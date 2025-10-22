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
        <v-select v-model="selectedCategory" :items="categories" label="Categoria" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Product {
  name: string
  price: number
  type: string
  image: string
}

const router = useRouter()

const navDrawer = ref(false)
const filterDrawer = ref(false)
const carrinhoDrawer = ref(false)

const search = ref('')
const selectedCategory = ref('Todos')
const sortBy = ref('Padrão')

const categories = ['Todos', 'Periféricos', 'Monitores', 'Eletrônicos']
const sortOptions = ['Padrão', 'Menor preço', 'Maior preço', 'Nome (A-Z)']

const avatarSrc = 'smirk.png'

const products = ref([
  { 
    name: 'Headset Gamer RGB', 
    price: 199.90, 
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_995664-MLA50930745743_072022-F.webp',
    description: 'Headset gamer com iluminação RGB e som surround de alta qualidade. Ideal para jogos e comunicação online.'
  },
  { 
    name: 'Teclado Mecânico', 
    price: 299.00, 
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_696440-MLA50199160146_062022-F.webp',
    description: 'Teclado mecânico com switches vermelhos e retroiluminação RGB personalizável. Excelente para digitação e jogos.'
  },
  { 
    name: 'Mouse Sem Fio', 
    price: 89.99, 
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_732496-MLA50621842279_072022-F.webp',
    description: 'Mouse sem fio ergonômico com sensor de alta precisão e bateria recarregável.'
  },
  { 
    name: 'Monitor 27” Full HD', 
    price: 1249.00, 
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_602893-MLA50063234834_052022-F.webp',
    description: 'Monitor de 27 polegadas Full HD com painel IPS e taxa de atualização de 75Hz. Ideal para produtividade e entretenimento.'
  },
])

const cart = ref<Product[]>([])

const removeFromCart = (index: number) => cart.value.splice(index, 1)
const cartTotal = computed<number>(() => cart.value.reduce((sum: number, item: Product) => sum + item.price, 0))

const filteredProducts = computed(() =>
  products.value.filter((p: Product) => {
    const matchCategory = selectedCategory.value === 'Todos' || p.type === selectedCategory.value
    const matchSearch = p.name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
    return matchCategory && matchSearch
  })
)

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]
  switch (sortBy.value) {
    case 'Menor preço': return list.sort((a, b) => a.price - b.price)
    case 'Maior preço': return list.sort((a, b) => b.price - a.price)
    case 'Nome (A-Z)': return list.sort((a, b) => a.name.localeCompare(b.name))
    default: return list
  }
})


const goToDetails = (product: Product) => {
  router.push({
    name: 'DetalhesProdutos',
    params: { name: encodeURIComponent(product.name) },
    query: {
      price: product.price.toString(),
      type: product.type,
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
  color: rgb(255, 128, 0);
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 4px rgba(212, 0, 255, 0.18);
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


