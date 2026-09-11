import React, { useState, useEffect, useRef } from 'react'
import {
  Store,
  ShieldAlert,
  ShieldCheck,
  Check,
  ShoppingBag,
  Wallet,
  BarChart3,
  Clock,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Package,
  CreditCard,
  AlertCircle,
  Sparkles,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  LocateFixed,
  Loader2,
  Plus,
  Trash2,
  X,
  UploadCloud,
} from 'lucide-react'
import GlassCard from '@/components/atoms/GlassCard'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import LocationPickerMap from '@/components/maps/LocationPickerMap'

const KATEGORI_TOKO = [
  'Pertanian & Bibit',
  'Sayur & Buah Segar',
  'Pangan & Sembako',
  'Olahan Makanan & Minuman',
  'Kerajinan & Kriya',
  'Peternakan & Perikanan',
  'Lainnya',
]

const SATUAN_PRODUK = ['kg', 'gram', 'ikat', 'bungkus', 'botol', 'butir', 'buah', 'pack', 'unit']

const BANK_OPTIONS = [
  { id: 'gv_pay', label: 'GV Pay (Instan & Bebas Biaya)', icon: '⚡' },
  { id: 'bri', label: 'Bank BRI', icon: '🏦' },
  { id: 'mandiri', label: 'Bank Mandiri', icon: '🏦' },
  { id: 'bca', label: 'Bank BCA', icon: '🏦' },
  { id: 'bni', label: 'Bank BNI', icon: '🏦' },
  { id: 'bsi', label: 'Bank Syariah Indonesia (BSI)', icon: '🏦' },
]

