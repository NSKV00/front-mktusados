import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as { id: number; nome: string; preco: number; imagem: string; quantidade: number }[],
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantidade, 0),
  },
  actions: {
    addToCart(produto: { id: number; nome: string; preco: number; imagem: string }) {
      const itemExistente = this.items.find((i) => i.id === produto.id)
      if (itemExistente) {
        itemExistente.quantidade++
      } else {
        this.items.push({ ...produto, quantidade: 1 })
      }
    },
    removeFromCart(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    clearCart() {
      this.items = []
    },
  },
})
