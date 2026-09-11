import { useState, useEffect } from 'react'
import { Wheat, Leaf, Egg } from 'lucide-react'

// Map of icons for seller products
const ICON_MAP = {
  Wheat,
  Leaf,
  Egg,
}

export const DEFAULT_SELLER_PRODUCTS = [
  {
    id: 101,
    name: 'Beras Pandan Wangi Premium 5kg',
    price: 65000,
    unit: '5 kg',
    stock: 48,
    active: true,
    iconName: 'Wheat',
    g: ['#827717', '#9E9D24'],
    cat: 'Pangan',
    desc: 'Beras pandan wangi premium organik hasil tani desa',
  },
  {
    id: 102,
    name: 'Sayur Bayam Organik Segar 250g',
    price: 5000,
    unit: '250 gr',
    stock: 120,
    active: true,
    iconName: 'Leaf',
    g: ['#2E7D32', '#4CAF50'],
    cat: 'Sayur',
    desc: 'Bayam organik segar dipetik langsung pagi hari',
  },
  {
    id: 103,
    name: 'Telur Ayam Kampung (12 butir)',
    price: 32000,
    unit: '12 butir',
    stock: 30,
    active: true,
    iconName: 'Egg',
    g: ['#D97706', '#F59E0B'],
    cat: 'Pangan',
    desc: 'Telur ayam kampung asli dari peternakan warga',
  },
  {
    id: 104,
    name: 'Pupuk Organik Kompos 25kg',
    price: 45000,
    unit: '25 kg',
    stock: 2,
    active: true,
    iconName: 'Leaf',
    g: ['#2E7D32', '#4CAF50'],
    cat: 'Lainnya',
    desc: 'Pupuk organik kompos siap pakai untuk tanaman kebun',
  },
  {
    id: 105,
    name: 'Bibit Cabai Rawit Unggul',
    price: 15000,
    unit: '50 biji',
    stock: 0,
    active: false,
    iconName: 'Leaf',
    g: ['#DC2626', '#EF4444'],
    cat: 'Lainnya',
    desc: 'Bibit cabai rawit lokal unggul tahan hama dan penyakit',
  },
]

// Default stock catalog across entire app (community + seller + official stores)
export const DEFAULT_PRODUCT_STOCKS = {
  // Community products (PRODUCTS in Pasar.jsx)
  1: 24,
  2: 40,
  3: 15,
  4: 8,
  5: 6,
  6: 20,
  7: 30,
  8: 12,
  9: 35,
  10: 0, // Jeruk Siam Manis - initial out of stock demo
  // Seller products (Toko Saya)
  101: 48,
  102: 120,
  103: 30,
  104: 2,
  105: 0, // Bibit Cabai - initial out of stock demo
  // Official store products (ESTO_STORES in Pasar.jsx)
  201: 50,
  202: 60,
  203: 45,
  204: 30,
  205: 25,
  206: 80,
  207: 40,
  208: 35,
  209: 25,
  210: 15,
  211: 40,
  212: 50,
  213: 20,
  214: 18,
  215: 30,
  216: 25,
  217: 20,
  218: 30,
  219: 15,
  220: 40,
  221: 25,
  222: 15,
  223: 10,
  224: 12,
  225: 18,
  226: 30,
  227: 20,
  228: 15,
}

const STOCK_STORAGE_KEY = 'gv_product_stocks'
const SELLER_PRODUCTS_KEY = 'gv_seller_products'
export const STOCK_UPDATE_EVENT = 'gv_stock_updated'

// Helper to broadcast changes
function broadcastStockUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STOCK_UPDATE_EVENT))
    window.dispatchEvent(new Event('storage'))
  }
}

// ── Product Stocks Map Management ──
export function getProductStocks() {
  if (typeof window === 'undefined') return { ...DEFAULT_PRODUCT_STOCKS }
  try {
    const raw = localStorage.getItem(STOCK_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_PRODUCT_STOCKS, ...parsed }
    }
  } catch (e) {
    console.error('Failed to read product stocks:', e)
  }
  // Initialize if empty
  saveProductStocks(DEFAULT_PRODUCT_STOCKS)
  return { ...DEFAULT_PRODUCT_STOCKS }
}

export function saveProductStocks(stocks) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stocks))
  } catch (e) {
    console.error('Failed to save product stocks:', e)
  }
}

// ── Seller Products (Toko Saya) Management ──
function hydrateSellerProduct(p) {
  const iconKey = p.iconName || (p.cat === 'Sayur' ? 'Leaf' : p.cat === 'Telur' ? 'Egg' : 'Wheat')
  return {
    ...p,
    Icon: ICON_MAP[iconKey] || Leaf,
  }
}

export function getSellerProducts() {
  if (typeof window === 'undefined') return DEFAULT_SELLER_PRODUCTS.map(hydrateSellerProduct)
  try {
    const raw = localStorage.getItem(SELLER_PRODUCTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const stocks = getProductStocks()
      return parsed.map((p) => {
        const currentStock = stocks[p.id] !== undefined ? stocks[p.id] : p.stock
        return hydrateSellerProduct({
          ...p,
          stock: currentStock,
          active: currentStock > 0,
        })
      })
    }
  } catch (e) {
    console.error('Failed to read seller products:', e)
  }
  // Initialize if empty
  saveSellerProductsRaw(DEFAULT_SELLER_PRODUCTS)
  return DEFAULT_SELLER_PRODUCTS.map(hydrateSellerProduct)
}

