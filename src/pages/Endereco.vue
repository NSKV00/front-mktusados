<template>
  <div v-if="isCarregando === true" class="ml-loading">
    <div class="loader"></div>
  </div>

  <v-container v-else fluid class="endereco-container">
    <v-card class="header-card mb-6 d-flex flex-column">
      <v-row class="pa-6" align="center" justify="space-between" no-gutters>
        <v-col cols="12" sm="auto">
          <h1 class="text-h4 font-weight-bold mb-2">Meus Endereços</h1>
          <p class="text-subtitle-2 text-grey">Gerencie seus endereços de entrega</p>
        </v-col>

        <v-btn prepend-icon="mdi-plus" color="amber-darken-2" variant="flat" @click="abrirModal()">
          Adicionar Endereço
        </v-btn>

        <v-col cols="12" sm="auto" class="d-flex align-center">
          <div class="text-right">
            <p class="text-caption text-grey font-weight-bold mb-1">Total de Endereços</p>
            <p class="text-body2 font-weight-bold mb-0">{{ enderecos.length }}</p>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-row v-if="enderecos && enderecos.length > 0" class="mb-6" dense>
      <v-col
        v-for="end in enderecos"
        :key="end.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="endereco-card h-100"
          :class="{ 'principal-card': end.id === enderecoPrincipalId }"
        >
          <v-card-text class="pa-6">
            <v-row align="center" class="mb-4">
              <v-col cols="auto" class="flex-grow-1">
                <h3 class="text-h6 font-weight-bold mb-1">
                  {{ formatCep(end.cep) }} — Nº {{ end.numero }}
                </h3>
                <p class="text-body2 text-grey mb-0">
                  {{ end.rua || '-' }}
                </p>
                <p class="text-body2 text-grey">
                  {{ end.bairro || '-' }} — {{ end.cidade }} / {{ end.estado }}
                </p>
              </v-col>

              <v-col cols="auto" class="d-flex align-center">
                <v-chip
                  v-if="end.id === enderecoPrincipalId"
                  prepend-icon="mdi-star"
                  color="success"
                  size="small"
                  label
                >
                  Principal
                </v-chip>
              </v-col>
            </v-row>

            <v-row class="ga-2">
              <v-col cols="12">
                <v-btn
                  prepend-icon="mdi-pencil"
                  variant="outlined"
                  color="primary"
                  size="small"
                  block
                  @click="abrirModal(end)"
                >
                  Editar
                </v-btn>
              </v-col>

              <v-col cols="12">
                <v-btn
                  prepend-icon="mdi-delete"
                  variant="outlined"
                  color="error"
                  size="small"
                  block
                  @click="deletarEndereco(end.id)"
                >
                  Excluir
                </v-btn>
              </v-col>

              <v-col cols="12" v-if="end.id !== enderecoPrincipalId">
                <v-btn
                  prepend-icon="mdi-star"
                  variant="outlined"
                  color="warning"
                  size="small"
                  block
                  @click="definirPrincipal(end.id)"
                >
                  Definir Principal
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="mb-6">
      <v-col cols="12">
        <v-card class="empty-card">
          <v-card-text class="text-center pa-12">
            <v-icon size="64" class="mb-4">mdi-map-marker-off</v-icon>
            <p class="text-h6 font-weight-bold mb-2">Nenhum endereço cadastrado</p>
            <p class="text-body2 text-grey mb-6">Adicione seu primeiro endereço para continuar</p>
            <v-btn prepend-icon="mdi-plus" color="amber-darken-2" variant="flat" @click="abrirModal()">
              Adicionar Endereço
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="modalAberto" max-width="600" persistent class="modal-dialog">
      <v-card class="modal-card">
        <v-card-title class="modal-title text-h5 font-weight-bold pa-6 bg-gradient-light">
          <v-icon class="mr-3" color="amber-darken-2">{{ enderecoEdicao ? "mdi-pencil" : "mdi-plus" }}</v-icon>
          {{ enderecoEdicao ? "Editar Endereço" : "Adicionar Endereço" }}
        </v-card-title>

        <v-card-text class="modal-content pa-6">
          <v-form ref="formRef" @submit.prevent="salvarEndereco">
            <v-row class="ga-4">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.cep"
                  label="CEP *"
                  placeholder="00000-000"
                  prepend-icon="mdi-map"
                  maxlength="9"
                  required
                  variant="outlined"
                  density="comfortable"
                  @input="formatarCep"
                  @blur="buscarCep"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.numero"
                  label="Número *"
                  prepend-icon="mdi-home"
                  type="number"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.rua"
                  label="Rua"
                  prepend-icon="mdi-road-variant"
                  readonly
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.bairro"
                  label="Bairro"
                  prepend-icon="mdi-city-variant"
                  readonly
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.cidade"
                  label="Cidade"
                  prepend-icon="mdi-city"
                  readonly
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.estado"
                  label="Estado"
                  prepend-icon="mdi-map-marker-radius"
                  readonly
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider class="my-0"></v-divider>

        <v-card-actions class="modal-actions pa-6 gap-2">
          <v-spacer/>
          <v-btn 
            color="grey" 
            variant="tonal" 
            @click="fecharModal"
            size="large"
            class="px-6"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="amber-darken-2" 
            variant="flat" 
            @click="salvarEndereco"
            size="large"
            class="px-6"
            prepend-icon="mdi-check"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  
