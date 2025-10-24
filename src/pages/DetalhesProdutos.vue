<template>
  <v-container class="detalhes-produto" fluid>
    <v-row justify="center" class="full-height">
      <v-col cols="12" md="10" class="full-height">
        <v-card class="detalhes-card" elevation="12">
          <v-row class="full-height">
            
          
            <v-col cols="12" md="6" class="image-section">
              <v-img
                :src="product.image || 'https://via.placeholder.com/400x400?text=Imagem+do+Produto'"
                class="product-image"
                contain
              />
            </v-col>

            
            <v-col cols="12" md="6" class="info-section">
              <h1 class="product-title">{{ product.name }}</h1>
              <p class="product-description">{{ product.description }}</p>
              <p class="product-price">R$ {{ product.price.toFixed(2) }}</p>

              <div class="button-group">
                <v-btn class="btnAdd" @click="addToCart">
                  Adicionar ao carrinho
                </v-btn>
                <v-btn class="btnBack" @click="$router.back()">
                  Voltar
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

  
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
  name: decodeURIComponent(route.params.name as string),
  price: Number(route.query.price) || 0,
  description: route.query.description || 'Descrição não disponível.',
  image: route.query.image || '',
}

const showToast = ref(false)

function addToCart() {
  showToast.value = true
}
</script>

<style scoped>

.detalhes-produto {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.full-height {
  height: 100%;
}


.detalhes-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 2rem;
  gap: 2rem;
  background-color: #ffffff;
  color: #000000;
  box-shadow: #00000033 6px 6px 20px, #0000001a -4px -4px 10px;
  height: 100%;
}


.image-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: #00000033 4px 4px 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-image:hover {
  transform: scale(1.03);
  box-shadow: #00000055 6px 6px 15px;
}


.info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  gap: 1rem;
  padding: 1rem;
}

.product-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #000000;
}

.product-description {
  font-size: 1.1rem;
  color: #333333;
  line-height: 1.6;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.product-price {
  font-size: 2rem;
  font-weight: bold;
  color: #000000;
}


.button-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.button-group .v-btn {
  min-width: 180px;
  height: 55px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btnAdd {
  background-color: #000000;
  color: #ffffff;
  box-shadow: #ffaf04 4px 4px 8px;
}
.btnAdd:hover {
  background-color: #333333;
}


.btnBack {
  background-color: #000000;
  color: #f5f5f5;
  border: 2px solid #000000;
  box-shadow: #d100ff 4px 4px 8px;
}
.btnBack:hover {
  background-color: #000000;
  color: #ffffff;
}

@media(min-width:1000px){
  .detalhes-produto {
  padding: 1.5rem 0;
}
  .detalhes-card {
  padding: 1.5rem;
  gap: 1.5rem;
}

}
@media (min-width: 768px) {
  .detalhes-card {
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
@media (max-width: 500px) {
  .detalhes-card {
    flex-direction: column;
  }

  .image-section {
    margin-bottom: 1.5rem;
  }
}
@media (max-width: 400px) {
  .product-title {
    font-size: 1.8rem;
  }
  .product-price {
    font-size: 1.3rem;
  }
  .product-description {
    font-size: 0.8rem;
  }
  .button-group .v-btn {
    min-width: 45px;
    height: 30px;
    font-size: 0.6rem;
  }
}
</style>
