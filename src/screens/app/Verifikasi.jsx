import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft,
  Clock,
  Camera,
  RotateCcw,
  Wallet,
  Store,
  Tv2,
  Sparkles,
  Shield,
  ShieldCheck,
  Lock,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sun,
  Maximize2,
  FileText,
  Play
} from 'lucide-react'
import ScreenHeader from '../../components/molecules/ScreenHeader'

// ── 1. MODULAR ILLUSTRATION COMPONENT ────────────────────────
/**
 * VerificationIllustration
 * Komponen ilustrasi modular terstandarisasi dengan fixed aspect-ratio.
 * Tim Multimedia / Graphic Design dapat langsung memasukkan asset gambar/SVG final
 * melalui prop `src` tanpa perlu mengubah layout utama.
 * 
 * @param {string} type - 'wajah-sukses' | 'ktp-sukses' | 'selfie-sukses' | 'selesai' | 'intro-wajah' | 'intro-ktp' | 'intro-selfie'
 * @param {string} [src] - URL / path asset gambar eksternal dari tim desain
 * @param {string} [alt] - Deskripsi alternatif gambar
 * @param {string} [className] - Kelas styling tambahan
 */
export function VerificationIllustration({ type, src, alt, className = '' }) {
  if (src) {
    return (
      <div
        className={`w-full max-w-[240px] aspect-[4/3] flex items-center justify-center mx-auto overflow-hidden rounded-2xl ${className}`}
      >
        <img
          src={src}
          alt={alt || type}
          className="w-full h-full object-contain select-none"
        />
      </div>
    )
  }

  // Preset vector illustrations berbasis design tokens G-Village
  switch (type) {
    case 'wajah-sukses':
      return (
        <div className={`w-full max-w-[220px] aspect-[4/3] flex items-center justify-center mx-auto relative ${className}`}>
          <svg width="190" height="150" viewBox="0 0 190 150" fill="none" className="drop-shadow-sm">
            {/* Ambient halo glow */}
            <circle cx="95" cy="75" r="65" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
            <circle cx="95" cy="75" r="50" fill="#DCFCE7" opacity="0.6" />
            
            {/* Biometric grid radar ring */}
            <circle cx="95" cy="75" r="60" stroke="#86EFAC" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
            
            {/* Face outline */}
            <ellipse cx="95" cy="68" rx="26" ry="30" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
            
            {/* Eyes */}
            <circle cx="86" cy="62" r="3" fill="#15803D" />
            <circle cx="104" cy="62" r="3" fill="#15803D" />
            <circle cx="87" cy="60.5" r="1" fill="#FFFFFF" />
            <circle cx="105" cy="60.5" r="1" fill="#FFFFFF" />
            
            {/* Eyebrows */}
            <path d="M 83 56 Q 86 54 89 56" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 101 56 Q 104 54 107 56" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Happy Smile */}
            <path d="M 86 76 Q 95 85 104 76" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            
            {/* Shoulders */}
            <path d="M 62 125 Q 64 102 95 100 Q 126 102 128 125" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
            
            {/* Success Check Badge */}
            <circle cx="134" cy="42" r="17" fill="#16A34A" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M 126 42 L 132 48 L 142 37" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Decorative sparkles */}
            <circle cx="48" cy="38" r="2.5" fill="#4ADE80" />
            <circle cx="152" cy="98" r="2" fill="#4ADE80" />
            <circle cx="42" cy="106" r="3" fill="#86EFAC" />
          </svg>
        </div>
      )

    case 'ktp-sukses':
      return (
        <div className={`w-full max-w-[220px] aspect-[4/3] flex items-center justify-center mx-auto relative ${className}`}>
          <svg width="210" height="145" viewBox="0 0 210 145" fill="none" className="drop-shadow-sm">
            {/* Card Shadow and Base */}
            <rect x="18" y="16" width="174" height="112" rx="12" fill="#F0FDF4" stroke="#4ADE80" strokeWidth="2.5" />
            
            {/* Header band */}
            <path d="M 18 28 Q 18 16 30 16 L 180 16 Q 192 16 192 28 L 192 40 L 18 40 Z" fill="#DCFCE7" />
            
            {/* Header Text Mockup */}
            <rect x="45" y="24" width="120" height="5" rx="2.5" fill="#16A34A" />
            <rect x="68" y="32" width="74" height="3.5" rx="1.75" fill="#4ADE80" />
            
            {/* Photo Box */}
            <rect x="30" y="52" width="38" height="48" rx="6" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
            <circle cx="49" cy="68" r="9" fill="#16A34A" opacity="0.8" />
            <path d="M 36 94 Q 37 84 49 84 Q 61 84 62 94" fill="#16A34A" opacity="0.8" />
            
            {/* Text lines */}
            <rect x="78" y="54" width="76" height="4.5" rx="2.25" fill="#15803D" />
            <rect x="78" y="64" width="94" height="3.5" rx="1.75" fill="#86EFAC" />
            <rect x="78" y="73" width="84" height="3.5" rx="1.75" fill="#86EFAC" />
            <rect x="78" y="82" width="62" height="3.5" rx="1.75" fill="#86EFAC" />
            <rect x="78" y="91" width="70" height="3.5" rx="1.75" fill="#BBF7D0" />
            
            {/* Chip gold icon */}
            <rect x="32" y="104" width="14" height="10" rx="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
            <line x1="37" y1="104" x2="37" y2="114" stroke="#CA8A04" strokeWidth="0.8" />
            <line x1="41" y1="104" x2="41" y2="114" stroke="#CA8A04" strokeWidth="0.8" />
            
            {/* Verified Badge */}
            <circle cx="178" cy="24" r="16" fill="#16A34A" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M 171 24 L 176 29 L 185 19" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )

    case 'selfie-sukses':
      return (
        <div className={`w-full max-w-[220px] aspect-[4/3] flex items-center justify-center mx-auto relative ${className}`}>
          <svg width="200" height="150" viewBox="0 0 200 150" fill="none" className="drop-shadow-sm">
            {/* Phone/Frame mockup */}
            <rect x="42" y="10" width="116" height="130" rx="18" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
            <rect x="48" y="16" width="104" height="118" rx="12" fill="#DCFCE7" opacity="0.5" />
            
            {/* Person Face in upper half */}
            <ellipse cx="100" cy="50" rx="20" ry="22" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2" />
            <circle cx="93" cy="46" r="2.5" fill="#15803D" />
            <circle cx="107" cy="46" r="2.5" fill="#15803D" />
            <path d="M 94 56 Q 100 62 106 56" stroke="#15803D" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* Hands holding KTP in lower half */}
            <path d="M 68 114 Q 74 88 100 88 Q 126 88 132 114" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
            
            {/* Held e-KTP Card */}
            <rect x="74" y="80" width="52" height="34" rx="4" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.5" />
            <rect x="77" y="84" width="12" height="14" rx="1.5" fill="#86EFAC" />
            <rect x="92" y="85" width="30" height="2.5" rx="1" fill="#16A34A" />
            <rect x="92" y="90" width="24" height="2" rx="1" fill="#86EFAC" />
            <rect x="92" y="94" width="26" height="2" rx="1" fill="#86EFAC" />
            
            {/* Fingers holding card */}
            <rect x="68" y="90" width="8" height="14" rx="4" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.2" />
            <rect x="124" y="90" width="8" height="14" rx="4" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.2" />
            
            {/* Success Check Badge */}
            <circle cx="144" cy="28" r="16" fill="#16A34A" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M 137 28 L 142 33 L 151 23" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )

    case 'selesai':
      return (
        <div className={`w-full max-w-[240px] aspect-[4/3] flex items-center justify-center mx-auto relative ${className}`}>
          <svg width="220" height="160" viewBox="0 0 220 160" fill="none" className="drop-shadow-sm">
            {/* Ambient Background Circles */}
            <circle cx="110" cy="80" r="68" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
            <circle cx="110" cy="80" r="54" fill="#DCFCE7" opacity="0.6" />
            
            {/* Central Security Shield */}
            <path
              d="M 110 32 L 148 48 L 148 84 Q 148 114 110 128 Q 72 114 72 84 L 72 48 Z"
              fill="#16A34A"
              stroke="#0C3E1E"
              strokeWidth="2.5"
            />
            
            {/* Inner Shield Layer */}
            <path
              d="M 110 40 L 140 53 L 140 82 Q 140 106 110 118 Q 80 106 80 82 L 80 53 Z"
              fill="#22C55E"
              opacity="0.9"
            />
            
            {/* Large White Checkmark */}
            <path
              d="M 94 82 L 105 93 L 128 68"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Floating Document Badge Left */}
            <g transform="translate(34, 52) rotate(-8)">
              <rect width="28" height="36" rx="4" fill="#FFFFFF" stroke="#4ADE80" strokeWidth="1.5" />
              <rect x="4" y="6" width="14" height="3" rx="1.5" fill="#16A34A" />
              <rect x="4" y="12" width="20" height="2" rx="1" fill="#86EFAC" />
              <rect x="4" y="16" width="18" height="2" rx="1" fill="#86EFAC" />
              <rect x="4" y="20" width="16" height="2" rx="1" fill="#BBF7D0" />
              <circle cx="20" cy="28" r="4" fill="#16A34A" />
            </g>
            
            {/* Floating Biometric Badge Right */}
            <g transform="translate(158, 62) rotate(8)">
              <rect width="30" height="30" rx="8" fill="#FFFFFF" stroke="#4ADE80" strokeWidth="1.5" />
              <circle cx="15" cy="12" r="5" fill="#86EFAC" />
              <path d="M 8 24 Q 15 19 22 24" stroke="#16A34A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>
            
            {/* Sparkles & Star Accents */}
            <path d="M 46 28 L 48 22 L 50 28 L 56 30 L 50 32 L 48 38 L 46 32 L 40 30 Z" fill="#4ADE80" />
            <path d="M 174 36 L 175.5 31 L 177 36 L 182 37.5 L 177 39 L 175.5 44 L 174 39 L 169 37.5 Z" fill="#4ADE80" />
            <circle cx="70" cy="136" r="3" fill="#86EFAC" />
            <circle cx="156" cy="132" r="3" fill="#86EFAC" />
          </svg>
        </div>
      )

    case 'intro-wajah':
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="21" stroke="#4ADE80" strokeWidth="1.2" strokeDasharray="4 3" />
          <ellipse cx="28" cy="25" rx="12" ry="13.5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
          <circle cx="24" cy="22" r="1.8" fill="#15803D" />
          <circle cx="32" cy="22" r="1.8" fill="#15803D" />
          <path d="M 24 28 Q 28 32 32 28" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 16 46 Q 16 38 28 37 Q 40 38 40 46" stroke="#16A34A" strokeWidth="1.5" fill="#DCFCE7" />
        </svg>
      )

    case 'intro-ktp':
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
          <rect x="10" y="17" width="36" height="23" rx="4" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
          <rect x="10" y="17" width="36" height="6" rx="4" fill="#BBF7D0" />
          <rect x="14" y="26" width="9" height="10" rx="1.5" fill="#86EFAC" />
          <rect x="25" y="26" width="16" height="2" rx="1" fill="#16A34A" />
          <rect x="25" y="30" width="12" height="1.8" rx="0.9" fill="#4ADE80" />
          <rect x="25" y="33.5" width="14" height="1.8" rx="0.9" fill="#4ADE80" />
        </svg>
      )

    case 'intro-selfie':
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
          <rect x="16" y="11" width="24" height="34" rx="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
          <circle cx="28" cy="22" r="5" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.2" />
          <circle cx="26" cy="21" r="0.8" fill="#15803D" />
          <circle cx="30" cy="21" r="0.8" fill="#15803D" />
          <rect x="19" y="31" width="18" height="9" rx="2" fill="#FFFFFF" stroke="#4ADE80" strokeWidth="1" />
          <rect x="21" y="33" width="4" height="5" rx="0.8" fill="#86EFAC" />
          <rect x="27" y="34" width="8" height="1.2" fill="#16A34A" />
          <rect x="27" y="36.5" width="6" height="1.2" fill="#86EFAC" />
        </svg>
      )

    default:
      return null
  }
}

