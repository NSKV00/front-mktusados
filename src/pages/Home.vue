<template>
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

    <v-main>
      <v-container class="products">
        <v-row>
          <v-col
            v-for="(product, index) in produtosFiltrados"
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
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import emitter from '../utils/emitter'
import api from '../controller/api'

const products = ref<any[]>([])
const produtosFiltrados = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await api.get('/produto')
    products.value = res.data
    produtosFiltrados.value = res.data
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  }

  emitter.on('applyFilters', (filters) => {
    const searchTerm = filters.search?.toLowerCase() || ''
    //const categoryTerm = filters.
    //const priceTerm = 
    //consy ordenacaoTerm = 

    produtosFiltrados.value = products.value.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm)
    )
  })
})

onUnmounted(() => {
  emitter.all.clear()
})
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>

