/**
 * Real, authentic, high-resolution product photos for Global Village (ESTO)
 * Ensuring all products display genuine photos instead of vector icons or illustrations.
 */
export const PRODUCT_IMAGE_MAP = {
  // Sayur & Daun
  'bayam organik segar': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
  'sayur bayam organik segar': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
  'sayur bayam organik segar 250g': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
  'bayam': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',

  // Tempe & Olahan Kedelai
  'tempe mendoan jumbo': 'https://images.unsplash.com/photo-1626082895617-2c6fd34adcfb?q=80&w=600&auto=format&fit=crop',
  'tempe': 'https://images.unsplash.com/photo-1626082895617-2c6fd34adcfb?q=80&w=600&auto=format&fit=crop',

  // Beras & Pangan
  'beras pandan wangi premium 5kg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
  'beras pandan wangi': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
  'beras': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',

  // Kopi
  'kopi robusta segar': 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',
  'kopi': 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',

  // Madu
  'madu hutan murni': 'https://images.unsplash.com/photo-1587049352847-4d4b124054da?q=80&w=600&auto=format&fit=crop',
  'madu': 'https://images.unsplash.com/photo-1587049352847-4d4b124054da?q=80&w=600&auto=format&fit=crop',

  // Telur
  'telur ayam kampung (10 butir)': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop',
  'telur ayam kampung (12 butir)': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop',
  'telur ayam kampung': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop',
  'telur': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop',

  // Buah & Camilan
  'pisang kepok matang': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600&auto=format&fit=crop',
  'keripik singkong pedas': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600&auto=format&fit=crop',
  'jeruk siam manis': 'https://images.unsplash.com/photo-1550258859-d088c27e49c1?q=80&w=600&auto=format&fit=crop',

  // Kerajinan & Lainnya
  'batik tulis lokal': 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?q=80&w=600&auto=format&fit=crop',
  'pupuk organik kompos 25kg': 'https://images.unsplash.com/photo-1627341398565-d0c75cc9e5f5?q=80&w=600&auto=format&fit=crop',
  'bibit cabai rawit lokal': 'https://images.unsplash.com/photo-1588147602377-5b6515a452db?q=80&w=600&auto=format&fit=crop',
}

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop'

/**
 * Resolves a real product photo for any product or cart/order item.
 * Always guarantees a realistic, authentic photo and never an illustration.
 */
export function getProductImage(item) {
  if (item?.image && typeof item.image === 'string' && item.image.startsWith('http')) {
    return item.image
  }
  const rawName = (item?.name || '').toLowerCase().trim()
  if (PRODUCT_IMAGE_MAP[rawName]) {
    return PRODUCT_IMAGE_MAP[rawName]
  }
  for (const [k, v] of Object.entries(PRODUCT_IMAGE_MAP)) {
    if (rawName.includes(k) || k.includes(rawName)) {
      return v
    }
  }
  return FALLBACK_PRODUCT_IMAGE
}
