<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product } from '../stores/products'
import { useProductsStore } from '../stores/products'

const store = useProductsStore()

const selectedProduct = ref<Product | null>(null)
const isPurchaseModalOpen = ref(false)

const openPurchaseModal = (product: Product) => {
  selectedProduct.value = product
  isPurchaseModalOpen.value = true
}

onMounted(async () => {
  await store.fetchProducts()
})

</script>

<template>
  <div class="min-h-screen bg-default">
    <UHeader>
      <template #title>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-store" class="size-6 text-primary" />
          <span class="font-bold text-lg">TechStore</span>
        </div>
      </template>

      <template #right>
        <CartSummary />
      </template>
    </UHeader>

    <UMain>
      <UContainer class="py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-default mb-2">Catálogo de Productos</h1>
          <p class="text-muted">Descubre nuestra selección de tecnología premium</p>
        </div>

        <UCard class="mb-8">
          <CatalogFilters />
        </UCard>

        <div v-if="store.paginatedProducts.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ProductCard
              v-for="product in store.paginatedProducts"
              :key="product.id"
              :product="product"
              @buy="openPurchaseModal"
            />
          </div>

          <div v-if="store.totalPages > 1" class="flex justify-center">
            <UPagination
              v-model="store.currentPage"
              :total="store.filteredProducts.length"
              :items-per-page="store.itemsPerPage"
              show-edges
            />
          </div>
        </div>

        <UEmpty
          v-else
          icon="i-lucide-search-x"
          title="No se encontraron productos"
          description="Intenta ajustar los filtros de búsqueda"
        />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <span class="text-sm text-muted">© 2026 TechStore. Todos los derechos reservados.</span>
      </template>
      <template #right>
        <div class="flex items-center gap-4 text-sm text-muted">
          <ULink to="#" inactive-class="hover:text-default">Términos</ULink>
          <ULink to="#" inactive-class="hover:text-default">Privacidad</ULink>
          <ULink to="#" inactive-class="hover:text-default">Contacto</ULink>
        </div>
      </template>
    </UFooter>

    <PurchaseModal
      v-model:open="isPurchaseModalOpen"
      :product="selectedProduct"
    />
  </div>
</template>
