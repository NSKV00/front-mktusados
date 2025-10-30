<template>
  <div v-if="!isCarregando" class="profile-page">
    <div v-if="usuario" class="profile-container">

    <button class="config-btn" aria-label="Configurações" @click="abrirModal">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    </button>

      <div class="profile-header">
        <div class="avatar-wrapper">
          <img
            v-if="fotoSrc"
            :src="fotoSrc"
            alt="avatar"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}
          </div>
        </div>

        <div class="user-info">
          <h2 class="user-name">{{ usuario.nome || '-' }}</h2>
          <p class="user-email">{{ usuario.email || '-' }}</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-card">
          <strong>Telefone</strong>
          <p>{{ usuario.telefone || '-' }}</p>
        </div>
        <div class="detail-card">
          <strong>CPF</strong>
          <p>{{ usuario.cpf || '-' }}</p>
        </div>
        <div class="detail-card">
          <strong>Idade</strong>
          <p>{{ usuario.idade || '-' }}</p>
        </div>
        <div class="detail-card">
          <strong>Email</strong>
          <p>{{ usuario.email || '-' }}</p>
        </div>
      </div>
    </div>

    
    <div v-else class="loading">
      Carregando perfil...
    </div>
    
    <div class="products-list">
        <h3 class="products-title">Meus Produtos</h3>

        <div class="products-grid">
          <div
            v-for="produto in produtos"
            :key="produto.id || produto.produtoId || produto.titulo"
            class="product-card"
          >
<img :src="produtoSrc(produto.img)" class="product-img" />
            <div class="product-info">
              <strong>{{ produto.nome || produto.titulo || 'Produto' }}</strong>
              <p class="product-desc">{{ produto.descricao || produto.description || '-' }}</p>
              <span class="product-price">Preço: {{ (produto.preco ?? produto.valor) }}</span>
              <span v-if="produto.valor && produto.valor !== produto.preco" class="product-value">Valor: {{(produto.valor) }}</span>
            </div>
          </div>

          <!-- Item final: botão que leva para outra página -->
          <router-link class="product-card add-new" to="/cadastrar-produto">
            <div class="add-inner">+ Cadastrar produto</div>
          </router-link>
        </div>
    </div>

    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-container">
        <h2>Editar Usuário</h2>
        <form @submit.prevent="salvarDados">
          <label>
            Nome:
            <input type="text" v-model="form.nome"/>
          </label>
          <label>
            Telefone:
            <input type="text" v-model="form.telefone"/>
          </label>
          <label>
            CPF:
            <input type="text" v-model="form.cpf"/>
          </label>
          <label>
            Idade:
            <input type="number" v-model="form.idade"/>
          </label>
          <div class="modal-buttons">
            <button type="button" @click="fecharModal">Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="loading-full">
    <div class="spinner-wrapper" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
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

/* Mantém o conteúdo centralizado e com altura limitada para permitir scroll interno */
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
  flex-direction: column;
  gap: 20px;
  /* limita altura para caber na viewport e permitir scroll interno se necessário */
  max-height: calc(100vh - 0px);
  overflow: auto;
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
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fed5aa;
  overflow: hidden;
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

/* Detalhes do perfil */
.profile-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}
.detail-card {
  flex: 1 1 calc(50% - 16px);
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
}
.detail-card strong {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}
.detail-card p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

/* Lista de produtos */
.products-list {
  margin-top: 20px;
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.products-title {
  margin-bottom: 12px;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

/* Grid responsivo que preenche o container */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* sempre 2 por linha */
  gap: 16px;
  width: 100%;
  align-items: start;
}

/* Card do produto com altura consistente */
.product-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  min-height: 320px; /* garante alinhamento visual */
  box-sizing: border-box;
}

/* Imagem com tamanho fixo e corte consistente */
.product-img {
  width: 100%;
  max-width: 280px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #fff;
  flex: 0 0 auto;
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
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
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
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjE4NTAxOTksImV4cCI6MTc2MTg1NzM5OSwiaWF0IjoxNzYxODUwMTk5fQ.Lq_avsrvyqtBkHCphiPKJ_xHCMZRvoEgjhWiUTe5mp8`
    };

    const [response, response2, response3] = await Promise.all([
      apiController.get("produto", {
        params: { usuarioId: 8 },
        headers
      }),
      apiController.get("usuarios", {
        params: { id: 8 },
        headers
      }),
      apiController.get("usuarioImagem/8", { headers })
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
  const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJuYmYiOjE3NjE4NTAxOTksImV4cCI6MTc2MTg1NzM5OSwiaWF0IjoxNzYxODUwMTk5fQ.Lq_avsrvyqtBkHCphiPKJ_xHCMZRvoEgjhWiUTe5mp8`
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