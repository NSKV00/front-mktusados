<template>
  <div class="addresses-container">
    <!-- Header -->
    <div class="addresses-header">
      <v-container class="header-content">
        <h1 class="page-title">Meus Endereços</h1>
        <p class="page-subtitle">Gerencie seus endereços de entrega</p>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="main-content">
      <div class="content-wrapper">
        <!-- Estado carregando -->
        <div v-if="isCarregando" class="loading-state">
          <v-progress-circular indeterminate color="deep-purple-accent-4"></v-progress-circular>
          <p>Carregando endereços...</p>
        </div>

        <!-- Botão Adicionar Endereço -->
        <div v-if="!isCarregando" class="add-address-section">
          <v-btn
            @click="openAddressDialog"
            class="add-btn"
            prepend-icon="mdi-plus"
            size="large"
          >
            Adicionar Endereço
          </v-btn>
        </div>

        <!-- Lista de Endereços -->
        <div v-if="!isCarregando && addresses.length > 0" class="addresses-grid">
          <v-card
            v-for="(address, index) in addresses"
            :key="index"
            class="address-card"
            :class="{ 'is-default': address.default }"
            elevation="2"
          >
            <!-- Badge padrão -->
            <v-badge
              v-if="address.default"
              color="deep-purple-accent-4"
              icon="mdi-check-circle"
              overlap
              bordered
              class="default-badge"
            >
              <template v-slot:badge>
                <span class="badge-text">Padrão</span>
              </template>
            </v-badge>

            <v-card-text class="pt-4">
              <!-- Tipo de endereço -->
              <div class="address-type">
                <v-icon :icon="getAddressIcon(address.type)" size="small"></v-icon>
                <span>{{ address.type }}</span>
              </div>

              <!-- Rótulo -->
              <div v-if="address.label" class="address-label">
                {{ address.label }}
              </div>

              <!-- Detalhes -->
              <div class="address-details">
                <p class="address-street">
                  {{ address.street }}, {{ address.number }}
                </p>
                <p v-if="address.complement" class="address-complement">
                  {{ address.complement }}
                </p>
                <p class="address-location">
                  {{ address.neighborhood }} - {{ address.city }}, {{ address.state }}
                </p>
                <p class="address-zip">{{ formatCEP(address.zip) }}</p>
                <p v-if="address.phone" class="address-phone">
                  <v-icon size="x-small" icon="mdi-phone" class="me-1"></v-icon>
                  {{ formatPhone(address.phone) }}
                </p>
              </div>
            </v-card-text>

            <!-- Ações -->
            <v-card-actions class="address-actions">
              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-pencil"
                @click="editAddress(index)"
                class="action-btn"
              >
                Editar
              </v-btn>
              <v-btn
                v-if="!address.default"
                variant="text"
                size="small"
                prepend-icon="mdi-star-outline"
                @click="setDefault(index)"
                class="action-btn"
              >
                Padrão
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-delete"
                @click="deleteAddress(index)"
                class="action-btn delete-btn"
              >
                Remover
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>

        <!-- Estado vazio -->
        <v-card v-else-if="!isCarregando" class="empty-state" elevation="1">
          <v-card-text class="text-center py-12">
            <v-icon size="x-large" icon="mdi-home-outline" class="empty-icon"></v-icon>
            <h3 class="mt-4 mb-2">Nenhum endereço cadastrado</h3>
            <p>Adicione um endereço para começar a fazer compras</p>
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <!-- Dialog Adicionar/Editar Endereço - NOVO DESIGN -->
    <v-dialog v-model="dialog" max-width="500" persistent scrollable class="address-dialog-wrapper">
      <v-card class="address-dialog" rounded="lg">
        <v-card-text class="dialog-content">
          <div class="dialog-header">
            <h1 class="dialog-title">
              {{ editingIndex !== null ? 'Editar endereço' : 'Adicionar endereço' }}
            </h1>
          </div>

          <v-form ref="form" class="form-section">
            <!-- CEP Input com busca automática -->
            <div class="form-group">
              <label class="form-label">
                CEP
                <span class="required-asterisk">*</span>
              </label>
              <div class="cep-input-wrapper">
                <v-text-field
                  v-model="form.zip"
                  placeholder="00000-000"
                  variant="outlined"
                  density="comfortable"
                  maxlength="9"
                  :rules="[v => !!v || 'CEP é obrigatório']"
                  @blur="buscarCEP"
                  @keyup.enter="buscarCEP"
                  :loading="carregandoCEP"
                  :error="erroViaCEP"
                  :error-messages="erroViaCEP ? 'CEP não encontrado' : ''"
                  class="cep-field"
                >
                  <template v-slot:append-inner>
                    <v-progress-circular
                      v-if="carregandoCEP"
                      indeterminate
                      size="24"
                      color="deep-purple-accent-4"
                    ></v-progress-circular>
                    <v-icon
                      v-else-if="cepEncontrado"
                      icon="mdi-check-circle"
                      color="green"
                      class="check-icon"
                    ></v-icon>
                  </template>
                </v-text-field>
              </div>
              <p v-if="cepEncontrado" class="cep-success-text">
                <v-icon size="small" icon="mdi-check-circle" class="me-1"></v-icon>
                Endereço encontrado automaticamente
              </p>
              <p class="cep-helper-text">Digite o CEP para preencher automaticamente</p>
            </div>

            <!-- Número da Rua -->
            <div class="form-group">
              <label class="form-label">
                Número
                <span class="required-asterisk">*</span>
              </label>
              <v-text-field
                v-model="form.number"
                placeholder="123"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'Número é obrigatório']"
              ></v-text-field>
            </div>

            <!-- Complemento -->
            <div class="form-group" v-if="cepEncontrado">
              <label class="form-label">Complemento</label>
              <v-text-field
                v-model="form.complement"
                placeholder="Apto, Sala, etc"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </div>

            <!-- Rua (Auto-preenchida) -->
            <div class="form-group" v-if="cepEncontrado">
              <label class="form-label">Rua</label>
              <v-text-field
                v-model="form.street"
                variant="outlined"
                density="comfortable"
                readonly
                class="readonly-field"
              ></v-text-field>
            </div>

            <!-- Bairro (Auto-preenchida) -->
            <div class="form-group" v-if="cepEncontrado">
              <label class="form-label">Bairro</label>
              <v-text-field
                v-model="form.neighborhood"
                variant="outlined"
                density="comfortable"
                readonly
                class="readonly-field"
              ></v-text-field>
            </div>

            <!-- Cidade e Estado (Auto-preenchidos) -->
            <div v-if="cepEncontrado" class="form-row">
              <div class="form-group form-col-6">
                <label class="form-label">Cidade</label>
                <v-text-field
                  v-model="form.city"
                  placeholder="Será preenchido automaticamente"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  class="readonly-field"
                ></v-text-field>
              </div>
              <div class="form-group form-col-6">
                <label class="form-label">Estado</label>
                <v-text-field
                  v-model="form.state"
                  placeholder="Será preenchido automaticamente"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  class="readonly-field"
                ></v-text-field>
              </div>
            </div>

            <!-- Campos vazios quando CEP não encontrado -->
            <div v-else class="empty-fields-placeholder">
              <p class="placeholder-text">Será preenchido automaticamente</p>
            </div>

            <!-- Checkbox Endereço Principal -->
            <div class="checkbox-section">
              <v-checkbox
                v-model="form.default"
                label="Deixar como endereço principal"
                color="deep-purple-accent-4"
                class="custom-checkbox"
              ></v-checkbox>
            </div>
          </v-form>
        </v-card-text>

        <!-- Dialog Actions -->
        <v-card-actions class="dialog-actions">
          <v-btn
            variant="text"
            @click="closeDialog"
            class="cancel-btn"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="deep-purple-accent-4"
            @click="saveAddress"
            class="save-btn"
            :disabled="!cepEncontrado || !form.number"
          >
            Salvar Endereço
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../controller/api'
import { toast } from 'vue3-toastify'
import axios from 'axios'