export default function AktivasiToko({ navigate, userData, updateUser, userProfile }) {
  // Verifikasi Prasyarat
  const isVerified =
    userData?.verificationStatus === 'verified' ||
    userProfile?.verified === true ||
    userProfile?.verificationStatus === 'verified' ||
    userProfile?.capabilities?.includes('Penjual') ||
    localStorage.getItem('mockVerificationStatus') === 'verified'
  
  // Status Toko Aktif
  const isSeller =
    userProfile?.capabilities?.includes('Penjual') ||
    userProfile?.isSeller === true ||
    userData?.isSeller === true ||
    localStorage.getItem('mockSellerAppStatus') === 'active'

  // Jika sudah aktif sebagai penjual, langsung arahkan ke Dashboard Toko
  useEffect(() => {
    if (isSeller) {
      navigate('toko')
    }
  }, [isSeller, navigate])

  // Load Saved Draft & Application Status
  const savedStatus = localStorage.getItem('mockSellerAppStatus') || 'not_applied'
  const [appStatus, setAppStatus] = useState(savedStatus)

  // Initial Step
  const [step, setStep] = useState(() => {
    if (savedStatus === 'pending') return 'pending'
    const savedDraft = localStorage.getItem('mockSellerDraft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed.currentStep) return parsed.currentStep
      } catch (e) {
        console.error(e)
      }
    }
    return 'intro'
  })

  // File Input Refs
  const storeFileInputRef = useRef(null)
  const productFileInputRef = useRef(null)

  // Map Picker & GPS States
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [isLocatingGps, setIsLocatingGps] = useState(false)

  // Local state untuk form produk aktif yang sedang diisi di Step 2
  const [currentProduct, setCurrentProduct] = useState({
    namaProduk: '',
    kategoriProduk: 'Sayur & Buah Segar',
    hargaProduk: '',
    satuanProduk: 'kg',
    stokProduk: '',
    fotoProduk: [], // array data URLs (maks 5)
  })

  function getDefaultForm() {
    return {
      fotoToko: '',
      namaToko: '',
      kategoriToko: 'Sayur & Buah Segar',
      deskripsiToko: '',
      alamatToko: '',
      coords: null,
      // Array produk yang sudah didaftarkan
      products: [],
      // Rekening (kosong secara default agar step 3 belum tercentang pada awal aktivasi)
      metodePencairan: 'gv_pay',
      nomorRekening: '',
      namaPemilik: '',
    }
  }

  // Form State dengan normalisasi kompatibilitas draft lama
  const [form, setForm] = useState(() => {
    const savedDraft = localStorage.getItem('mockSellerDraft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        const parsedForm = parsed.form || getDefaultForm()
        if (!Array.isArray(parsedForm.products)) {
          parsedForm.products = []
          if (parsedForm.namaProduk && parsedForm.namaProduk.trim() !== '') {
            parsedForm.products.push({
              id: 'prod_' + Date.now(),
              namaProduk: parsedForm.namaProduk,
              kategoriProduk: parsedForm.kategoriProduk || 'Sayur & Buah Segar',
              hargaProduk: parsedForm.hargaProduk || '',
              satuanProduk: parsedForm.satuanProduk || 'kg',
              stokProduk: parsedForm.stokProduk || '',
              fotoProduk: parsedForm.fotoProduk ? [parsedForm.fotoProduk] : [],
            })
          }
        }
        if (parsedForm.fotoToko === undefined) parsedForm.fotoToko = ''
        if (parsedForm.coords === undefined) parsedForm.coords = null
        return parsedForm
      } catch (e) {
        console.error(e)
      }
    }
    return getDefaultForm()
  })

  // Reset / Sinkronisasi State ketika Persona Berganti
  useEffect(() => {
    const currentSavedStatus = localStorage.getItem('mockSellerAppStatus') || 'not_applied'
    setAppStatus(currentSavedStatus)

    if (currentSavedStatus === 'pending') {
      setStep('pending')
      return
    }

    const savedDraft = localStorage.getItem('mockSellerDraft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed.form) {
          setForm(parsed.form)
          if (parsed.currentStep) setStep(parsed.currentStep)
          return
        }
      } catch (e) {}
    }

    // Jika tidak ada draft tersimpan (e.g. Warga Aktif fresh):
    setForm(getDefaultForm())
    setCurrentProduct({
      namaProduk: '',
      kategoriProduk: 'Sayur & Buah Segar',
      hargaProduk: '',
      satuanProduk: 'kg',
      stokProduk: '',
      fotoProduk: [],
    })
    setStep('intro')
  }, [userProfile?.id, userData?.name])

  // Simpan Draft ke LocalStorage setiap form berubah
  useEffect(() => {
    if (step !== 'intro' && step !== 'pending') {
      try {
        localStorage.setItem(
          'mockSellerDraft',
          JSON.stringify({ form, currentStep: step, lastUpdated: new Date().toISOString() })
        )
      } catch (e) {
        console.error(e)
      }
    }
  }, [form, step])

  // Handlers Foto Toko (Step 1)
  const handleStorePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, fotoToko: ev.target.result }))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemoveStorePhoto = () => {
    setForm((f) => ({ ...f, fotoToko: '' }))
  }

  // Handler GPS "Gunakan Lokasi Saya" (Step 1)
  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung akses GPS.')
      return
    }
    setIsLocatingGps(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'id' } }
          )
          if (res.ok) {
            const data = await res.json()
            if (data && data.display_name) {
              const addr = data.address || {}
              const road = addr.road || addr.village || addr.suburb || ''
              const village = addr.village || addr.city_district || 'Desa Bojong'
              const district = addr.county || addr.city || 'Bogor'
              let formatted = road ? `${road}, ${village}` : village
              if (district && !formatted.includes(district)) {
                formatted += `, ${district}`
              }
              setForm((f) => ({
                ...f,
                alamatToko: formatted || data.display_name.split(',').slice(0, 3).join(','),
                coords: { lat, lng },
              }))
              setIsLocatingGps(false)
              return
            }
          }
        } catch (err) {
          console.error(err)
        }
        // Fallback jika API reverse geocode offline/lambat
        setForm((f) => ({
          ...f,
          alamatToko: `RT 02/RW 04, Dusun Karanganyar, ${userData?.desa || 'Desa Bojong'}`,
          coords: { lat, lng },
        }))
        setIsLocatingGps(false)
      },
      (err) => {
        console.warn('Geolocation error:', err)
        setForm((f) => ({
          ...f,
          alamatToko: `RT 02/RW 04, Dusun Karanganyar, ${userData?.desa || 'Desa Bojong'}`,
          coords: { lat: -6.6042, lng: 107.0395 },
        }))
        setIsLocatingGps(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  // Handlers Foto Produk (Step 2 - Maksimal 5 foto, slot 0 = thumbnail)
  const handleProductPhotoChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentCount = currentProduct.fotoProduk.length
    const availableSlots = 5 - currentCount
    if (availableSlots <= 0) {
      alert('Maksimal 5 foto per produk.')
      return
    }

    const filesToProcess = files.slice(0, availableSlots)
    const readers = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((newPhotos) => {
      setCurrentProduct((cp) => ({
        ...cp,
        fotoProduk: [...cp.fotoProduk, ...newPhotos].slice(0, 5),
      }))
    })
    e.target.value = ''
  }

  const handleRemoveProductPhoto = (index) => {
    setCurrentProduct((cp) => ({
      ...cp,
      fotoProduk: cp.fotoProduk.filter((_, i) => i !== index),
    }))
  }

  // Handlers Multi-Produk
  const isCurrentProductValid =
    currentProduct.namaProduk.trim() !== '' &&
    currentProduct.hargaProduk !== '' &&
    Number(currentProduct.hargaProduk) > 0 &&
    currentProduct.stokProduk !== '' &&
    Number(currentProduct.stokProduk) >= 0 &&
    currentProduct.fotoProduk.length > 0

  const handleAddAnotherProduct = () => {
    if (!isCurrentProductValid) return
    const newProd = {
      id: 'prod_' + Date.now(),
      ...currentProduct,
    }
    setForm((f) => ({
      ...f,
      products: [...(f.products || []), newProd],
    }))
    // Reset form produk berikutnya
    setCurrentProduct({
      namaProduk: '',
      kategoriProduk: 'Sayur & Buah Segar',
      hargaProduk: '',
      satuanProduk: 'kg',
      stokProduk: '',
      fotoProduk: [],
    })
  }

  const handleDeleteProduct = (productId) => {
    setForm((f) => ({
      ...f,
      products: (f.products || []).filter((p) => p.id !== productId),
    }))
  }

  const handleProceedFromStep2 = () => {
    if (isCurrentProductValid) {
      const newProd = {
        id: 'prod_' + Date.now(),
        ...currentProduct,
      }
      setForm((f) => ({
        ...f,
        products: [...(f.products || []), newProd],
      }))
      setCurrentProduct({
        namaProduk: '',
        kategoriProduk: 'Sayur & Buah Segar',
        hargaProduk: '',
        satuanProduk: 'kg',
        stokProduk: '',
        fotoProduk: [],
      })
      setStep('setup-rekening')
    } else if ((form.products || []).length >= 1) {
      setStep('setup-rekening')
    }
  }

  // Evaluasi Kelengkapan Tiap Tahap
  const isStep1Complete = form.namaToko.trim() !== '' && form.alamatToko.trim() !== ''
  const isStep2Complete = (form.products && form.products.length > 0) || isCurrentProductValid
  const isStep3Complete = form.nomorRekening.trim() !== '' && form.namaPemilik.trim() !== ''

  const completedStepsCount =
    (isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0) + (isStep3Complete ? 1 : 0)

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: SUDAH AKTIF SEBAGAI PENJUAL ──────────────────────
  // ═════════════════════════════════════════════════════════════
  if (isSeller) {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Toko Saya" onBack={() => navigate('profile')} />

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4 pb-6">
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shadow-xs mb-4">
              <Store size={44} className="text-[#1B6B3A]" />
            </div>

            <h2 className="font-extrabold text-[20px] text-surface-900 tracking-tight">
              Toko ESTO Anda Aktif!
            </h2>
            <p className="text-[12.5px] text-surface-500 px-6 mt-1.5 leading-relaxed max-w-xs">
              Toko Anda sudah terdaftar resmi dan siap menerima pesanan dari warga desa di Pasar ESTO.
            </p>

            <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs mt-6 text-left">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-[13px] pb-2 border-b border-surface-100">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Status: Toko Beroperasi</span>
              </div>
              <p className="text-[11.5px] text-surface-500 mt-2.5 leading-relaxed">
                Kelola katalog produk, periksa pesanan masuk, dan pantau omzet harian Anda melalui Dashboard Penjual.
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-2.5 pt-4">
            <button
              type="button"
              onClick={() => navigate('toko')}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                boxShadow: '0 4px 14px rgba(27,107,58,0.35)',
              }}
            >
              <span>Buka Dashboard Toko Penjual</span>
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={() => navigate('profile')}
              className="w-full py-3 rounded-xl bg-surface-50 text-surface-600 font-semibold text-[13px] border border-surface-200 transition active:scale-[0.98] text-center"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── GATE SCREEN: BELUM TERVERIFIKASI ─────────────────────────
  // ═════════════════════════════════════════════════════════════
  if (!isVerified) {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Toko Saya" onBack={() => navigate('profile')} />

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4 pb-6">
          <div className="flex flex-col items-center text-center mt-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs mb-4">
              <ShieldAlert size={44} className="text-amber-600" />
            </div>

            <h2 className="font-extrabold text-[19px] text-surface-900 tracking-tight leading-snug">
              Verifikasi Identitas Diperlukan
            </h2>
            <p className="text-[12.5px] text-surface-500 px-6 mt-1.5 leading-relaxed max-w-xs">
              Untuk menjamin keamanan transaksi di Pasar ESTO, semua penjual wajib menyelesaikan verifikasi identitas resmi (e-KTP & Liveness).
            </p>

            {/* Stepper Preview Prasyarat */}
            <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs mt-6 text-left">
              <span className="text-[10px] font-bold text-surface-400 tracking-wider block mb-3 uppercase">
                ALUR AKTIVASI PENJUAL
              </span>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-surface-900">
                      Verifikasi Data Diri (KYC)
                    </p>
                    <p className="text-[11px] text-amber-700 font-medium">
                      Status: Belum Terverifikasi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-surface-100 text-surface-500 flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-surface-700">
                      Setup Toko, Produk & Rekening
                    </p>
                    <p className="text-[11px] text-surface-400">
                      Terbuka setelah identitas diverifikasi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-surface-100 text-surface-500 flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-surface-700">
                      Toko Aktif & Mulai Jualan di ESTO
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm mx-auto space-y-2.5 pt-4">
            <button
              type="button"
              onClick={() => navigate('verifikasi')}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                boxShadow: '0 4px 14px rgba(27,107,58,0.35)',
              }}
            >
              <span>Verifikasi Data Diri Sekarang</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate('profile')}
              className="w-full py-3 rounded-xl bg-surface-50 text-surface-600 font-semibold text-[13px] border border-surface-200 transition active:scale-[0.98] text-center hover:bg-surface-100"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: PENDING / SEDANG DITINJAU ────────────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'pending') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Status Pengajuan Toko" onBack={() => navigate('profile')} />

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4 pb-6">
          <div className="flex flex-col items-center text-center mt-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs mb-3">
              <Clock size={42} className="text-amber-600" />
            </div>

            <h2 className="font-extrabold text-[20px] text-surface-900 tracking-tight">
              Pengajuan Toko Sedang Ditinjau
            </h2>
            <p className="text-[12.5px] text-surface-500 px-6 mt-1.5 leading-relaxed max-w-xs">
              Tim verifikator Pasar ESTO sedang memeriksa kelengkapan profil dan produk perdana toko Anda.
            </p>

            <div className="w-full max-w-sm bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl p-4 border border-amber-200/80 shadow-2xs mt-5 text-left">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-amber-200/60">
                <Clock size={16} className="text-amber-800" />
                <span className="font-extrabold text-[13px] text-amber-900">
                  Estimasi 1–2 Hari Kerja
                </span>
              </div>
              <p className="text-[11.5px] text-amber-800/90 leading-relaxed">
                Notifikasi otomatis akan dikirim ke smartphone Anda begitu toko disetujui. Produk perdana Anda akan langsung tayang di katalog Pasar ESTO.
              </p>
            </div>

            {/* Ringkasan Data yang Dikirim */}
            <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs mt-4 text-left">
              <span className="text-[10px] font-bold text-surface-400 tracking-wider block mb-2.5 uppercase">
                RINGKASAN PENGAJUAN
              </span>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-surface-500">Nama Toko:</span>
                  <span className="font-bold text-surface-900">{form.namaToko || 'Toko Berkah Tani'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Kategori:</span>
                  <span className="font-medium text-surface-800">{form.kategoriToko}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Produk Terdaftar:</span>
                  <span className="font-medium text-surface-800">
                    {form.products && form.products.length > 0
                      ? `${form.products[0].namaProduk}${form.products.length > 1 ? ` (+${form.products.length - 1} lainnya)` : ''}`
                      : '1 Produk Siap Jual'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Pencairan:</span>
                  <span className="font-medium text-surface-800">{form.metodePencairan.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Termasuk Tombol Simulasi Langsung Buka Dashboard */}
          <div className="w-full max-w-sm mx-auto space-y-2.5 pt-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('mockSellerAppStatus', 'active')
                localStorage.setItem('gv_store_open', 'true')
                if (form.namaToko) {
                  localStorage.setItem(
                    'mockSellerStoreInfo',
                    JSON.stringify({
                      name: form.namaToko,
                      category: form.kategoriToko || 'Sayur & Buah Segar',
                      address: form.alamatToko || '',
                      coords: form.coords || null,
                      fotoToko: form.fotoToko || '',
                      products: form.products || [],
                      phone: userData?.phone || '0812-3456-7890',
                      bankName: form.metodePencairan === 'gv_pay' ? 'GV Pay (Dompet Digital Desa)' : 'Transfer Bank',
                      accountNumber: form.nomorRekening || userData?.phone || '0812-3456-7890',
                      accountHolder: form.namaPemilik || userData?.name || userProfile?.name || 'Pak Budi Santoso',
                    })
                  )
                }
                updateUser?.({ isSeller: true })
                navigate('toko')
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
              }}
            >
              <span>Simulasikan Toko Aktif (Demo)</span>
              <ExternalLink size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate('profile')}
              className="w-full py-3 rounded-xl bg-surface-50 text-surface-600 font-semibold text-[13px] border border-surface-200 transition active:scale-[0.98] text-center hover:bg-surface-100"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SUB-KOMPONEN: STEPPER INDICATOR ─────────────────────────
  // ═════════════════════════════════════════════════════════════
  const StepperHeader = ({ currentStepIndex }) => {
    const STEPS = [
      { id: 'info', label: 'Toko' },
      { id: 'produk', label: 'Produk' },
      { id: 'rekening', label: 'Rekening' },
      { id: 'review', label: 'Review' },
    ]

    return (
      <div className="bg-white border-b border-surface-200/80 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {STEPS.map((s, i) => {
            const isDone = i < currentStepIndex
            const isCurrent = i === currentStepIndex
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#0C3E1E] text-white shadow-xs'
                        : 'bg-surface-100 text-surface-400'
                    }`}
                  >
                    {isDone ? <Check size={13} strokeWidth={3} /> : i + 1}
                  </div>
                  <span
                    className={`text-[11.5px] font-bold hidden sm:inline ${
                      isCurrent ? 'text-surface-900' : isDone ? 'text-emerald-800' : 'text-surface-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 rounded-full ${
                      i < currentStepIndex ? 'bg-emerald-500' : 'bg-surface-200'
                    }`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: TAHAP 1 — INFO TOKO & ALAMAT ────────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-info') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        {/* Overlay LocationPickerMap jika user memilih 'Pilih di Peta' */}
        {showMapPicker && (
          <LocationPickerMap
            initialLocation={form.alamatToko}
            initialCoords={form.coords || null}
            onBack={() => setShowMapPicker(false)}
            onConfirm={({ locationLabel, lat, lng }) => {
              setForm((f) => ({
                ...f,
                alamatToko: locationLabel,
                coords: { lat, lng },
              }))
              setShowMapPicker(false)
            }}
          />
        )}

        <ScreenHeader title="Setup Toko ESTO" onBack={() => setStep('intro')} />
        <StepperHeader currentStepIndex={0} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Informasi & Alamat Toko
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Tentukan identitas tokomu agar warga desa dapat mengenali usaha dan lokasimu.
              </p>
            </div>

            {/* 1. UPLOAD FOTO TOKO (Di atas Nama Toko, Hanya 1 foto, ada Preview) */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Foto Profil Toko <span className="text-surface-400 font-normal">(1 foto)</span>
              </label>
              <input
                type="file"
                ref={storeFileInputRef}
                accept="image/*"
                onChange={handleStorePhotoChange}
                className="hidden"
              />
              {form.fotoToko ? (
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-surface-200 shadow-2xs group bg-surface-100">
                  <img
                    src={form.fotoToko}
                    alt="Foto Profil Toko"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 flex items-end justify-between p-3">
                    <div className="flex items-center gap-1.5 text-white text-[11.5px] font-bold">
                      <Camera size={14} className="text-emerald-400" />
                      <span>Foto Profil Terpasang</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => storeFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-surface-800 text-[11px] font-bold shadow-xs active:scale-95 transition"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveStorePhoto}
                        className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-xs active:scale-95 transition"
                        title="Hapus foto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => storeFileInputRef.current?.click()}
                  className="w-full py-5 px-4 rounded-2xl border-2 border-dashed border-surface-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer transition shadow-2xs group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-1.5 transition">
                    <Camera size={20} />
                  </div>
                  <p className="text-[12.5px] font-bold text-surface-800">
                    Unggah Foto Profil Toko
                  </p>
                  <p className="text-[10.5px] text-surface-400 mt-0.5">
                    Format JPG, PNG, atau WebP (1 foto profil)
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/80 pointer-events-none"
                  >
                    Pilih Foto Toko
                  </button>
                </div>
              )}
            </div>

            {/* Input Nama Toko */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Nama Toko <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="cth. Toko Tani Subur Makmur"
                value={form.namaToko}
                onChange={(e) => setForm((f) => ({ ...f, namaToko: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-[13px] text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
              />
              <p className="text-[11px] text-surface-400 mt-1">
                Nama resmi tokomu di Pasar ESTO
              </p>
            </div>

            {/* Pilihan Kategori */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Kategori Utama <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {KATEGORI_TOKO.map((item) => {
                  const active = form.kategoriToko === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, kategoriToko: item }))}
                      className={`py-2.5 px-3 text-left text-[11.5px] rounded-xl font-bold transition flex items-center justify-between border ${
                        active
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs'
                          : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {active && <Check size={13} className="text-emerald-600 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input Deskripsi Toko */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Deskripsi Singkat Toko <span className="text-surface-400 font-normal">(opsional)</span>
              </label>
              <textarea
                rows={2}
                maxLength={140}
                placeholder="Ceritakan keunggulan hasil tani atau produk tokomu..."
                value={form.deskripsiToko}
                onChange={(e) => setForm((f) => ({ ...f, deskripsiToko: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-2.5 text-[13px] text-surface-900 focus:outline-none focus:border-emerald-600 resize-none shadow-2xs transition"
              />
              <p className="text-[10.5px] text-right text-surface-400">
                {form.deskripsiToko.length}/140
              </p>
            </div>

            {/* 2. ALAMAT TOKO & TITIK PENJEMPUTAN (Integrasi GPS & Peta) */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Alamat Toko & Titik Penjemputan <span className="text-red-500">*</span>
              </label>

              {/* 2 Opsi Tombol Cepat: GPS & Peta */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={handleUseCurrentGps}
                  disabled={isLocatingGps}
                  className="py-2.5 px-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-800 text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-[0.98] disabled:opacity-60"
                >
                  {isLocatingGps ? (
                    <Loader2 size={15} className="animate-spin text-emerald-700" />
                  ) : (
                    <LocateFixed size={15} className="text-emerald-700" strokeWidth={2.2} />
                  )}
                  <span>{isLocatingGps ? 'Mencari GPS...' : 'Gunakan Lokasi Saya'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="py-2.5 px-3 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 text-surface-700 text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-[0.98]"
                >
                  <MapPin size={15} className="text-[#1B6B3A]" />
                  <span>Pilih di Peta</span>
                </button>
              </div>

              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-surface-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="cth. RT 03/RW 01, Dusun Karanganyar, Desa Nagrak"
                  value={form.alamatToko}
                  onChange={(e) => setForm((f) => ({ ...f, alamatToko: e.target.value }))}
                  className="w-full bg-white border border-surface-200 rounded-xl pl-9 pr-4 py-3 text-[13px] text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
                />
              </div>

              {/* Status Koordinat GPS */}
              {form.coords && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 w-fit">
                  <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                  <span>Titik GPS: {form.coords.lat.toFixed(4)}, {form.coords.lng.toFixed(4)}</span>
                </div>
              )}
              <p className="text-[11px] text-surface-400 mt-1">
                Lokasi untuk kurir desa atau pembeli yang memilih ambil sendiri (pickup)
              </p>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-4 pb-2">
            <button
              type="button"
              disabled={!isStep1Complete}
              onClick={() => setStep('setup-produk')}
              className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] transition flex items-center justify-center gap-2 ${
                isStep1Complete
                  ? 'text-white shadow-md active:scale-[0.98] cursor-pointer'
                  : 'bg-surface-200 text-surface-400 cursor-not-allowed'
              }`}
              style={
                isStep1Complete
                  ? {
                      background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                      boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
                    }
                  : {}
              }
            >
              <span>Lanjut: Tambah Produk Pertama</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: TAHAP 2 — TAMBAH PRODUK & STOK (MULTI-PRODUK) ───
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-produk') {
    const hasSavedProducts = (form.products || []).length > 0

    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Produk & Stok Toko" onBack={() => setStep('setup-info')} />
        <StepperHeader currentStepIndex={1} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Tambah Produk & Stok Awal
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Toko membutuhkan minimal 1 produk siap jual sebelum dapat diaktifkan.
              </p>
            </div>

            {/* 4. DAFTAR PRODUK YANG SUDAH TERDAFTAR (Card Ringkas) */}
            {hasSavedProducts && (
              <div className="space-y-2 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-surface-600">
                    Produk Terdaftar ({form.products.length})
                  </span>
                  <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Siap Jual
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5 no-scrollbar">
                  {form.products.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="bg-white rounded-xl p-2.5 border border-surface-200/90 shadow-2xs flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-surface-100 overflow-hidden border border-surface-200 flex-shrink-0 relative">
                        {p.fotoProduk && p.fotoProduk[0] ? (
                          <img src={p.fotoProduk[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-surface-400 m-auto mt-3" />
                        )}
                        {p.fotoProduk && p.fotoProduk.length > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[8px] font-bold px-1 py-0.2 rounded">
                            +{p.fotoProduk.length - 1}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-bold text-surface-900 truncate">
                          {p.namaProduk}
                        </p>
                        <p className="text-[11.5px] font-extrabold text-emerald-700 mt-0.5">
                          Rp {Number(p.hargaProduk || 0).toLocaleString('id')} / {p.satuanProduk}
                        </p>
                        <span className="text-[10.5px] text-surface-500 font-medium">
                          Stok: {p.stokProduk} {p.satuanProduk}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition flex-shrink-0 active:scale-95"
                        title="Hapus produk ini"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FORM INPUT PRODUK (BARU / TAMBAHAN) */}
            <div className="bg-white rounded-2xl p-3.5 border border-surface-200 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-surface-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  {hasSavedProducts ? 'Form Tambah Produk Lagi' : 'Form Produk Pertama'}
                </span>
                <span className="text-[10.5px] text-surface-400">
                  {currentProduct.fotoProduk.length}/5 Foto
                </span>
              </div>

              {/* 3. FOTO PRODUK — MANUAL UPLOAD (Maksimal 5 foto, Slot 0 = Utama) */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Foto Produk <span className="text-red-500">*</span>
                </label>
                <p className="text-[10.5px] text-surface-400 mb-2">
                  Maksimal 5 foto. Foto pertama otomatis jadi thumbnail utama di katalog.
                </p>

                <input
                  type="file"
                  ref={productFileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleProductPhotoChange}
                  className="hidden"
                />

                {/* Grid Preview Foto Produk */}
                <div className="grid grid-cols-4 gap-2">
                  {currentProduct.fotoProduk.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-surface-200 bg-surface-100 shadow-2xs group"
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#0C3E1E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                          Utama
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveProductPhoto(idx)}
                        className="w-5 h-5 rounded-full bg-black/65 hover:bg-red-600 text-white flex items-center justify-center transition absolute top-1 right-1 shadow-xs active:scale-90"
                        title="Hapus foto"
                      >
                        <X size={11} strokeWidth={3} />
                      </button>
                    </div>
                  ))}

                  {/* Slot Tambah Foto */}
                  {currentProduct.fotoProduk.length < 5 && (
                    <button
                      type="button"
                      onClick={() => productFileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-surface-300 hover:border-emerald-600 bg-surface-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center text-surface-400 hover:text-emerald-700 transition cursor-pointer shadow-2xs"
                    >
                      <Plus size={18} />
                      <span className="text-[9.5px] font-bold mt-0.5">
                        + Foto
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="cth. Sayur Bayam Organik Segar 250gr"
                  value={currentProduct.namaProduk}
                  onChange={(e) => setCurrentProduct((cp) => ({ ...cp, namaProduk: e.target.value }))}
                  className="w-full bg-surface-50/50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
                />
              </div>

              {/* Harga Jual & Satuan */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                    Harga Jual (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[12px] font-bold text-surface-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="15000"
                      value={currentProduct.hargaProduk}
                      onChange={(e) => setCurrentProduct((cp) => ({ ...cp, hargaProduk: e.target.value }))}
                      className="w-full bg-surface-50/50 border border-surface-200 rounded-xl pl-9 pr-2.5 py-2.5 text-[13px] font-bold text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                    Satuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentProduct.satuanProduk}
                    onChange={(e) => setCurrentProduct((cp) => ({ ...cp, satuanProduk: e.target.value }))}
                    className="w-full bg-surface-50/50 border border-surface-200 rounded-xl px-2.5 py-2.5 text-[12.5px] font-semibold text-surface-800 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
                  >
                    {SATUAN_PRODUK.map((sat) => (
                      <option key={sat} value={sat}>
                        per {sat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Jumlah Stok Awal */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                  Stok Awal Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="cth. 50"
                  value={currentProduct.stokProduk}
                  onChange={(e) => setCurrentProduct((cp) => ({ ...cp, stokProduk: e.target.value }))}
                  className="w-full bg-surface-50/50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons di Bawah */}
          <div className="max-w-sm mx-auto w-full pt-4 pb-2 space-y-2">
            {/* Tombol Utama: Lanjut ke Rekening */}
            <button
              type="button"
              disabled={!isStep2Complete}
              onClick={handleProceedFromStep2}
              className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] transition flex items-center justify-center gap-2 ${
                isStep2Complete
                  ? 'text-white shadow-md active:scale-[0.98] cursor-pointer'
                  : 'bg-surface-200 text-surface-400 cursor-not-allowed'
              }`}
              style={
                isStep2Complete
                  ? {
                      background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                      boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
                    }
                  : {}
              }
            >
              <span>Lanjut: Rekening Pencairan</span>
              <ArrowRight size={17} />
            </button>

            {/* Tombol Kedua: Tambah Produk Lagi (Muncul saat form produk saat ini valid) */}
            {isCurrentProductValid && (
              <button
                type="button"
                onClick={handleAddAnotherProduct}
                className="w-full py-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-850 font-bold text-[13.5px] shadow-xs active:scale-[0.98] transition flex items-center justify-center gap-1.5"
              >
                <Plus size={16} className="text-emerald-700" strokeWidth={2.5} />
                <span>Tambah Produk Lagi</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setStep('setup-info')}
              className="w-full py-2 text-[13px] font-semibold text-surface-500 hover:text-surface-800 transition text-center"
            >
              Kembali ke Info Toko
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: TAHAP 3 — REKENING PENCAIRAN ─────────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-rekening') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Rekening Pencairan" onBack={() => setStep('setup-produk')} />
        <StepperHeader currentStepIndex={2} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Rekening Pencairan Hasil Jual
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Penghasilan dari pesanan yang selesai akan ditransfer otomatis ke rekening ini.
              </p>
            </div>

            {/* Pilihan Bank / E-Wallet */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Pilih Bank / Dompet Digital <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {BANK_OPTIONS.map((b) => {
                  const selected = form.metodePencairan === b.id
                  return (
                    <div
                      key={b.id}
                      onClick={() => setForm((f) => ({ ...f, metodePencairan: b.id }))}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs font-bold text-emerald-900'
                          : 'border-surface-200 bg-white hover:bg-surface-50 text-surface-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[16px]">{b.icon}</span>
                        <span className="text-[12.5px]">{b.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selected ? 'border-emerald-600 bg-emerald-600' : 'border-surface-300'
                        }`}
                      >
                        {selected && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Nomor Rekening */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-surface-700">
                  Nomor Rekening / Nomor GV Pay <span className="text-red-500">*</span>
                </label>
                {userData?.phone && !form.nomorRekening && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, nomorRekening: userData.phone }))}
                    className="text-[10.5px] font-bold text-emerald-700 hover:underline"
                  >
                    Gunakan No. HP ({userData.phone})
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="cth. 08123456789 atau 1234567890"
                value={form.nomorRekening}
                onChange={(e) => setForm((f) => ({ ...f, nomorRekening: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-[13px] font-bold text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
              />
            </div>

            {/* Nama Pemilik Rekening */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-surface-700">
                  Nama Pemilik Rekening <span className="text-red-500">*</span>
                </label>
                {(userData?.name || userProfile?.name) && !form.namaPemilik && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, namaPemilik: userData?.name || userProfile?.name }))}
                    className="text-[10.5px] font-bold text-emerald-700 hover:underline"
                  >
                    Gunakan Nama ({userData?.name || userProfile?.name})
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Harus sesuai nama di identitas KTP"
                value={form.namaPemilik}
                onChange={(e) => setForm((f) => ({ ...f, namaPemilik: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-[13px] text-surface-900 focus:outline-none focus:border-emerald-600 shadow-2xs transition"
              />
              <p className="text-[11px] text-surface-400 mt-1">
                Pencairan dana dilindungi verifikasi nama pemilik rekening bank
              </p>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-4 pb-2 space-y-2">
            <button
              type="button"
              disabled={!isStep3Complete}
              onClick={() => setStep('setup-review')}
              className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] transition flex items-center justify-center gap-2 ${
                isStep3Complete
                  ? 'text-white shadow-md active:scale-[0.98] cursor-pointer'
                  : 'bg-surface-200 text-surface-400 cursor-not-allowed'
              }`}
              style={
                isStep3Complete
                  ? {
                      background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                      boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
                    }
                  : {}
              }
            >
              <span>Lanjut: Review & Konfirmasi Toko</span>
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={() => setStep('setup-produk')}
              className="w-full py-2.5 text-[13px] font-semibold text-surface-500 hover:text-surface-800 transition text-center"
            >
              Kembali ke Produk & Stok
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: TAHAP 4 — REVIEW DATA SEBELUM DIAKTIFKAN ────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-review') {
    const reviewProducts = form.products && form.products.length > 0
      ? form.products
      : [
          {
            id: 'default',
            namaProduk: currentProduct.namaProduk || 'Produk Perdana',
            kategoriProduk: currentProduct.kategoriProduk || form.kategoriToko,
            hargaProduk: currentProduct.hargaProduk || '0',
            satuanProduk: currentProduct.satuanProduk || 'kg',
            stokProduk: currentProduct.stokProduk || '0',
            fotoProduk: currentProduct.fotoProduk || [],
          }
        ]

    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Review Pengajuan Toko" onBack={() => setStep('setup-rekening')} />
        <StepperHeader currentStepIndex={3} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Periksa Data Toko Anda
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Pastikan informasi profil toko, seluruh produk yang didaftarkan, dan rekening pencairan sudah tepat.
              </p>
            </div>

            {/* Card Preview Profil Toko */}
            <div className="bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs">
              <div className="flex items-start justify-between pb-2 mb-2 border-b border-surface-100">
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                  PROFIL TOKO ESTO
                </span>
                <button
                  type="button"
                  onClick={() => setStep('setup-info')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Ubah
                </button>
              </div>
              <div className="flex items-center gap-3">
                {form.fotoToko ? (
                  <div className="w-13 h-13 rounded-2xl overflow-hidden border border-surface-200 flex-shrink-0">
                    <img src={form.fotoToko} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-lg border border-emerald-200/60">
                    <Store size={22} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-[14px] text-surface-900 truncate">
                    {form.namaToko || 'Nama Toko'}
                  </p>
                  <p className="text-[11.5px] text-surface-500 mt-0.5">{form.kategoriToko}</p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-surface-50 text-[11.5px] text-surface-600">
                <div className="flex items-start gap-1">
                  <span className="font-bold text-surface-700 flex-shrink-0">Alamat:</span>
                  <span className="line-clamp-2">{form.alamatToko}</span>
                </div>
                {form.coords && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10.5px] text-emerald-700 font-medium">
                    <MapPin size={13} className="text-emerald-600 flex-shrink-0" />
                    <span>GPS: {form.coords.lat.toFixed(4)}, {form.coords.lng.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Preview SEMUA Produk Terdaftar */}
            <div className="bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs">
              <div className="flex items-start justify-between pb-2 mb-2 border-b border-surface-100">
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                  PRODUK TERDAFTAR ({reviewProducts.length} PRODUK)
                </span>
                <button
                  type="button"
                  onClick={() => setStep('setup-produk')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Ubah / Tambah
                </button>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-0.5 no-scrollbar">
                {reviewProducts.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="flex items-center gap-3 p-2 rounded-xl bg-surface-50/70 border border-surface-100"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-100 border border-surface-200 flex-shrink-0 relative">
                      {p.fotoProduk && p.fotoProduk[0] ? (
                        <img src={p.fotoProduk[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-surface-400 m-auto mt-3" />
                      )}
                      {p.fotoProduk && p.fotoProduk.length > 1 && (
                        <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[8px] font-bold px-1 py-0.2 rounded">
                          +{p.fotoProduk.length - 1}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[12.5px] text-surface-900 truncate">
                        {p.namaProduk}
                      </p>
                      <p className="text-[11.5px] font-extrabold text-emerald-700 mt-0.5">
                        Rp {Number(p.hargaProduk || 0).toLocaleString('id')} / {p.satuanProduk}
                      </p>
                      <span className="text-[10px] text-surface-500 font-medium">
                        Stok awal: {p.stokProduk} {p.satuanProduk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Preview Rekening Pencairan */}
            <div className="bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs">
              <div className="flex items-start justify-between pb-2 mb-2 border-b border-surface-100">
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                  REKENING PENCAIRAN
                </span>
                <button
                  type="button"
                  onClick={() => setStep('setup-rekening')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Ubah
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[13px] text-surface-900">
                    {form.metodePencairan.toUpperCase()} · {form.nomorRekening}
                  </p>
                  <p className="text-[11.5px] text-surface-500 mt-0.5">a.n. {form.namaPemilik}</p>
                </div>
              </div>
            </div>

            {/* Catatan Jaminan */}
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-800">
              <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
              <span>Identitas Anda telah terverifikasi resmi oleh sistem Global Village.</span>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-4 pb-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                // Simpan profil toko lengkap termasuk semua produk dan koordinat
                if (form.namaToko) {
                  localStorage.setItem(
                    'mockSellerStoreInfo',
                    JSON.stringify({
                      name: form.namaToko,
                      category: form.kategoriToko || 'Sayur & Buah Segar',
                      address: form.alamatToko || '',
                      coords: form.coords || null,
                      fotoToko: form.fotoToko || '',
                      products: form.products || [],
                      phone: userData?.phone || '0812-3456-7890',
                      bankName: form.metodePencairan === 'gv_pay' ? 'GV Pay (Dompet Digital Desa)' : 'Transfer Bank',
                      accountNumber: form.nomorRekening || userData?.phone || '0812-3456-7890',
                      accountHolder: form.namaPemilik || userData?.name || userProfile?.name || 'Pak Budi Santoso',
                    })
                  )
                }
                localStorage.setItem('mockSellerAppStatus', 'pending')
                localStorage.removeItem('mockSellerDraft')
                updateUser?.({ tokoStatus: 'pending' })
                setAppStatus('pending')
                setStep('pending')
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
              }}
            >
              <span>Ajukan & Aktifkan Toko ESTO</span>
              <Check size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => setStep('setup-rekening')}
              className="w-full py-2.5 text-[13px] font-semibold text-surface-500 hover:text-surface-800 transition text-center"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: INTRO & DASHBOARD PROGRESS AKTIVASI ─────────────
  // ═════════════════════════════════════════════════════════════
  return (
    <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
      <ScreenHeader title="Aktivasi Toko ESTO" onBack={() => navigate('profile')} />

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between pb-6">
        <div className="max-w-sm mx-auto w-full space-y-4">
          {/* Hero Banner */}
          <div
            className="rounded-2xl p-5 overflow-hidden relative text-white"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 60%, #217A44 100%)',
              boxShadow: '0 4px 16px rgba(12, 62, 30, 0.25)',
            }}
          >
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-white border border-white/20">
                <Store size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1">
                  <Sparkles size={11} />
                  <span>Identitas Terverifikasi</span>
                </div>
                <h2 className="font-extrabold text-[18px] leading-tight">Buka Toko di ESTO</h2>
                <p className="text-white/80 text-[12px] mt-1 leading-snug">
                  Pasarkan hasil tani, kerajinan, dan produk desamu ke ribuan warga GV.
                </p>
              </div>
            </div>
          </div>

          {/* Card Checklist Progres Tahap Setup */}
          <div className="bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-extrabold text-[13.5px] text-surface-900 leading-tight">
                  Tahapan Setup Toko
                </p>
                <p className="text-[11px] text-surface-500 mt-0.5">
                  {completedStepsCount} dari 3 tahap terisi
                </p>
              </div>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                  completedStepsCount === 3
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : completedStepsCount > 0
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-surface-100 text-surface-500'
                }`}
              >
                {completedStepsCount === 3
                  ? 'Siap Review'
                  : completedStepsCount > 0
                  ? 'Sedang Diproses'
                  : 'Belum Diisi'}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Tahap 1 */}
              <div
                onClick={() => setStep('setup-info')}
                className="p-3 rounded-xl border border-surface-100 bg-surface-50/70 flex items-center justify-between cursor-pointer hover:bg-surface-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold ${
                      isStep1Complete ? 'bg-emerald-600 text-white' : 'bg-surface-200 text-surface-600'
                    }`}
                  >
                    {isStep1Complete ? <Check size={14} strokeWidth={3} /> : '1'}
                  </div>
                  <div>
                    <p className="font-bold text-[12.5px] text-surface-900">Info & Alamat Toko</p>
                    <p className="text-[11px] text-surface-400">
                      {isStep1Complete ? form.namaToko : 'Nama toko & lokasi penjemputan'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  {isStep1Complete ? 'Ubah' : 'Isi →'}
                </span>
              </div>

              {/* Tahap 2 */}
              <div
                onClick={() => setStep('setup-produk')}
                className="p-3 rounded-xl border border-surface-100 bg-surface-50/70 flex items-center justify-between cursor-pointer hover:bg-surface-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold ${
                      isStep2Complete ? 'bg-emerald-600 text-white' : 'bg-surface-200 text-surface-600'
                    }`}
                  >
                    {isStep2Complete ? <Check size={14} strokeWidth={3} /> : '2'}
                  </div>
                  <div>
                    <p className="font-bold text-[12.5px] text-surface-900">Produk & Stok Awal</p>
                    <p className="text-[11px] text-surface-400">
                      {isStep2Complete
                        ? `${(form.products || []).length || 1} Produk didaftarkan`
                        : 'Foto produk, harga & stok'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  {isStep2Complete ? 'Ubah' : 'Isi →'}
                </span>
              </div>

              {/* Tahap 3 */}
              <div
                onClick={() => setStep('setup-rekening')}
                className="p-3 rounded-xl border border-surface-100 bg-surface-50/70 flex items-center justify-between cursor-pointer hover:bg-surface-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold ${
                      isStep3Complete ? 'bg-emerald-600 text-white' : 'bg-surface-200 text-surface-600'
                    }`}
                  >
                    {isStep3Complete ? <Check size={14} strokeWidth={3} /> : '3'}
                  </div>
                  <div>
                    <p className="font-bold text-[12.5px] text-surface-900">Rekening Pencairan</p>
                    <p className="text-[11px] text-surface-400">
                      {isStep3Complete ? form.metodePencairan.toUpperCase() : 'Bank atau GV Pay'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  {isStep3Complete ? 'Ubah' : 'Isi →'}
                </span>
              </div>
            </div>
          </div>

          {/* Keunggulan Penjual di ESTO */}
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-xl border border-surface-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-surface-900 leading-snug">Jangkau Pasar Desa</p>
                <p className="text-[11px] text-surface-500">Produkmu langsung dicari warga tanpa perantara tengkulak</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-surface-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Wallet size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-surface-900 leading-snug">Pembayaran Instan GV Pay</p>
                <p className="text-[11px] text-surface-500">Dana otomatis masuk ke saldo rekening begitu pesanan diterima</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="max-w-sm mx-auto w-full pt-4">
          <button
            type="button"
            onClick={() => {
              if (completedStepsCount === 3) {
                setStep('setup-review')
              } else if (!isStep1Complete) {
                setStep('setup-info')
              } else if (!isStep2Complete) {
                setStep('setup-produk')
              } else {
                setStep('setup-rekening')
              }
            }}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
              boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
            }}
          >
            <span>
              {completedStepsCount === 3
                ? 'Review & Aktifkan Toko'
                : completedStepsCount > 0
                ? 'Lanjutkan Setup Toko'
                : 'Mulai Setup Toko'}
            </span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
