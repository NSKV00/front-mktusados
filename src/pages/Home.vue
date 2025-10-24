<template>
  <main class="home">
    <header class="header">
  <div class="header-content">
    <h1 class="logo-text">Chuuko Vendas</h1>
    <v-btn icon @click="navDrawer = true">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </div>
</header>

    
    <v-navigation-drawer v-model="navDrawer" location="right" temporary class="nav-drawer">
      <v-list>
        <v-list-item-title class="drawer-title">Navegação</v-list-item-title>
        <v-divider />
        <v-list-item to="/">Home</v-list-item>
        <v-list-item to="/Cadastro">Cadastro</v-list-item>
        <v-list-item to="/Login">Login</v-list-item>
      </v-list>
    </v-navigation-drawer>

    
    <div class="search-container">
      <v-text-field
        v-model="search"
        placeholder="Buscar produtos, marcas e muito mais..."
        variant="solo"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search-bar"
      />
      <v-btn color="primary" class="filter-btn" @click="filterDrawer = true">
        <v-icon start>mdi-filter-variant</v-icon>Filtro
      </v-btn>
      <v-btn color="primary" class="carrinho-btn" @click="carrinhoDrawer = true">
        <v-badge :content="cart.length" color="red" overlap>
          <v-avatar :src="avatarSrc" size="60" />
        </v-badge>
      </v-btn>
    </div>

    
    <v-navigation-drawer v-model="filterDrawer" location="right" temporary class="filter-drawer">
      <v-list>
        <v-list-item-title class="filter-title">Filtros</v-list-item-title>
        <v-divider />
        <v-select v-model="sortBy" :items="sortOptions" label="Ordenar por" />
        <v-btn block color="primary" class="mt-4" @click="filterDrawer = false">Aplicar</v-btn>
      </v-list>
    </v-navigation-drawer>

    
    <v-navigation-drawer v-model="carrinhoDrawer" location="right" temporary class="carrinho-drawer">
      <v-list>
        <v-list-item-title class="drawer-title">Carrinho</v-list-item-title>
        <v-divider />
        <div v-if="cart.length === 0" class="empty-cart">Seu carrinho está vazio.</div>

        <v-list-item v-for="(item, index) in cart" :key="index">
          <v-img :src="item.image" width="60" height="60" class="mr-3" />
          <div class="cart-info">
            <h4>{{ item.name }}</h4>
            <p>R$ {{ item.price.toFixed(2) }}</p>
            <v-btn icon size="small" @click="removeFromCart(index)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-list-item>

        <v-divider class="my-4" />
        <h3 class="cart-total">Total: R$ {{ cartTotal.toFixed(2) }}</h3>
        <v-btn block color="green" class="mt-3" :disabled="cart.length === 0">Finalizar Compra</v-btn>
      </v-list>
    </v-navigation-drawer>

    <section class="products">
      <v-container>
        <v-row>
          <v-col v-for="(product, index) in sortedProducts" :key="index" cols="12" sm="6" md="4" lg="3">
            <v-card class="product-card" @click="goToDetails(product)">
              <v-img :src="product.image" height="180px" />
              <v-card-text>
                <h3>{{ product.name }}</h3>
                <p class="price">R$ {{ product.price }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Product {
  id: number
  name: string        
  description: string 
  price: number       
  image: string       
  discount?: number
  categoryId?: number
  active?: boolean
}

interface CarrinhoItem {
  id: number
  produtoId: number
  qtd: number
  usuarioId: number
  ativo?: boolean
}
const router = useRouter()

const navDrawer = ref(false)
const filterDrawer = ref(false)
const carrinhoDrawer = ref(false)

const search = ref('')
const sortBy = ref('Padrão')

const sortOptions = ['Padrão', 'Menor preço', 'Maior preço', 'name (A-Z)']

const avatarSrc = 'smirk.png'




const products = ref<Product[]>([])
const isLoading = ref(true)

onMounted(() => {
  axios.get('http://localhost:5056/produto')
    .then((res) => {
      products.value = res.data.map((p: any) => ({
        id: p.id,
        name: p.nome,
        description: p.descricao,
        price: Number(p.valor),
        image: p.img || '', 
        discount: p.desconto,
        categoryId: p.categoriaId,
        active: p.ativo
      }))
      isLoading.value = false
    })
    .catch((err) => {
      console.error('Erro ao buscar produtos:', err)
      isLoading.value = false
    })
})

const apiBase = 'http://localhost:5056/Itemcarrinho'; 


async function getCarrinho(usuarioId: number) {
  const res = await axios.get(`${apiBase}?usuarioId=${usuarioId}`);
  return res.data; 
}


async function addCarrinho(item: { produtoId: number, qtd: number, usuarioId: number }) {
  const res = await axios.post(apiBase, item);
  return res.data;
}


async function updateCarrinho(itemId: number, patch: { qtd?: number, ativo?: boolean }) {
  const res = await axios.patch(`${apiBase}/${itemId}`, patch);
  return res.data;
}

async function removeCarrinho(itemId: number) {
  const res = await axios.delete(`${apiBase}/${itemId}`);
  return res.data;
}
const carrinho = ref<CarrinhoItem[]>([])
const usuarioId = 1; 


onMounted(() => {
  getCarrinho(usuarioId)
    .then((items) => {
      carrinho.value = items
    })
    .catch((err) => {
      console.error(err)
    })
})

async function addToCart(productId: number) {
  try {
    const item = await addCarrinho({ produtoId: productId, qtd: 1, usuarioId })
    carrinho.value.push(item)
  } catch (err) {
    console.error(err)
  }
}
function removeCarrinhoItem(index: number) {
  const item = carrinho.value[index]
  if (!item) return
  return removeCarrinho(item.id)
    .then(() => {
      carrinho.value.splice(index, 1)
    })
    .catch((err) => {
      console.error(err)
    })
}
const cart = ref<Product[]>([])
const removeFromCart = (index: number) => cart.value.splice(index, 1)
const cartTotal = computed<number>(() =>
  cart.value.reduce((sum: number, item: Product) => sum + item.price, 0)
)


const filteredProducts = computed(() =>
  products.value.filter((p: Product) => {
    const matchSearch =
      p.name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
    return matchSearch
  })
)

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]
  switch (sortBy.value) {
    case 'Menor preço':
      return list.sort((a, b) => a.price - b.price)
    case 'Maior preço':
      return list.sort((a, b) => b.price - a.price)
    case 'name (A-Z)':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return list
  }
})