// ── 2. STANDARDIZED CAMERA HEADER ────────────────────────────
function CameraHeader({ title, subtitle, stepNum, totalSteps, onBack }) {
  const progressPercent = (stepNum / totalSteps) * 100

  return (
    <div
      className="flex-shrink-0 relative select-none z-20"
      style={{
        background: 'linear-gradient(180deg, rgba(6, 26, 13, 0.95) 0%, rgba(6, 26, 13, 0.75) 75%, transparent 100%)',
      }}
    >
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition active:scale-95 text-white"
          style={{
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          aria-label="Kembali"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="text-center min-w-0 flex-1">
          <p className="text-[14.5px] font-extrabold text-white leading-tight tracking-tight truncate">
            {title}
          </p>
          <p className="text-[11px] text-emerald-300 font-semibold tracking-wide truncate mt-0.5">
            {subtitle}
          </p>
        </div>

        <span className="text-[11px] text-white font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/10 flex-shrink-0">
          {stepNum} dari {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/15 w-full flex-shrink-0">
        <div
          className="h-full bg-[#4ADE80] rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

// ── 3. CAMERA SHUTTER BUTTON ─────────────────────────────────
function CaptureButton({ onClick, label = 'Ketuk untuk mengambil foto' }) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-label="Ambil Gambar"
        onClick={onClick}
        className="w-16 h-16 rounded-full active:scale-95 transition-all flex items-center justify-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)',
          boxShadow: '0 0 0 4px rgba(74,222,128,0.35), 0 6px 20px rgba(12,62,30,0.55)',
        }}
      >
        <Camera size={24} className="text-white" />
      </button>
      {label && <span className="text-white/75 text-[11.5px] mt-2 font-medium">{label}</span>}
    </div>
  )
}

// ── 4. CAMERA ERROR & FALLBACK OVERLAY ────────────────────────
function CameraErrorOverlay({ onRetry, onSimulate }) {
  return (
    <div className="absolute inset-0 z-30 bg-black/92 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3">
        <AlertTriangle size={32} className="text-amber-400" />
      </div>
      <p className="text-white font-extrabold text-[16px]">Kamera Belum Terhubung</p>
      <p className="text-white/70 text-[12px] mt-1.5 max-w-xs leading-relaxed">
        Pastikan browser memiliki izin mengakses kamera perangkat Anda, atau gunakan mode simulasi untuk melanjutkan pengujian.
      </p>
      <div className="mt-5 flex flex-col gap-2.5 w-full max-w-xs">
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-2.5 rounded-xl bg-[#1B6B3A] text-white font-bold text-[13px] active:scale-95 transition flex items-center justify-center gap-2 hover:bg-[#15522D]"
        >
          <RefreshCw size={14} />
          <span>Coba Hubungkan Kamera</span>
        </button>
        {onSimulate && (
          <button
            type="button"
            onClick={onSimulate}
            className="w-full py-2.5 rounded-xl bg-white/15 text-white/90 font-semibold text-[12.5px] active:scale-95 transition border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20"
          >
            <Play size={13} className="text-emerald-400" />
            <span>Simulasikan Berhasil (Demo)</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ── 5. FLASH OVERLAY ─────────────────────────────────────────
function FlashOverlay({ show }) {
  return (
    <div
      className="absolute inset-0 bg-white pointer-events-none z-30"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    />
  )
}

// ── MAIN COMPONENT: VERIFIKASI ───────────────────────────────
export default function Verifikasi({ navigate, userData, updateUser, userProfile }) {
  // Steps: 'intro' | 'wajah' | 'wajah-sukses' | 'ktp' | 'ktp-sukses' | 'selfie' | 'selfie-sukses' | 'selesai'
  const [step, setStep] = useState('intro')
  const [pose, setPose] = useState(0)

  // State auto-advance countdown liveness
  const [countdown, setCountdown] = useState(3)
  const [scanning, setScanning] = useState(false)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [cameraError, setCameraError] = useState(false)
  const [capturing, setCapturing] = useState(false)

  // 5 Gerakan KYC Liveness standar
  const POSES = [
    {
      id: 'depan',
      label: 'Hadap Depan',
      hint: 'Tatap kamera secara langsung lurus ke depan',
      icon: '👤',
    },
    {
      id: 'kiri',
      label: 'Tengok Kiri',
      hint: 'Putar kepala perlahan ke arah kiri',
      icon: '👈',
    },
    {
      id: 'kanan',
      label: 'Tengok Kanan',
      hint: 'Putar kepala perlahan ke arah kanan',
      icon: '👉',
    },
    {
      id: 'atas',
      label: 'Tengadah',
      hint: 'Arahkan wajah perlahan sedikit ke atas',
      icon: '👆',
    },
    {
      id: 'bawah',
      label: 'Tunduk',
      hint: 'Arahkan wajah perlahan sedikit ke bawah',
      icon: '👇',
    },
  ]

  // Definisi langkah verifikasi untuk stepper intro
  const STEPS = [
    { num: 1, label: 'Pindai Wajah', sub: 'Liveness' },
    { num: 2, label: 'Foto e-KTP', sub: 'Dokumen' },
    { num: 3, label: 'Selfie + KTP', sub: 'Validasi' },
  ]

  // Start kamera nyata dengan WebRTC getUserMedia
  const startCamera = async (facing = 'user') => {
    try {
      setCameraError(false)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      streamRef.current = s
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.play().catch(() => {})
      }
    } catch (err) {
      console.warn('Camera access error or unsupported in environment:', err)
      setCameraError(true)
    }
  }

  // Hentikan stream kamera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // Efek flash saat tombol shutter ditekan
  const handleCapture = () => {
    setCapturing(true)
    setTimeout(() => setCapturing(false), 300)
  }

  // Sinkronisasi videoRef saat stream terupdate
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [stream])

  // Auto start/stop kamera sesuai step aktif
  useEffect(() => {
    const cameraSteps = ['wajah', 'ktp', 'selfie']
    if (step === 'wajah') {
      startCamera('user')
    } else if (step === 'ktp') {
      startCamera('environment')
    } else if (step === 'selfie') {
      startCamera('user')
    } else if (!cameraSteps.includes(step)) {
      stopCamera()
    }
  }, [step])

  // Auto-advance liveness detection: 2 detik per pose
  useEffect(() => {
    if (step !== 'wajah' || cameraError) return

    // Mulai scanning setelah kamera siap
    const startDelay = setTimeout(() => setScanning(true), 800)

    return () => clearTimeout(startDelay)
  }, [step, cameraError, pose])

  useEffect(() => {
    if (step !== 'wajah' || !scanning) return

    setCountdown(3)

    // Hitung mundur 3-2-1
    const tick1 = setTimeout(() => setCountdown(2), 700)
    const tick2 = setTimeout(() => setCountdown(1), 1400)
    const tick3 = setTimeout(() => {
      setCountdown(3)
      setScanning(false)
      if (pose < POSES.length - 1) {
        setPose((p) => p + 1)
        setTimeout(() => setScanning(true), 400)
      } else {
        // Semua 5 pose selesai
        stopCamera()
        setStep('wajah-sukses')
        setPose(0)
      }
    }, 2100)

    return () => {
      clearTimeout(tick1)
      clearTimeout(tick2)
      clearTimeout(tick3)
    }
  }, [scanning, pose, step, POSES.length])

  // Cleanup kamera saat unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 1: INTRO (Halaman Awal Verifikasi Data Diri) ───────
  // ═════════════════════════════════════════════════════════════
  if (step === 'intro') {
    return (
      <div className="h-full flex flex-col bg-[#FAFBF9] overflow-hidden select-none">
        {/* Header terstandarisasi G-Village */}
        <ScreenHeader
          title="Verifikasi Data Diri"
          subtitle="Identitas Resmi Warga Global Village"
          onBack={() => navigate('profile')}
        />

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-4">
          <div className="flex flex-col items-center py-2">
            {/* Hero Icon Card */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shadow-xs mb-3">
              <ShieldCheck size={36} className="text-[#1B6B3A]" />
            </div>

            {/* Judul & Subjudul */}
            <h2 className="text-[17.5px] font-extrabold text-surface-900 text-center leading-snug">
              Verifikasi Sekali, Nikmati Semua Fitur
            </h2>
            <p className="text-[12px] text-surface-500 text-center mt-1.5 max-w-xs leading-relaxed">
              Proses cepat hanya 2–3 menit langsung dari smartphone Anda tanpa formulir berbelit.
            </p>

            {/* Stepper Horizontal 3 Langkah */}
            <div className="flex items-start justify-center gap-0 w-full max-w-sm mt-5 px-3">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center" style={{ minWidth: '70px' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-[13px] shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 100%)',
                      }}
                    >
                      {s.num}
                    </div>
                    <p className="text-[#14532D] text-[11px] font-bold mt-1.5 text-center leading-tight">
                      {s.label}
                    </p>
                    <p className="text-surface-400 text-[10px] text-center mt-0.5">
                      {s.sub}
                    </p>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] mt-4 bg-gradient-to-r from-emerald-400 to-emerald-200 rounded-full" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 3 Ilustrasi Preview Terstandarisasi */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-5 px-1">
              <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-surface-200/80 shadow-2xs">
                <VerificationIllustration type="intro-wajah" />
                <span className="text-[10px] text-surface-600 font-bold mt-1.5 text-center">
                  1. Liveness Wajah
                </span>
              </div>
              <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-surface-200/80 shadow-2xs">
                <VerificationIllustration type="intro-ktp" />
                <span className="text-[10px] text-surface-600 font-bold mt-1.5 text-center">
                  2. Foto e-KTP
                </span>
              </div>
              <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-surface-200/80 shadow-2xs">
                <VerificationIllustration type="intro-selfie" />
                <span className="text-[10px] text-surface-600 font-bold mt-1.5 text-center">
                  3. Selfie + KTP
                </span>
              </div>
            </div>

            {/* Card Manfaat Verifikasi */}
            <div className="w-full max-w-sm mt-4 bg-white rounded-2xl p-3.5 border border-surface-200/80 shadow-2xs">
              <p className="text-[10px] font-bold text-surface-400 tracking-wider mb-2.5 uppercase">
                KEUNTUNGAN AKUN TERVERIFIKASI
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1B6B3A] flex items-center justify-center flex-shrink-0">
                    <Wallet size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-surface-900 leading-snug">
                      GV Pay Bebas Limit
                    </p>
                    <p className="text-[10.5px] text-surface-500 leading-snug">
                      Transaksi, bayar tagihan & transfer tanpa batas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Store size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-surface-900 leading-snug">
                      Buka Toko di ESTO
                    </p>
                    <p className="text-[10.5px] text-surface-500 leading-snug">
                      Mulai jualan produk desa ke ribuan warga
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Tv2 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-surface-900 leading-snug">
                      Kreator & Siaran GV
                    </p>
                    <p className="text-[10.5px] text-surface-500 leading-snug">
                      Akses monetisasi konten video & live streaming
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="w-full max-w-sm mx-auto pt-2 pb-1">
            <button
              type="button"
              onClick={() => {
                setPose(0)
                setScanning(false)
                setStep('wajah')
              }}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                boxShadow: '0 4px 14px rgba(27,107,58,0.35)',
              }}
            >
              <span>Mulai Verifikasi Sekarang</span>
              <ChevronRight size={18} />
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-surface-500">
              <Lock size={12} className="text-emerald-700" />
              <span>Data Anda terenkripsi 256-bit dan dilindungi undang-undang</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 2: WAJAH (Liveness Detection - 5 Pose) ───────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'wajah') {
    return (
      <div className="flex flex-col h-full bg-black overflow-hidden relative select-none">
        {/* Header */}
        <CameraHeader
          title="Pindai Wajah"
          subtitle="Liveness Biometrik"
          stepNum={1}
          totalSteps={3}
          onBack={() => {
            stopCamera()
            setStep('intro')
            setPose(0)
            setScanning(false)
          }}
        />

        {/* Instruksi Atas */}
        <div className="flex-shrink-0 text-center px-6 py-2 z-10">
          <h2 className="font-bold text-white text-[15px] leading-tight">
            Posisikan Wajah dalam Bingkai
          </h2>
          <p className="text-white/60 text-[11.5px] mt-0.5 leading-relaxed">
            Ikuti gerakan kepala di bawah untuk membuktikan keaslian identitas
          </p>
        </div>

        {/* Viewfinder Area Tengah */}
        <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Radial Shadow Cutout */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 58% 46% at 50% 44%, transparent 100%, rgba(0,0,0,0.72) 100%)',
            }}
          />

          {/* Oval Viewfinder Border (Tanpa floating badge yang keluar batas) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-5">
            <div
              className="relative w-[210px] h-[270px] rounded-[50%] transition-all duration-300"
              style={{
                border: scanning ? '2.5px solid #4ADE80' : '2.5px solid rgba(255,255,255,0.4)',
                boxShadow: scanning
                  ? '0 0 24px rgba(74,222,128,0.35)'
                  : '0 0 12px rgba(0,0,0,0.5)',
              }}
            >
              {/* Subtle scanner line */}
              {scanning && (
                <div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#4ADE80] to-transparent animate-pulse"
                  style={{ top: '48%' }}
                />
              )}
            </div>
          </div>

          {/* Pose Instruction Card Terintegrasi (Center-bottom) */}
          <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center px-4 z-10 pointer-events-none">
            <div className="bg-black/75 backdrop-blur-md rounded-2xl px-5 py-2.5 text-center border border-white/15 shadow-xl max-w-xs w-full">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>GERAKAN KE-{pose + 1} DARI {POSES.length}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[18px]">{POSES[pose]?.icon}</span>
                <p className="text-white font-extrabold text-[15.5px]">
                  {POSES[pose]?.label}
                </p>
              </div>

              <p className="text-white/70 text-[11.5px] mt-0.5 leading-snug">
                {POSES[pose]?.hint}
              </p>

              {/* 5 Dot progress indicators */}
              <div className="flex justify-center gap-2 mt-2">
                {POSES.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i < pose
                          ? '#4ADE80'
                          : i === pose
                          ? '#FFFFFF'
                          : 'rgba(255,255,255,0.25)',
                      transform: i === pose ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scanning / Countdown Ring Indicator */}
          {scanning && (
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center z-10 pointer-events-none">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 3)}`}
                    style={{ transition: 'stroke-dashoffset 0.7s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-extrabold text-[17px]">{countdown}</span>
                </div>
              </div>
              <p className="text-white/60 text-[10.5px] mt-1 font-medium">
                Mendeteksi secara otomatis...
              </p>
            </div>
          )}

          {!scanning && !cameraError && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 rounded-full px-3.5 py-1.5 border border-white/10 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-[11.5px] font-medium">Memposisikan kamera...</span>
              </div>
            </div>
          )}

          <FlashOverlay show={capturing} />
          {cameraError && (
            <CameraErrorOverlay
              onRetry={() => startCamera('user')}
              onSimulate={() => {
                stopCamera()
                setStep('wajah-sukses')
                setPose(0)
              }}
            />
          )}
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 3: WAJAH-SUKSES (Verifikasi Liveness Berhasil) ────
  // ═════════════════════════════════════════════════════════════
  if (step === 'wajah-sukses') {
    return (
      <div className="flex flex-col h-full bg-white select-none">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 flex items-center justify-between border-b border-surface-100">
          <button
            type="button"
            onClick={() => {
              setPose(0)
              setScanning(false)
              setStep('wajah')
            }}
            className="flex items-center gap-1.5 text-surface-500 text-[12px] font-medium hover:text-surface-800 transition"
          >
            <RotateCcw size={14} />
            <span>Pindai Ulang</span>
          </button>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Tahap 1 Selesai
          </span>
        </div>

        {/* Konten Utama Terpusat */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <VerificationIllustration type="wajah-sukses" />

          <h2 className="font-extrabold text-[19px] text-surface-900 mt-3">
            Wajah Terverifikasi!
          </h2>
          
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[11.5px] font-bold mt-1.5 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>5 dari 5 Gerakan Liveness Berhasil</span>
          </div>

          <p className="text-[12.5px] text-surface-500 leading-relaxed mt-3 max-w-xs">
            Liveness biometrik Anda telah terverifikasi secara akurat. Lanjutkan ke langkah berikutnya untuk memotret dokumen e-KTP.
          </p>

          <div className="flex items-center gap-1.5 bg-surface-50 border border-surface-200/80 rounded-xl px-3 py-2 mt-4 max-w-xs text-left">
            <Shield size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="text-[11px] text-surface-600 font-medium">
              Data biometrik diproses terenkripsi dan tidak dibagikan ke pihak ketiga
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-6 space-y-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setStep('ktp')}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] transition active:scale-[0.98] shadow-md flex items-center justify-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
              boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
            }}
          >
            <span>Lanjut ke Foto KTP</span>
            <ChevronRight size={17} />
          </button>

          <button
            type="button"
            onClick={() => {
              setPose(0)
              setScanning(false)
              setStep('wajah')
            }}
            className="w-full py-3 rounded-xl bg-surface-50 text-surface-600 font-semibold text-[13px] border border-surface-200 transition active:scale-[0.98] text-center hover:bg-surface-100"
          >
            ↺ Pindai Ulang Wajah
          </button>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 4: KTP (Foto e-KTP Asli) ─────────────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'ktp') {
    return (
      <div className="flex flex-col h-full bg-black overflow-hidden relative select-none">
        {/* Header */}
        <CameraHeader
          title="Foto e-KTP"
          subtitle="Dokumen Identitas Asli"
          stepNum={2}
          totalSteps={3}
          onBack={() => {
            stopCamera()
            setStep('wajah-sukses')
          }}
        />

        {/* Instruksi & Indikator Kualitas */}
        <div className="flex-shrink-0 text-center px-4 py-2 z-10">
          <h2 className="font-bold text-white text-[15px] leading-tight">
            Ambil Foto e-KTP Asli
          </h2>
          <p className="text-white/60 text-[11.5px] mt-0.5 leading-relaxed">
            Letakkan KTP di permukaan datar dan pastikan seluruh teks terbaca
          </p>

          {/* 3 Quality Indicators */}
          <div className="flex justify-center gap-3 py-1.5 mt-1">
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-white/80 text-[10.5px] font-medium border border-white/10">
              <Sun size={12} className="text-amber-400" />
              <span>Cukup Cahaya</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-white/80 text-[10.5px] font-medium border border-white/10">
              <Maximize2 size={12} className="text-emerald-400" />
              <span>Tidak Miring</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-white/80 text-[10.5px] font-medium border border-white/10">
              <FileText size={12} className="text-blue-400" />
              <span>Teks Terbaca</span>
            </div>
          </div>
        </div>

        {/* Viewfinder e-KTP Proporsional (ID-1 Aspect Ratio 1.58:1) */}
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Semi-transparent dark mask overlay */}
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          {/* Viewfinder Box e-KTP (Center, Clean corner markers) */}
          <div className="relative w-[88%] max-w-[340px] aspect-[1.58/1] rounded-xl pointer-events-none z-10 flex items-center justify-center">
            {/* Cutout clear glass effect */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                border: '2px dashed rgba(74, 222, 128, 0.75)',
              }}
            />

            {/* 4 Corner Markers */}
            <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-l-[3px] border-t-[3px] border-emerald-400 rounded-tl-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-r-[3px] border-t-[3px] border-emerald-400 rounded-tr-lg" />
            <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-l-[3px] border-b-[3px] border-emerald-400 rounded-bl-lg" />
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-r-[3px] border-b-[3px] border-emerald-400 rounded-br-lg" />

            {/* Subtle internal guide mockup */}
            <div className="absolute top-3 left-3 w-10 h-12 rounded border border-white/20 bg-white/5" />
            <div className="absolute top-4 left-16 right-4 space-y-1.5">
              <div className="h-1.5 w-3/4 bg-white/20 rounded" />
              <div className="h-1.5 w-1/2 bg-white/15 rounded" />
              <div className="h-1.5 w-2/3 bg-white/15 rounded" />
            </div>
          </div>

          <FlashOverlay show={capturing} />
          {cameraError && (
            <CameraErrorOverlay
              onRetry={() => startCamera('environment')}
              onSimulate={() => {
                stopCamera()
                setStep('ktp-sukses')
              }}
            />
          )}
        </div>

        {/* Capture Button Footer */}
        <div className="bg-gradient-to-t from-black/85 via-black/60 to-transparent py-5 flex-shrink-0 z-10 flex flex-col items-center">
          <CaptureButton
            onClick={() => {
              handleCapture()
              setTimeout(() => {
                stopCamera()
                setStep('ktp-sukses')
              }, 350)
            }}
            label="Ketuk untuk memotret e-KTP"
          />
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 5: KTP-SUKSES (Hasil Foto e-KTP) ─────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'ktp-sukses') {
    return (
      <div className="flex flex-col h-full bg-white select-none">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 flex items-center justify-between border-b border-surface-100">
          <button
            type="button"
            onClick={() => setStep('ktp')}
            className="flex items-center gap-1.5 text-surface-500 text-[12px] font-medium hover:text-surface-800 transition"
          >
            <RotateCcw size={14} />
            <span>Ambil Ulang</span>
          </button>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Tahap 2 Selesai
          </span>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <VerificationIllustration type="ktp-sukses" />

          <h2 className="font-extrabold text-[19px] text-surface-900 mt-3">
            Foto KTP Berhasil!
          </h2>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[11.5px] font-bold mt-1.5 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Kualitas Dokumen Memenuhi Standar</span>
          </div>

          <p className="text-[12.5px] text-surface-500 leading-relaxed mt-3 max-w-xs">
            Data NIK dan foto e-KTP Anda terbaca dengan jelas. Lanjutkan ke langkah terakhir yaitu foto selfie bersama e-KTP.
          </p>

          <div className="flex items-center gap-1.5 bg-surface-50 border border-surface-200/80 rounded-xl px-3 py-2 mt-4 max-w-xs text-left">
            <Shield size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="text-[11px] text-surface-600 font-medium">
              Data e-KTP diproteksi dengan enkripsi end-to-end sesuai standar regulasi
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-6 space-y-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setStep('selfie')}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] transition active:scale-[0.98] shadow-md flex items-center justify-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
              boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
            }}
          >
            <span>Lanjut ke Selfie + KTP</span>
            <ChevronRight size={17} />
          </button>

          <button
            type="button"
            onClick={() => setStep('ktp')}
            className="w-full py-3 rounded-xl bg-surface-50 text-surface-600 font-semibold text-[13px] border border-surface-200 transition active:scale-[0.98] text-center hover:bg-surface-100"
          >
            ↺ Ambil Ulang Foto KTP
          </button>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 6: SELFIE (Selfie + e-KTP) ───────────────────────
  // ═════════════════════════════════════════════════════════════
  if (step === 'selfie') {
    return (
      <div className="flex flex-col h-full bg-black overflow-hidden relative select-none">
        {/* Header */}
        <CameraHeader
          title="Selfie + e-KTP"
          subtitle="Validasi Pemilik Akun"
          stepNum={3}
          totalSteps={3}
          onBack={() => {
            stopCamera()
            setStep('ktp-sukses')
          }}
        />

        {/* Instruksi */}
        <div className="flex-shrink-0 text-center px-6 py-2 z-10">
          <h2 className="font-bold text-white text-[15px] leading-tight">
            Selfie Memegang e-KTP
          </h2>
          <p className="text-white/60 text-[11.5px] mt-0.5 leading-relaxed">
            Pegang KTP di depan dada, pastikan wajah dan teks e-KTP terlihat jelas
          </p>
        </div>

        {/* Viewfinder Dual-Zone Terintegrasi (Tanpa floating badge yang menumpuk) */}
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Masking overlay */}
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          {/* Structured Viewfinder Guide (Integrated Frame) */}
          <div className="relative w-[88%] max-w-[340px] h-[78%] rounded-2xl pointer-events-none z-10 flex flex-col items-center justify-between p-3.5">
            {/* Cutout box shadow */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                border: '2px solid rgba(74, 222, 128, 0.85)',
              }}
            />

            {/* 4 Corner Markers */}
            <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-l-[3px] border-t-[3px] border-emerald-400 rounded-tl-xl" />
            <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-r-[3px] border-t-[3px] border-emerald-400 rounded-tr-xl" />
            <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-l-[3px] border-b-[3px] border-emerald-400 rounded-bl-xl" />
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-r-[3px] border-b-[3px] border-emerald-400 rounded-br-xl" />

            {/* Upper Zone: Face Oval Guide */}
            <div className="w-[140px] h-[170px] rounded-[50%] border-2 border-dashed border-emerald-400/60 flex items-center justify-center mt-2">
              <span className="text-[10px] font-bold tracking-wider text-emerald-300/80 uppercase">
                Area Wajah
              </span>
            </div>

            {/* Lower Zone: KTP Box Guide */}
            <div className="w-[180px] h-[105px] rounded-xl border-2 border-dashed border-emerald-400/60 flex items-center justify-center mb-1">
              <span className="text-[10px] font-bold tracking-wider text-emerald-300/80 uppercase">
                Pegang e-KTP di Sini
              </span>
            </div>
          </div>

          <FlashOverlay show={capturing} />
          {cameraError && (
            <CameraErrorOverlay
              onRetry={() => startCamera('user')}
              onSimulate={() => {
                stopCamera()
                setStep('selfie-sukses')
              }}
            />
          )}
        </div>

        {/* Capture Button Footer */}
        <div className="bg-gradient-to-t from-black/85 via-black/60 to-transparent py-5 flex-shrink-0 z-10 flex flex-col items-center">
          <CaptureButton
            onClick={() => {
              handleCapture()
              setTimeout(() => {
                stopCamera()
                setStep('selfie-sukses')
              }, 350)
            }}
            label="Ketuk untuk ambil selfie + KTP"
          />
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 7: SELFIE-SUKSES (State Sukses Setelah Selfie) ────
  // ═════════════════════════════════════════════════════════════
  if (step === 'selfie-sukses') {
    return (
      <div className="flex flex-col h-full bg-white select-none">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 flex items-center justify-between border-b border-surface-100">
          <button
            type="button"
            onClick={() => setStep('selfie')}
            className="flex items-center gap-1.5 text-surface-500 text-[12px] font-medium hover:text-surface-800 transition"
          >
            <RotateCcw size={14} />
            <span>Ambil Ulang</span>
          </button>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Tahap 3 Selesai
          </span>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <VerificationIllustration type="selfie-sukses" />

          <h2 className="font-extrabold text-[19px] text-surface-900 mt-3">
            Selfie + KTP Berhasil!
          </h2>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[11.5px] font-bold mt-1.5 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Semua 3 Tahap Verifikasi Telah Lengkap</span>
          </div>

          <p className="text-[12.5px] text-surface-500 leading-relaxed mt-3 max-w-xs">
            Wajah dan dokumen e-KTP Anda terlihat jelas dalam satu frame. Seluruh berkas siap dikirimkan untuk peninjauan resmi.
          </p>

          <div className="flex items-center gap-1.5 bg-surface-50 border border-surface-200/80 rounded-xl px-3 py-2 mt-4 max-w-xs text-left">
            <Shield size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="text-[11px] text-surface-600 font-medium">
              Data Anda siap dikirimkan secara aman ke tim verifikator Global Village
            </span>
          </div>
        </div>

        {/* Action Buttons: Primary "Kirim untuk Ditinjau" */}
        <div className="px-4 pb-6 space-y-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              updateUser?.({ verificationStatus: 'pending' })
              setStep('selesai')
            }}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] transition active:scale-[0.98] shadow-md flex items-center justify-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
              boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
            }}
          >
            <span>Kirim untuk Ditinjau</span>
            <ChevronRight size={17} />
          </button>

          <button
            type="button"
            onClick={() => setStep('selfie')}
            className="w-full py-3 rounded-xl bg-surface-50 text-surface-600 font-semibold text-[13px] border border-surface-200 transition active:scale-[0.98] text-center hover:bg-surface-100"
          >
            ↺ Ambil Ulang Selfie
          </button>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // ── SCREEN 8: SELESAI (Data Berhasil Terkirim) ───────────────
  // ═════════════════════════════════════════════════════════════
  return (
    <div className="h-full flex flex-col bg-[#FAFBF9] overflow-y-auto select-none px-5 py-6">
      <div className="my-auto flex flex-col items-center text-center py-4">
        {/* 1. Ilustrasi Sukses Modular */}
        <VerificationIllustration type="selesai" />

        {/* 2. Judul Utama */}
        <h2 className="font-extrabold text-[21px] text-surface-900 mt-4 tracking-tight leading-tight">
          Data Berhasil Terkirim!
        </h2>

        {/* 3. Penjelasan Singkat Peninjauan */}
        <p className="text-[12.5px] text-surface-500 mt-2 px-2 max-w-xs leading-relaxed">
          Dokumen verifikasi identitas Anda telah kami terima dan sedang ditinjau oleh tim verifikator Global Village.
        </p>

        {/* 4. Card Informasi Estimasi Proses (SLA) */}
        <div className="w-full max-w-sm mt-5 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/40 p-4 text-left shadow-2xs">
          <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-amber-200/60">
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Clock size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-[13px] text-amber-900 leading-tight">
                Estimasi 1–2 Hari Kerja
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                Pemeriksaan dokumen identitas resmi
              </p>
            </div>
          </div>
          <p className="text-[11.5px] text-amber-800/90 leading-relaxed">
            Anda akan menerima notifikasi otomatis segera setelah status akun Anda disetujui. Selama menunggu, Anda tetap dapat menjelajahi komunitas dan pasar GV.
          </p>
        </div>

        {/* 5. Informasi Keamanan & Privacy */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-surface-500">
          <ShieldCheck size={13} className="text-emerald-700 flex-shrink-0" />
          <span>Privasi data e-KTP dan biometrik Anda dilindungi UU Perlindungan Data Pribadi</span>
        </div>
      </div>

      {/* 6 & 7. Action Buttons */}
      <div className="w-full max-w-sm mx-auto space-y-2.5 pt-2 pb-2">
        <button
          type="button"
          onClick={() => navigate('profile')}
          className="w-full py-3.5 rounded-xl text-white font-bold text-[14.5px] shadow-md active:scale-[0.98] transition text-center"
          style={{
            background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
            boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
          }}
        >
          Kembali ke Profil Saya
        </button>

        <button
          type="button"
          onClick={() => navigate('beranda')}
          className="w-full py-3 rounded-xl bg-white text-surface-700 font-semibold text-[13px] border border-surface-200/80 active:scale-[0.98] transition text-center hover:bg-surface-50 shadow-2xs"
        >
          Ke Halaman Beranda
        </button>
      </div>
    </div>
  )
}
