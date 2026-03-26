import { defineStore } from 'pinia'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  rating: number
}

interface ProductsState {
  products: Product[]
  categories: string[]
  searchQuery: string
  selectedCategory: string
  priceRange: { min: number; max: number }
  currentPage: number
  itemsPerPage: number
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [
      {
        id: 1,
        name: 'MacBook Pro 16"',
        description: 'Potente laptop con chip M3 Pro, 18GB RAM y 512GB SSD. Ideal para profesionales creativos.',
        price: 2499,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        stock: 15,
        rating: 4.9,
      },
      {
        id: 2,
        name: 'iPhone 15 Pro Max',
        description: 'El smartphone más avanzado con cámara de 48MP, chip A17 Pro y pantalla Super Retina XDR.',
        price: 1199,
        category: 'Smartphones',
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
        stock: 50,
        rating: 4.8,
      },
      {
        id: 3,
        name: 'Sony WH-1000XM5',
        description: 'Auriculares premium con cancelación de ruido líder en la industria y hasta 30 horas de batería.',
        price: 349,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        stock: 30,
        rating: 4.7,
      },
      {
        id: 4,
        name: 'iPad Pro 12.9"',
        description: 'Tablet profesional con chip M2, pantalla Liquid Retina XDR y compatibilidad con Apple Pencil.',
        price: 1099,
        category: 'Tablets',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        stock: 25,
        rating: 4.8,
      },
      {
        id: 5,
        name: 'Dell XPS 15',
        description: 'Laptop ultradelgada con pantalla OLED 3.5K, Intel Core i7 y 16GB RAM.',
        price: 1899,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
        stock: 20,
        rating: 4.6,
      },
      {
        id: 6,
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone premium con S Pen integrado, cámara de 200MP y Galaxy AI.',
        price: 1299,
        category: 'Smartphones',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
        stock: 40,
        rating: 4.7,
      },
      {
        id: 7,
        name: 'AirPods Pro 2',
        description: 'Auriculares inalámbricos con cancelación activa de ruido, audio espacial y estuche MagSafe.',
        price: 249,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop',
        stock: 100,
        rating: 4.8,
      },
      {
        id: 8,
        name: 'Samsung Galaxy Tab S9 Ultra',
        description: 'Tablet Android de 14.6" con pantalla AMOLED, S Pen incluido y resistencia al agua.',
        price: 1199,
        category: 'Tablets',
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
        stock: 18,
        rating: 4.5,
      },
      {
        id: 9,
        name: 'LG UltraWide 34"',
        description: 'Monitor curvo ultrawide QHD con panel IPS, 144Hz y USB-C con carga de 90W.',
        price: 799,
        category: 'Monitores',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
        stock: 12,
        rating: 4.6,
      },
      {
        id: 10,
        name: 'Logitech MX Master 3S',
        description: 'Ratón ergonómico premium con desplazamiento MagSpeed y conectividad multi-dispositivo.',
        price: 99,
        category: 'Accesorios',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
        stock: 75,
        rating: 4.9,
      },
      {
        id: 11,
        name: 'Apple Watch Ultra 2',
        description: 'Smartwatch resistente con GPS de doble frecuencia, titanio y 36 horas de batería.',
        price: 799,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
        stock: 35,
        rating: 4.7,
      },
      {
        id: 12,
        name: 'Keychron Q1 Pro',
        description: 'Teclado mecánico inalámbrico con cuerpo de aluminio CNC, switches Gateron y QMK/VIA.',
        price: 199,
        category: 'Accesorios',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=300&fit=crop',
        stock: 45,
        rating: 4.8,
      },
    ],
    categories: ['Todos', 'Laptops', 'Smartphones', 'Tablets', 'Audio', 'Monitores', 'Accesorios', 'Wearables'],
    searchQuery: '',
    selectedCategory: 'Todos',
    priceRange: { min: 0, max: 3000 },
    currentPage: 1,
    itemsPerPage: 6,
  }),

  getters: {
    filteredProducts(state): Product[] {
      return state.products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
        const matchesCategory = state.selectedCategory === 'Todos' || product.category === state.selectedCategory
        const matchesPrice = product.price >= state.priceRange.min && product.price <= state.priceRange.max
        return matchesSearch && matchesCategory && matchesPrice
      })
    },

    paginatedProducts(): Product[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProducts.slice(start, end)
    },

    totalPages(): number {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },

    maxPrice(state): number {
      return Math.max(...state.products.map((p) => p.price))
    },
  },

  actions: {
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1
    },

    setCategory(category: string) {
      this.selectedCategory = category
      this.currentPage = 1
    },

    setPriceRange(min: number, max: number) {
      this.priceRange = { min, max }
      this.currentPage = 1
    },

    setPage(page: number) {
      this.currentPage = page
    },

    updateStock(productId: number, quantity: number) {
      const product = this.products.find((p) => p.id === productId)
      if (product) {
        product.stock -= quantity
      }
    },
  },
})
