<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Product } from '../stores/products'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { computed, reactive, watch } from 'vue'

interface Props {
  product: Product | null
}

const props = defineProps<Props>()
const open = defineModel<boolean>('open', { default: false })

const productsStore = useProductsStore()
const cartStore = useCartStore()
const toast = useToast()

const schema = computed(() =>
  z.object({
    quantity: z
      .number({ message: 'Ingresa una cantidad válida' })
      .min(1, 'La cantidad mínima es 1')
      .max(props.product?.stock ?? 1, `Solo hay ${props.product?.stock ?? 0} unidades disponibles`),
  })
)

type Schema = z.output<typeof schema.value>

const state = reactive({
  quantity: 1,
})

watch(
  () => props.product,
  () => {
    state.quantity = 1
  }
)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const totalPrice = computed(() => {
  if (!props.product) return 0
  return props.product.price * state.quantity
})
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!props.product) return

  // 1. Agregamos el producto al store
  // IMPORTANTE: Tu acción addItem ya pone cartStore.isCartOpen = true
  cartStore.addItem(props.product, state.quantity)

  // 2. Cerramos el modal de confirmación (el que pide la cantidad)
  open.value = false 

  // 3. Feedback visual opcional
  toast.add({
    title: '¡Listo!',
    description: `${props.product.name} se añadió al carrito`,
    color: 'success'
  })
}

const incrementQuantity = () => {
  if (props.product && state.quantity < props.product.stock) {
    state.quantity++
  }
}

const decrementQuantity = () => {
  if (state.quantity > 1) {
    state.quantity--
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Confirmar compra"
    :description="product?.name"
  >
    <template #body>
      <div v-if="product" class="space-y-6">
        <div class="flex gap-4">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-24 h-24 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-default text-lg">{{ product.name }}</h3>
            <p class="text-muted text-sm mt-1">{{ product.description }}</p>
            <div class="flex items-center gap-2 mt-2">
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ product.category }}
              </UBadge>
              <span class="text-sm text-muted">
                <UIcon name="i-lucide-package" class="size-4 inline mr-1" />
                {{ product.stock }} disponibles
              </span>
            </div>
          </div>
        </div>

        <USeparator />

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField name="quantity" label="Cantidad">
            <div class="flex items-center gap-3">
              <UButton
                icon="i-lucide-minus"
                variant="outline"
                color="neutral"
                size="sm"
                :disabled="state.quantity <= 1"
                @click="decrementQuantity"
              />
              <UInputNumber
                v-model="state.quantity"
                :min="1"
                :max="product.stock"
                class="w-24 text-center"
              />
              <UButton
                icon="i-lucide-plus"
                variant="outline"
                color="neutral"
                size="sm"
                :disabled="state.quantity >= product.stock"
                @click="incrementQuantity"
              />
            </div>
          </UFormField>

          <div class="bg-muted rounded-lg p-4">
            <div class="flex justify-between text-sm text-muted mb-2">
              <span>Precio unitario</span>
              <span>{{ formatPrice(product.price) }}</span>
            </div>
            <div class="flex justify-between text-sm text-muted mb-2">
              <span>Cantidad</span>
              <span>x{{ state.quantity }}</span>
            </div>
            <USeparator class="my-2" />
            <div class="flex justify-between text-lg font-bold text-default">
              <span>Total</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="open = false"
            >
              Cancelar
            </UButton>
            <UButton
              type="submit"
              icon="i-lucide-shopping-cart"
            >
              Añadir al carrito
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
