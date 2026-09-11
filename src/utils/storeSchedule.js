/**
 * Store Operational Schedule System (Hybrid: Automatic Schedule + Manual Override)
 * 
 * Default Schedule:
 * - Senin - Sabtu: 07:00 - 17:00 WIB
 * - Minggu: Libur
 * 
 * Modes:
 * - 'auto': Operasional mengikuti jadwal mingguan & jam buka-tutup
 * - 'force_closed': Override manual "Tutup Sementara Hari Ini"
 * - 'force_open': Override manual "Buka Sekarang" di luar jam operasional
 */

export const DEFAULT_STORE_SCHEDULE = {
  mode: 'auto', // 'auto' | 'force_closed' | 'force_open'
  openDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  openTime: '07:00',
  closeTime: '17:00',
  closedReason: 'Tutup Sementara Hari Ini',
  autoReplyClosed: true,
  autoReplyText: 'Halo! Toko kami saat ini sedang tutup. Pesanan dan pertanyaan Anda akan segera kami respon saat toko buka kembali. Terima kasih atas pengertiannya! 🙏'
}

export const DAY_OPTIONS = [
  { id: 'Senin', label: 'Sen', full: 'Senin' },
  { id: 'Selasa', label: 'Sel', full: 'Selasa' },
  { id: 'Rabu', label: 'Rab', full: 'Rabu' },
  { id: 'Kamis', label: 'Kam', full: 'Kamis' },
  { id: 'Jumat', label: 'Jum', full: 'Jumat' },
  { id: 'Sabtu', label: 'Sab', full: 'Sabtu' },
  { id: 'Minggu', label: 'Min', full: 'Minggu' },
]

/**
 * Retrieve saved schedule from localStorage or fallback to default
 */
export function getStoredSchedule() {
  const saved = localStorage.getItem('gv_store_schedule')
  if (saved) {
    try {
      return { ...DEFAULT_STORE_SCHEDULE, ...JSON.parse(saved) }
    } catch (e) {
      console.warn('Error reading gv_store_schedule:', e)
    }
  }
  return DEFAULT_STORE_SCHEDULE
}

/**
 * Calculate current real-time operational status based on hybrid rules
 */
export function calculateStoreStatus(schedule = DEFAULT_STORE_SCHEDULE, referenceDate = new Date()) {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const currentDay = dayNames[referenceDate.getDay()]
  
  const currentHours = String(referenceDate.getHours()).padStart(2, '0')
  const currentMinutes = String(referenceDate.getMinutes()).padStart(2, '0')
  const currentTimeStr = `${currentHours}:${currentMinutes}`

  const isOpenDay = (schedule.openDays || []).includes(currentDay)
  const isWithinHours = currentTimeStr >= (schedule.openTime || '07:00') && currentTimeStr <= (schedule.closeTime || '17:00')
  const isScheduledOpen = isOpenDay && isWithinHours

  // Manual Override: Force Closed
  if (schedule.mode === 'force_closed') {
    return {
      isOpen: false,
      mode: 'force_closed',
      badge: 'Tutup Sementara',
      badgeColor: 'red',
      reason: schedule.closedReason || 'Tutup sementara oleh penjual',
      subText: 'Override manual aktif · Toko tidak menerima pesanan baru',
      nextOpenInfo: `Buka kembali besok ${schedule.openTime || '07:00'}`
    }
  }

  // Manual Override: Force Open
  if (schedule.mode === 'force_open') {
    return {
      isOpen: true,
      mode: 'force_open',
      badge: 'Buka (Manual)',
      badgeColor: 'emerald',
      reason: 'Buka manual di luar jam jadwal',
      subText: 'Menerima pesanan warga · Override manual aktif',
      nextOpenInfo: `Jadwal normal: ${schedule.openTime} - ${schedule.closeTime}`
    }
  }

  // Automatic Schedule
  if (isScheduledOpen) {
    return {
      isOpen: true,
      mode: 'auto',
      badge: 'Buka Sesuai Jadwal',
      badgeColor: 'emerald',
      reason: `Operasional hari ${currentDay}`,
      subText: `Tutup pukul ${schedule.closeTime || '17:00'} WIB`,
      nextOpenInfo: `Tutup pukul ${schedule.closeTime || '17:00'}`
    }
  } else {
    let nextInfo = ''
    if (!isOpenDay) {
      nextInfo = `Hari ini libur · Buka ${schedule.openDays?.[0] || 'Senin'} ${schedule.openTime || '07:00'}`
    } else if (currentTimeStr < (schedule.openTime || '07:00')) {
      nextInfo = `Buka hari ini pukul ${schedule.openTime || '07:00'}`
    } else {
      nextInfo = `Buka besok pukul ${schedule.openTime || '07:00'}`
    }

    return {
      isOpen: false,
      mode: 'auto',
      badge: 'Tutup Sesuai Jadwal',
      badgeColor: 'red',
      reason: !isOpenDay ? 'Hari Libur Toko' : 'Di Luar Jam Operasional',
      subText: nextInfo,
      nextOpenInfo: nextInfo
    }
  }
}

/**
 * Save schedule & sync boolean flag to localStorage
 */
export function saveStoredSchedule(schedule) {
  localStorage.setItem('gv_store_schedule', JSON.stringify(schedule))
  const status = calculateStoreStatus(schedule)
  localStorage.setItem('gv_store_open', String(status.isOpen))
  localStorage.setItem('gv_store_schedule_text', `${(schedule.openDays || []).join(', ')} · ${schedule.openTime} - ${schedule.closeTime} WIB`)
  localStorage.setItem('gv_store_next_open', status.nextOpenInfo || '')
  return status
}
