<template>
  <USlideover v-model="cartStore.isCartOpen" title="Carrito de Compras">
    <template #body>
      <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-muted py-12">
        <UIcon name="i-lucide-shopping-cart" class="size-12 mb-4 opacity-20" />
        <p>Tu carrito está vacío</p>
      </div>

      <div v-else class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto space-y-4">
          <div v-for="item in cartStore.items" :key="item.product.id" class="flex gap-4 p-3 bg-muted/30 rounded-lg">
            <img :src="item.product.image" class="w-16 h-16 object-cover rounded-md" />
            <div class="flex-1">
              <h4 class="text-sm font-bold line-clamp-1">{{ item.product.name }}</h4>
              <p class="text-xs text-muted">Cantidad: {{ item.quantity }}</p>
              <p class="text-sm font-semibold text-primary">{{ formatPrice(item.product.price * item.quantity) }}</p>
            </div>
            <UButton 
              icon="i-lucide-trash-2" 
              color="red" 
              variant="ghost" 
              size="xs" 
              @click="cartStore.removeItem(item.product.id)" 
            />
          </div>
        </div>

        <div class="border-t pt-4 mt-6 space-y-4">
          <div class="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <UButton 
            block 
            size="xl" 
            label="Finalizar Compra" 
            icon="i-lucide-credit-card"
            :loading="cartStore.loading"
            @click="handleCheckout"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const toast = useToast()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)
}

const handleCheckout = async () => {
  try {
    await cartStore.checkout()
    toast.add({
      title: 'Compra procesada',
      description: 'El inventario ha sido actualizado.',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message,
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  }
}
</script>