import { defineStore } from 'pinia'
import type { Product } from './products'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems(state): number {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },

    totalPrice(state): number {
      return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    },
  },

  actions: {
    addItem(product: Product, quantity: number) {
      const existingItem = this.items.find((item) => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
    },

    removeItem(productId: number) {
      const index = this.items.findIndex((item) => item.product.id === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
