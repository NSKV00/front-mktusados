<template>
  <div v-if="!isCarregando" class="profile-page">
    <div v-if="usuario" class="profile-container">
      <button class="config-btn" aria-label="Configurações" @click="abrirModal">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.213-.75-.153-1.075.124-.073.044-.146.087-.22.127-.332.184-.582.496-.645.87l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a4.997 4.997 0 0 0-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.293-.241.438-.613.431-.992a6.758 6.758 0 0 0 0-.255c.007-.378-.138-.75-.43-.99l-1.005-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.213.75.153 1.075-.124.072-.044.146-.087.22-.127.332-.184.582-.496.644-.87l.213-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>

      <header class="profile-header">
        <div class="avatar-wrapper">
          <img v-if="fotoSrc" :src="fotoSrc" alt="avatar" class="avatar-img" />
          <div v-else class="avatar-placeholder">
            {{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ usuario.nome || '-' }}</h2>
          <p class="user-email">{{ usuario.email || '-' }}</p>
        </div>
      </header>

      <section class="profile-details">
        <div class="detail-card" v-for="(valor, campo) in {Telefone: usuario.telefone, CPF: usuario.cpf, Idade: usuario.idade, Email: usuario.email}" :key="campo">
          <strong>{{ campo }}</strong>
          <p>{{ valor || '-' }}</p>
        </div>
      </section>
    </div>

    <div v-else class="loading">Carregando perfil...</div>

    <section class="products-list">
      <div>
      <h3 v-if="produtos.length > 0" class="products-title">Meus Produtos</h3>
      <div class="products-grid">

      <div v-if="produtos.length === 0" class="no-products">
        Nenhum produto cadastrado
        <router-link to="/produtoCriar">
          <button class="btn-criar">Cadastrar Produto</button>
        </router-link>
      </div>
        <div v-for="produto in produtos" :key="produto.id || produto.produtoId || produto.titulo" class="product-card">
          <div class="product-header">
            <span class="status-badge" :class="{ inativo: !produto.ativo }">
              {{ produto.ativo ? 'Ativo' : 'Inativo' }}
            </span>
            <img :src="produtoSrc(produto.img)" class="product-img" alt="Imagem do produto" />
          </div>
          <div class="product-body">
            <h3 class="product-title">{{ produto.nome || produto.titulo || 'Produto' }}</h3>
            <p class="product-desc">{{ produto.descricao || produto.description || '-' }}</p>
            <p class="product-price">R$ {{ (produto.preco ?? produto.valor) }}</p>
          </div>
          <div class="product-footer">
            <span class="product-category">{{ produto.categoria || 'Sem categoria' }}</span>
            <span class="product-date">{{ produto.data || '24/10/2024' }}</span>
          </div>
        </div>
      </div>
      </div>
    </section>

    <!-- Modal -->
    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-container">
        <h2>Editar Usuário</h2>
        <form @submit.prevent="salvarDados">
          <label>Nome:<input type="text" v-model="form.nome" /></label>
          <label>Telefone:<input type="text" v-model="form.telefone" /></label>
          <label>CPF:<input type="text" v-model="form.cpf" /></label>
          <label>Idade:<input type="number" v-model="form.idade" /></label>
          <div class="modal-buttons">
            <button type="button" @click="fecharModal" class="btn-cancelar">Cancelar</button>
            <button type="submit" class="btn-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="loading-full">
    <div class="spinner-wrapper">
    <div class="spinner-cent">
      <div class="spinner"></div>
      <div class="loading-text">Carregando perfil...</div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import apiController from '../controller/api'
import { jwtDecode } from 'jwt-decode'

const isValidToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part && part.length > 0)
}

const tokenLocal = localStorage.getItem('token') || ''
const token = ref(tokenLocal)

const user = ref<any>(null)
if (tokenLocal && isValidToken(tokenLocal)) {
  try {
    user.value = jwtDecode(tokenLocal)
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    user.value = null
  }
}

const produtos = ref<any[]>([])
const usuario = ref<any>(null)
const imagemBase64 = ref('')
const offset = ref(0)
const isCarregando = ref(true)
const modalAberto = ref(false)

const form = ref({
  nome: '',
  telefone: '',
  cpf: '',
  idade: null
})

