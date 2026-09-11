import React, { useState, useEffect } from 'react'
import {
  Clapperboard,
  ShieldAlert,
  ShieldCheck,
  Check,
  Play,
  Star,
  Users,
  Clock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Wallet,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Tv2
} from 'lucide-react'
import GlassCard from '@/components/atoms/GlassCard'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import ScreenHeader from '@/components/molecules/ScreenHeader'

const KATEGORI_CHANNEL = [
  'Pertanian & Agribisnis',
  'Edukasi & Tutorial Desa',
  'Bisnis & UMKM Desa',
  'Seni & Budaya Lokal',
  'Kuliner Tradisional',
  'Kesehatan & Herbal',
  'Hiburan & Vlogging',
]

const BANK_OPTIONS = [
  { id: 'gv_pay', label: 'GV Pay (Instan & Bebas Biaya)', icon: '⚡' },
  { id: 'bri', label: 'Bank BRI', icon: '🏦' },
  { id: 'mandiri', label: 'Bank Mandiri', icon: '🏦' },
  { id: 'bca', label: 'Bank BCA', icon: '🏦' },
  { id: 'bni', label: 'Bank BNI', icon: '🏦' },
  { id: 'bsi', label: 'Bank Syariah Indonesia (BSI)', icon: '🏦' },
]

