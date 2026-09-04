import React, { useState, useRef, useEffect } from 'react'
import { Smartphone, CheckCircle } from 'lucide-react'
import OnboardingLayout from '@/components/templates/OnboardingLayout'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

export default function OTP({ navigate, userData }) {
  const [otp, setOtp]           = useState(['','','','','',''])
  const [countdown, setCd]      = useState(60)
  const [verified, setVerified] = useState(false)
  const refs = useRef([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCd(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
    if (next.every(d => d !== '')) {
      setTimeout(() => {
        setVerified(true)
        setTimeout(() => navigate('desa'), 700)
      }, 300)
    }
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      refs.current[5]?.focus()
      setTimeout(() => {
        setVerified(true)
        setTimeout(() => navigate('desa'), 700)
      }, 300)
    }
  }

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      title="Verifikasi OTP"
      subtitle="Pastikan nomor ponselmu aktif untuk menerima kode"
      onBack={() => navigate('register')}
      footer={
        <div className="text-center">
          <p className="text-[11.5px] text-surface-500 leading-relaxed font-medium">
            💡 Untuk prototype ini, masukkan 6 digit angka apa saja atau paste <code className="px-1.5 py-0.5 rounded bg-surface-100 text-brand font-bold">123456</code>.
          </p>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center flex-1 py-4 animate-fade-in" onPaste={handlePaste}>
        {/* Phone icon with modern tactile squircle */}
        <SkeuoIcon
          icon={Smartphone}
          gradient={['#1B5E20', '#2E7D32']}
          size="lg"
          className="mb-4"
        />

        <h2 className="text-[17px] font-extrabold text-surface-900 mb-1 text-center headline-tight">
          Masukkan 6 Digit OTP
        </h2>
        <p className="text-surface-500 text-[12.5px] text-center mb-1">
          Kode telah dikirim melalui SMS ke
        </p>
        <p className="font-bold text-surface-900 text-[13.5px] mb-6 tabular-nums tracking-wide">
          +62 {userData.phone || '8xx-xxxx-xxxx'}
        </p>

        {/* OTP digit inputs */}
        <div className="flex gap-2.5 mb-5 justify-center w-full max-w-[320px]">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => (refs.current[i] = el)}
              type="tel"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              className={`w-11 h-14 text-center text-[22px] font-extrabold rounded-2xl border-2 outline-none transition-all tabular-nums ${
                verified
                  ? 'border-green-500 bg-green-50/80 text-green-700'
                  : d
                  ? 'border-brand bg-brand/5 text-surface-900 shadow-brand-xs'
                  : 'border-surface-200 bg-surface-50 text-surface-900 focus:border-brand focus:bg-white'
              }`}
            />
          ))}
        </div>

        {verified ? (
          <div className="flex items-center gap-2 text-green-700 text-[13px] font-bold mb-4 animate-scale-in">
            <SkeuoIcon icon={CheckCircle} gradient={['#16a34a', '#15803d']} size="xs" shape="circle" />
            <span>Terverifikasi! Menuju pemilihan desa...</span>
          </div>
        ) : (
          <p className="text-surface-500 text-[12px] text-center mb-2">
            {countdown > 0 ? (
              <>
                Kirim ulang kode dalam{' '}
                <span className="font-bold text-brand tabular-nums">{countdown}s</span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setCd(60)}
                className="font-bold text-brand hover:underline"
              >
                Kirim Ulang Kode OTP
              </button>
            )}
          </p>
        )}
      </div>
    </OnboardingLayout>
  )
}

