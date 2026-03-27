import { defineStore } from 'pinia'

// URL de tu API de Spring Boot
const API_URL = 'http://localhost:8080/api/products'

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  category: string
  image: string
  status: string
  stock: number
  rating: number
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
    products: [], // Inicializado como array vacío para evitar el error de .length
    loading: false,
    categories: ['Todos', 'Motos', 'Laptops', 'Smartphones', 'Accesorios'],
    searchQuery: '',
    selectedCategory: 'Todos',
    priceRange: { min: 0, max: 30000000 }, // Rango ajustado para precios de motos
    currentPage: 1,
    itemsPerPage: 6,
  }),

  getters: {
    filteredProducts(state): Product[] {
      // Agregamos comprobación de seguridad para state.products
      if (!state.products) return []
      
      return state.products.filter((product) => {
        const matchesSearch =
          (product.name?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(state.searchQuery.toLowerCase()))
        const matchesCategory = state.selectedCategory === 'Todos' || product.category === state.selectedCategory
        const matchesPrice = product.price >= state.priceRange.min && product.price <= state.priceRange.max
        return matchesSearch && matchesCategory && matchesPrice
      })
    },

    paginatedProducts(): Product[] {
      const filtered = this.filteredProducts
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },

    totalPages(): number {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        console.log('[fetchProducts] Llamando a Java en:', API_URL)
        const response = await fetch(API_URL)
        
        if (!response.ok) throw new Error('Error al conectar con la API')
        
        const data = await response.json()
        console.log('[fetchProducts] Datos de Java:', data)

        // Mapeo para que el Front no se rompa con los datos de Java
        this.products = data.map((p: any) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          description: p.description,
          price: p.price,
          // Rellenamos campos que Java no tiene todavía para que la UI se vea bien
          category: p.category || 'Motos',
          image: p.image_url || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=500', 
          status: p.status || 'Disponible',
          stock: p.stock || 5,
          rating: 4.8
        }))
      } catch (err) {
        console.error('[fetchProducts] Error:', err)
        this.products = [] // Evita que quede como undefined
      } finally {
        this.loading = false
      }
    },
    
    // ... mantén tus otras acciones (setSearchQuery, etc.) igual
  }
})