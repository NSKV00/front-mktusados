<template>
  <v-app>
    <HeaderTop
      v-model:drawerCart="carrinhoDrawer"
      v-model:searchTerm="searchTerm"
      :cart-count="carrinhoTotalQtd"
      @open-filters="filtroDrawer = true"
    />

    <BannerPromocional :banners="banners" />

    <v-main class="home-main">
      <v-container fluid>
        <!-- CATEGORIAS RÁPIDAS -->
        <CategoriasRapidas
          :categories="quickCategories"
          v-model:selected="selectedCategory"
          @select="onQuickCategory"
        />

        <!-- FILTROS (mobile info) -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-sheet elevation="0" class="pa-3">
              <div class="d-flex gap-3 align-center">
                <small class="muted">Exibindo</small>
                <strong class="text--primary">{{ produtosFiltrados.length }}</strong>
                <small class="muted">produtos</small>
                <v-spacer />
                <SortAndView
                  v-model:sort="sortOrder"
                  :show-grid-toggle="false"
                />
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <!-- GRID DE PRODUTOS -->
        <v-row class="mt-3" dense>
          <template v-if="isLoading">
            <v-col
              v-for="n in 8"
              :key="`skeleton-${n}`"
              cols="6" md="3"
            >
              <SkeletonProductCard />
            </v-col>
          </template>

          <template v-else>
            <v-col
              v-for="product in produtosPaginados"
              :key="product.id"
              cols="6"
              md="3"
            >
              <transition name="card-fade" mode="out-in">
                <ProductCard
                  :product="product"
                  @click="goToDetails(product)"
                />
              </transition>
            </v-col>
          </template>
        </v-row>

        <!-- PAGINAÇÃO -->
        <v-row class="mt-6" align="center" justify="center">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div class="pagination-wrapper">
              <v-btn icon :disabled="paginaAtual===1" @click="paginaAtual--">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <div class="page-info">Página <strong>{{ paginaAtual }}</strong> de {{ totalPaginas }}</div>

              <v-btn icon :disabled="paginaAtual===totalPaginas" @click="paginaAtual++">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- COMPRE SEU CARRINHO -->
        <CompreSeuCarrinho :cart-products="cartShowcase" @goto-suggestions="goToSuggested" />

      </v-container>
    </v-main>

    <!-- DRAWERS -->
    <Carrinho
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
function finalizarCompra() {
  window.alert('Compra finalizada!');
}
import { ref, computed, onMounted, watch } from 'vue';
import api from '../controller/api';
import emitter from '../utils/emitter.ts';

import HeaderTop from '../components/HomeComponents/HeaderTop.vue';
import BannerPromocional from '../components/HomeComponents/BannerPromocional.vue';
import CategoriasRapidas from '../components/HomeComponents/CategoriasRapidas.vue';
import ProductCard from '../components/HomeComponents/ProductCard.vue';
import SkeletonProductCard from '../components/HomeComponents/SkeletonProductCard.vue';
import CompreSeuCarrinho from '../components/HomeComponents/CompreSeuCarrinho.vue';
//import Carrinho from '../components/HomeComponents/Comp';
import FiltroDrawer from '../components/HomeComponents/FiltroDrawer.vue';
import SortAndView from '../components/HomeComponents/SortAndView.vue';
import { jwtDecode } from 'jwt-decode';

interface Product {
  id:number; nome:string; categoria:string; valor:number; img:string; ativo?:boolean; vendedorNome?:string; createdAt?:string;
}

interface CarrinhoItem { id:number; produtoId:number; qtd:number; usuarioId:number; }

let user: any = null;

const token = localStorage.getItem("token");

if (token) {
  user = jwtDecode(token);
  console.log(user);
}

const isLoading = ref(true);
const products = ref<Product[]>([]);
const carrinho = ref<CarrinhoItem[]>([]);
const searchTerm = ref('');
const selectedCategory = ref<string | undefined>(undefined);
const filtroDrawer = ref(false);
const carrinhoDrawer = ref(false);
const paginaAtual = ref(1);
const itensPorPagina = 32;
const sortOrder = ref('recent'); // recent | price-asc | price-desc

const filters = ref({
  nomeProduto: '',
  categoriaNome: '',
  vendedorNome: '',
  valorMinimo: null,
  valorMaximo: null
});

// banners (exemplo)
const banners = ref([
  { img:'', title:'Ofertas da semana', subtitle:'Frete grátis em T.O.S' },
  { img:'', title:'Novidades', subtitle:'Chegaram centenas de produtos' },
]);

const quickCategories = ['Tudo','Eletrônicos','Moda','Beleza','Casa','Jogos'];

