import { ref } from 'vue'

export interface Product {
  name: string
  price: number
  type?: string
  image: string
}

export const cart = ref<Product[]>([])

export function addToCart(product: Product) {
  cart.value.push(product)
}