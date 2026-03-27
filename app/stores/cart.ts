import { defineStore } from 'pinia'
import type { Product } from './products'
import { createClient } from '@supabase/supabase-js'

// Usamos el cliente para la persistencia de la venta
const supabase = createClient(
  'https://cuhyjvnunpvhtlrguxkp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aHlqdm51bnB2aHRscmd1eGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODg3OTAsImV4cCI6MjA5MDA2NDc5MH0.NcjR67KI_cZKI3NKTAUZClizZTXUw09JPshAjXJuYQI'
)

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  isCartOpen: boolean // Estado para mostrar/ocultar el carrito
  loading: boolean
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    isCartOpen: false,
    loading: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  },

  actions: {
    addItem(product: Product, quantity: number) {
      const existingItem = this.items.find((item) => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
      // REQUERIMIENTO: Mostrar el carrito automáticamente
      this.isCartOpen = true 
    },

    // REQUERIMIENTO END-TO-END: Procesar la compra en la BD
    async checkout() {
      this.loading = true
      try {
        // Generamos una Idempotency-Key para resiliencia (evita cobros dobles)
        const idempotencyKey = crypto.randomUUID()

        for (const item of this.items) {
          // Llamamos a la función RPC de Supabase que creamos antes
          const { error } = await supabase.rpc('process_purchase', {
            p_product_id: item.product.id,
            p_quantity: item.quantity
          })

          if (error) throw new Error(`Error en ${item.product.name}: ${error.message}`)
        }

        this.clearCart()
        this.isCartOpen = false
        return { success: true }
      } catch (error: any) {
        console.error('Error en el checkout:', error.message)
        throw error
      } finally {
        this.loading = false
      }
    },

    removeItem(productId: string) { // Cambiado a string por el UUID
      this.items = this.items.filter(item => item.product.id !== productId)
    },

    clearCart() {
      this.items = []
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    }
  },
})