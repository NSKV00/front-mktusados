<template>
  <section class="products">
    <v-container>
      <v-row>
        <v-col
          v-for="(product, index) in filteredProducts"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="product-card">
            <v-img :src="product.img" height="180px" />
            <v-card-text>
              <h3>{{ product.nome }}</h3>
              <p class="price">R$ {{ product.valor }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <v-container fluid class="fill-height d-flex flex-column align-center justify-center bg-blue-darken-4 text-center text-white">
    <v-icon size="80" class="mb-4">mdi-home</v-icon>
    <h1 class="text-h4 font-weight-bold mb-2">Bem-vindo ao MKT Usados</h1>
    <p class="text-subtitle-1 mb-6">
      A melhor plataforma para compra e venda de produtos usados com segurança e praticidade.
    </p>

    <v-btn color="blue-grey-lighten-4" class="text-blue-darken-4 mb-3" @click="$router.push('/cadastro')">
      Criar conta
    </v-btn>

    <v-btn variant="outlined" color="white" @click="$router.push('/login')">
      Já tenho uma conta
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import emitter from '../utils/emitter'
import api from '../controller/api'

const products = ref<any[]>([])
const filters = ref({
  search: '',
  category: '',
  priceRange: [0, 5000]
})

onMounted(async () => {
  const res = await api.get('/produto')
  products.value = res.data

  emitter.on('applyFilters', (newFilters) => {
    filters.value = newFilters
  })
})

onUnmounted(() => {
  emitter.off('applyFilters')
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchName = p.nome.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchCategory = !filters.value.category || p.categoria === filters.value.category
    const matchPrice = p.valor >= filters.value.priceRange[0] && p.valor <= filters.value.priceRange[1]
    return matchName && matchCategory && matchPrice
  })
})
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
