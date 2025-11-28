<template>
  <v-app>
    <!-- HEADER -->
    <v-app-bar color="white" height="72" class="elevation-2 header-appbar">
      <v-container class="d-flex align-center justify-space-between" fluid>

        <!-- SEARCH -->
        <div class="search-and-actions d-flex align-center gap-3" style="flex: 1; max-width: 900px; margin: 0 16px;">
          <v-text-field
            v-model="searchTerm"
            :loading="isSearching"
            @keyup.enter="emitFiltersFromHeader"
            @input="onSearchInput"
            prepend-inner-icon="mdi-magnify"
            label="Buscar produtos..."
            hide-details
            variant="outlined"
            density="comfortable"
            class="search-bar"
            clearable
          />
        </div>

        <!-- QUICK ACTIONS: filter drawer icon, cart, quick categories on large screens -->
        <div class="d-flex align-center gap-2">
          <v-btn icon @click="filtroDrawer = true" title="Abrir filtros">
            <v-icon>mdi-filter-variant</v-icon>
          </v-btn>

          <!-- Quick categories - on large screens show as chips -->
          <div class="quick-categories d-none d-md-flex align-center gap-2">
            <v-chip
              v-for="cat in quickCategories"
              :key="cat"
              :color="selectedCategory === cat ? 'deep-purple accent-3' : ''"
              :text-color="selectedCategory === cat ? 'white' : ''"
              @click="selectQuickCategory(cat)"
              class="ma-0"
              outlined
              small
            >
              {{ cat }}
            </v-chip>
          </div>

          <!-- CARRINHO ICON -->
          <v-btn icon @click="carrinhoDrawer = true">
            <v-icon>mdi-cart-outline</v-icon>

            <v-badge
              v-if="carrinho.length > 0"
              :content="carrinhoTotalQtd"
              color="deep-purple-accent-4"
              offset-x="10"
              offset-y="10"
            />
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- MAIN CONTENT -->
    <v-main class="home-main" style="margin-top: 16px; background-color: #f5f5f5">
      <v-container>

        <!-- FILTER BAR (visible on small screens just below header) -->
        <v-row class="mb-4 d-md-none">
          <v-col cols="12">
            <v-chip-group
              active-class="chip-active"
              class="d-flex flex-wrap gap-2"
            >
              <v-chip
                v-for="cat in quickCategories"
                :key="cat"
                @click="selectQuickCategory(cat)"
                outlined
                small
              >
                {{ cat }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- PRODUCTS GRID -->
        <v-row>
          <v-col cols="12">
            <h4 class="section-title">Produtos</h4>
          </v-col>

          <v-col
            v-for="(product, idx) in produtosPaginados"
            :key="product.id"
            cols="6"
            md="3"
            class="d-flex"
          >

          <!-- <v-card class="product-card" @click="goToDetails(product)">
              <v-img :src="product.img" height="180px" />
              <v-card-text>
                <h3>Nome:{{ product.nome }}</h3>
                <p class="price">R$ {{ product.valor }}</p>
                <p class="categoria">categoria: {{ product.categoria }}</p>
              </v-card-text>
            </v-card> -->
            <v-card class="product-card" @click="goToDetails(product)">
              <v-img class="img-product" :src="product.img" height="180px" cover />
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <h3 class="product-title">{{ product.nome }}</h3>
                  <span class="price">R$ {{ formatPrice(product.valor) }}</span>
                </div>
                <p class="categoria">{{ product.categoria }} • {{ product.vendedorNome || 'Vendedor' }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- PAGINATION -->
        <v-row class="mt-6">
          <v-col cols="12" class="d-flex justify-center">
            <v-pagination v-model="paginaAtual" :length="totalPaginas" />
          </v-col>
        </v-row>

        <!-- COMPRE SEU CARRINHO SECTION -->
        <v-row class="mt-8 compr-seu-carrinho-row">
          <v-col cols="12">
            <h4 class="section-title">Compre seu carrinho</h4>
            <p class="subtitle">Itens que estão no seu carrinho — finalize agora</p>
          </v-col>

          <!-- show exactly one row with up to 4 (md) / 2 (xs) -->
          <v-col
            v-for="(p, i) in cartShowcase"
            :key="`cart-show-${i}-${p?.id || 'placeholder'}`"
            :cols="6"
            md="3"
          >
            <v-card
              class="product-card small-card"
              v-if="p"
              @click="goToDetails(p)"
            >
              <v-img :src="p.img" height="140px" />
              <v-card-text>
                <div class="d-flex justify-space-between">
                  <div class="truncate product-title">{{ p.nome }}</div>
                  <div class="price">R$ {{ formatPrice(p.valor) }}</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- placeholder suggestion card when no product (filler) -->
            <v-card v-else class="suggestion-card">
              <v-card-text class="d-flex flex-column align-center justify-center pa-6">
                <v-icon size="36">mdi-lightbulb-on-outline</v-icon>
                <div class="mt-2 text-center">Sugestão</div>
                <v-btn text small class="mt-2" @click="goToSuggested">Ver sugestões</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-main>

    <!-- DRAWER: CARRINHO -->
    <Carrinho
      v-model:aberto="carrinhoDrawer"
      :carrinho="carrinho"
      :produtos="products"
      @remover="removerCarrinho"
      @finalizar="() => alert('Compra finalizada!')"
    />

    <!-- DRAWER: FILTROS (igual visual do carrinho) -->
    <v-navigation-drawer
      v-model="filtroDrawer"
      right
      width="380"
      class="filter-drawer"
      overlay
    >
      <div class="drawer-header">
        <h3>Filtros</h3>
        <v-btn icon @click="filtroDrawer = false"><v-icon>mdi-close</v-icon></v-btn>
      </div>

      <v-divider />

      <v-card-text>
        <v-form ref="filterFormRef" lazy-validation>
          <v-text-field
            v-model="filters.nomeProduto"
            label="Nome do produto"
            clearable
            dense
          />

          <v-select
            v-model="filters.categoriaNome"
            :items="categorias"
            label="Categoria"
            dense
            clearable
          />

          <v-select
            v-model="filters.vendedorNome"
            :items="vendedores"
            label="Vendedor"
            dense
            clearable
          />

          <v-row class="mt-3">
            <v-col cols="6">
              <v-text-field
                v-model.number="filters.valorMinimo"
                label="Valor mínimo"
                type="number"
                dense
                placeholder="0"
                clearable
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="filters.valorMaximo"
                label="Valor máximo"
                type="number"
                dense
                placeholder="0"
                clearable
              />
            </v-col>
          </v-row>

          <v-row class="mt-4" dense>
            <v-col cols="6">
              <v-btn block color="deep-purple accent-3" dark @click="applyFilters">Aplicar</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block outlined @click="clearFilters">Limpar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-spacer />
      <v-divider />
      <v-card-text class="pt-4">
        <small class="text-caption">Filtros rápidos: use as categorias ou o campo de busca no topo.</small>
      </v-card-text>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../controller/api";
import emitter from "../utils/emitter"; // seu emitter existente
//import Carrinho from "../components/Carrinho.vue"; // ajustar o path conforme projeto

// ----------------- Tipagens -----------------
interface Product {
  id: number;
  nome: string;
  description?: string;
  categoria: string;
  valor: number;
  img: string;
  ativo: boolean;
  vendedorNome?: string;
}

interface CarrinhoItem {
  id: number;
  produtoId: number;
  qtd: number;
  usuarioId: number;
}

// ----------------- Estado -----------------
const router = useRouter();
const token = "SEU_TOKEN_AQUI"; // <- substitua aqui
const carrinhoDrawer = ref(false);
const filtroDrawer = ref(false);

const isLoading = ref(true);
const isSearching = ref(false);
const products = ref<Product[]>([]);
const carrinho = ref<CarrinhoItem[]>([]);
const searchTerm = ref("");
const selectedCategory = ref<string | null>(null);

// filtros do drawer
const filters = ref({
  nomeProduto: "",
  categoriaNome: "",
  vendedorNome: "",
  valorMinimo: null as number | null,
  valorMaximo: null as number | null,
});

// pagination
const paginaAtual = ref(1);
const itensPorPagina = 32;

// quick categories
const quickCategories = ["Tudo", "Eletrônicos", "Moda", "Beleza", "Casa", "Jogos"];

// reference to form
const filterFormRef = ref(null);

// ----------------- Computeds -----------------
const categorias = computed(() => {
  const set = new Set(products.value.map((p) => p.categoria || "Outros"));
  return Array.from(set);
});

const vendedores = computed(() => {
  const set = new Set(products.value.map((p) => p.vendedorNome || "Vendedor"));
  return Array.from(set);
});

// aplica filtros combinados: ativo, searchTerm (campo header), drawer filters e selectedCategory
const produtosFiltrados = computed(() => {
  let list = products.value.filter((p) => p.ativo !== false); // somente ativos

  // quick category
  if (selectedCategory.value && selectedCategory.value !== "Tudo") {
    list = list.filter((p) => p.categoria === selectedCategory.value);
  }

  // header searchTerm
  const termoHeader = (searchTerm.value || "").toLowerCase().trim();
  if (termoHeader.length > 0) {
    list = list.filter((p) =>
      (p.nome || "").toLowerCase().includes(termoHeader)
    );
  }

  // drawer filters
  const f = filters.value;
  if (f.nomeProduto && f.nomeProduto.trim() !== "") {
    const t = f.nomeProduto.toLowerCase().trim();
    list = list.filter((p) => (p.nome || "").toLowerCase().includes(t));
  }
  if (f.categoriaNome && f.categoriaNome.trim() !== "") {
    list = list.filter((p) => p.categoria === f.categoriaNome);
  }
  if (f.vendedorNome && f.vendedorNome.trim() !== "") {
    list = list.filter((p) => p.vendedorNome === f.vendedorNome);
  }
  if (f.valorMinimo != null) {
    list = list.filter((p) => Number(p.valor) >= Number(f.valorMinimo));
  }
  if (f.valorMaximo != null) {
    list = list.filter((p) => Number(p.valor) <= Number(f.valorMaximo));
  }

  // ordenar por mais recente (assumindo id maior = mais recente)
  list = list.sort((a, b) => b.id - a.id);

  return list;
});

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(produtosFiltrados.value.length / itensPorPagina))
);

