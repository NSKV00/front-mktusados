<template>
  <v-container class="product-details" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="details-card" elevation="6">
          <v-row>
            <!-- Imagem -->
            <v-col cols="12" md="6" class="image-section">
              <v-img
                :src="product.image || 'https://via.placeholder.com/400x400?text=Imagem+do+Produto'"
                class="product-image"
                contain
              />
            </v-col>

            <!-- Informações -->
            <v-col cols="12" md="6" class="info-section">
              <h1 class="product-title">{{ product.name }}</h1>
              <p class="product-price">R$ {{ product.price.toFixed(2) }}</p>

              <div class="button-group">
                <v-btn class="btnAdd" color="green" dark @click="addToCart">
                  Adicionar ao carrinho
                </v-btn>
                <v-btn class="btnBack" color="grey" dark @click="$router.back()">
                  Voltar
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Toast -->
    <v-snackbar v-model="showToast" color="green" timeout="2000" rounded="pill">
      Produto adicionado ao carrinho!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const product = (route as any).state?.product || {
  name: route.params.name || 'Produto Desconhecido',
  price: 0,
  image: '',
}

const showToast = ref(false)

function addToCart() {
  showToast.value = true
}
</script>

<style scoped>
.product-details {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
}

.details-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 2rem;
  gap: 2rem;
}

.image-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: #ffffff 0px 2px 6px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px; /* altura mínima */
  justify-content: space-between; /* nome em cima, botões embaixo */
}

.product-title {
  font-size: 2.5rem; /* maior */
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem; /* distância do resto */
}

.product-price {
  font-size: 2.2rem;
  font-weight: bold;
  color: #00a650;
  
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.button-group .v-btn {
  min-width: 150px; 
  height: 50px;      
  font-size: 1rem;
}
.btnAdd{
  background-color: #a67100;
}
@media (min-width: 768px) {
  .details-card {
    flex-direction: row;
    align-items: center;
  }

  .info-section {
    text-align: left;
  }

  .image-section {
    margin-right: 2rem;
  }
}
</style>
