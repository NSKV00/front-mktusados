<template>
  <div v-if="isCarregando === true" class="ml-loading">
    <div class="loader"></div>
  </div>
  <v-app v-else>
    <v-app-bar color="white" height="80" class="header-appbar">
      <v-container fluid class="d-flex align-center gap-4 pa-0">

        <v-spacer/>

        <v-text-field
          v-model="localSearch"
          @input="onInput"
          @keyup.enter="onSearchEnter"
          placeholder="Buscar por produtos, lojas ou marcas..."
          prepend-inner-icon="mdi-magnify"
          dense
          rounded
          clearable
          class="search-field"
        />

        <v-spacer />

        <v-btn icon title="Filtros" @click="filtroDrawer = true">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>

        <v-btn v-if="isLogged" icon @click="carrinhoDrawer = true" title="Carrinho">
          <v-icon>mdi-cart</v-icon>
          <v-badge v-if="carrinhoTotalQtd > 0" :content="carrinhoTotalQtd" offset-x="25" offset-y="10" />
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="home-main">
      <v-container fluid>
        <v-row class="mt-4">
          <v-col cols="12">
            <v-sheet elevation="0" class="pa-3 info-bar">
              <div class="d-flex gap-3 align-center ">
                <v-sheet class="pa-2 categories-sheet" elevation="0">
                  <div class="chips-row">
                    <v-chip
                      v-for="cat in quickCategories"
                      :key="cat"
                      :class="{ 'active-chip': selectedCategory === cat }"
                      outlined
                      @click="selectCategory(cat)"
                    >
                      <v-icon left small>{{ iconFor(cat) }}</v-icon>
                      {{ cat }}
                    </v-chip>
                  </div>
                </v-sheet>
                <v-spacer />
                <v-select v-model="sortOrder" :items="sortItems" dense hide-details style="max-width:200px;" />
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="mt-3" dense>
          <template v-if="isLoading">
            <v-col v-for="n in 8" :key="n" cols="6" md="3">
              <v-sheet class="skeleton-card pa-3">
                <v-skeleton-loader type="image, text, text" />
              </v-sheet>
            </v-col>
          </template>

          <template v-else>
            <v-col v-for="p in produtosPaginados" :key="p.id" cols="6" md="3">
              <transition name="card-fade" mode="out-in">
                <v-card class="product-card" elevation="1">
                  <v-badge v-if="isProductNew(p)" color="deep-purple accent-3" class="badge-new" offset-x="10" offset-y="10">
                    <template #badge>Novo</template>
                  </v-badge>

                  <v-img :src="converterBase64(p.img)" class="product-image" height="200" cover @click="goToDetails(p)" />

                  <v-card-text class="card-content" @click="goToDetails(p)">
                    <div class="product-title">{{ p.nome }}</div>
                    <div class="product-price">R$ {{ formatPrice(p.valor) }}</div>
                    <div class="product-info">Vendido por <span class="seller-name" @click.stop="goToPerfil(p.usuarioId)">
                      {{ p.usuarioNome || 'Vendedor' }}
                    </span>
                  </div>
                  </v-card-text>

                  <v-card-actions class="card-actions">
                    <v-btn class="buy-button" block color="deep-purple-accent-4" @click.stop="adicionarAoCarrinho(p)">
                      Adicionar ao Carrinho
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </transition>
            </v-col>
          </template>
        </v-row>

        <v-row class="mt-6" align="center" justify="center">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div class="pagination-wrapper">
              <v-btn icon :disabled="paginaAtual === 1" @click="paginaAtual--">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <div class="page-info">Página <strong>{{ paginaAtual }}</strong> de {{ totalPaginas }}</div>
              <v-btn icon :disabled="paginaAtual === totalPaginas" @click="paginaAtual++">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Carrinho
      v-if="isLogged"
      v-model:aberto="carrinhoDrawer"
      :carrinho="carrinho"
      :produtos="products"
      @remover="removerCarrinho"
      @finalizar="finalizarCompra"
    />

    <FiltroDrawer
      v-model:open="filtroDrawer"
      :categorias="categorias"
      :vendedores="vendedores"
      :initial-filters="filters"
      @apply="onApplyFilters"
      @clear="onClearFilters"
    />
  </v-app>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '../controller/api'
  import Carrinho from '../components/carrinho.vue'
  import FiltroDrawer from '../components/FiltroDrawer.vue'
  import { toast } from 'vue3-toastify'

  interface Product {
    id: number;
    nome: string;
    description?: string;
    quantidade?: number;
    categoria?: string;
    categoriaNome?: string;
    usuarioNome?: string;
    valor: number;
    usuarioId: number;
    img?: string;
    ativo?: boolean;
    createdAt?: string;
  }

  interface CarrinhoItem {
    id: number;
    produtoId: number;
    qtd: number;
    usuarioId?: number;
  }

  const isLogged = computed(() => Boolean(localStorage.getItem("token")))
  const router = useRouter()
  const isCarregando = ref(true)

  const isLoading = ref(true)
  const products = ref<Product[]>([])
  const carrinho = ref<CarrinhoItem[]>([])
  const localSearch = ref('')
  const quickCategories = ref(api.get('/categoria').then(res => {
    const cats = Array.isArray(res.data) ? res.data : []
    return ['Tudo', ...cats]
  }).catch(() => ['Tudo']))
  const selectedCategory = ref<string | null>(null)
  const filtroDrawer = ref(false)
  const carrinhoDrawer = ref(false)
  const paginaAtual = ref(1)
  const itensPorPagina = 32
  const sortOrder = ref<'recent' | 'price-asc' | 'price-desc'>('recent')

  const filters = ref({
    nomeProduto: '',
    categoriaNome: '',
    vendedorNome: '',
    valorMinimo: null as number | null,
    valorMaximo: null as number | null
  })

  const sortItems = [
    { title: 'Mais recentes', value: 'recent' },
    { title: 'Menor preço', value: 'price-asc' },
    { title: 'Maior preço', value: 'price-desc' },
  ]

  const categorias = computed(() => Array.from(new Set(products.value.map(p => p.categoriaNome || p.categoria || 'Outros'))))
  const vendedores = computed(() => Array.from(new Set(products.value.map(p => p.usuarioNome || 'Vendedor'))))

  const produtosFiltrados = computed(() => {
    let list = products.value.filter(p => p.ativo !== false)

    if (selectedCategory.value && selectedCategory.value !== 'Tudo') {
      list = list.filter(p => (p.categoria || p.categoriaNome) === selectedCategory.value)
    }

    const s = (localSearch.value || '').toLowerCase().trim()
    if (s) {
      list = list.filter(p =>
        (p.nome || '').toLowerCase().includes(s) ||
        (p.usuarioNome || '').toLowerCase().includes(s)
      )
    }

    const f = filters.value
    if (f.nomeProduto) list = list.filter(p => (p.nome || '').toLowerCase().includes(String(f.nomeProduto).toLowerCase()))
    if (f.categoriaNome) list = list.filter(p => (p.categoria || p.categoriaNome) === f.categoriaNome)
    if (f.vendedorNome) list = list.filter(p => (p.usuarioNome || '').includes(f.vendedorNome))
    if (f.valorMinimo != null) list = list.filter(p => Number(p.valor) >= Number(f.valorMinimo))
    if (f.valorMaximo != null) list = list.filter(p => Number(p.valor) <= Number(f.valorMaximo))

    if (sortOrder.value === 'price-asc') list = list.sort((a, b) => (Number(a.valor) || 0) - (Number(b.valor) || 0))
    else if (sortOrder.value === 'price-desc') list = list.sort((a, b) => (Number(b.valor) || 0) - (Number(a.valor) || 0))
    else list = list.sort((a, b) => (b.id || 0) - (a.id || 0))

    return list
  })

  const totalPaginas = computed(() => Math.max(1, Math.ceil(produtosFiltrados.value.length / itensPorPagina)))

  const produtosPaginados = computed(() => {
    const start = (paginaAtual.value - 1) * itensPorPagina
    return produtosFiltrados.value.slice(start, start + itensPorPagina)
  })

  const carrinhoTotalQtd = computed(() => carrinho.value.reduce((s, it) => s + (it.qtd || 0), 0))

  watch([() => filters.value, localSearch, selectedCategory, sortOrder], () => {
    paginaAtual.value = 1
  }, { deep: true })

  watch(() => paginaAtual.value, (v) => {
    if (v < 1) paginaAtual.value = 1
    if (v > totalPaginas.value) paginaAtual.value = totalPaginas.value
  })

  function goToPerfil(vendedorId?: number) {
    if (!vendedorId) return
    router.push({ path: `/perfilVisual/${vendedorId}` })
  }

  onMounted(() => carregarDados())

  function iconFor(cat: string) {
    const map: Record<string, string> = { 'Eletrônicos': 'mdi-cellphone', 'Moda': 'mdi-tshirt-crew', 'Beleza': 'mdi-lipstick', 'Casa': 'mdi-sofa', 'Jogos': 'mdi-gamepad', 'Tudo': 'mdi-fire' }
    return map[cat] || 'mdi-tag'
  }

  function formatPrice(v: any) {
    const n = Number(v || 0)
    return n.toFixed(2).replace('.', ',')
  }

  const converterBase64 = (base64:any) => {
    if (!base64 || typeof base64 !== 'string') return null
    const trimmed = base64.trim()
    if (trimmed.startsWith('data:')) return trimmed

    let tipo = 'image/png'
    if (trimmed.startsWith('/9j/')) tipo = 'image/jpeg'

    return `data:${tipo};base64,${trimmed}`
}

  function isProductNew(p: Product) {
    if (!p?.createdAt) return false
    try {
      const created = new Date(p.createdAt).getTime()
      return (Date.now() - created) < 1000 * 60 * 60 * 24 * 7
    } catch {
      return false
    }
  }

  function goToDetails(produto: Product) {
    router.push({ path: `/produto/${produto.id}` })
  }

  let debounceTimer: number | undefined;
  function onInput() {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      paginaAtual.value = 1
    }, 350)
  }

  function onSearchEnter() {
    paginaAtual.value = 1
  }

  function selectCategory(cat: string) {
    selectedCategory.value = (cat === 'Tudo') ? null : cat
    paginaAtual.value = 1
  }

  function getAuthHeaders() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function carregarDados() {
  isLoading.value = true
  try {
    const headers = getAuthHeaders()

    const res = await api.get('/produto', { headers })
    products.value = Array.isArray(res.data) ? res.data : []
    console.log(res.data)

    let usuarioId: number | null = null
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        usuarioId = Number(payload?.id) || null
      } catch {
        usuarioId = null
      }
    }

    if (!usuarioId) {
      carrinho.value = []
      return
    }
    
    try {
      const resCarrinho = await api.get('/itemCarrinho', {
        params: { usuarioId },
        headers
      })

      const data = resCarrinho?.data
      carrinho.value = Array.isArray(data) ? data : []

    } catch (carrinhoErr: any) {
      if (carrinhoErr?.response?.status === 404) {
        carrinho.value = []
      } else {
        console.warn("Carrinho não pôde ser carregado:", carrinhoErr)
        carrinho.value = []
      }
    }

  } catch (err: any) {
    console.error('Erro ao carregar dados:', err?.response?.data || err)
    toast.error('Erro ao carregar produtos.')
  } finally {
    isLoading.value = false
    isCarregando.value = false
  }
}

  async function adicionarAoCarrinho(produto: Product) {
    if (!produto) return
    const token = localStorage.getItem('token')
    if (!token) {
      toast.info('Você precisa estar logado para adicionar ao carrinho.')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const usuarioId = Number(payload.id)
      if (!usuarioId) { toast.error('Usuário inválido. Faça login novamente.'); return; }

      await api.post('/itemCarrinho', {
        UsuarioId: usuarioId,
        ProdutoId: produto.id,
        Qtd: 1
      }, { headers: getAuthHeaders() })

      await carregarDados();
      toast.success('Item adicionado ao carrinho com sucesso!')
      carrinhoDrawer.value = true
    } catch (err: any) {
      console.error('Erro ao adicionar ao carrinho:', err?.response?.data || err)
      toast.error(err?.response?.data?.message || 'Erro ao adicionar ao carrinho')
    }
  }

  async function removerCarrinho(index: number) {
    const item = carrinho.value[index]
    if (!item) return
    try {
      await api.delete(`/itemcarrinho/${item.id}`, { headers: getAuthHeaders() })
      carrinho.value.splice(index, 1)
      toast.success('Item removido do carrinho')
    } catch (err) {
      console.error('Erro ao remover item:', err)
      toast.error('Erro ao remover item')
    }
  }

  function finalizarCompra() {
    toast.success('Compra finalizada!')
    carrinho.value = []
  }

  function onApplyFilters(payload: any) {
    if (!payload) return
    filters.value = { ...filters.value, ...payload }
    paginaAtual.value = 1
    filtroDrawer.value = false
  }

  function onClearFilters() {
    filters.value = { nomeProduto: '', categoriaNome: '', vendedorNome: '', valorMinimo: null, valorMaximo: null }
    paginaAtual.value = 1
    filtroDrawer.value = false
  }
