import React, { useState } from 'react'
import { User, Phone, Lightbulb } from 'lucide-react'
import OnboardingLayout from '@/components/templates/OnboardingLayout'
import AppButton from '@/components/atoms/AppButton'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

export default function Register({ navigate, userData, updateUser }) {
  const [name, setName]   = useState(userData.name)
  const [phone, setPhone] = useState(userData.phone)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim())       e.name  = 'Nama tidak boleh kosong'
    if (phone.length < 10)  e.phone = 'Nomor HP minimal 10 digit'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    updateUser({ name: name.trim(), phone })
    navigate('otp')
  }

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={4}
      title="Buat Akun Baru"
      subtitle="Bergabunglah dengan ekosistem digital desa masa depan"
      onBack={() => navigate('welcome')}
      footer={
        <div>
          <AppButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
          >
            Lanjutkan Verifikasi
          </AppButton>
          <p className="text-center text-[11px] text-surface-400 mt-2.5 leading-relaxed">
            Dengan mendaftar, kamu menyetujui{' '}
            <span className="text-brand font-semibold">Syarat & Ketentuan</span> G-Village.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 animate-fade-in pt-1">
        <div>
          <label className="block text-[13px] font-bold text-surface-800 mb-1.5">
            Nama Lengkap
          </label>
          <div
            className={`flex items-center gap-3 border-2 rounded-2xl px-3.5 py-3 transition-all ${
              errors.name
                ? 'border-red-400 bg-red-50/50'
                : name
                ? 'border-brand bg-brand/5 shadow-brand-xs'
                : 'border-surface-200 bg-surface-50 focus-within:border-brand focus-within:bg-white'
            }`}
          >
            <User size={18} className={name ? 'text-brand' : 'text-surface-400'} />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="flex-1 text-[13.5px] font-medium text-surface-900 placeholder-surface-400 outline-none bg-transparent"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-[11px] font-semibold mt-1 ms-1 animate-slide-up">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-bold text-surface-800 mb-1.5">
            Nomor WhatsApp / HP
          </label>
          <div
            className={`flex items-center gap-2.5 border-2 rounded-2xl px-3.5 py-3 transition-all ${
              errors.phone
                ? 'border-red-400 bg-red-50/50'
                : phone
                ? 'border-brand bg-brand/5 shadow-brand-xs'
                : 'border-surface-200 bg-surface-50 focus-within:border-brand focus-within:bg-white'
            }`}
          >
            <div className="flex items-center gap-1.5 border-e border-surface-300 pe-2.5 flex-shrink-0">
              <Phone size={16} className="text-surface-400" />
              <span className="text-[13px] text-surface-700 font-bold tabular-nums">+62</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="8xx-xxxx-xxxx"
              maxLength={13}
              className="flex-1 text-[13.5px] font-medium text-surface-900 placeholder-surface-400 outline-none bg-transparent tabular-nums"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-[11px] font-semibold mt-1 ms-1 animate-slide-up">
              {errors.phone}
            </p>
          )}
          <p className="text-surface-500 text-[11.5px] mt-1.5 ms-1">
            Kode OTP verifikasi akan dikirim ke nomor ini.
          </p>
        </div>

        <div className="rounded-2xl p-3.5 bg-brand/5 border border-brand/15 mt-2 flex items-start gap-3">
          <SkeuoIcon icon={Lightbulb} gradient={['#F57F17', '#FBC02D']} size="xs" className="mt-0.5" />
          <p className="text-[11.5px] text-surface-700 leading-relaxed font-medium flex-1">
            <strong className="text-brand">Akun Terintegrasi</strong>: Satu akun G-Village untuk
            media, komunitas desa, belanja hasil bumi ESTO, dan dompet digital GV Pay.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  )
}

