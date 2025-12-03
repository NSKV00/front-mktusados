<template>
  <div class="ml-page" v-if="!isCarregando">
    <div class="ml-container">

      <aside class="ml-aside">
        <div class="ml-user-card">
          <div class="ml-avatar">
            <img v-if="fotoSrc" :src="fotoSrc" alt="Avatar" />
            <div v-else class="ml-avatar-fallback">{{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}</div>
            <button class="ml-edit-photo" @click="abrirModalImagem" aria-label="Alterar foto"> ✏️
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14" stroke="#1B1B1B" stroke-width="1.6" stroke-linecap="round"/><path d="M5 12h14" stroke="#1B1B1B" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
          </div>

          <div class="ml-user-info">
            <h2 class="ml-name">{{ usuario.nome || '-' }}</h2>
            <p class="ml-email">{{ usuario.email || '-' }}</p>
          </div>

          <button class="ml-edit-btn" @click="abrirModal">Editar perfil</button>

          <div class="ml-details">
            <div class="ml-detail">
              <span class="label">Telefone</span>
              <span class="value">{{ usuario.telefone || '-' }}</span>
            </div>
            <div class="ml-detail">
              <span class="label">CPF</span>
              <span class="value">{{ usuario.cpf || '-' }}</span>
            </div>
            <div class="ml-detail">
              <span class="label">Idade</span>
              <span class="value">{{ usuario.idade || '-' }}</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="ml-main">
        <section class="ml-products-header">
          <h1 class="products-title">Meus Produtos</h1>
          <div class="products-actions">
            <router-link to="/produtoCriar" class="btn-add-produto">Adicionar produto</router-link>
          </div>
        </section>

        <!-- Abas de Filtro -->
        <div class="filter-tabs">
          <button 
            class="tab-button" 
            :class="{ active: filtroAtivo === 'ativos' }"
            @click="filtroAtivo = 'ativos'"
          >
            <span class="tab-badge active-badge">{{ produtosAtivos.length }}</span>
            Ativos
          </button>
          <button 
            class="tab-button" 
            :class="{ active: filtroAtivo === 'inativos' }"
            @click="filtroAtivo = 'inativos'"
          >
            <span class="tab-badge inactive-badge">{{ produtosInativos.length }}</span>
            Inativos
          </button>
        </div>

        <section class="ml-products">
          <!-- Empty State -->
          <div v-if="filtroAtivo === 'ativos' && produtosFiltrados.length === 0" class="ml-empty">
            <p>{{ filtroAtivo === 'ativos' && 'Nenhum produto ativo' }}</p>
            <router-link to="/produtoCriar" class="btn-add-produto btn-add-large">Criar anúncio</router-link>
          </div>

          <!-- Grid de Produtos -->
          <div class="products-grid">
            <article v-for="(produto, index) in produtosFiltradosVisiveis" :key="produto.id || produto.produtoId || produto.titulo"  class="product-card" @click="abrirProduto(produto)">
              <div class="product-media">
                <img :src="produtoSrc(produto.img)" alt="produto" class="product-img" />
              </div>

              <div class="product-content">
                <div class="product-top">
                  <h3 class="product-title">{{ produto.nome || produto.titulo || 'Produto' }}</h3>
                  <p class="product-desc">{{ produto.descricao || produto.description || '-' }}</p>
                </div>

                <div class="product-bottom">
                  <div class="price-wrap">
                    <span class="product-price">R$ {{ (produto.preco ?? produto.valor) }}</span>
                  </div>
                  <div class="meta-wrap">
                    <span class="product-category">{{ produto.categoria || 'Sem categoria' }}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Paginação -->
          <div v-if="produtosFiltrados.length > 0" class="pagination-controls">
            <button class="btn-pagination" @click="offsetFiltro = Math.max(0, offsetFiltro - 12)" :disabled="offsetFiltro === 0" aria-label="Anterior">&lt;</button>
            <span class="pagination-info">{{ offsetFiltro + 1 }} - {{ Math.min(offsetFiltro + 12, produtosFiltrados.length) }} de {{ produtosFiltrados.length }}</span>
            <button class="btn-pagination" @click="offsetFiltro = Math.min(produtosFiltrados.length - 1, offsetFiltro + 12)" :disabled="offsetFiltro + 12 >= produtosFiltrados.length" aria-label="Próximo">&gt;</button>
          </div>
        </section>
      </main>
    </div>

    <!-- Modal: Editar usuário -->
    <div v-if="modalAberto" class="ml-modal-backdrop" @click.self="fecharModal">
      <div class="ml-modal">
        <h3>Editar usuário</h3>
        <form @submit.prevent="salvarDados" class="ml-form">
          <label>Nome<input type="text" v-model="form.nome" /></label>
          <label>Email<input type="email" v-model="form.email" /></label>
          <label>Telefone<input type="text" v-model="form.telefone" /></label>
          <label>CPF<input type="text" v-model="form.cpf" /></label>
          <label>Idade<input type="number" v-model="form.idade" /></label>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Alterar imagem de perfil -->
    <div v-if="modalImagemAberto" class="ml-modal-backdrop" @click.self="fecharModalImagem">
      <div class="ml-modal">
        <h3>Alterar imagem de perfil</h3>
        <form @submit.prevent="salvarImagem" class="ml-form">
          <input ref="fileInput" type="file" accept="image/*" @change="selecionarImagem" style="display:none" />
          <button type="button" class="btn-secondary" @click="fileInput.click()">Escolher arquivo</button>
          <div v-if="preview" class="preview-box">
            <img :src="preview" alt="preview" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="fecharModalImagem">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="ml-loading">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
:root{
  --ml-yellow: #ffd200;
  --ml-dark: #1b1b1b;
  --muted: #6b7280;
  --card-radius: 10px;
  --container-width: min(1200px, 100%);
}

/* Page layout */
.ml-page{
  min-height: 100vh;
  background: linear-gradient(180deg,#f7f8fa,#fbfbfd);
  padding: 28px;
  box-sizing: border-box;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: var(--ml-dark);
  display: flex;
  justify-content: center;
}

.ml-container{
  width: var(--container-width);
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  align-items: start;
}

/* Aside: user card */
.ml-aside {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ml-user-card{
  background: #fff;
  border-radius: var(--card-radius);
  padding: 20px;
  box-shadow: 0 6px 20px rgba(15,23,42,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  gap: 12px;
}

.ml-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: visible;    
  border: 4px solid var(--ml-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.ml-avatar img,
.ml-avatar-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  border-radius: 50%;
}

.ml-edit-photo {
  position: absolute;
  right: 10px;   
  bottom: 10px;  
  transform: translate(25%, 25%); 
  z-index: 10;
  background: rgba(255, 255, 255, 0.753);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}

.ml-edit-photo:hover {
  background: rgba(255, 255, 255, 1);
  transform: translate(25%, 25%) scale(1.1);
}

.ml-user-info{
  text-align:center;
}

.ml-name{
  margin:0;
  font-size:18px;
  font-weight:700;
}

.ml-email{
  margin:0;
  color:var(--muted);
  font-size:13px;
}

.ml-edit-btn{
  margin-top:6px;
  background:#fff;
  border:1px solid rgba(0,0,0,0.06);
  padding:8px 14px;
  border-radius:8px;
  cursor:pointer;
  font-weight:600;
  width:100%;
  transition: all 0.2s ease;
}

.ml-edit-btn:hover{
  background: var(--ml-yellow);
  border-color: var(--ml-yellow);
}

.ml-details{
  width:100%;
  margin-top:6px;
  display:flex;
  flex-direction:column;
  gap:8px;
}

.ml-detail{
  display:flex;
  justify-content:space-between;
  width:100%;
  padding:8px 10px;
  background:#fafafa;
  border-radius:8px;
  font-size:13px;
  color:var(--muted);
}

/* Main content */
.ml-main{
  display:flex;
  flex-direction:column;
  gap:18px;
}

/* Products header */
.ml-products-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  background: linear-gradient(90deg,#fff,#fff);
  padding:16px 12px;
  border-radius: 12px;
}

.products-title{
  margin:0;
  font-size:28px;
  font-weight:800;
  text-align:center;
  color:black;
  flex:1;
}

.products-actions{
  display:flex;
  align-items:center;
  justify-content:flex-end;
}

/* Add product button */
.btn-add-produto{
  display:inline-flex;
  align-items:center;
  gap:10px;
  background: linear-gradient(180deg,#e0a04069,#ffaf4d93);
  color:#fff;
  padding:10px 16px;
  border-radius:8px;
  font-weight:700;
  text-decoration:none;
  border:none;
  box-shadow: 0 6px 18px rgba(255,152,0,0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-produto:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,152,0,0.25);
}

.btn-add-large{
  padding:12px 20px;
  font-size:16px;
}

/* ===== FILTER TABS ===== */
.filter-tabs {
  display: flex;
  gap: 8px;
  background: #fff;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #f3f4f6;
  color: var(--ml-dark);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-button:hover {
  background: #e5e7eb;
}

.tab-button.active {
  background: var(--ml-yellow);
  color: #000;
  box-shadow: 0 4px 12px rgba(255, 210, 0, 0.2);
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.1);
  color: inherit;
}

.tab-badge.active-badge {
  background: #16a34a;
  color: white;
}

.tab-badge.inactive-badge {
  background: #9ca3af;
  color: white;
}

/* Products grid */
.ml-products{
  background: transparent;
}

.products-grid{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  align-items:start;
}

/* Card */
.product-card{
  width: 100%;
  background:#fff;
  border-radius:12px;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  box-shadow: 0 6px 20px rgba(15,23,42,0.06);
  border:1px solid rgba(0,0,0,0.04);
  transition: transform .12s ease, box-shadow .12s ease;
}

.product-card:hover{
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(15,23,42,0.09);
}

.product-media{
  position:relative;
  width:100%;
  height:220px;
  background:linear-gradient(180deg,#f8f8f8,#ffffff);
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}

.product-img{
  max-width:100%;
  max-height:100%;
  width:auto;
  height:auto;
  object-fit:contain;
  display:block;
}

.status-badge{
  position:absolute;
  left:12px;
  top:12px;
  padding:6px 10px;
  border-radius:999px;
  font-weight:700;
  font-size:12px;
  color:#fff;
  background:#16a34a;
  box-shadow: 0 8px 24px rgba(22,163,74,0.12);
}

.status-badge.inativo{
  background:#9ca3af;
}

.product-content{
  padding:14px 16px;
  display:flex;
  flex-direction:column;
  gap:12px;
  min-height:140px;
}

.product-top{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.product-title{
  margin:0;
  font-size:16px;
  font-weight:800;
  color:var(--ml-dark);
  line-height:1.2;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
  text-overflow:ellipsis;
}

.product-desc{
  color: black;
  margin:0;
  font-size:13px;
  line-height:1.4;
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.product-bottom{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-top:auto;
}

.product-price{
  color:#029c35;
  font-weight:900;
  font-size:18px;
}

.meta-wrap{
  text-align:right;
  display:flex;
  flex-direction:column;
  gap:6px;
}

.product-category{
  background:#f3f4f6;
  padding:6px 10px;
  border-radius:999px;
  font-weight:700;
  color:#374151;
  font-size:12px;
}

.product-date{
  font-size:12px;
  color:var(--muted);
}

/* Empty state */
.ml-empty{
  display:flex;
  gap:16px;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  padding:32px;
  background:#fac16c33;
  border-radius:12px;
  border:1px dashed rgba(136, 40, 2, 0.616);
  min-width: 300px;
  height: 240px;
  animation: fadeIn 0.3s ease;
}

.ml-empty p{
  margin:0;
  font-size:18px;
  font-weight:600;
  color: var(--ml-dark);
  text-align:center;
}

/* Pagination */
.pagination-controls{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  margin-top:18px;
}

.btn-pagination{
  background:#4c0163;
  border:1px solid rgba(0,0,0,0.06);
  padding:8px 12px;
  border-radius:8px;
  font-weight:700;
  cursor:pointer;
  color: white;
  transition: all 0.2s ease;
}

.btn-pagination:hover:not(:disabled){
  background: #6b0d7f;
  transform: translateY(-2px);
}

.btn-pagination:disabled{
  opacity:0.45;
  cursor:not-allowed;
}

.pagination-info{
  color: #4c0163;
  font-weight:700;
}

/* Modal styles */
.ml-modal-backdrop{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:2000;
  animation: fadeIn 0.2s ease;
}

.ml-modal{
  width:100%;
  max-width:480px;
  background:#fff;
  padding:20px;
  border-radius:12px;
  box-shadow: 0 18px 50px rgba(15,23,42,0.2);
  color: black;
  animation: slideUp 0.3s ease;
}

.ml-form{
  display:flex;
  flex-direction:column;
  gap:12px;
  margin-top:12px;
}

.ml-form label{
  display:flex;
  flex-direction:column;
  gap:8px;
  margin-bottom:10px;
  font-weight:600;
  color: black;
}

.ml-form input[type="text"],
.ml-form input[type="email"],
.ml-form input[type="number"]{
  padding:8px 10px;
  border-radius:8px;
  border:1px solid rgba(0,0,0,0.08);
  color: black;
  transition: all 0.2s ease;
}

.ml-form input:focus{
  outline: none;
  border-color: var(--ml-yellow);
  box-shadow: 0 0 0 3px rgba(255, 210, 0, 0.1);
}

/* Modal buttons */
.modal-actions{
  display:flex;
  justify-content:center;
  align-items: center;
  gap:12px;
  margin-top:12px;
}

.btn-primary{
  background:var(--ml-yellow);
  border:1px solid rgba(0,0,0,0.06);
  color:#111;
  padding:8px 14px;
  border-radius:8px;
  font-weight:500;
  cursor:pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover{
  background: #ffca00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 210, 0, 0.2);
}

.btn-secondary{
  background:#fff;
  border:1px solid rgba(0,0,0,0.06);
  padding:8px 14px;
  border-radius:8px;
  font-weight:500;
  cursor:pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover{
  background: #f3f4f6;
  border-color: rgba(0,0,0,0.12);
}

/* Loading */
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

.preview-box {
  width: 100%;
  max-width: 300px;
  max-height: 300px;
  margin: 16px auto;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}

.preview-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

@keyframes spin{ 
  to { transform:rotate(360deg);} 
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* Responsiveness */
@media (max-width: 980px){
  .ml-container{ grid-template-columns: 1fr; }
  .products-grid{ grid-template-columns: repeat(1,1fr); }
  .ml-aside{ order:2; }
  .ml-main{ order:1; }
  .products-title{ text-align:left; }
}

@media (max-width: 640px){
  .filter-tabs {
    gap: 6px;
  }

  .tab-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .tab-badge {
    min-width: 20px;
    height: 20px;
    font-size: 11px;
  }
}
</style>


<script setup>
import { ref, onMounted, computed } from 'vue'
import apiController from "../controller/api"
import { jwtDecode } from "jwt-decode"
import { toast } from 'vue3-toastify'
import { useRouter } from "vue-router"

const router = useRouter()

const produtos = ref([])
const usuario = ref(null)
const imagemBase64 = ref('')
const modalAberto = ref(false)
const isCarregando = ref(true)
const modalImagemAberto = ref(false)
const preview = ref(null)
const imagemSelecionada = ref(null)
const fileInput = ref(null)
const offset = ref(0)
const offsetFiltro = ref(0)
const filtroAtivo = ref('ativos') // 'ativos' ou 'inativos'

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)

const form = ref({
  email: '',
  nome: '',
  telefone: '',
  cpf: '',
  idade: ''
})

const fotoPadrao = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

const detectarTipoImagem = (base64) => {
  if (base64.startsWith('UklG')) return 'image/webp'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('iVBOR')) return 'image/png'
  return 'image/png'
}


const abrirProduto = (produto) => {
  router.push(`/produto/${produto.id || produto.produtoId}`)
}

const fotoSrc = computed(() => {
  const b = imagemBase64.value

  if (!b || typeof b !== "string" || !b.trim()) {
    return fotoPadrao
  }

  if (!b || typeof b !== 'string') return null
  const trimmed = b.trim()
  if (trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed
  const tipo = detectarTipoImagem(trimmed)
  return `data:${tipo};base64,${trimmed}`
})

const produtoSrc = (imagem) => {
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

// ===== COMPUTED: FILTRAR PRODUTOS =====
const produtosAtivos = computed(() => {
  return produtos.value.filter(p => p.ativo === true)
})

const produtosInativos = computed(() => {
  return produtos.value.filter(p => p.ativo === false)
})

const produtosFiltrados = computed(() => {
  return filtroAtivo.value === 'ativos' ? produtosAtivos.value : produtosInativos.value
})

const produtosFiltradosVisiveis = computed(() => {
  return produtosFiltrados.value.slice(offsetFiltro.value, offsetFiltro.value + 12)
})

const abrirModalImagem = () => {
  modalImagemAberto.value = true
}

const fecharModalImagem = () => {
  modalImagemAberto.value = false
  preview.value = null
  imagemSelecionada.value = null
}

const selecionarImagem = (event) => {
  const file = event.target.files[0]

  if (!file) {
    alert('❌ Nenhum arquivo selecionado!')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('❌ Selecione apenas imagens (JPG, PNG, etc.)!')
    event.target.value = ''
    return
  }

  imagemSelecionada.value = file
  preview.value = URL.createObjectURL(file)
}

const salvarImagem = async () => {
  if (!imagemSelecionada.value) return

  const formData = new FormData()
  formData.append("imagem", imagemSelecionada.value)
  formData.append("file", imagemSelecionada.value)

  try {
    const headers = {
      Authorization: `Bearer ${token.value}`
    }

    await apiController.post(`usuarioImagem/${usuario.value.id}`, formData, {
      headers,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    })

    toast.success("Imagem atualizada com sucesso!")

    const reader = new FileReader()
    reader.onload = () => {
      imagemBase64.value = reader.result.split(",")[1]
    }
    reader.readAsDataURL(imagemSelecionada.value)

    fecharModalImagem()
  } catch (error) {
    console.error("Erro ao enviar imagem:", error)
    toast.error("Erro ao atualizar a imagem.")
  }
}

onMounted(async () => {
  try {
    isCarregando.value = true
    const headers = {
      Authorization: `Bearer ${token.value}`
    }

    const [response, response2, response3] = await Promise.all([
      apiController.get("produto", {
        params: { usuarioId: user.value.id, skip: offset.value },
        headers
      }),
      apiController.get("usuarios", {
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
      imagemBase64.value = produtoSrc(response3.data.imagemBase64)
    }

    form.value = {
      email: usuario.value.email || '',
      nome: usuario.value.nome || '',
      telefone: usuario.value.telefone || usuario.value.telefones || '',
      cpf: usuario.value.cpf || '',
      idade: usuario.value.idade || usuario.value.age || ''
    }

    isCarregando.value = false
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    isCarregando.value = false
  }
})

const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return false

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== parseInt(cpf.charAt(10))) return false

  return true
}

const abrirModal = () => modalAberto.value = true
const fecharModal = () => modalAberto.value = false

const salvarDados = async () => {
  const inicio = { ...usuario.value }

  try {
    if (!validarCPF(form.value.cpf)) {
      toast.error("CPF inválido. Verifique e tente novamente.")
      return
    }

    const headers = {
      Authorization: `Bearer ${token.value}`
    }

    await apiController.patch(
      `usuarios/${usuario.value.id}`,
      { ...form.value },
      {
        params: { id: usuario.value.id },
        headers
      }
    )
    toast.success("Dados atualizados com sucesso!")
    usuario.value = { ...usuario.value, ...form.value }

    fecharModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Erro ao atualizar dados. Tente novamente.')
    form.value = {
      email: inicio.email || '',
      nome: inicio.nome || '',
      telefone: inicio.telefone || inicio.telefones || '',
      cpf: inicio.cpf || '',
      idade: inicio.idade || inicio.age || ''
    }
  }
}
</script>