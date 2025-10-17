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

   
    <v-navigation-drawer
      v-model="navDrawer"
      location="left"
      temporary
      class="nav-drawer"
    >
      <v-list>
        <v-list-item-title class="drawer-title">Navegação</v-list-item-title>
        <v-divider />
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
        <v-icon start>mdi-filter-variant</v-icon> Filtro
      </v-btn>
    </div>


    <v-navigation-drawer
      v-model="filterDrawer"
      location="right"
      temporary
      class="filter-drawer"
    >
      <v-list>
        <v-list-item>
          <v-list-item-title class="filter-title">Filtros</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Categoria"
          variant="outlined"
          density="comfortable"
          hide-details
        />

        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Ordenar por"
          variant="outlined"
          density="comfortable"
          hide-details
        />

        <v-btn block color="primary" class="mt-4" @click="filterDrawer = false">
          Aplicar
        </v-btn>
      </v-list>
    </v-navigation-drawer>

 
    <section class="products">
      <v-container>
        <v-row>
          <v-col
            v-for="(product, index) in sortedProducts"
            :key="index"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card class="product-card">
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

interface Product {
  name: string
  price: number
  type: string
  image: string
}

const navDrawer = ref(false)
const filterDrawer = ref(false)
const search = ref('')
const selectedCategory = ref('Todos')
const sortBy = ref('Padrão')

const categories = ['Todos', 'Periféricos', 'Monitores', 'Eletrônicos']
const sortOptions = ['Padrão', 'Menor preço', 'Maior preço', 'Nome (A-Z)']


const products = ref<Product[]>([
  { name: 'Headset Gamer RGB', price: 199.9, type: 'Periféricos', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_995664-MLA50930745743_072022-F.webp' },
  { name: 'Teclado Mecânico', price: 299.0, type: 'Periféricos', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_696440-MLA50199160146_062022-F.webp' },
  { name: 'Mouse Sem Fio', price: 89.99, type: 'Periféricos', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_732496-MLA50621842279_072022-F.webp' },
  { name: 'Monitor 27” Full HD', price: 1249.0, type: 'Monitores', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_602893-MLA50063234834_052022-F.webp' },
  { name: 'Caixa Bluetooth JBL', price: 159.0, type: 'Eletrônicos', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_682901-MLA49542416183_032022-F.webp' },
])


const filteredProducts = computed(() => {
  return products.value.filter((p: Product) => {
    const matchCategory = selectedCategory.value === 'Todos' || p.type === selectedCategory.value
    const matchSearch = p.name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
    return matchCategory && matchSearch
  })
})

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]
  switch (sortBy.value) {
    case 'Menor preço':
      return list.sort((a, b) => a.price - b.price)
    case 'Maior preço':
      return list.sort((a, b) => b.price - a.price)
    case 'Nome (A-Z)':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return list
  }
})
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
  box-shadow: 0 2px 4px rgba(212, 0, 255, 0.361);
}

.search-bar {
  min-width: 40%;
}

.filter-btn {
  height: 40px;
}


.filter-drawer {
  width: 280px;
  padding: 1rem;
}

.filter-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.nav-drawer {
  width: 250px;
  padding: 1rem;
}

.drawer-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
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

.product-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.2rem;
  color: #00a650;
  font-weight: bold;
}
</style>