const produtosPaginados = computed(() => {
  const start = (paginaAtual.value - 1) * itensPorPagina;
  return produtosFiltrados.value.slice(start, start + itensPorPagina);
});

// carrinho total qtd
const carrinhoTotalQtd = computed(() =>
  carrinho.value.reduce((s, it) => s + (it.qtd || 0), 0)
);

// ----------------- Compre seu carrinho: montar linha de 4 (md) / 2 (xs) -----------------
const cartProducts = computed(() => {
  // map carrinho items to product objects
  const prods: Product[] = [];
  for (const item of carrinho.value) {
    const p = products.value.find((x) => x.id === item.produtoId);
    if (p) prods.push(p);
  }
  return prods;
});

const cartShowcase = computed(() => {
  // deseja 4 slots (md) -> exibiremos exatamente 4 elements (pode conter nulls)
  // each slot should be either a cart product or a suggested product if not enough
  const slots = 4;
  const arr: (Product | null)[] = [];

  // add cart products first (max slots)
  const cartProds = cartProducts.value.slice(0, slots);
  for (const p of cartProds) arr.push(p);

  // if less than slots, fill with sugestões (produtos recentes não no carrinho)
  if (arr.length < slots) {
    const idsInCart = new Set(cartProds.map((p) => p.id));
    const suggestions = products.value
      .filter((p) => p.ativo !== false && !idsInCart.has(p.id))
      .sort((a, b) => b.id - a.id)
      .slice(0, slots - arr.length);
    for (const s of suggestions) arr.push(s);
  }

  // if still less (very small product pool), fill with null placeholders
  while (arr.length < slots) arr.push(null);

  return arr;
});

