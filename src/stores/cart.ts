import { defineStore } from 'pinia'

const STORAGE_KEY = 'front-mktusados:cart'

type CartProduct = {
  id: number
  nome: string
  preco: number
  imagem: string
}

export type CartItem = CartProduct & {
  quantidade: number
}

type CartState = {
  items: CartItem[]
}

function loadCartItems(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!storedValue) return []

    const parsed: CartItem[] = JSON.parse(storedValue)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item) => Boolean(item?.id) && item.quantidade > 0)
  } catch (error) {
    console.warn('Falha ao carregar o carrinho armazenado. Usando estado vazio.', error)
    return []
  }
}

function persistCartItems(items: CartItem[]) {
  if (typeof window === 'undefined') return

  try {
    if (!items.length) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.warn('Falha ao persistir o carrinho. Estado manterá somente em memória.', error)
  }
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: loadCartItems(),
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantidade, 0),
  },
  actions: {
    addToCart(produto: CartProduct) {
      const itemExistente = this.items.find((item) => item.id === produto.id)

      if (itemExistente) {
        itemExistente.quantidade += 1
      } else {
        this.items.push({ ...produto, quantidade: 1 })
      }

      persistCartItems(this.items)
    },
    incrementQuantity(id: number) {
      const item = this.items.find((current) => current.id === id)
      if (!item) return

      item.quantidade += 1
      persistCartItems(this.items)
    },
    decrementQuantity(id: number) {
      const item = this.items.find((current) => current.id === id)
      if (!item) return

      if (item.quantidade <= 1) {
        this.removeFromCart(id)
        return
      }

      item.quantidade -= 1
      persistCartItems(this.items)
    },
    setQuantity(id: number, quantidade: number) {
      if (quantidade <= 0) {
        this.removeFromCart(id)
        return
      }

      const item = this.items.find((current) => current.id === id)
      if (!item) return

      item.quantidade = quantidade
      persistCartItems(this.items)
    },
    removeFromCart(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
      persistCartItems(this.items)
    },
    clearCart() {
      this.items = []
      persistCartItems(this.items)
    },
    hydrateFromStorage() {
      this.items = loadCartItems()
    },
  },
})
