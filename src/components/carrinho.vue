<template>
  <v-navigation-drawer
    v-model="aberto"
    :location="location"
    :width="drawerWidth"
    temporary
    :class="drawerClasses"
  >
    <v-list>
      <v-list-item-title class="drawer-title">Carrinho</v-list-item-title>
      <v-divider />

      <div v-if="cart.items.length === 0" class="empty-cart">
        Seu carrinho está vazio.
      </div>

      <v-list-item
        v-for="item in cart.items"
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
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cart'

const props = withDefaults(
  defineProps<{
    aberto?: boolean
    posicao?: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end'
    largura?: number | string
  }>(),
  {
    posicao: 'right',
    largura: 350,
  },
)

const emit = defineEmits<{
  (event: 'update:aberto', value: boolean): void
}>()

const stateAberto = ref(false)

const cart = useCartStore()

const location = computed(() => props.posicao)

const horizontalLocations = ['left', 'right', 'start', 'end'] as const

const drawerWidth = computed(() => {
  const isHorizontal =
    horizontalLocations.indexOf(location.value as (typeof horizontalLocations)[number]) !== -1
  if (!isHorizontal) return undefined

  if (typeof props.largura === 'number') {
    return props.largura
  }

  if (typeof props.largura === 'string' && props.largura.trim().length > 0) {
    return props.largura
  }

  return 350
})

const drawerClasses = computed(() => [
  'carrinho-drawer',
  `carrinho-drawer--${location.value}`,
])

const aberto = computed({
  get: () => (props.aberto ?? stateAberto.value),
  set: (value: boolean) => {
    stateAberto.value = value
    if (props.aberto !== undefined) {
      emit('update:aberto', value)
    }
  },
})

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
  padding: 1rem;
}

.carrinho-drawer--left,
.carrinho-drawer--right,
.carrinho-drawer--start,
.carrinho-drawer--end {
  max-width: min(90vw, 420px);
}

.carrinho-drawer--top,
.carrinho-drawer--bottom {
  width: 100%;
  height: auto;
  max-height: 70vh;
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