// ----------------- UTILS -----------------
function formatPrice(v: any) {
  if (v == null) return "0,00";
  return Number(v).toFixed(2).replace(".", ",");
}

function goToDetails(produto: Product) {
  router.push({ name: "DetalhesProdutos", params: { id: String(produto.id) } });
}

function goToSuggested() {
  // abrir sugestoes (pode ser lista de promocoes)
  window.scrollTo({ top: 400, behavior: "smooth" });
}

// ----------------- CARREGAR DADOS -----------------
async function carregarDados() {
  try {
    isLoading.value = true;
    const headers = { Authorization: `Bearer ${token}` };

    const resProdutos = await api.get("/produto", { headers });
    products.value = resProdutos.data || [];

    const resCarrinho = await api.get("/itemCarrinho", {
      params: { usuarioId: 1 },
      headers,
    });
    carrinho.value = resCarrinho.data || [];
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  } finally {
    isLoading.value = false;
  }
}

// ----------------- FILTROS / EMITTER -----------------
let searchDebounceTimer: any = null;
function onSearchInput() {
  isSearching.value = true;
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    emitFiltersFromHeader();
    isSearching.value = false;
  }, 450);
}

function emitFiltersFromHeader() {
  // Emite evento exatamente como seu trecho espera
  const payload = {
    search: searchTerm.value,
    // poderíamos incluir outros campos se desejar
  };
  emitter.emit("applyFilters", payload);

  // também podemos forçar atualização local (já feito via computed que lê searchTerm)
  paginaAtual.value = 1;
}

// Aplica filtros quando drawer: Aplicar
function applyFilters() {
  // emitir para qualquer outro componente que use emitter
  const payload = {
    search: searchTerm.value,
    nomeProduto: filters.value.nomeProduto,
    categoriaNome: filters.value.categoriaNome,
    vendedorNome: filters.value.vendedorNome,
    valorMinimo: filters.value.valorMinimo,
    valorMaximo: filters.value.valorMaximo,
  };
  emitter.emit("applyFilters", payload);
  // fecha drawer
  filtroDrawer.value = false;
  paginaAtual.value = 1;
}

