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
      <div>
      <h3 v-if="produtos.length > 0" class="products-title">Meus Produtos</h3>
      <div>
      <h3 v-if="produtos.length > 0" class="products-title">Meus Produtos</h3>
      <div class="products-grid">

      <div v-if="produtos.length === 0" class="no-products">
        Nenhum produto cadastrado
        <router-link to="/produtoCriar">
          <button class="btn-criar">Cadastrar Produto</button>
        </router-link>
      </div>

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
  justify-items: center;
  justify-items: center;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  gap: 50px;
  width: 100%;
}

/* Card principal */
.product-card {
  width: 80%;
  width: 80%;
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
  height: 350px;
  height: 350px;
  overflow: hidden;
  background: #fafafa;
}


.product-img {
  width: 100%;
  height: 350px;
  object-fit: fill;
  border-radius: 8px;
  height: 350px;
  object-fit: fill;
  border-radius: 8px;
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
:deep(.products-title) {
  padding-top: 42px;
  padding-bottom: 42px;
  font-size: 46px;
:deep(.products-title) {
  padding-top: 42px;
  padding-bottom: 42px;
  font-size: 46px;
  font-weight: 600;
  color: #111;
  margin: 0;
}
.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(1200px, 100%);
  max-width: 1200px;
  gap: 28px;
  padding: 60px 20px;
  grid-column: span 2;
  border-radius: 18px;
  background: #faf9ff;
  border: 1px dashed #b48eff;
  box-shadow: 0 6px 18px rgba(150, 100, 255, 0.08);
  animation: fadeIn 0.4s ease;
}

.no-products {
  font-size: 32px;
  font-weight: 500;
  color: #6b5c99;
  margin-top: 56px;
}

.no-products:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(150, 100, 255, 0.15);
  transition: 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}



.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(1200px, 100%);
  max-width: 1200px;
  gap: 28px;
  padding: 60px 20px;
  grid-column: span 2;
  border-radius: 18px;
  background: #faf9ff;
  border: 1px dashed #b48eff;
  box-shadow: 0 6px 18px rgba(150, 100, 255, 0.08);
  animation: fadeIn 0.4s ease;
}

.no-products {
  font-size: 32px;
  font-weight: 500;
  color: #6b5c99;
  margin-top: 56px;
}

.no-products:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(150, 100, 255, 0.15);
  transition: 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
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
.btn-criar {
  display: inline-block;
  padding: 12px 22px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7b2ff7, #9c4dff);
  color: white;
  font-size: 36px;
  font-weight: 600;
.btn-criar {
  display: inline-block;
  padding: 12px 22px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7b2ff7, #9c4dff);
  color: white;
  font-size: 36px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: 0.25s ease;
  box-shadow: 0 4px 12px rgba(123, 47, 247, 0.35);
  transition: 0.25s ease;
  box-shadow: 0 4px 12px rgba(123, 47, 247, 0.35);
}

.btn-criar:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(123, 47, 247, 0.45);
.btn-criar:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(123, 47, 247, 0.45);
}

.btn-criar:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(123, 47, 247, 0.3);

.btn-criar:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(123, 47, 247, 0.3);
}

/* Loader */
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 12px;
}

.spinner-cent {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  color: #ffffff;
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
  width: 100%;
  height: 220px;
  object-fit: cover;
}
.product-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

  @media (max-width: 720px) {
  .product-header {
    height: 160px;
  }
}
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import  apiController  from "../controller/api"
import { jwtDecode } from "jwt-decode"
import { jwtDecode } from "jwt-decode"

const produtos = ref([])
const usuario = ref(null)
const imagemBase64 = ref('')
const modalAberto = ref(false)
const isCarregando = ref(true)

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)


const form = ref({
  nome: '',
  telefone: '',
  cpf: '',
  idade: ''
})

const fotoPadrao = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

const fotoPadrao = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

const detectarTipoImagem = (base64) => {
  if (base64.startsWith('UklG')) return 'image/webp'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('iVBOR')) return 'image/png'
  return 'image/png'
}

const fotoSrc = computed(() => {
  const b = imagemBase64.value

  if (!b || typeof b !== "string" || !b.trim()) {
  return fotoPadrao
  }


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
  if (!imagem) return null;

  // Se for base64 direto
  if (typeof imagem === 'string') {
    const trimmed = imagem.trim()
    if (trimmed.startsWith('/9j/') || trimmed.startsWith('iVBOR') || trimmed.startsWith('UklG')) {
      const tipo = detectarTipoImagem(trimmed)
      return `data:${tipo};base64,${trimmed}`
    }

    if (trimmed.startsWith('data:')) return trimmed
    return trimmed  // URL absoluta
  }

  if (typeof imagem === 'object') {
    return produtoSrc(imagem.base64 || imagem.url || '')
  }

  // Se for base64 direto
  if (typeof imagem === 'string') {
    const trimmed = imagem.trim()
    if (trimmed.startsWith('/9j/') || trimmed.startsWith('iVBOR') || trimmed.startsWith('UklG')) {
      const tipo = detectarTipoImagem(trimmed)
      return `data:${tipo};base64,${trimmed}`
    }

    if (trimmed.startsWith('data:')) return trimmed
    return trimmed  // URL absoluta
  }

  if (typeof imagem === 'object') {
    return produtoSrc(imagem.base64 || imagem.url || '')
  }

  return null
}
  return null
}

onMounted(async () => {
     console.log("onMounted foi chamado!")

  

  try {

    console.log(user.value)
    console.log(user.value)
    isCarregando.value = true
    const headers = {
      Authorization: `Bearer ${token.value}`
      Authorization: `Bearer ${token.value}`
    };

    const [response, response2, response3] = await Promise.all([
      apiController.get("produto", {
        params: { Id: 20},
        params: { usuarioId: 8, skip: 8, take: 1 },
        headers
      }),
      apiController.get("usuarios", {
        params: { id: user.value.id },
        params: { id: user.value.id },
        headers
      }),
      apiController.get(`usuarioImagem/8`, { headers })
      apiController.get(`usuarioImagem/${user.value.id}`, { headers })
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
    isCarregando.value = true
  }
})


const abrirModal = () => modalAberto.value = true
const fecharModal = () => modalAberto.value = false

const salvarDados = async() => {
  const inicio = { ...usuario.value }
try {
  const headers = {
      Authorization: `Bearer ${token.value}`
      Authorization: `Bearer ${token.value}`
    };
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