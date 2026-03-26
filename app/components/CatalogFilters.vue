<script setup lang="ts">
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()
const searchQuery = ref(store.searchQuery)
const selectedCategory = ref(store.selectedCategory)
const priceRange = ref([store.priceRange.min, store.priceRange.max])

const categoryItems = computed(() =>
  store.categories.map((cat) => ({
    label: cat,
    value: cat,
  }))
)

const debouncedSearch = useDebounceFn((value: string) => {
  store.setSearchQuery(value)
}, 300)

watch(searchQuery, (value) => {
  debouncedSearch(value)
})

watch(selectedCategory, (value) => {
  store.setCategory(value)
})

watch(
  priceRange,
  (value) => {
    store.setPriceRange(value[0], value[1])
  },
  { deep: true }
)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'Todos'
  priceRange.value = [0, store.maxPrice]
  store.setSearchQuery('')
  store.setCategory('Todos')
  store.setPriceRange(0, store.maxPrice)
}

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' ||
    selectedCategory.value !== 'Todos' ||
    priceRange.value[0] !== 0 ||
    priceRange.value[1] !== store.maxPrice
  )
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Buscar productos..."
          size="lg"
          class="w-full"
        />
      </div>
      <USelect
        v-model="selectedCategory"
        :items="categoryItems"
        placeholder="Categoría"
        size="lg"
        class="w-full sm:w-48"
      />
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div class="flex-1 w-full">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-default">Rango de precio</span>
          <span class="text-sm text-muted">
            {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
          </span>
        </div>
        <USlider
          v-model="priceRange"
          :min="0"
          :max="store.maxPrice"
          :step="50"
        />
      </div>

      <UButton
        v-if="hasActiveFilters"
        variant="ghost"
        color="neutral"
        icon="i-lucide-x"
        @click="clearFilters"
      >
        Limpiar filtros
      </UButton>
    </div>

    <div class="flex items-center justify-between text-sm text-muted border-t border-muted pt-4">
      <span>
        {{ store.filteredProducts.length }} producto{{ store.filteredProducts.length !== 1 ? 's' : '' }} encontrado{{ store.filteredProducts.length !== 1 ? 's' : '' }}
      </span>
    </div>
  </div>
</template>
