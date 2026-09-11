import { useState, useEffect } from 'react'

export const STORAGE_KEY_ADS_NOTIFS = 'gv_ads_notifications'

// Default sample notifications for initial view
export const DEFAULT_ADS_NOTIFS = [
  {
    id: 'an-1',
    title: 'Iklan "Sepeda Lipat..." Telah Tayang!',
    sub: 'Iklan Anda aktif ditayangkan di pemirsa lokal Desa Sukamaju.',
    time: '2 jam lalu',
    unread: false,
    type: 'tayang',
    category: 'transaksi',
  },
]

export function getAdsNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADS_NOTIFS)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error('Failed to parse ads notifications', e)
  }
  return DEFAULT_ADS_NOTIFS
}

export function saveAdsNotifications(notifs) {
  try {
    localStorage.setItem(STORAGE_KEY_ADS_NOTIFS, JSON.stringify(notifs))
    window.dispatchEvent(new Event('gv_notifications_updated'))
  } catch (e) {
    console.error('Failed to save ads notifications', e)
  }
}

export function addAdsNotification({ title, sub, category = 'transaksi', type = 'info', adId = null }) {
  const current = getAdsNotifications()
  const newNotif = {
    id: `an-${Date.now()}`,
    title,
    sub,
    time: 'Baru saja',
    unread: true,
    category,
    type,
    adId,
    createdAt: new Date().toISOString(),
  }
  const updated = [newNotif, ...current]
  saveAdsNotifications(updated)
  return newNotif
}

export function markAllAdsNotifsRead() {
  const current = getAdsNotifications()
  const updated = current.map((n) => ({ ...n, unread: false }))
  saveAdsNotifications(updated)
}

export function getUnreadAdsNotifCount() {
  const list = getAdsNotifications()
  return list.filter((n) => n.unread).length
}

export function useAdsNotifications() {
  const [notifications, setNotifications] = useState(() => getAdsNotifications())

  useEffect(() => {
    const handleSync = () => setNotifications(getAdsNotifications())
    window.addEventListener('storage', handleSync)
    window.addEventListener('gv_notifications_updated', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('gv_notifications_updated', handleSync)
    }
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter((n) => n.unread).length,
    addNotification: addAdsNotification,
    markAllRead: markAllAdsNotifsRead,
  }
}
