import bgMain from '@background/gv-main-bg.png'
import bgSunrise from '@background/background-sunrise-village.png'

export const BACKGROUND_IMAGES = {
  main: bgMain,
  sunrise: bgSunrise,
  // Fallback alias jika ada komponen yang memanggil variant legacy
  village: bgMain,
  sunset: bgMain,
}

export const BACKGROUND_METADATA = {
  main: {
    title: 'GV Smart Village',
    desc: 'Lanskap cerdas dan teknologi ramah lingkungan desa masa depan',
    contrastMode: 'dark-content-friendly',
    recommendedScreens: ['beranda'],
  },
  sunrise: {
    title: 'Fajar Menyingsing Desa',
    desc: 'Awal hari yang cerah, penuh harapan menyambut warga baru',
    contrastMode: 'high-clarity',
    recommendedScreens: ['welcome', 'register', 'otp', 'desa', 'preferensi', 'selesai'],
  },
}

export default BACKGROUND_IMAGES