</script>

<style scoped>
  .header-appbar {
    display: flex;
    align-items: center;
    position: relative;
    top: 0;
    background: white;
  }
  .brand-text {
    color: #372b73;
    font-weight: 700;
    font-size: 1.05rem;
    margin-right: 12px;
  }
  .search-field {
    max-width: 760px;
    width: 100%;
  }
  .home-main {
    background: #faf9fc;
    min-height: calc(100vh - 120px);
    padding-top: 16px;
  }
  .mt-4 {
    margin-top: 16px !important;
  }
  .seller-name {
  font-weight: 600;
  color: #372b73;
  cursor: pointer;
  text-decoration: underline;
  }
  .categories-sheet {
    background: transparent;
    color: #050505;
  }
  .sortItems {
    background-color: #777 !important;
  }
  .chips-row {
    display:flex; 
    gap:10px; 
    overflow-x:auto; 
    padding-bottom:6px;
    color: #050505;
  }
  .active-chip { 
    background: linear-gradient(90deg,#372b73,#FF6B6B); 
    color: white !important; 
  }

  .product-card {
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    color: #050505;
    display: flex;
    flex-direction: column;
    transition: transform .18s ease, box-shadow .18s ease;
  }
  .product-card:hover { 
    transform: translateY(-6px); 
    box-shadow: 0 16px 32px rgba(55,43,115,0.12); 
  }
  .product-image { 
    width: 100%; 
    height: 280px !important; 
    object-fit: cover; 
    border-bottom: 1px solid #eee; 
  }
  @media (max-width: 600px) {
    .product-image {
      height: 180px !important;
    }
  }
  .card-content { 
    padding: 1rem; 
    cursor: pointer; 
  }
  .product-title { 
    font-weight: 700; 
    color: #372b73; 
    font-size: 1rem; 
    margin-bottom: 0.4rem; 
    min-height: 38px;
    display: -webkit-box; 
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical; 
    overflow: hidden; 
  }
  .product-price { 
    font-size: 1.25rem; 
    color: #fcca00; 
    font-weight: 700; 
    margin-bottom: 0.6rem; 
  }
  .product-info { 
    font-size: 0.85rem; 
    color: #777; 
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
  .card-actions {
    padding: 0.8rem 1rem 1.2rem; 
  }
  .buy-button { 
    font-size: 0.95rem; 
    text-transform: none; 
    font-weight: 600; 
    border-radius: 10px; 
  }

  .badge-new { 
    position: absolute; 
    top: 10px; left: 
    10px; 
  }

  .skeleton-card { 
    background: white; 
    border-radius: 12px; 
    box-shadow: 0 6px 18px rgba(0,0,0,0.04); 
  }

  .pagination-wrapper { 
    display:flex; 
    align-items:center; 
    gap:12px; background:white; 
    padding:6px 12px; 
    border-radius:999px; 
    box-shadow:0 6px 18px rgba(55,43,115,0.06); 
  }
  .page-info { 
    font-size:0.95rem; 
    color:#372b73; 
  }

  .card-fade-enter-active, 
  .card-fade-leave-active { 
    transition: all .25s ease; 
  }
  .card-fade-enter-from { 
    opacity: 0; transform: translateY(8px); 
  }

  .muted { 
    color:#777; 
  }
  .info-bar { 
    background: #cecece;
    margin-top: 30px;
  }
</style>