function saveSellerProductsRaw(products) {
  if (typeof window === 'undefined') return
  try {
    const serializable = products.map((p) => {
      const copy = { ...p }
      delete copy.Icon
      if (!copy.iconName) {
        copy.iconName = p.cat === 'Sayur' ? 'Leaf' : p.cat === 'Telur' ? 'Egg' : 'Wheat'
      }
      return copy
    })
    localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify(serializable))
  } catch (e) {
    console.error('Failed to save seller products:', e)
  }
}

export function saveSellerProducts(products) {
  saveSellerProductsRaw(products)
  // Also sync stocks to product stocks map
  const stocks = getProductStocks()
  products.forEach((p) => {
    stocks[p.id] = Number(p.stock)
  })
  saveProductStocks(stocks)
  broadcastStockUpdate()
}

export function saveSellerProduct(product) {
  const current = getSellerProducts()
  const exists = current.some((p) => p.id === product.id)
  let next
  if (exists) {
    next = current.map((p) => (p.id === product.id ? { ...p, ...product } : p))
  } else {
    next = [product, ...current]
  }
  saveSellerProducts(next)
  return next
}

export function deleteSellerProduct(productId) {
  const current = getSellerProducts()
  const next = current.filter((p) => p.id !== productId)
  saveSellerProducts(next)
  return next
}

// ── Stock Mutation Operations ──

/**
 * Decrease stock when an order is created (Checkout)
 * @param {Array<{ id?: number|string, name: string, qty: number }>} items
 */
export function decreaseStock(items) {
  if (!items || !items.length) return
  const stocks = getProductStocks()
  const sellerProducts = getSellerProducts()
  let changed = false

  items.forEach((item) => {
    const qty = Number(item.qty || 1)
    let targetId = item.id !== undefined && item.id !== null ? Number(item.id) : null

    // Fallback: match by name if ID not in stock map
    if (!targetId || stocks[targetId] === undefined) {
      const matchSeller = sellerProducts.find(
        (p) => p.name.toLowerCase() === (item.name || '').toLowerCase()
      )
      if (matchSeller) {
        targetId = matchSeller.id
      } else {
        // Find in default product stocks
        const entry = Object.entries(DEFAULT_PRODUCT_STOCKS).find(([k]) => {
          return k == item.id
        })
        if (entry) targetId = Number(entry[0])
      }
    }

    if (targetId !== null) {
      const currentStock = stocks[targetId] !== undefined ? stocks[targetId] : (item.stock || 0)
      const newStock = Math.max(0, currentStock - qty)
      stocks[targetId] = newStock
      changed = true

      // Also update seller product entry if present
      const sIdx = sellerProducts.findIndex(
        (p) => p.id === targetId || p.name.toLowerCase() === (item.name || '').toLowerCase()
      )
      if (sIdx !== -1) {
        sellerProducts[sIdx].stock = newStock
        sellerProducts[sIdx].active = newStock > 0
      }
    }
  })

  if (changed) {
    saveProductStocks(stocks)
    saveSellerProductsRaw(sellerProducts)
    broadcastStockUpdate()
  }
}

/**
 * Restore stock when an order is cancelled (by buyer or seller)
 * @param {Array<{ id?: number|string, name: string, qty: number }>} items
 */
export function restoreStock(items) {
  if (!items || !items.length) return
  const stocks = getProductStocks()
  const sellerProducts = getSellerProducts()
  let changed = false

  items.forEach((item) => {
    const qty = Number(item.qty || 1)
    let targetId = item.id !== undefined && item.id !== null ? Number(item.id) : null

    // Fallback: match by name if ID not in stock map
    if (!targetId || stocks[targetId] === undefined) {
      const matchSeller = sellerProducts.find(
        (p) => p.name.toLowerCase() === (item.name || '').toLowerCase()
      )
      if (matchSeller) {
        targetId = matchSeller.id
      } else {
        const entry = Object.entries(DEFAULT_PRODUCT_STOCKS).find(([k]) => {
          return k == item.id
        })
        if (entry) targetId = Number(entry[0])
      }
    }

    if (targetId !== null) {
      const currentStock = stocks[targetId] !== undefined ? stocks[targetId] : (item.stock || 0)
      const newStock = currentStock + qty
      stocks[targetId] = newStock
      changed = true

      // Also update seller product entry if present
      const sIdx = sellerProducts.findIndex(
        (p) => p.id === targetId || p.name.toLowerCase() === (item.name || '').toLowerCase()
      )
      if (sIdx !== -1) {
        sellerProducts[sIdx].stock = newStock
        sellerProducts[sIdx].active = newStock > 0
      }
    }
  })

  if (changed) {
    saveProductStocks(stocks)
    saveSellerProductsRaw(sellerProducts)
    broadcastStockUpdate()
  }
}

/**
 * Reset all product stocks and seller products back to defaults
 */
export function resetStockStore() {
  saveProductStocks(DEFAULT_PRODUCT_STOCKS)
  saveSellerProductsRaw(DEFAULT_SELLER_PRODUCTS)
  broadcastStockUpdate()
}

// ── React Hook for Reactive Stock Synchronization ──
export function useStock() {
  const [stocks, setStocks] = useState(() => getProductStocks())
  const [sellerProducts, setSellerProducts] = useState(() => getSellerProducts())

  useEffect(() => {
    const handleUpdate = () => {
      setStocks(getProductStocks())
      setSellerProducts(getSellerProducts())
    }

    window.addEventListener(STOCK_UPDATE_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener(STOCK_UPDATE_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return {
    stocks,
    sellerProducts,
    decreaseStock,
    restoreStock,
    saveSellerProduct,
    deleteSellerProduct,
    saveSellerProducts,
    resetStockStore,
    getStock: (productId, fallback = 0) => {
      if (productId === undefined || productId === null) return fallback
      return stocks[productId] !== undefined ? stocks[productId] : fallback
    },
  }
}
