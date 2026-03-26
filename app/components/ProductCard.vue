<script setup lang="ts">
import type { Product } from '~/stores/products'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  buy: [product: Product]
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
</script>

<template>
  <UCard class="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <template #header>
      <div class="relative overflow-hidden rounded-lg">
        <img
          :src="props.product.image"
          :alt="props.product.name"
          class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <UBadge
          v-if="props.product.stock < 10"
          color="warning"
          class="absolute top-2 right-2"
        >
          ¡Últimas unidades!
        </UBadge>
      </div>
    </template>

    <div class="flex-1 flex flex-col gap-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-default text-lg leading-tight">
          {{ props.product.name }}
        </h3>
        <UBadge color="neutral" variant="subtle" size="sm">
          {{ props.product.category }}
        </UBadge>
      </div>

      <p class="text-muted text-sm line-clamp-2 flex-1">
        {{ props.product.description }}
      </p>

      <div class="flex items-center gap-1 text-sm">
        <UIcon name="i-lucide-star" class="size-4 text-yellow-500" />
        <span class="font-medium text-default">{{ props.product.rating }}</span>
        <span class="text-muted">• {{ props.product.stock }} en stock</span>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-muted">
        <span class="text-xl font-bold text-default">
          {{ formatPrice(props.product.price) }}
        </span>
        <UButton
          icon="i-lucide-shopping-cart"
          size="sm"
          :disabled="props.product.stock === 0"
          @click="emit('buy', props.product)"
        >
          Comprar
        </UButton>
      </div>
    </div>
  </UCard>
</template>
