<template>
  <div class="ml-page" v-if="!isCarregando">
    <div class="ml-container">

      <aside class="ml-aside">
        <div class="ml-user-card">
          <div class="ml-avatar">
            <img v-if="fotoSrc" :src="fotoSrc" alt="Avatar" />
            <div v-else class="ml-avatar-fallback">{{ usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U' }}</div>
          </div>

          <div class="ml-user-info">
            <h2 class="ml-name">{{ usuario.nome || '-' }}</h2>
            <p class="ml-email">{{ usuario.email || '-' }}</p>
          </div>

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
          </div>
        </section>

        <section class="ml-products">
          <div v-if="produtos.length === 0" class="ml-empty">
            <p>Este Usuario Ainda Não Tem Anúncios.</p>
          </div>

          <div class="products-grid">
            <article v-for="(produto, index) in produtosVisiveis" :key="produto.id || produto.produtoId || produto.titulo" class="product-card">
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

          <div v-if="produtos.length > 0" class="pagination-controls">
            <button class="btn-pagination" @click="offset = Math.max(0, offset - 12)" :disabled="offset === 0" aria-label="Anterior">&lt;</button>
            <span class="pagination-info">{{ offset + 1 }} - {{ Math.min(offset + 12, produtos.length) }} de {{ produtos.length }}</span>
            <button class="btn-pagination" @click="offset = Math.min(produtos.length - 1, offset + 12)" :disabled="offset + 12 >= produtos.length" aria-label="Próximo">&gt;</button>
          </div>
        </section>
      </main>
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
  min-width: 500px;;
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

/* Add product button (orange / market-like) */
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
}

.btn-add-large{
  padding:12px 20px;
  font-size:16px;
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
  /* layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 28px;
  box-sizing: border-box;
  width: 100%;
  height: 240px;
  background: linear-gradient(180deg, rgba(137,12,148,0.08), rgba(128, 97, 133, 0.459));
  border: 1px dashed rgba(137,12,148,0.28);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(137,12,148,0.06);
  color: var(--ml-dark);
  text-align: center;
  animation: fadeIn 300ms ease both;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.ml-empty::before{
  content: "📭";
  display: block;
  font-size: 44px;
  line-height: 1;
  margin-bottom: 4px;
  filter: drop-shadow(0 6px 18px rgba(137,12,148,0.08));
}

/* texto principal */
.ml-empty p{
  margin: 0;
  font-weight: 700;
  font-size: 16px;
  color: var(--ml-dark);
  text-transform: none;
}

/* se houver botão (usa a classe existente .btn-add-produto) */
.ml-empty .btn-add-produto{
  margin-top: 6px;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(0,0,0,0.06);
}

/* hover sutil no bloco vazio */
.ml-empty:hover{
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(137,12,148,0.09);
}

/* responsividade */
@media (max-width: 640px){
  .ml-empty{
    padding: 20px;
  }
  .ml-empty::before{
    font-size: 36px;
  }
  .ml-empty p{
    font-size: 15px;
  }
}
@media (max-width: 420px){
  .ml-empty{
    padding: 16px;
  }
  .ml-empty::before{
    font-size: 30px;
  }
  .ml-empty p{
    font-size: 14px;
  }
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
}

.ml-modal{
  width:100%;
  max-width:480px;
  background:#fff;
  padding:20px;
  border-radius:12px;
  box-shadow: 0 18px 50px rgba(15,23,42,0.2);
  color: black;
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
.ml-form input[type="number"]{
  padding:8px 10px;
  border-radius:8px;
  border:1px solid rgba(0,0,0,0.08);
  color: black;
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
}

.btn-secondary{
  background:#fff;
  border:1px solid rgba(0,0,0,0.06);
  padding:8px 14px;
  border-radius:8px;
  font-weight:500;
  cursor:pointer;
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
  max-width: 300px;   /* largura máxima do preview */
  max-height: 300px;  /* altura máxima do preview */
  margin: 16px auto;
  overflow: hidden;
  border-radius: 12px;  /* opcional, deixa arredondado */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}

.preview-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* mantém proporção e não corta a imagem */
  display: block;
}

@keyframes spin{ to { transform:rotate(360deg);} }

/* Responsiveness */
@media (max-width: 980px){
  .ml-container{ grid-template-columns: 1fr; }
  .products-grid{ grid-template-columns: repeat(1,1fr); }
  .ml-aside{ order:2; }
  .ml-main{ order:1; }
  .products-title{ text-align:left; }
}
</style>


<script setup>
import { ref, onMounted, computed } from 'vue'
import  apiController  from "../controller/api"
import { useRoute } from 'vue-router'
import { jwtDecode } from "jwt-decode"
import { toast } from 'vue3-toastify'

const produtos = ref([])
const usuario = ref(null)
const imagemBase64 = ref('')
const isCarregando = ref(true)

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)

const route = useRoute()
const usuarioId = ref(route.params.id) 


const form = ref({
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

  return null
}

onMounted(async () => {
     console.log("onMounted foi chamado!")

  

  try {

    console.log(user.value)
    isCarregando.value = true
    const headers = {
      Authorization: `Bearer ${token.value}`
    };

    const [response, response2, response3] = await Promise.all([
      apiController.get("produto", {
        params: { usuarioId: usuarioId.value , skip:offset.value },
        headers
      }),
      apiController.get("usuarios", {
        params: { id: usuarioId.value },
        headers
      }),
      apiController.get(`usuarioImagem/${usuarioId.value}`, { headers })
    ]);

    if (response2?.data) {
      usuario.value = response2.data[0];
    }

    if (response?.data) {
      produtos.value = response.data;
    }
    if (response3?.data) {
      imagemBase64.value = produtoSrc(response3.data.imagemBase64);
    }

    console.log("Produto SRC FINAL:", produtoSrc(produtos.value[0]?.img));
    console.log("USUÁRIO CARREGADO:", usuario.value.id);

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

const offset = ref(0)

const produtosVisiveis = computed(() => {
  return produtos.value.slice(offset.value, offset.value + 16)
})
</script>