const fotoPadrao = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

const detectarTipoImagem = (base64: any) => {
  if (base64?.startsWith('UklG')) return 'image/webp'
  if (base64?.startsWith('/9j/')) return 'image/jpeg'
  if (base64?.startsWith('iVBOR')) return 'image/png'
  return 'image/png'
}

const fotoSrc = computed(() => {
  const b = imagemBase64.value

  if (!b || typeof b !== 'string' || !b.trim()) {
    return fotoPadrao
  }
  const cleanedBase64 = b.replace(/[\r\n\s]+/g, '')
  const tipo = detectarTipoImagem(cleanedBase64)
  return `data:${tipo};base64,${cleanedBase64}`
})

const produtoSrc = (imagem: any) => {
  if (!imagem) return null

  if (typeof imagem === 'string') {
    const trimmed = imagem.trim()
    if (trimmed.startsWith('/9j/') || trimmed.startsWith('iVBOR') || trimmed.startsWith('UklG')) {
      const tipo = detectarTipoImagem(trimmed)
      return `data:${tipo};base64,${trimmed}`
    }

    if (trimmed.startsWith('data:')) return trimmed
    return trimmed
  }

  if (typeof imagem === 'object') {
    return produtoSrc(imagem.base64 || imagem.url || '')
  }

  return null
}

onMounted(async () => {
  try {
    isCarregando.value = true
    const headers = {
      Authorization: `Bearer ${token.value}`
    }

    if (!user.value) {
      console.error('Usuário não autenticado')
      isCarregando.value = false
      return
    }

    const [response, response2, response3] = await Promise.all([
      apiController.get('produto', {
        params: { usuarioId: user.value.id, skip: offset.value },
        headers
      }),
      apiController.get('usuarios', {
        params: { id: user.value.id },
        headers
      }),
      apiController.get(`usuarioImagem/${user.value.id}`, { headers })
    ])

    if (response2?.data) {
      usuario.value = response2.data[0]
    }

    if (response?.data) {
      produtos.value = response.data
    }

    if (response3?.data) {
      imagemBase64.value = response3.data.imagem
    }

    form.value = {
      nome: usuario.value?.nome || '',
      telefone: usuario.value?.telefone || usuario.value?.telefones || '',
      cpf: usuario.value?.cpf || '',
      idade: usuario.value?.idade || usuario.value?.age || null
    }

    isCarregando.value = false
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    isCarregando.value = false
  }
})

const abrirModal = () => (modalAberto.value = true)
const fecharModal = () => (modalAberto.value = false)

const salvarDados = async () => {
  const inicio = { ...usuario.value }
  try {
    const headers = {
      Authorization: `Bearer ${token.value}`
    }
    console.log('Dados atualizados:', form.value)
    usuario.value = { ...usuario.value, ...form.value }
    await apiController.patch(
      `usuarios/${usuario.value.id}`,
      { ...form.value },
      {
        params: { id: usuario.value.id },
        headers
      }
    )
    fecharModal()
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error)
    form.value = {
      nome: inicio.nome || '',
      telefone: inicio.telefone || inicio.telefones || '',
      cpf: inicio.cpf || '',
      idade: inicio.idade || inicio.age || null
    }
  }
}

const produtosVisiveis = computed(() => {
  return produtos.value.slice(offset.value, offset.value + 16)
})
</script>