const goToDetails = (product: Product) => {
  router.push({
    name: 'DetalhesProdutos',
    params: { name: encodeURIComponent(product.name) },
    query: {
      price: product.price.toString(),
      description: product.description,
      image: product.image,
    },
  })
}
</script>

<style scoped>
.home {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  position: relative;
  top: 0;
  background-color: #f5f5f5;
  color: #ffaf04;
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
   box-shadow: 0 2px 4px #d100ff;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.logo-text {
  font-size: 2rem;
  font-weight: bold;
  margin-left: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  padding: 2rem;
 
}

.search-bar {
  min-width: 40%;
}

.filter-btn,
.carrinho-btn {
  height: 40px;
}


.filter-drawer {
  width: 280px;
  padding: 1rem;
}
.Categorias{
  gap: 12px;
}
.Ordenador{
  gap: 12px;
}

.carrinho-drawer {
  width: 350px;
  padding: 1rem;
}

.nav-drawer {
  width: 250px;
  padding: 1rem;
}


.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-info h4 {
  margin: 0;
  font-size: 1rem;
}

.cart-info p {
  margin: 0;
  color: #00a650;
}

.cart-total {
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}


.products {
  padding: 2rem 1rem;
}

.product-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.price {
  font-size: 1.2rem;
  color: #00a650;
  font-weight: bold;
}


.empty-cart {
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style>