// carregamento
async function carregarDados(){
  try {
    isLoading.value = true;
    const headers = { Authorization: `Bearer ${token}` };
    const resProdutos = await api.get('/produto', { headers });
    products.value = resProdutos.data || [];
    const resCarrinho = await api.get('/itemCarrinho',{ params:{ usuarioId:user.id }, headers });
    console.log(resCarrinho.data);
    carrinho.value = resCarrinho.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  carregarDados();
  emitter.on('applyFilters', (payload:any) => {
    // aplica external emitter
    if (payload.search !== undefined) searchTerm.value = payload.search;
    if (payload.nomeProduto !== undefined) filters.value.nomeProduto = payload.nomeProduto;
    if (payload.categoriaNome !== undefined) filters.value.categoriaNome = payload.categoriaNome;
    if (payload.vendedorNome !== undefined) filters.value.vendedorNome = payload.vendedorNome;
    if (payload.valorMinimo !== undefined) filters.value.valorMinimo = payload.valorMinimo;
    if (payload.valorMaximo !== undefined) filters.value.valorMaximo = payload.valorMaximo;
    paginaAtual.value = 1;
  });
});

watch([() => filters.value, searchTerm, selectedCategory, sortOrder], () => {
  paginaAtual.value = 1;
}, { deep:true });

const categorias = computed(() => Array.from(new Set(products.value.map(p=>p.categoria||'Outros'))));
const vendedores = computed(() => Array.from(new Set(products.value.map(p=>p.vendedorNome||'Vendedor'))));

// filtragem combinada:
const produtosFiltrados = computed(() => {
  let list = products.value.filter(p => p.ativo !== false);
  if (selectedCategory.value && selectedCategory.value!=='Tudo') list = list.filter(p => p.categoria === selectedCategory.value);
  const s = (searchTerm.value||'').toLowerCase().trim();
  if (s) list = list.filter(p => (p.nome||'').toLowerCase().includes(s) || (p.vendedorNome||'').toLowerCase().includes(s));
  const f = filters.value;
  if (f.nomeProduto) list = list.filter(p => (p.nome||'').toLowerCase().includes(f.nomeProduto.toLowerCase()));
  if (f.categoriaNome) list = list.filter(p => p.categoria === f.categoriaNome);
  if (f.vendedorNome) list = list.filter(p => p.vendedorNome === f.vendedorNome);
  if (f.valorMinimo != null) list = list.filter(p => Number(p.valor) >= Number(f.valorMinimo));
  if (f.valorMaximo != null) list = list.filter(p => Number(p.valor) <= Number(f.valorMaximo));

  if (sortOrder.value === 'price-asc') list = list.sort((a,b) => a.valor - b.valor);
  else if (sortOrder.value === 'price-desc') list = list.sort((a,b) => b.valor - a.valor);
  else list = list.sort((a,b) => (b.id||0) - (a.id||0));
  return list;
});

const totalPaginas = computed(() => Math.max(1, Math.ceil(produtosFiltrados.value.length / itensPorPagina)));
const produtosPaginados = computed(() => {
  const start = (paginaAtual.value - 1) * itensPorPagina;
  return produtosFiltrados.value.slice(start, start + itensPorPagina);
});

// carrinho util
const carrinhoTotalQtd = computed(() => carrinho.value.reduce((s, it)=> s + (it.qtd||0), 0));
const cartProducts = computed(() => {
  const arr = [];
  for (const it of carrinho.value) {
    const p = products.value.find(x => x.id === it.produtoId);
    if (p) arr.push(p);
  }
  return arr;
});
const cartShowcase = computed(() => {
  const slots = 4;
  const arr:any[] = [];
  const cartProds = cartProducts.value.slice(0, slots);
  for (const p of cartProds) arr.push(p);
  if (arr.length < slots) {
    const ids = new Set(arr.map(a=>a.id));
    const suggestions = products.value.filter(p => p.ativo !== false && !ids.has(p.id)).slice(0, slots - arr.length);
    for (const s of suggestions) arr.push(s);
  }
  while (arr.length < slots) arr.push(null);
  return arr;
});

function goToDetails(p:Product){ /* rota para detalhes */ window.scrollTo({top:0, behavior:'smooth'}); }
function goToSuggested(){ window.scrollTo({top:600, behavior:'smooth'}); }

async function removerCarrinho(index:number){
  const item = carrinho.value[index];
  if (!item) return;
  try {
    await api.delete(`/itemCarrinho/${item.id}`, { headers:{ Authorization:`Bearer ${token}` }});
    carrinho.value.splice(index,1);
  } catch(e){ console.error(e); }
}

function onApplyFilters(payload:any){
  // aplicação via drawer
  if (!payload) return;
  filters.value = { ...filters.value, ...payload };
  paginaAtual.value = 1;
}

function onClearFilters(){
  filters.value = { nomeProduto:'', categoriaNome:'', vendedorNome:'', valorMinimo:null, valorMaximo:null };
  paginaAtual.value = 1;
}

function onQuickCategory(cat:string){
  selectedCategory.value = (cat==='Tudo' ? undefined : cat);
  paginaAtual.value = 1;
}

</script>

<style scoped>
.home-main { background:#faf9fc; min-height:calc(100vh - 120px); padding-top:16px; }
.pagination-wrapper { display:flex; align-items:center; gap:12px; background:white; padding:6px 12px; border-radius:999px; box-shadow:0 6px 18px rgba(55,43,115,0.06); }
.page-info { font-size:0.95rem; color:#372b73; }
.card-fade-enter-active, .card-fade-leave-active { transition: all .25s ease; }
.card-fade-enter-from { opacity: 0; transform: translateY(8px); }
</style>