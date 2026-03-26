<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const toast = useToast()
const open = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const removeItem = (productId: number, productName: string) => {
  cartStore.removeItem(productId)
  toast.add({
    title: 'Producto eliminado',
    description: `${productName} eliminado del carrito.`,
    icon: 'i-lucide-trash-2',
    color: 'neutral',
  })
}

const checkout = () => {
  toast.add({
    title: '¡Compra realizada!',
    description: `Total: ${formatPrice(cartStore.totalPrice)}. Gracias por tu compra.`,
    icon: 'i-lucide-check-circle',
    color: 'success',
  })
  cartStore.clearCart()
  open.value = false
}
</script>

<template>
  <USlideover v-model:open="open" title="Tu carrito" side="right">
    <UButton
      icon="i-lucide-shopping-cart"
      variant="ghost"
      color="neutral"
      class="relative"
    >
      <UChip
        v-if="cartStore.totalItems > 0"
        :text="String(cartStore.totalItems)"
        color="primary"
        size="lg"
      />
    </UButton>

    <template #body>
      <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
        <UIcon name="i-lucide-shopping-bag" class="size-16 text-muted mb-4" />
        <p class="text-muted">Tu carrito está vacío</p>
        <p class="text-sm text-dimmed mt-1">Añade productos para comenzar</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="flex gap-3 p-3 bg-muted rounded-lg"
        >
          <img
            :src="item.product.image"
            :alt="item.product.name"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-default text-sm truncate">
              {{ item.product.name }}
            </h4>
            <p class="text-muted text-xs">
              {{ formatPrice(item.product.price) }} x {{ item.quantity }}
            </p>
            <p class="font-semibold text-default text-sm mt-1">
              {{ formatPrice(item.product.price * item.quantity) }}
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="removeItem(item.product.id, item.product.name)"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="cartStore.items.length > 0" class="space-y-4 w-full">
        <USeparator />
        <div class="flex justify-between text-lg font-bold text-default">
          <span>Total</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <UButton
          block
          size="lg"
          icon="i-lucide-credit-card"
          @click="checkout"
        >
          Finalizar compra
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
