<template>
  <v-navigation-drawer
    v-model="aberto"
    location="right"
    temporary
    class="carrinho-drawer"
  >
    <v-list>
      <v-list-item-title class="drawer-title">Carrinho</v-list-item-title>
      <v-divider />

      <div v-if="cart.items.length === 0" class="empty-cart">
        Seu carrinho está vazio.
      </div>

      <v-list-item
        v-for="(item, index) in cart.items"
        :key="item.id"
        class="cart-item"
      >
        <v-img
          :src="item.imagem"
          width="60"
          height="60"
          class="mr-3 rounded-lg"
        />
        <div class="cart-info">
          <h4>{{ item.nome }}</h4>
          <p>R$ {{ item.preco.toFixed(2) }}</p>
          <v-row align="center" class="mt-1">
            <v-btn icon size="small" @click="diminuirQuantidade(item.id)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="mx-2">{{ item.quantidade }}</span>
            <v-btn icon size="small" @click="aumentarQuantidade(item.id)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon size="small" @click="removerItem(item.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </v-row>
        </div>
      </v-list-item>

      <v-divider class="my-4" />
      <h3 class="cart-total">
        Total: R$ {{ cart.total.toFixed(2) }}
      </h3>

      <v-btn
        block
        color="green"
        class="mt-3"
        :disabled="cart.items.length === 0"
        @click="finalizarCompra"
      >
        Finalizar Compra
      </v-btn>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const aberto = ref(false) // controle de abrir/fechar o drawer

// Ações
function removerItem(id: number) {
  cart.removeFromCart(id)
}

function aumentarQuantidade(id: number) {
  cart.incrementQuantity(id)
}

function diminuirQuantidade(id: number) {
  cart.decrementQuantity(id)
}

function finalizarCompra() {
  alert('Compra finalizada com sucesso!')
  cart.clearCart()
  aberto.value = false
}
</script>

<style scoped>
.carrinho-drawer {
  width: 350px;
  padding: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-info {
  flex-grow: 1;
}

.cart-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
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

.empty-cart {
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style>