</template>

<script setup>
  import { ref, onMounted } from "vue"
  import api from "../controller/api"
  import { decryptJSON } from "../utils/crypto"
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'

  const usuario = decryptJSON(localStorage.getItem("usuario")) || { id: null }

  const enderecos = ref([])
  const enderecoEdicao = ref(null)
  const enderecoPrincipalId = ref(null)
  const modalAberto = ref(false)
  const enderecoPrincipalRegistroId = ref(null)
  const isCarregando = ref(true)

  const form = ref({
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: ""
  })

  const formRef = ref(null)

  const formatCep = (raw) => {
    if (!raw) return ""
    const onlyDigits = raw.replace(/\D/g, "")
    if (onlyDigits.length > 5) {
      return onlyDigits.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9)
    }
    return onlyDigits
  }

  const formatCepInPlace = () => {
    form.value.cep = formatCep(form.value.cep)
  }

  const formatCepDisplay = (cep) => {
    if (!cep) return "-"
    const s = String(cep).replace(/\D/g, "")
    if (s.length === 8) return s.replace(/(\d{5})(\d{3})/, "$1-$2")
    return s
  }

  const formatCepForApi = (cep) => String(cep).replace(/\D/g, "")

  const carregarEnderecos = async () => {
    try {
      if (!usuario?.id) {
        enderecos.value = []
        return
      }

      const res = await api.get(`/endereco`, {
        params: { id: usuario.id }
      })

      enderecos.value = Array.isArray(res.data) ? res.data : []
    } catch (e) {
      console.error("Erro ao carregar endereços:", e)
      enderecos.value = []
    }
  }

  const carregarEnderecoPrincipal = async () => {
    if (!usuario?.id) return

    try {
      const res = await api.get(`/endereco-principal/${usuario.id}`)

      enderecoPrincipalId.value = res.data?.enderecoId || null
      enderecoPrincipalRegistroId.value = res.data?.id || null
    } catch (e) {
      enderecoPrincipalId.value = null
      enderecoPrincipalRegistroId.value = null
    }
  }

  const abrirModal = (endereco = null) => {
    enderecoEdicao.value = endereco

    if (endereco) {
      form.value = {
        cep: formatCep(String(endereco.cep)),
        numero: endereco.numero ?? "",
        rua: endereco.rua ?? "",
        bairro: endereco.bairro ?? "",
        cidade: endereco.cidade ?? "",
        estado: endereco.estado ?? ""
      }
    } else {
      form.value = { cep: "", numero: "", rua: "", bairro: "", cidade: "", estado: "" }
    }

    modalAberto.value = true
  }

  const fecharModal = () => {
    modalAberto.value = false
    enderecoEdicao.value = null

    setTimeout(() => {
      form.value = { cep: "", numero: "", rua: "", bairro: "", cidade: "", estado: "" }
    }, 200)
  }

  const buscarCep = async () => {
    const cepRaw = formatCepForApi(form.value.cep)
    if (!cepRaw || cepRaw.length !== 8) return

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`)
      const dados = await res.json()

      if (!dados || dados.erro) return

      form.value.rua = dados.logradouro || "";
      form.value.bairro = dados.bairro || "";
      form.value.cidade = dados.localidade || "";
      form.value.estado = dados.uf || "";
    } catch (e) {
      console.error("Erro ao buscar CEP:", e)
    }
  }

  const salvarEndereco = async () => {
    const cepNumbers = formatCepForApi(form.value.cep)
    if (cepNumbers.length !== 8) {
      toast.error("Informe um CEP válido.")
      return
    }

    if (!form.value.numero) {
      toast.error("Informe o número.")
      return
    }

    const payload = {
    cep: formatCepForApi(form.value.cep),
    numero: Number(form.value.numero),
    usuarioId: usuario.id
  }

    try {
      if (enderecoEdicao.value && enderecoEdicao.value.id) {
        await api.patch(`/endereco/${enderecoEdicao.value.id}`, payload)
      } else {
        await api.post("/endereco", payload)
      }

      fecharModal()
      await carregarEnderecos()
      await carregarEnderecoPrincipal()
      toast.success("Endereço salvo com sucesso!")
    } catch (e) {
      console.error("Erro ao salvar endereço:", e?.response?.data || e)
      toast.error("Erro ao salvar endereço.")
    }
  }

  const deletarEndereco = async (id) => {
    const confirmar = () => {
      return new Promise((resolve) => {
        toast.info("Confirmar exclusão?")
        resolve(true)
      })
    }

    try {
      await api.delete(`/endereco/${id}`)

      await carregarEnderecos()
      await carregarEnderecoPrincipal()
      toast.success("Endereço excluído com sucesso!")
    } catch (e) {
      console.error("Erro ao deletar endereço:", e)
      toast.error("Erro ao deletar endereço.")
    }
  }

  const definirPrincipal = async (enderecoId) => {
    if (!usuario?.id) {
      toast.error("Usuário inválido.")
      return
    }

    try {
      if (enderecoPrincipalRegistroId.value) {
        await api.patch(`/endereco-principal/${enderecoPrincipalRegistroId.value}`, { enderecoId })
      } else {
        const res = await api.post("/endereco-principal", {
          usuarioId: usuario.id,
          enderecoId
        })

        enderecoPrincipalRegistroId.value = res.data?.id || null
      }

      enderecoPrincipalId.value = enderecoId
      toast.success("Endereço principal definido com sucesso!")
    } catch (e) {
      console.error("Erro ao definir principal:", e)
      toast.error("Erro ao definir principal.")
    }
  }

  onMounted(async () => {
    await carregarEnderecos()
    await carregarEnderecoPrincipal()

    isCarregando.value = false
  })
</script>

<style scoped>
  .endereco-container {
    width: 100%;
    height: auto;
    max-width: 1400px;
    margin: 0 auto;
    padding: 28px 16px;
    background: linear-gradient(180deg, #cccccc, #cacaca);
    min-height: 100vh;
    box-sizing: border-box;
  }

  .header-card {
    background: linear-gradient(135deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);
    border: 1px solid rgba(25, 118, 210, 0.06);
    border-radius: 16px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
  }
  .header-card:hover {
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.06);
  }

  .endereco-card {
    background: #fff;
    border: 2px solid #eef3f8;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ml-loading{
    min-height: 100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(180deg,#f7f8fa,#fbfbfd);
  }

  .loader{
    width:44px;
    height:44px;
    border-radius:50%;
    border:5px solid rgba(0,0,0,0.06);
    border-top-color:var(--ml-yellow);
    animation:spin .9s linear infinite;
  }

  @keyframes spin{ 
    to { transform:rotate(360deg);} 
  }

  .endereco-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(25, 118, 210, 0.12);
    border-color: rgba(25, 118, 210, 0.16);
  }
  .principal-card {
    border-color: rgba(25, 118, 210, 0.18);
    background: linear-gradient(135deg, #f4fbff 0%, #ffffff 100%);
  }
  .principal-card:hover {
    box-shadow: 0 12px 32px rgba(25, 118, 210, 0.18);
  }

  .empty-card {
    background: linear-gradient(135deg, #f8fbff 0%, #fff 100%);
    border: 2px dashed rgba(25, 118, 210, 0.16);
    border-radius: 16px;
    transition: all 0.3s ease;
  }
  .empty-card:hover {
    border-color: rgba(25, 118, 210, 0.24);
    box-shadow: 0 6px 18px rgba(25, 118, 210, 0.06);
  }

  .modal-dialog :deep(.v-overlay__content) {
    margin: 16px;
  }
  .modal-card {
    border-radius: 20px;
    box-shadow: 0 18px 48px rgba(16, 24, 40, 0.08);
    overflow: hidden;
  }
  .bg-gradient-light {
    background: linear-gradient(135deg, #f4fbff 0%, #fff 100%);
    border-bottom: 1px solid rgba(25, 118, 210, 0.12);
  }
  .modal-title {
    color: #333;
    letter-spacing: 0.3px;
  }
  .modal-content {
    max-height: 60vh;
    overflow-y: auto;
  }
  .modal-content :deep(.v-text-field) {
    margin-bottom: 8px;
  }
  .modal-actions {
    justify-content: flex-end;
    gap: 12px;
    background: linear-gradient(135deg, #f8f9fb 0%, #fff 100%);
  }

  .v-dialog--active .modal-card {
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 960px) {
    .endereco-container {
      padding: 20px 12px;
    }

    .header-card :deep(.v-row) {
      flex-direction: column;
      gap: 12px !important;
    }

    .modal-dialog :deep(.v-overlay__content) {
      width: calc(100% - 32px) !important;
    }
  }

  @media (max-width: 600px) {
    .endereco-container {
      padding: 12px 8px;
      background: linear-gradient(180deg, #fafcff, #f5fbff);
    }
    .endereco-card {
      border-radius: 12px;
    }
    .endereco-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(25, 118, 210, 0.08);
    }

    .header-card {
      border-radius: 12px;
      margin-bottom: 16px !important;
    }
    .header-card :deep(.v-card__text) {
      padding: 16px !important;
    }

    .modal-dialog :deep(.v-overlay__content) {
      margin: 12px;
      max-width: calc(100% - 24px) !important;
    }
    .modal-card {
      border-radius: 16px;
      max-width: 100% !important;
    }
    .modal-title {
      font-size: 1.25rem !important;
      padding: 16px !important;
    }
    .modal-content {
      padding: 16px !important;
      max-height: 70vh;
    }
    .modal-actions {
      padding: 12px 16px !important;
      flex-wrap: wrap;
      gap: 8px;
    }
    .modal-actions :deep(.v-btn) {
      min-width: 120px !important;
      font-size: 0.875rem !important;
    }

    .endereco-card :deep(.v-btn) {
      font-size: 0.813rem !important;
      padding: 8px 12px !important;
    }

    .modal-content :deep(.v-text-field) {
      margin-bottom: 12px !important;
    }
    .modal-content :deep(.v-field) {
      min-height: 48px;
    }

    .header-card :deep(h1) {
      font-size: 1.5rem !important;
    }
    .header-card :deep(.text-subtitle-2) {
      font-size: 0.875rem !important;
    }
  }

  @media (max-width: 480px) {
    .endereco-container {
      padding: 8px 4px;
    }

    .header-card {
      margin-bottom: 12px !important;
    }
    .header-card :deep(.v-card__text) {
      padding: 12px !important;
    }

    .modal-dialog :deep(.v-overlay__content) {
      margin: 8px;
      max-width: calc(100% - 16px) !important;
    }
    .modal-title {
      font-size: 1.125rem !important;
      padding: 12px !important;
    }
    .modal-content {
      padding: 12px !important;
    }
    .modal-actions {
      padding: 8px 12px !important;
    }
    .modal-actions :deep(.v-btn) {
      font-size: 0.75rem !important;
    }

    .endereco-card :deep(.v-card__text) {
      padding: 12px !important;
    }

  }

  @media (prefers-color-scheme: dark) {
    .endereco-container {
      background: linear-gradient(180deg, #cccccc, #c9c9c9);
    }

    .header-card,
    .endereco-card,
    .empty-card {
      background: #ffffff;
      border-color: rgba(25, 118, 210, 0.06);
      box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
    }

    .modal-card {
      background: #ffffff;
    }

    .bg-gradient-light {
      background: linear-gradient(135deg, #f4fbff 0%, #fff 100%);
      border-bottom-color: rgba(25, 118, 210, 0.12);
    }

    .modal-actions {
      background: linear-gradient(135deg, #f8f9fb 0%, #fff 100%);
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.3s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
</style>