interface Address {
  id?: string
  type: string
  label: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zip: string
  phone: string
  default: boolean
}

const addresses = ref<Address[]>([])
const isCarregando = ref(true)

const dialog = ref(false)
const editingIndex = ref<number | null>(null)
const carregandoCEP = ref(false)
const erroViaCEP = ref(false)
const cepEncontrado = ref(false)

const form = ref<Address>({
  type: '',
  label: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  default: false,
})

// Buscar CEP na API ViaCEP
const buscarCEP = async () => {
  const cepLimpo = form.value.zip.replace(/\D/g, '')

  // Validar CEP
  if (!cepLimpo || cepLimpo.length !== 8) {
    erroViaCEP.value = true
    cepEncontrado.value = false
    return
  }

  carregandoCEP.value = true
  erroViaCEP.value = false
  cepEncontrado.value = false

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)

    if (response.data.erro) {
      erroViaCEP.value = true
      toast.error('CEP não encontrado')
      return
    }

    // Preencher automaticamente os campos
    form.value.street = response.data.logradouro || ''
    form.value.neighborhood = response.data.bairro || ''
    form.value.city = response.data.localidade || ''
    form.value.state = response.data.uf || ''
    form.value.zip = `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`

    cepEncontrado.value = true
    erroViaCEP.value = false
    toast.success('Endereço encontrado!')
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    erroViaCEP.value = true
    toast.error('Erro ao buscar CEP. Tente novamente.')
  } finally {
    carregandoCEP.value = false
  }
}

const getAddressIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    Residência: 'mdi-home',
    Comercial: 'mdi-briefcase',
    Outro: 'mdi-map-marker',
  }
  return icons[type] || 'mdi-map-marker'
}

const formatCEP = (cep: string | undefined) => {
  if (!cep) return ''
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
}

const formatPhone = (phone: string | undefined) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 11) return phone
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
}

const openAddressDialog = () => {
  editingIndex.value = null
  form.value = {
    type: '',
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    default: false,
  }
  cepEncontrado.value = false
  erroViaCEP.value = false
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editingIndex.value = null
  cepEncontrado.value = false
  erroViaCEP.value = false
}

const editAddress = (index: number) => {
  editingIndex.value = index
  form.value = { ...addresses.value[index] }
  cepEncontrado.value = true
  dialog.value = true
}

const setDefault = (index: number) => {
  addresses.value.forEach((addr, idx) => {
    addr.default = idx === index
  })
}

// Funções de API
const getToken = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const loadAddresses = async () => {
  try {
    isCarregando.value = true
    const headers = getToken()
    const response = await api.get('/endereco', { headers })
    addresses.value = response.data || []
  } catch (error: any) {
    console.error('Erro ao carregar endereços:', error)
    toast.error('Erro ao carregar endereços')
  } finally {
    isCarregando.value = false
  }
}

const saveAddress = async () => {
  try {
    const headers = getToken()
    
    if (editingIndex.value !== null) {
      // Atualizar endereço existente
      const address = addresses.value[editingIndex.value]
      await api.patch(`/endereco/${address.id}`, form.value, { headers })
      addresses.value[editingIndex.value] = { ...form.value }
      toast.success('Endereço atualizado com sucesso')
    } else {
      // Criar novo endereço
      const response = await api.post('/endereco', form.value, { headers })
      form.value.id = response.data.id
      
      if (form.value.default) {
        addresses.value.forEach((addr) => (addr.default = false))
      }
      addresses.value.push({ ...form.value })
      toast.success('Endereço adicionado com sucesso')
    }
    
    closeDialog()
  } catch (error: any) {
    console.error('Erro ao salvar endereço:', error)
    toast.error('Erro ao salvar endereço')
  }
}