<style scoped>
/* =============================
    BASE DO LAYOUT
============================= */
  .profile-page {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    overflow-x: hidden;
  }

  /* =============================
      CONTAINER PRINCIPAL
  ============================= */
  .profile-container {
    position: relative;
    margin: 0 auto;
    width: min(1200px, 100%);
    background-color: #fff;
    border-radius: 12px;
    border: 2px solid #fed5aa;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: row;
    gap: 5%;
    justify-content: center;
    align-items: flex-start;
    max-height: calc(100vh - 0px);
    overflow-y: auto;
  }

  /* Melhor adaptação para telas menores */
  @media (max-width: 1024px) {
    .profile-container {
      flex-direction: column;
      align-items: center;
      padding: 18px;
      gap: 32px;
    }
  }

  @media (max-width: 480px) {
    .profile-container {
      width: calc(100% - 16px);
      padding: 14px;
    }
  }

  /* =============================
      BOTÃO DE CONFIGURAÇÃO
  ============================= */
  .config-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 34px;
    height: 34px;
    padding: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #000;
    border-radius: 8px;
    transition: background 0.15s ease, transform 0.12s ease;
  }
  .config-btn:hover {
    background-color: #fed5aa;
    transform: scale(1.05);
  }

  @media (max-width: 375px) {
    .config-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 24px;
      right: 2px !important;
    }
  }

  /* =============================
      HEADER / FOTO / USER INFO
  ============================= */
  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .avatar-wrapper {
    width: 260px;
    height: 260px;
    border: 3px solid #fed5aa;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    flex-shrink: 0;
  }
  @media (max-width: 425px) {
    .avatar-wrapper {
      width: 180px;
      height: 180px;
    }
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    font-size: 28px;
    color: #666;
    background-color: #eee;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Informações do usuário */
  .user-info {
    text-align: center;
    width: 100%;
  }
  .user-name {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
  .user-email {
    color: #666;
    font-size: 14px;
  }

  .user-info h2 {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
  }
  .user-info p {
    font-size: 15px;
    color: #6b7280;
  }

  /* =============================
      CARDS DE DETALHES
  ============================= */
  .profile-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 400px;
  }

  .detail-card {
    background: #ffffff;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
  }
  .detail-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
  .detail-card strong {
    color: #374151;
    font-weight: 600;
    margin-bottom: 6px;
    display: block;
  }
  .detail-card p {
    color: #111827;
    font-size: 15px;
  }

  /* =============================
        GRID DE PRODUTOS
  ============================= */
  .products-grid {
    display: grid;
    gap: 40px;
    width: 100%;
    justify-items: center;
  }

  /* Grid adaptativo para qualquer tamanho */
  @media (min-width: 1400px) {
    .products-grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (max-width: 1200px) {
    .products-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 900px) {
    .products-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .products-grid { grid-template-columns: 1fr; }
  }

  /* =============================
      CARDS DE PRODUTO
  ============================= */
  .product-card {
    width: 100%;
    max-width: 320px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.08);
  }

  .product-header {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    background: #fafafa;
  }
  @media (max-width: 480px) {
    .product-header { height: 200px; }
  }

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #22c55e;
    color: #fff;
    font-size: 13px;
    padding: 4px 10px;
    border-radius: 999px;
  }

  /* Corpo */
  .product-body {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .product-desc {
    font-size: 14px;
    color: #555;
  }
  .product-price {
    color: #16a34a;
    font-size: 18px;
    font-weight: 700;
  }

  /* Footer */
  .product-footer {
    padding: 10px 16px 14px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #6b7280;
  }
  .product-category {
    background: #f3f4f6;
    padding: 4px 10px;
    border-radius: 999px;
  }

  /* =============================
      ESTADO: SEM PRODUTOS
  ============================= */
  .no-products {
    margin: 48px auto;
    width: 100%;
    max-width: 600px;
    font-size: 28px;
    font-weight: 500;
    color: #6b5c99;
    background: #faf9ff;
    border: 1px dashed #b48eff;
    padding: 40px 20px;
    border-radius: 18px;
    text-align: center;
    animation: fadeIn 0.4s ease;
  }
  .no-products:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(150, 100, 255, 0.15);
  }
  @media (max-width: 480px) {
    .no-products {
      font-size: 22px;
      padding: 30px 16px;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* =============================
        BOTÕES / LOADER
  ============================= */
  .btn-add-produto {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 8px;
    background-color: rgb(255, 182, 46);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.25s ease;
    border: none;
    white-space: nowrap;
  }
  .btn-add-produto:hover {
    transform: translateY(-2px);
  }

  .spinner-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60vh;
    gap: 12px;
  }

  /* =============================
        PAGINAÇÃO
  ============================= */
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }

  .btn-pagination {
    padding: 10px 18px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffc36f, #bd7100);
    color: white;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.25s ease;
  }
  .btn-pagination:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  .btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-info {
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
  }

  @media (max-width: 480px) {
    .btn-pagination {
      padding: 8px 12px;
      font-size: 13px;
    }
    .pagination-info {
      font-size: 12px;
    }
  }
</style>