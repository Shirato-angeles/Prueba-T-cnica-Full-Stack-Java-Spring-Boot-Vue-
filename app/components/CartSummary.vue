<script setup lang="ts">
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const toast = useToast()

// Usamos directamente el estado del store para controlar la visibilidad
// Así, cuando addItem hace cartStore.isCartOpen = true, este panel aparece.

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', { // Cambiado a COP por tu ubicación
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price)
}

const handleRemove = (productId: string, name: string) => {
  cartStore.removeItem(productId)
  toast.add({
    title: 'Eliminado',
    description: `${name} fuera del carrito`,
    color: 'neutral'
  })
}

const handleCheckout = async () => {
  try {
    // Aquí es donde llamarás a la lógica de Supabase que descuenta stock
    await cartStore.checkout() 
    toast.add({
      title: '¡Compra exitosa!',
      description: 'El inventario ha sido actualizado en la base de datos.',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error en la transacción',
      description: error.message,
      color: 'red'
    })
  }
}
</script>

<template>
  <USlideover v-model:open="cartStore.isCartOpen" title="Tu carrito" side="right">
    
    <template #body>
      <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-center py-20">
        <UIcon name="i-lucide-shopping-cart" class="size-16 text-muted/20 mb-4" />
        <p class="text-muted font-medium">El carrito está vacío</p>
        <UButton 
          variant="ghost" 
          label="Seguir explorando" 
          class="mt-2" 
          @click="cartStore.isCartOpen = false" 
        />
      </div>

      <div v-else class="space-y-4">
        <div v-for="item in cartStore.items" :key="item.product.id" 
             class="flex gap-3 p-3 bg-muted/50 rounded-xl border border-white/5">
          <img :src="item.product.image" class="w-16 h-16 object-cover rounded-lg shadow-sm" />
          
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm truncate">{{ item.product.name }}</h4>
            <p class="text-xs text-muted">Cant: {{ item.quantity }}</p>
            <p class="font-semibold text-primary text-sm mt-1">
              {{ formatPrice(item.product.price * item.quantity) }}
            </p>
          </div>

          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="red"
            size="xs"
            @click="handleRemove(item.product.id, item.product.name)"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="cartStore.items.length > 0" class="w-full space-y-4">
        <div class="flex justify-between items-end">
          <span class="text-muted text-sm">Subtotal</span>
          <span class="text-xl font-black text-primary">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <UButton
          block
          size="xl"
          label="Pagar ahora"
          icon="i-lucide-shield-check"
          :loading="cartStore.loading"
          @click="handleCheckout"
        />
      </div>
    </template>
  </USlideover>
</template>