<template>
  <div v-if="!isCarregando" class="profile-page">
    <div v-if="usuario" class="profile-container">
      <button class="config-btn" aria-label="Configurações" @click="abrirModal">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
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
      <h3 class="products-title">Meus Produtos</h3>
      <div class="products-grid">
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

        <router-link class="product-card add-new" to="/cadastrar-produto">
          <div class="add-inner">+ Cadastrar produto</div>
        </router-link>
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
      <div class="spinner"></div>
      <div class="loading-text">Carregando perfil...</div>
    </div>
  </div>
</template>


<style scoped>
.profile-page {
  position: relative; 
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 24px;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow-x: hidden;
}


.profile-container {
  margin: 0 auto;
  width: min(1200px, 100%);
  max-width: 1200px;
  background-color: #fff;
  border-radius: 12px;
  border: 2px solid #fed5aa;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 5%;
  justify-content: center;
  max-height: calc(100vh - 0px);
  overflow: auto;
  align-items: center;
}

/* Botão de Configurações */
.config-btn {
  position: absolute;
  top: 16px;
  right: 16px;
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

/* Cabeçalho do perfil */
.profile-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  width: 300px;
  height: 300px;
  border: 3px solid #fed5aa;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #666;
  background-color: #eee;
  border-radius: 50%;
}

/* Informações */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
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
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}
.user-info p {
  font-size: 15px;
  color: #6b7280;
}

/* Detalhes do perfil */
.profile-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
}
.detail-card {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  width: 400px;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}
.detail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.detail-card strong {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 6px;
}
.detail-card p {
  color: #111827;
  font-size: 15px;
}


/* Lista de produtos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

/* Card principal */
.product-card {
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

/* Header com imagem */
.product-header {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #fafafa;
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
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

/* Corpo do produto */
.product-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0;
}
.product-desc {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
  margin: 0;
}
.product-price {
  color: #16a34a;
  font-size: 18px;
  font-weight: 700;
  margin-top: 8px;
}

/* Rodapé com categoria e data */
.product-footer {
  margin-top: auto;
  padding: 10px 16px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #6b7280;
}
.product-category {
  background: #f3f4f6;
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 500;
}
.product-date {
  color: #9ca3af;
}

/* Botão de novo produto */
.add-new {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #333;
  background: linear-gradient(180deg, #fff7ed, #fff2e6);
  border: 2px dashed #f9c78c;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  min-height: 320px;
}
.add-new:hover {
  background: linear-gradient(180deg, #fff2e6, #ffe9d0);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-container {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}
.modal-buttons button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.modal-buttons button:first-child {
  background: #f3f3f3;
}
.modal-buttons button:last-child {
  background: #fed5aa;
}

/* Loader */
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0,0,0,0.12);
  border-top-color: #fed5aa;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-text {
  color: #222;
  font-size: 16px;
}

/* Responsividade */
@media (max-width: 720px) {
  .profile-container {
    width: calc(100% - 32px);
    padding: 16px;
    max-height: calc(100vh - 32px);
  }
  .products-grid {
    grid-template-columns: 1fr;
  }
  .product-img {
    height: 140px;
  }

  @media (max-width: 720px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  .product-header {
    height: 160px;
  }
}
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import  apiController  from "../controller/api"

const produtos = ref([])
const usuario = ref(null)
const imagemBase64 = ref('')
const modalAberto = ref(false)
const isCarregando = ref(true)
const token = localStorage.getItem('authToken');


const form = ref({
  nome: '',
  telefone: '',
  cpf: '',
  idade: ''
})

const detectarTipoImagem = (base64) => {
  if (base64.startsWith('UklG')) return 'image/webp'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('iVBOR')) return 'image/png'
  return 'image/png'
}
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return null;
  }
}

const fotoSrc = computed(() => {
  const b = imagemBase64.value
  if (!b || typeof b !== 'string') return null
  const trimmed = b.trim()
  if (trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed
  const tipo = detectarTipoImagem(trimmed)
  return `data:${tipo};base64,${trimmed}`
})

const produtoSrc = (imagem) => {
  if (!imagem) return null;
  if (Array.isArray(imagem) && imagem.length > 0) imagem = imagem[0];
  if (typeof imagem === "object" && imagem !== null)
    imagem =
      imagem.url ||
      imagem.imagem ||
      imagem.base64 ||
      imagem.path ||
      imagem.src ||
      "";

  if (!imagem || typeof imagem !== "string") return null;
  let trimmed = imagem.replace(/^"|"$/g, "").replace(/\r?\n|\s+/g, "").trim();

  if (/^data:image\/[a-zA-Z]+;base64,/.test(trimmed)) return trimmed;

  if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;

  if (trimmed.startsWith("UklG")) return `data:image/webp;base64,${trimmed}`;
  if (trimmed.startsWith("/9j/")) return `data:image/jpeg;base64,${trimmed}`;
  if (trimmed.startsWith("iVBOR")) return `data:image/png;base64,${trimmed}`;

  return `data:image/png;base64,${trimmed}`;
};

onMounted(async () => {
     console.log("onMounted foi chamado!")

  

  try {

    isCarregando.value = true
    const token = localStorage.getItem("token")
    const tokenData = token ? decodeJWT(token) : null;
    
    if (!token || !tokenData) {
      console.error("Token não encontrado ou inválido")
      isCarregando.value = false
      return
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const usuarioId = tokenData.id

    const [response, response2, response3] = await Promise.all([
      apiController.get("produto", {
        params: { usuarioId },
        headers
      }),
      apiController.get("usuarios", {
        params: { id: usuarioId },
        headers
      }),
      apiController.get(`usuarioImagem/${usuarioId}`, { headers })
    ]);

    if (response2?.data) {
      usuario.value = response2.data[0];
    }

    if (response?.data) {
      produtos.value = response.data;
    }
    if (response3?.data) {
      imagemBase64.value = response3.data.imagem;
    }

    console.log("Produto SRC FINAL:", produtoSrc(produtos.value[0]?.img));

    form.value = {
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


const abrirModal = () => modalAberto.value = true
const fecharModal = () => modalAberto.value = false

const salvarDados = async() => {
  const inicio = { ...usuario.value }
try {
  const token = localStorage.getItem("token")
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  
  console.log('Dados atualizados:', form.value)
  usuario.value = { ...usuario.value, ...form.value }
  await apiController.patch(
    `usuarios/${usuario.value.id}`,
    { ...form.value },
    {
      params: { id: usuario.value.id },
      headers
    }
  );

fecharModal()
} catch (error) {
  console.error("Erro ao salvar dados do usuário")
  form.value = {
    nome: inicio.nome || '',
    telefone: inicio.telefone || inicio.telefones || '',
    cpf: inicio.cpf || '',
    idade: inicio.idade || inicio.age || ''
  }
}
}


</script>