// Limpar filtros
function clearFilters() {
  filters.value = {
    nomeProduto: "",
    categoriaNome: "",
    vendedorNome: "",
    valorMinimo: null,
    valorMaximo: null,
  };
  emitter.emit("applyFilters", { search: searchTerm.value });
  paginaAtual.value = 1;
}

// selecionar quick category
function selectQuickCategory(cat: string) {
  selectedCategory.value = cat === "Tudo" ? null : cat;
  paginaAtual.value = 1;
  emitter.emit("applyFilters", { search: searchTerm.value, categoriaNome: selectedCategory.value });
}

// ----------------- CARRINHO -----------------
async function removerCarrinho(index: number) {
  const item = carrinho.value[index];
  if (!item) return;
  try {
    await api.delete(`/itemCarrinho/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    carrinho.value.splice(index, 1);
  } catch (err) {
    console.error("Erro ao remover item:", err);
  }
}

// ----------------- EMITTER: receber filtros de outros componentes -----------------
function handleEmitterApply(filtersPayload: any) {
  // compatível com seu trecho: filters.search
  if (!filtersPayload) return;

  // atualizar header search se vierem search
  if (typeof filtersPayload.search === "string") {
    searchTerm.value = filtersPayload.search;
  }

  // atualizar drawer filters se vierem
  if (typeof filtersPayload.nomeProduto === "string") filters.value.nomeProduto = filtersPayload.nomeProduto;
  if (typeof filtersPayload.categoriaNome === "string") filters.value.categoriaNome = filtersPayload.categoriaNome;
  if (typeof filtersPayload.vendedorNome === "string") filters.value.vendedorNome = filtersPayload.vendedorNome;
  if (filtersPayload.valorMinimo != null) filters.value.valorMinimo = filtersPayload.valorMinimo;
  if (filtersPayload.valorMaximo != null) filters.value.valorMaximo = filtersPayload.valorMaximo;

  // ajustar pagina
  paginaAtual.value = 1;
}

onMounted(() => {
  carregarDados();

  // registra listener (compatível com seu código)
  emitter.on("applyFilters", handleEmitterApply);
});

onUnmounted(() => {
  emitter.off("applyFilters", handleEmitterApply);
});

// reset page when filters/search change
watch([() => filters.value, searchTerm, selectedCategory], () => {
  paginaAtual.value = 1;
}, { deep: true });

</script>

<style scoped>
.header-appbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.brand {
  color: #372b73;
  margin: 0;
  cursor: pointer;
}

.banner-mini {
  background: linear-gradient(90deg, #FF6B6B, #372b73);
  color: white;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  align-items: center;
}

.search-bar {
  width: 100%;
}

/* promo banner */
.promo-banner {
  background: linear-gradient(90deg, #fff2f0, #f6f4ff);
  padding: 18px 0;
  border-bottom: 1px solid #eee;
}

.promo-content h3 {
  margin: 0;
  color: #372b73;
}
.promo-content p {
  margin: 6px 0 12px;
}

/* products */
.section-title {
  margin: 0 0 12px;
  color: #372b73;
  font-weight: 700;
}
.subtitle {
  margin: 0 0 18px;
  color: #666;
}

/* product card */
/* 
.products {
  padding: 2rem 1rem;
}
.product-card h3,
.product-card .price,
.product-card .categoria {
  margin-left: 0;
  text-align: left;
}
.product-card {
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 18px;
  padding: 2rem 2rem;
  background-color: #ffffff;
  color: #000;
  box-shadow: 0 8px 20px #00000022;
  height: 340px;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(204, 0, 255, 0.441);
} */


/* .product-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 26px rgba(55,43,115,0.08);
} */
.product-card {
  width: 100%;
  height: 360px;
  border-radius: 18px;
  padding: 0.5rem 0.5rem;
  background-color: #ffffff;
  color: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 2 8px 20px rgba(0,0,0,0.08);
  transition: transform .18s ease, box-shadow .18s ease;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(204, 0, 255, 0.441);
}
.img-product {
  border-radius: 12px;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #372b73;
  margin: 0;
}

.categoria {
  font-size: 0.82rem;
  color: #666;
  margin-top: 8px;
}

/* .price {
  color: #FF6B6B;
  font-weight: 700;
} */
.price {
  font-size: 1.2rem;
  color: #fcca00;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* small cards in Compre seu carrinho */
.small-card {
  min-height: 220px;
}
.suggestion-card {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px dashed #ddd;
}

/* filter drawer styling to match carrinho look */
.filter-drawer {
  background: #fff;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: -10px 0 30px rgba(55,43,115,0.06);
  padding: 12px 8px;
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* chips active */
.chip-active {
  background: linear-gradient(90deg,#372b73,#FF6B6B) !important;
  color: #fff !important;
}

/* responsive tweaks */
@media (max-width: 959px) {
  .quick-categories { display: none !important; }
  .banner-mini { display: none; }
}
</style>
