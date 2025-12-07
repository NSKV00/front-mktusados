<template>
  <v-navigation-drawer
    v-model="openLocal"
    right
    width="380"
    class="filter-drawer"
    overlay
  >
    <div class="drawer-head pa-3 d-flex align-center justify-space-between">
      <div>
        <h3>Filtros</h3>
        <small class="muted">Refine sua busca</small>
      </div>

      <v-btn icon @click="openLocal = false" aria-label="Fechar filtros">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider />

    <v-form ref="formRef" class="pa-4" @submit.prevent="apply">
      <v-text-field
        v-model="local.nomeProduto"
        label="Nome do produto"
        dense
        clearable
        prepend-inner-icon="mdi-text-box"
        autocomplete="off"
      />

      <v-select
        v-model="local.categoriaNome"
        :items="categoriasLocal"
        item-title="nome"
        item-value="nome"
        label="Categoria"
        dense
        clearable
        prepend-inner-icon="mdi-tag"
      />

      <v-select
        v-model="local.vendedorNome"
        :items="vendedores"
        label="Vendedor"
        dense
        clearable
        prepend-inner-icon="mdi-store"
      />

      <v-row class="mt-2" align="center">
        <v-col cols="6">
          <v-text-field
            v-model.number="local.valorMinimo"
            label="Valor mínimo"
            type="number"
            dense
            prepend-inner-icon="mdi-currency-brl"
            clearable
            min="0"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model.number="local.valorMaximo"
            label="Valor máximo"
            type="number"
            dense
            prepend-inner-icon="mdi-currency-brl"
            clearable
            :min="local.valorMinimo ?? 0"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-btn block color="deep-purple accent-3" dark @click="apply">
            Aplicar
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn block outlined @click="clear">
            Limpar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-spacer />
    <v-divider />
    <v-card-text class="pa-4 muted small">
      Dica: use a busca rápida no topo para resultados instantâneos.
    </v-card-text>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { ref, watch, computed, onMounted } from "vue"
  import api from "../controller/api"

  const props = defineProps<{
    open?: boolean;
    categorias?: Array<any>;
    vendedores?: Array<string>;
    initialFilters?: Partial<{
      nomeProduto: string;
      categoriaNome: string;
      vendedorNome: string;
      valorMinimo: number | null;
      valorMaximo: number | null;
    }>;
    skip?: number;
    take?: number;
  }>()

  const emit = defineEmits<{
    (e: "update:open", v: boolean): void;
    (e: "apply", filters: Record<string, any>): void;
    (e: "clear"): void;
  }>()

  const openLocal = ref<boolean>(props.open ?? false)
  watch(
    () => props.open,
    (v) => {
      openLocal.value = !!v;
    }
  )
  watch(openLocal, (v) => emit("update:open", v))

  const formRef = ref()
  const local = ref({
    nomeProduto: "",
    categoriaNome: "" as string | null,
    vendedorNome: "" as string | null,
    valorMinimo: null as number | null,
    valorMaximo: null as number | null
  })

  const categoriasLocal = ref<Array<any>>(props.categorias ?? [])
  const vendedores = ref<Array<string>>(props.vendedores ?? [])

  watch(
    () => props.initialFilters,
    (v) => {
      if (!v) return
      local.value = { ...local.value, ...v }
    },
    { immediate: true }
  )

  const rangeIsValid = computed(() => {
    if (local.value.valorMinimo == null || local.value.valorMaximo == null) return true
    return Number(local.value.valorMinimo) <= Number(local.value.valorMaximo)
  })

  const loadCategoriasIfNeeded = async () => {
    if (categoriasLocal.value && categoriasLocal.value.length) return
    try {
      const res = await api.get("/categoria")
      categoriasLocal.value = Array.isArray(res.data) ? res.data : []
    } catch (e) {
      console.error("Erro ao carregar categorias:", e)
      categoriasLocal.value = []
    }
  }

  const fetchVendedores = async () => {
    try {
      const res = await api.get("/usuario", { params: { vendedor: true } })

      vendedores.value = Array.isArray(res.data)
        ? res.data.map((v: any) => v.nome)
        : [];
    } catch (e) {
      console.error("Erro ao carregar vendedores:", e)
      vendedores.value = []
    }
  }

  onMounted(async () => {
    await loadCategoriasIfNeeded()

    if (!vendedores.value.length) {
      await fetchVendedores()
    }
  })

  const buildProdutoParams = (opts?: { skip?: number; take?: number }) => {
    const params: Record<string, any> = {}
    if (local.value.nomeProduto) params.nome = local.value.nomeProduto;
    if (local.value.categoriaNome) params.categoriaNome = local.value.categoriaNome;
    if (local.value.vendedorNome) params.vendedorNome = local.value.vendedorNome;
    if (local.value.valorMinimo != null) params.valorMinimo = local.value.valorMinimo;
    if (local.value.valorMaximo != null) params.valorMaximo = local.value.valorMaximo;

    params.skip = opts?.skip ?? props.skip ?? 0;
    params.take = opts?.take ?? props.take ?? 20;
    return params;
  }

  async function fetchProdutos(opts?: { skip?: number; take?: number }) {
    try {
      const params = buildProdutoParams(opts)
      const res = await api.get("/produto", { params })
      return res.data
    } catch (e) {
      console.error("Erro ao buscar produtos:", e)
      throw e
    }
  }

  function apply() {
    if (!rangeIsValid.value) {
      emit("apply", { error: "Valor mínimo deve ser menor ou igual ao valor máximo" })
      return
    }

    const payload = {
      nome: local.value.nomeProduto || undefined,
      categoriaNome: local.value.categoriaNome || undefined,
      vendedorNome: local.value.vendedorNome || undefined,
      valorMinimo: local.value.valorMinimo != null ? Number(local.value.valorMinimo) : undefined,
      valorMaximo: local.value.valorMaximo != null ? Number(local.value.valorMaximo) : undefined
    }

    emit("apply", payload)
    openLocal.value = false
  }

  function clear() {
    local.value = { nomeProduto: "", categoriaNome: null, vendedorNome: null, valorMinimo: null, valorMaximo: null }
    emit("clear")
    openLocal.value = false
  }

  const exposed = {
    fetchProdutos,
    loadCategoriasIfNeeded,
    reset: clear
  }
  defineExpose(exposed)
</script>

<style scoped>
  .filter-drawer {
    background: #fff;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    min-height: 100%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .drawer-head h3 {
    margin: 0;
    color: #372b73;
    font-weight: 600;
  }

  .muted {
    color: #777;
  }

  .pa-4 {
    color: #444;
  }

  @media (max-width: 600px) {
    .filter-drawer {
      width: 100% !important;
    }
  }
</style>