export default function AktivasiKreator({ navigate, userData, updateUser, userProfile }) {
  // Verifikasi Prasyarat
  const isVerified =
    userData?.verificationStatus === 'verified' ||
    userProfile?.verified === true ||
    userProfile?.verificationStatus === 'verified' ||
    userProfile?.capabilities?.includes('Kreator') ||
    localStorage.getItem('mockVerificationStatus') === 'verified'

  // Status Kreator Aktif
  const isCreator =
    userProfile?.capabilities?.includes('Kreator') ||
    userProfile?.isCreator === true ||
    userData?.isCreator === true ||
    localStorage.getItem('mockCreatorAppStatus') === 'active'

  // Jika sudah aktif sebagai kreator, langsung arahkan ke Studio Kreator GV
  useEffect(() => {
    if (isCreator) {
      navigate('studio')
    }
  }, [isCreator, navigate])

  // Load Saved Application Status
  const savedStatus = localStorage.getItem('mockCreatorAppStatus') || 'not_applied'
  const [appStatus, setAppStatus] = useState(savedStatus)

  // Initial Step
  const [step, setStep] = useState(() => {
    if (savedStatus === 'pending') return 'pending'
    const savedDraft = localStorage.getItem('mockCreatorDraft')
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

  // Form State
  const [form, setForm] = useState(() => {
    const savedDraft = localStorage.getItem('mockCreatorDraft')
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft).form || getDefaultForm()
      } catch (e) {
        console.error(e)
      }
    }
    return getDefaultForm()
  })

  function getDefaultForm() {
    return {
      namaChannel: '',
      kategoriChannel: 'Pertanian & Agribisnis',
      bioChannel: '',
      avatar: '🌾',
      metodePencairan: 'gv_pay',
      nomorRekening: '',
      namaPemilik: '',
      setujuSyarat: false,
    }
  }

  // Sinkronisasi saat persona berubah atau status berubah
  useEffect(() => {
    const currentStatus = localStorage.getItem('mockCreatorAppStatus') || 'not_applied'
    setAppStatus(currentStatus)

    if (currentStatus === 'pending') {
      setStep('pending')
      return
    }

    const savedDraft = localStorage.getItem('mockCreatorDraft')
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
    setStep('intro')
  }, [userProfile?.id, userData?.name])

  // Simpan Draft ke LocalStorage
  useEffect(() => {
    if (step !== 'intro' && step !== 'pending') {
      try {
        localStorage.setItem(
          'mockCreatorDraft',
          JSON.stringify({ form, currentStep: step, lastUpdated: new Date().toISOString() })
        )
      } catch (e) {
        console.error(e)
      }
    }
  }, [form, step])

  // Evaluasi Kelengkapan
  const isStep1Complete = form.namaChannel.trim() !== '' && form.bioChannel.trim() !== ''
  const isStep2Complete =
    form.nomorRekening.trim() !== '' && form.namaPemilik.trim() !== '' && form.setujuSyarat

  const completedStepsCount = (isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0)

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: SUDAH AKTIF SEBAGAI KREATOR ──────────────────────
  // ═════════════════════════════════════════════════════════════
  if (isCreator) {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Aktivasi Kreator GV" onBack={() => navigate('profile')} />

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4 pb-6">
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-20 h-20 rounded-3xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shadow-xs mb-4">
              <Clapperboard size={44} className="text-purple-700" />
            </div>

            <h2 className="font-extrabold text-[20px] text-surface-900 tracking-tight">
              Channel Kreator Anda Aktif!
            </h2>
            <p className="text-[12.5px] text-surface-500 px-6 mt-1.5 leading-relaxed max-w-xs">
              Channel Anda telah terdaftar dan aktif di GV Media. Anda dapat langsung mengunggah video, membuat postingan, atau siaran live.
            </p>

            <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs mt-6 text-left">
              <div className="flex items-center gap-2.5 text-purple-900 font-bold text-[13px] pb-2 border-b border-surface-100">
                <CheckCircle2 size={16} className="text-purple-700" />
                <span>Status: Kreator Terverifikasi GV</span>
              </div>
              <p className="text-[11.5px] text-surface-500 mt-2.5 leading-relaxed">
                Akses analitik penonton, kelola monetisasi subscriber, dan publikasikan karya Anda melalui Studio Kreator.
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-2.5 pt-4">
            <button
              type="button"
              onClick={() => navigate('studio')}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
                boxShadow: '0 4px 14px rgba(123,31,162,0.35)',
              }}
            >
              <span>Buka Studio Kreator GV</span>
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
        <ScreenHeader title="Aktivasi Kreator GV" onBack={() => navigate('profile')} />

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4 pb-6">
          <div className="flex flex-col items-center text-center mt-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs mb-4">
              <ShieldAlert size={44} className="text-amber-600" />
            </div>

            <h2 className="font-extrabold text-[19px] text-surface-900 tracking-tight leading-snug">
              Verifikasi Identitas Diperlukan
            </h2>
            <p className="text-[12.5px] text-surface-500 px-6 mt-1.5 leading-relaxed max-w-xs">
              Untuk mengaktifkan fitur monetisasi dan menerbitkan konten di GV Media, identitas Anda harus terverifikasi resmi.
            </p>

            {/* Stepper Preview Prasyarat */}
            <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs mt-6 text-left">
              <span className="text-[10px] font-bold text-surface-400 tracking-wider block mb-3 uppercase">
                ALUR AKTIVASI KREATOR
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
                      Setup Channel & Monetisasi
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
                      Channel Aktif & Mulai Siaran
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
        <ScreenHeader title="Status Pengajuan Channel" onBack={() => navigate('profile')} />

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4 pb-6">
          <div className="flex flex-col items-center text-center mt-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs mb-3">
              <Clock size={42} className="text-amber-600" />
            </div>

            <h2 className="font-extrabold text-[20px] text-surface-900 tracking-tight">
              Pendaftaran Channel Ditinjau
            </h2>
            <p className="text-[12.5px] text-surface-500 px-6 mt-1.5 leading-relaxed max-w-xs">
              Tim kurasi GV Media sedang meninjau pengajuan channel dan preferensi konten Anda.
            </p>

            <div className="w-full max-w-sm bg-gradient-to-br from-purple-50 to-amber-50/40 rounded-2xl p-4 border border-purple-200/80 shadow-2xs mt-5 text-left">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-purple-200/60">
                <Clock size={16} className="text-purple-800" />
                <span className="font-extrabold text-[13px] text-purple-900">
                  Estimasi 1–2 Hari Kerja
                </span>
              </div>
              <p className="text-[11.5px] text-purple-900/80 leading-relaxed">
                Notifikasi otomatis akan dikirim ke akun Anda begitu channel disetujui. Badge Kreator Terverifikasi akan aktif di profil Anda.
              </p>
            </div>

            {/* Ringkasan Data yang Dikirim */}
            <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs mt-4 text-left">
              <span className="text-[10px] font-bold text-surface-400 tracking-wider block mb-2.5 uppercase">
                RINGKASAN PENGAJUAN
              </span>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-surface-500">Nama Channel:</span>
                  <span className="font-bold text-surface-900">{form.namaChannel || 'Channel Baru'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Kategori:</span>
                  <span className="font-medium text-surface-800">{form.kategoriChannel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Pencairan:</span>
                  <span className="font-medium text-surface-800">
                    {form.metodePencairan === 'gv_pay' ? 'GV PAY' : form.metodePencairan.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Termasuk Tombol Simulasi Langsung Buka Studio */}
          <div className="w-full max-w-sm mx-auto space-y-2.5 pt-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('mockCreatorAppStatus', 'active')
                localStorage.setItem(
                  'mockCreatorChannelInfo',
                  JSON.stringify({
                    channelName: form.namaChannel || 'Channel Kreator GV',
                    category: form.kategoriChannel,
                    bio: form.bioChannel,
                    avatar: form.avatar || '🌾',
                    contentTypes: ['Video', 'Podcast'],
                    payoutMethod: form.metodePencairan,
                    accountNumber: form.nomorRekening,
                    accountHolder: form.namaPemilik,
                  })
                )
                localStorage.removeItem('mockCreatorDraft')
                updateUser?.({ isCreator: true })
                navigate('studio')
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
                boxShadow: '0 4px 14px rgba(123,31,162,0.3)',
              }}
            >
              <span>Simulasikan Kreator Aktif (Demo)</span>
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
      { id: 'channel', label: 'Channel' },
      { id: 'rekening', label: 'Monetisasi' },
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
                        ? 'bg-purple-700 text-white'
                        : isCurrent
                        ? 'bg-[#4A148C] text-white shadow-xs'
                        : 'bg-surface-100 text-surface-400'
                    }`}
                  >
                    {isDone ? <Check size={13} strokeWidth={3} /> : i + 1}
                  </div>
                  <span
                    className={`text-[11.5px] font-bold hidden sm:inline ${
                      isCurrent ? 'text-surface-900' : isDone ? 'text-purple-800' : 'text-surface-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 rounded-full ${
                      i < currentStepIndex ? 'bg-purple-500' : 'bg-surface-200'
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
  // ── SCREEN: TAHAP 1 — SETUP CHANNEL & BIO ───────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-channel') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Setup Channel Kreator" onBack={() => setStep('intro')} />
        <StepperHeader currentStepIndex={0} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Identitas Channel Anda
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Tentukan nama dan deskripsi channel yang menarik untuk pemirsa warga desa.
              </p>
            </div>

            {/* Nama Channel */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Nama Channel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="cth. Suara Petani Desa Inovatif"
                value={form.namaChannel}
                onChange={(e) => setForm((f) => ({ ...f, namaChannel: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-[13px] text-surface-900 focus:outline-none focus:border-purple-700 shadow-2xs transition"
              />
              <p className="text-[11px] text-surface-400 mt-1">
                Nama ini yang akan tampil di halaman GV Media & Siaran
              </p>
            </div>

            {/* Kategori Channel */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Kategori Utama Konten <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {KATEGORI_CHANNEL.map((item) => {
                  const active = form.kategoriChannel === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, kategoriChannel: item }))}
                      className={`py-2.5 px-3 text-left text-[11.5px] rounded-xl font-bold transition flex items-center justify-between border ${
                        active
                          ? 'bg-purple-50 border-purple-700 text-purple-900 shadow-2xs'
                          : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {active && <Check size={13} className="text-purple-700 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bio Channel */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Bio / Deskripsi Singkat <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                maxLength={180}
                placeholder="Ceritakan tentang materi video, podcast, atau karya yang Anda bagikan..."
                value={form.bioChannel}
                onChange={(e) => setForm((f) => ({ ...f, bioChannel: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-2.5 text-[13px] text-surface-900 focus:outline-none focus:border-purple-700 resize-none shadow-2xs transition"
              />
              <p className="text-[10.5px] text-right text-surface-400">
                {form.bioChannel.length}/180
              </p>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-4 pb-2">
            <button
              type="button"
              disabled={!isStep1Complete}
              onClick={() => setStep('setup-rekening')}
              className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] transition flex items-center justify-center gap-2 ${
                isStep1Complete
                  ? 'text-white shadow-md active:scale-[0.98] cursor-pointer'
                  : 'bg-surface-200 text-surface-400 cursor-not-allowed'
              }`}
              style={
                isStep1Complete
                  ? {
                      background: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
                      boxShadow: '0 4px 14px rgba(123,31,162,0.3)',
                    }
                  : {}
              }
            >
              <span>Lanjut: Rekening Monetisasi</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: TAHAP 2 — REKENING MONETISASI & ROYALTI ─────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-rekening') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Rekening Monetisasi" onBack={() => setStep('setup-channel')} />
        <StepperHeader currentStepIndex={1} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Pencairan Royalti & Gift
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Penghasilan dari subscriber GV+, gift siaran live, dan iklan akan ditransfer ke rekening ini.
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
                          ? 'border-purple-600 bg-purple-50/70 shadow-2xs font-bold text-purple-900'
                          : 'border-surface-200 bg-white hover:bg-surface-50 text-surface-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[16px]">{b.icon}</span>
                        <span className="text-[12.5px]">{b.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selected ? 'border-purple-700 bg-purple-700' : 'border-surface-300'
                        }`}
                      >
                        {selected && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Nomor Rekening / Nomor GV Pay Dinamis */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700">
                  {form.metodePencairan === 'gv_pay' ? 'Nomor GV Pay' : 'Nomor Rekening'} <span className="text-red-500">*</span>
                </label>
                {userData?.phone && form.nomorRekening !== userData.phone && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, nomorRekening: userData.phone }))}
                    className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition active:scale-95"
                  >
                    Gunakan No. HP ({userData.phone})
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder={
                  form.metodePencairan === 'gv_pay'
                    ? 'cth. 08123456789 (No. HP GV Pay)'
                    : 'cth. 1234567890 (No. rekening)'
                }
                value={form.nomorRekening}
                onChange={(e) => setForm((f) => ({ ...f, nomorRekening: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-[13px] font-bold text-surface-900 focus:outline-none focus:border-purple-700 shadow-2xs transition"
              />
            </div>

            {/* Nama Pemilik Rekening */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700">
                  Nama Pemilik Rekening <span className="text-red-500">*</span>
                </label>
                {(userData?.name || userProfile?.name) &&
                  form.namaPemilik !== (userData?.name || userProfile?.name) && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          namaPemilik: userData?.name || userProfile?.name,
                        }))
                      }
                      className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition active:scale-95"
                    >
                      Gunakan Nama ({userData?.name || userProfile?.name})
                    </button>
                  )}
              </div>
              <input
                type="text"
                placeholder="Harus sesuai dengan nama identitas KTP"
                value={form.namaPemilik}
                onChange={(e) => setForm((f) => ({ ...f, namaPemilik: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-[13px] text-surface-900 focus:outline-none focus:border-purple-700 shadow-2xs transition"
              />
            </div>

            {/* Checkbox Syarat & Ketentuan */}
            <div
              onClick={() => setForm((f) => ({ ...f, setujuSyarat: !f.setujuSyarat }))}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                  form.setujuSyarat
                    ? 'bg-purple-700 border-purple-700 text-white'
                    : 'border-surface-400 bg-white'
                }`}
              >
                {form.setujuSyarat && <Check size={11} strokeWidth={3} />}
              </div>
              <p className="text-[11.5px] text-purple-950 leading-relaxed">
                Saya menyetujui pedoman komunitas Kreator GV: konten ramah warga desa, bebas hoaks, dan orisinal.
              </p>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-4 pb-2 space-y-2">
            <button
              type="button"
              disabled={!isStep2Complete}
              onClick={() => setStep('setup-review')}
              className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] transition flex items-center justify-center gap-2 ${
                isStep2Complete
                  ? 'text-white shadow-md active:scale-[0.98] cursor-pointer'
                  : 'bg-surface-200 text-surface-400 cursor-not-allowed'
              }`}
              style={
                isStep2Complete
                  ? {
                      background: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
                      boxShadow: '0 4px 14px rgba(123,31,162,0.3)',
                    }
                  : {}
              }
            >
              <span>Lanjut: Review & Konfirmasi Channel</span>
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={() => setStep('setup-channel')}
              className="w-full py-2.5 text-[13px] font-semibold text-surface-500 hover:text-surface-800 transition text-center"
            >
              Kembali ke Identitas Channel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN: TAHAP 3 — REVIEW & KONFIRMASI CHANNEL ───────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'setup-review') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] select-none overflow-hidden relative">
        <ScreenHeader title="Review Pendaftaran Channel" onBack={() => setStep('setup-rekening')} />
        <StepperHeader currentStepIndex={2} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between">
          <div className="max-w-sm mx-auto w-full space-y-4 pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-surface-900 leading-tight">
                Pratinjau Channel Kreator
              </h2>
              <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">
                Tampilan channel Anda di aplikasi GV Media bagi seluruh penonton desa.
              </p>
            </div>

            {/* Card Preview Channel */}
            <GlassCard variant="elevated" className="p-4 border border-surface-200/80 shadow-2xs">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)' }}
                >
                  <Clapperboard size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-[15px] text-surface-900 leading-tight truncate">
                    {form.namaChannel || 'Nama Channel'}
                  </h3>
                  <p className="text-[12px] text-purple-700 font-semibold mt-0.5">
                    {form.kategoriChannel}
                  </p>
                  <span className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 border border-purple-200/60">
                    Kreator Baru
                  </span>
                </div>
              </div>

              <div className="mt-3 mb-2.5 border-t border-surface-100" />
              <p className="text-[12px] text-surface-600 leading-relaxed italic">
                "{form.bioChannel}"
              </p>
            </GlassCard>

            {/* Card Rekening Pencairan */}
            <div className="bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs">
              <div className="flex items-start justify-between pb-2 mb-2 border-b border-surface-100">
                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                  PENCAIRAN ROYALTI & MONETISASI
                </span>
                <button
                  type="button"
                  onClick={() => setStep('setup-rekening')}
                  className="text-[11px] font-bold text-purple-700 hover:underline"
                >
                  Ubah
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[13px] text-surface-900">
                    {form.metodePencairan === 'gv_pay' ? 'GV PAY' : form.metodePencairan.toUpperCase()} · {form.nomorRekening}
                  </p>
                  <p className="text-[11.5px] text-surface-500 mt-0.5">a.n. {form.namaPemilik}</p>
                </div>
              </div>
            </div>

            {/* Jaminan Identitas */}
            <div className="flex items-center gap-2 p-3 bg-purple-50/70 rounded-xl border border-purple-200/60 text-[11px] text-purple-900">
              <ShieldCheck size={16} className="text-purple-700 flex-shrink-0" />
              <span>Pengajuan ini terhubung dengan identitas resmi Anda yang telah terverifikasi.</span>
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-4 pb-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('mockCreatorAppStatus', 'pending')
                localStorage.setItem(
                  'mockCreatorChannelInfo',
                  JSON.stringify({
                    channelName: form.namaChannel || 'Channel Baru',
                    category: form.kategoriChannel,
                    bio: form.bioChannel,
                    avatar: form.avatar || '🌾',
                    contentTypes: ['Video', 'Podcast'],
                    payoutMethod: form.metodePencairan,
                    accountNumber: form.nomorRekening,
                    accountHolder: form.namaPemilik,
                  })
                )
                localStorage.removeItem('mockCreatorDraft')
                updateUser?.({ kreatorStatus: 'pending' })
                setAppStatus('pending')
                setStep('pending')
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
                boxShadow: '0 4px 14px rgba(123,31,162,0.3)',
              }}
            >
              <span>Daftarkan & Aktifkan Channel</span>
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
      <ScreenHeader title="Aktivasi Kreator GV" onBack={() => navigate('profile')} />

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between pb-6">
        <div className="max-w-sm mx-auto w-full space-y-4">
          {/* Hero Section */}
          <div
            className="rounded-2xl p-5 overflow-hidden relative text-white"
            style={{
              background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)',
              boxShadow: '0 4px 16px rgba(74, 20, 140, 0.25)',
            }}
          >
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-white border border-white/20">
                <Clapperboard size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1">
                  <Sparkles size={11} />
                  <span>Identitas Terverifikasi</span>
                </div>
                <h2 className="font-extrabold text-[18px] leading-tight">Jadi Kreator GV</h2>
                <p className="text-white/80 text-[12px] mt-1 leading-snug">
                  Bagikan ilmu, podcast, dan siaran video Anda ke komunitas warga desa.
                </p>
              </div>
            </div>
          </div>

          {/* Card Checklist Progres Tahap Setup */}
          <div className="bg-white rounded-2xl p-4 border border-surface-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-extrabold text-[13.5px] text-surface-900 leading-tight">
                  Tahapan Setup Channel
                </p>
                <p className="text-[11px] text-surface-500 mt-0.5">
                  {completedStepsCount} dari 2 tahap terisi
                </p>
              </div>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                  completedStepsCount === 2
                    ? 'bg-purple-50 text-purple-800 border border-purple-200'
                    : completedStepsCount > 0
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-surface-100 text-surface-500'
                }`}
              >
                {completedStepsCount === 2
                  ? 'Siap Review'
                  : completedStepsCount > 0
                  ? 'Sedang Diproses'
                  : 'Belum Diisi'}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Tahap 1 */}
              <div
                onClick={() => setStep('setup-channel')}
                className="p-3 rounded-xl border border-surface-100 bg-surface-50/70 flex items-center justify-between cursor-pointer hover:bg-surface-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold ${
                      isStep1Complete ? 'bg-purple-700 text-white' : 'bg-surface-200 text-surface-600'
                    }`}
                  >
                    {isStep1Complete ? <Check size={14} strokeWidth={3} /> : '1'}
                  </div>
                  <div>
                    <p className="font-bold text-[12.5px] text-surface-900">Identitas Channel & Bio</p>
                    <p className="text-[11px] text-surface-400">
                      {isStep1Complete ? form.namaChannel : 'Nama channel & deskripsi'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-700">
                  {isStep1Complete ? 'Ubah' : 'Isi →'}
                </span>
              </div>

              {/* Tahap 2 */}
              <div
                onClick={() => setStep('setup-rekening')}
                className="p-3 rounded-xl border border-surface-100 bg-surface-50/70 flex items-center justify-between cursor-pointer hover:bg-surface-100/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold ${
                      isStep2Complete ? 'bg-purple-700 text-white' : 'bg-surface-200 text-surface-600'
                    }`}
                  >
                    {isStep2Complete ? <Check size={14} strokeWidth={3} /> : '2'}
                  </div>
                  <div>
                    <p className="font-bold text-[12.5px] text-surface-900">Rekening Monetisasi</p>
                    <p className="text-[11px] text-surface-400">
                      {isStep2Complete
                        ? (form.metodePencairan === 'gv_pay' ? 'GV PAY' : form.metodePencairan.toUpperCase())
                        : 'Bank atau Dompet GV Pay'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-700">
                  {isStep2Complete ? 'Ubah' : 'Isi →'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Keunggulan */}
          <div className="space-y-2">
            <GlassCard variant="elevated" className="p-3 flex items-center gap-3 border border-surface-200/80 shadow-2xs">
              <SkeuoIcon size="sm" gradient={['#C62828', '#E53935']} icon={Play} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[12.5px] text-surface-900 leading-snug">
                  Tayangkan Video & Podcast
                </p>
                <p className="text-[11px] text-surface-500 mt-0.5">
                  Tersedia langsung di tab GV Media desa
                </p>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-3 flex items-center gap-3 border border-surface-200/80 shadow-2xs">
              <SkeuoIcon size="sm" gradient={['#E65100', '#F57C00']} icon={Star} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[12.5px] text-surface-900 leading-snug">
                  Monetisasi & Royalti Kreator
                </p>
                <p className="text-[11px] text-surface-500 mt-0.5">
                  Dukungan langsung dari warga dan member GV+
                </p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Action Button */}
        <div className="max-w-sm mx-auto w-full pt-4">
          <button
            type="button"
            onClick={() => {
              if (completedStepsCount === 2) {
                setStep('setup-review')
              } else if (!isStep1Complete) {
                setStep('setup-channel')
              } else {
                setStep('setup-rekening')
              }
            }}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
              boxShadow: '0 4px 14px rgba(123,31,162,0.3)',
            }}
          >
            <span>
              {completedStepsCount === 2
                ? 'Review & Daftarkan Channel'
                : completedStepsCount > 0
                ? 'Lanjutkan Setup Channel'
                : 'Mulai Setup Channel'}
            </span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