const deleteAddress = async (index: number) => {
  try {
    const address = addresses.value[index]
    const headers = getToken()
    
    await api.delete(`/endereco/${address.id}`, { headers })
    addresses.value.splice(index, 1)
    toast.success('Endereço removido com sucesso')
  } catch (error: any) {
    console.error('Erro ao remover endereço:', error)
    toast.error('Erro ao remover endereço')
  }
}

// Carregar endereços ao montar o componente
onMounted(() => {
  loadAddresses()
})
</script>

<style scoped lang="css">
.addresses-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.addresses-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
}

.page-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: clamp(0.875rem, 3vw, 1rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.main-content {
  max-width: 1200px;
  margin-bottom: 3rem;
  padding: 1rem;
}

.content-wrapper {
  width: 100%;
}

.add-address-section {
  margin-bottom: 2rem;
  text-align: center;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.address-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.address-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.address-card.is-default {
  border-color: #667eea;
}

.default-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.badge-text {
  font-size: 0.7rem;
  font-weight: 600;
}

.address-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.address-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.address-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.address-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.address-street {
  font-weight: 600;
  color: #333;
}

.address-complement {
  color: #999;
  font-size: 0.85rem;
}

.address-location {
  color: #666;
  font-size: 0.9rem;
}

.address-zip {
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
}

.address-phone {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #667eea;
  font-weight: 500;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.5rem;
}

.action-btn {
  color: #667eea;
  flex: 1;
  min-width: 80px;
  font-size: 0.85rem;
}

.action-btn:hover {
  background-color: rgba(102, 126, 234, 0.1);
}

.delete-btn {
  color: #ff6b6b !important;
}

.delete-btn:hover {
  background-color: rgba(255, 107, 107, 0.1) !important;
}

.empty-state {
  text-align: center;
  background: white;
}

.empty-icon {
  color: #ddd;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

/* ========== NOVO DESIGN DO MODAL ========== */

.address-dialog-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2rem;
}

.address-dialog {
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.dialog-content {
  padding: 2rem !important;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.dialog-header {
  margin-bottom: 2rem;
  text-align: center;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.required-asterisk {
  color: #ff6b6b;
  font-weight: 700;
}

.cep-input-wrapper {
  position: relative;
}

.cep-field {
  width: 100%;
}

.check-icon {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cep-success-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.cep-helper-text {
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-col-6 {
  width: 100%;
}

.readonly-field :deep(.v-field__input) {
  color: #666;
  background-color: #f5f5f5;
}

.readonly-field :deep(.v-field) {
  background-color: #f5f5f5 !important;
}

.empty-fields-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.placeholder-text {
  color: #999;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
}

.checkbox-section {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.custom-checkbox :deep(.v-checkbox__label) {
  color: #333;
  font-weight: 500;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem !important;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
  border-radius: 0 0 20px 20px;
}

.cancel-btn {
  color: #666 !important;
  font-weight: 600;
}

.cancel-btn:hover {
  background-color: #f0f0f0;
}

.save-btn {
  padding: 0.7rem 2rem !important;
  font-weight: 600;
  border-radius: 8px;
  text-transform: none;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .addresses-header {
    padding: 1.5rem 1rem;
    margin-bottom: 1.5rem;
  }

  .main-content {
    padding: 0.5rem;
  }

  .dialog-content {
    padding: 1.5rem !important;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .dialog-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }

  :deep(.v-row) {
    margin: 0 !important;
  }

  :deep(.v-col) {
    padding: 0.5rem !important;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .addresses-header {
    padding: 1rem 0.5rem;
    margin-bottom: 1rem;
  }

  .add-address-section {
    margin-bottom: 1rem;
  }

  .add-btn {
    width: 100%;
  }

  .addresses-grid {
    gap: 1rem;
  }

  .address-card {
    padding: 0.75rem;
  }

  .address-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100% !important;
  }

  .dialog-content {
    padding: 1rem !important;
  }

  .dialog-header {
    margin-bottom: 1.5rem;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .form-section {
    gap: 1rem;
  }

  .dialog-actions {
    padding: 1rem !important;
    flex-direction: column-reverse;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
