import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cuhyjvnunpvhtlrguxkp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aHlqdm51bnB2aHRscmd1eGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODg3OTAsImV4cCI6MjA5MDA2NDc5MH0.NcjR67KI_cZKI3NKTAUZClizZTXUw09JPshAjXJuYQI'
)

export interface Product {
  id: string // Cambiado a string por el tipo UUID de tu DB
  sku: string
  name: string
  description: string
  price: number
  category: string
  image: string // Mapeado desde image_url
  status: string
  stock: number // Este vendrá del microservicio de Inventario después
  rating: number // Valor por defecto o de la DB
}

interface ProductsState {
  products: Product[]
  loading: boolean
  categories: string[]
  searchQuery: string
  selectedCategory: string
  priceRange: { min: number; max: number }
  currentPage: number
  itemsPerPage: number
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    loading: false,
    categories: ['Todos', 'Laptops', 'Smartphones', 'Tablets', 'Audio', 'Monitores', 'Accesorios', 'Wearables'],
    searchQuery: '',
    selectedCategory: 'Todos',
    priceRange: { min: 0, max: 3000 },
    currentPage: 1,
    itemsPerPage: 6,
  }),

  getters: {
    filteredProducts(state): Product[] {
      const filtered = state.products.filter((product) => {
        const matchesSearch =
          (product.name?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(state.searchQuery.toLowerCase()))
        const matchesCategory = state.selectedCategory === 'Todos' || product.category === state.selectedCategory
        const matchesPrice = product.price >= state.priceRange.min && product.price <= state.priceRange.max
        return matchesSearch && matchesCategory && matchesPrice
      })
      console.log('[filteredProducts] filtered:', filtered)
      return filtered
    },

    paginatedProducts(): Product[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      const paginated = this.filteredProducts.slice(start, end)
      console.log('[paginatedProducts] paginated:', paginated)
      return paginated
    },

    totalPages(): number {
      const total = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
      console.log('[totalPages] total:', total)
      return total
    },

    maxPrice(state): number {
      if (state.products.length === 0) {
        console.log('[maxPrice] No products, default 3000')
        return 3000
      }
      const max = Math.max(...state.products.map((p) => p.price))
      console.log('[maxPrice] max:', max)
      return max
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      console.log('[fetchProducts] Fetching products...')
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
        if (error) throw error
        console.log('[fetchProducts] Data received from Supabase:', data)
        // MAPEEO CRÍTICO: Convertimos image_url de la DB a image del frontend
        this.products = data.map((p: any) => ({
          ...p,
          image: p.image_url, // Ajuste para que coincida con tu estructura SQL
          stock: p.stock || 20, // Valor temporal hasta conectar el Microservicio 2
          rating: 4.5 // Valor temporal para la UI
        }))
        console.log('[fetchProducts] Products loaded:', this.products)
      } catch (err) {
        console.error('[fetchProducts] Error en Supabase:', err)
      } finally {
        this.loading = false
        console.log('[fetchProducts] Loading finished')
      }
    },

    setSearchQuery(query: string) {
      console.log('[setSearchQuery] query:', query)
      this.searchQuery = query;
      this.currentPage = 1
    },
    setCategory(category: string) {
      console.log('[setCategory] category:', category)
      this.selectedCategory = category;
      this.currentPage = 1
    },
    setPriceRange(min: number, max: number) {
      console.log('[setPriceRange] min:', min, 'max:', max)
      this.priceRange = { min, max };
      this.currentPage = 1
    },
    setPage(page: number) {
      console.log('[setPage] page:', page)
      this.currentPage = page
    }
  }
})