import { useState, useEffect } from 'react'

export const STORAGE_KEY_WISHLIST = 'gv_wishlist_products'
export const STORAGE_KEY_SAVED_VIDEOS = 'gv_saved_videos'

// Initial default data for prototype
export const DEFAULT_WISHLIST_PRODUCT_IDS = [1, 3]

export const DEFAULT_SAVED_VIDEOS = [
  {
    id: 'uk1',
    title: 'Foto Produk Pakai HP, Hasil Pro',
    channel: 'Kreator · Tips',
    dur: '11:20',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'tr1',
    title: 'Bugar Ala Gatot',
    channel: 'Bersama Aliong · Eps. 1',
    dur: '14:50',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
  },
]

// ── Wishlist Products Helpers ─────────────────────────────────────
export function getWishlistProductIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WISHLIST)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error('Failed to parse wishlist products', e)
  }
  return DEFAULT_WISHLIST_PRODUCT_IDS
}

export function saveWishlistProductIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(ids))
    window.dispatchEvent(new Event('gv_wishlist_updated'))
  } catch (e) {
    console.error('Failed to save wishlist products', e)
  }
}

export function isProductWishlisted(id) {
  const ids = getWishlistProductIds()
  return ids.includes(Number(id)) || ids.includes(id)
}

export function toggleWishlistProduct(id) {
  const numId = Number(id)
  const current = getWishlistProductIds()
  const exists = current.includes(numId) || current.includes(id)
  let updated
  if (exists) {
    updated = current.filter((x) => x !== numId && x !== id)
  } else {
    updated = [...current, numId]
  }
  saveWishlistProductIds(updated)
  return !exists
}

// ── Saved Videos Helpers ──────────────────────────────────────────
export function getSavedVideos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_VIDEOS)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error('Failed to parse saved videos', e)
  }
  return DEFAULT_SAVED_VIDEOS
}

export function saveVideosToStorage(videos) {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_VIDEOS, JSON.stringify(videos))
    window.dispatchEvent(new Event('gv_saved_videos_updated'))
  } catch (e) {
    console.error('Failed to save videos to storage', e)
  }
}

export function isVideoSaved(id) {
  if (!id) return false
  const list = getSavedVideos()
  return list.some((v) => String(v.id) === String(id))
}

export function toggleSavedVideo(video) {
  if (!video || !video.id) return false
  const list = getSavedVideos()
  const exists = list.some((v) => String(v.id) === String(video.id))
  let updated
  if (exists) {
    updated = list.filter((v) => String(v.id) !== String(video.id))
  } else {
    const newItem = {
      id: video.id,
      title: video.title || 'Video GV Media',
      channel: video.ep || video.channel || video.creator?.name || 'GV Media',
      dur: video.dur || '10:00',
      image: video.image || video.poster || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
    }
    updated = [newItem, ...list]
  }
  saveVideosToStorage(updated)
  return !exists
}

// ── React Hooks for Real-Time Synchronization ─────────────────────
export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState(() => getWishlistProductIds())

  useEffect(() => {
    const handleSync = () => setWishlistIds(getWishlistProductIds())
    window.addEventListener('storage', handleSync)
    window.addEventListener('gv_wishlist_updated', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('gv_wishlist_updated', handleSync)
    }
  }, [])

  return {
    wishlistIds,
    count: wishlistIds.length,
    isWishlisted: (id) => wishlistIds.includes(Number(id)) || wishlistIds.includes(id),
    toggle: (id) => toggleWishlistProduct(id),
    remove: (id) => {
      const numId = Number(id)
      const updated = wishlistIds.filter((x) => x !== numId && x !== id)
      saveWishlistProductIds(updated)
    },
  }
}

export function useSavedVideos() {
  const [savedVideos, setSavedVideos] = useState(() => getSavedVideos())

  useEffect(() => {
    const handleSync = () => setSavedVideos(getSavedVideos())
    window.addEventListener('storage', handleSync)
    window.addEventListener('gv_saved_videos_updated', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('gv_saved_videos_updated', handleSync)
    }
  }, [])

  return {
    savedVideos,
    count: savedVideos.length,
    isSaved: (id) => savedVideos.some((v) => String(v.id) === String(id)),
    toggle: (video) => toggleSavedVideo(video),
    remove: (id) => {
      const updated = savedVideos.filter((v) => String(v.id) !== String(id))
      saveVideosToStorage(updated)
    },
  }
}
