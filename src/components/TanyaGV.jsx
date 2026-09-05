import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles, X, Mic, Send, Zap, CreditCard, Store, Tv2, ArrowRightLeft,
  Package, ChevronRight, Wheat, RefreshCw, ShieldCheck, ShoppingCart,
  MessageCircle, FileText, CloudSun, ArrowUpRight
} from 'lucide-react'

// ── Tiga Tombol Pertanyaan Cepat (Pola Gambar 2) ─────────────
const ALL_STARTER_PROMPTS = [
  // Halaman 1 (selaras dengan Gambar 2)
  [
    { icon: Zap,        text: 'Cara bayar tagihan listrik PLN?' },
    { icon: CreditCard, text: 'Cara Top Up saldo GV Pay?' },
    { icon: Store,      text: 'Cara buka toko di Pasar ESTO?' },
  ],
  // Halaman 2 (pertanyaan dari Gambar 1)
  [
    { icon: Wheat,      text: 'Tips pupuk kompos organik sendiri' },
    { icon: CloudSun,   text: 'Prakiraan cuaca & musim tanam?' },
    { icon: FileText,   text: 'Syarat surat pengantar dari desa?' },
  ],
]

// ── Basis Pengetahuan Respon Cerdas ─────────────────────────
const RESPONSES = {
  'Cara bayar tagihan listrik PLN?': {
    text: 'Untuk membayar tagihan atau token listrik PLN:\n\n1. Buka menu **Bayar** di beranda.\n2. Pilih kategori **Tagihan → Listrik PLN**.\n3. Masukkan ID Pelanggan atau nomor meter.\n4. Konfirmasi jumlah dan bayar dengan saldo **GV Pay**.',
    action: 'bayar',
    actionLabel: 'Buka Tagihan Listrik',
  },
  'Tips pupuk kompos organik sendiri': {
    text: 'Cara praktis membuat pupuk kompos dari limbah tani:\n\n• **Bahan**: Jerami kering, kotoran ternak, sisa daun hijau, dan EM4.\n• **Proses**: Susun berlapis, siram lembab (60%), aduk tiap 5–7 hari.\n• Dalam 3–4 minggu, kompos matang berbau tanah dan siap dipupukkan.',
    action: 'komunitas',
    actionLabel: 'Diskusi di Komunitas Tani',
  },
  'Cara buka toko di Pasar ESTO?': {
    text: 'Mulai jualan hasil bumi atau kerajinan di Pasar ESTO:\n\n1. Masuk ke menu **Profil Saya**.\n2. Ketuk **"Aktivasi Penjual"** (pendaftaran gratis).\n3. Lengkapi nama tokomu dan nomor rekening.\n4. Unggah foto produk panen dan langsung siap terima pesanan warga!',
    action: 'pasar',
    actionLabel: 'Buka Pasar ESTO',
  },
  'Cara Top Up saldo GV Pay?': {
    text: 'Isi saldo GV Pay dapat dilakukan melalui:\n\n• **Transfer Bank / VA**: BCA, Mandiri, BRI, BNI lewat m-banking.\n• **Scan QRIS**: Dari e-wallet atau perbankan manapun.\n• **Agen Desa**: Kunjungi toko kelontong bertanda agen GV Pay terdekat.',
    action: 'bayar',
    actionLabel: 'Buka Menu Top Up',
  },
  'Prakiraan cuaca & musim tanam?': {
    text: 'Kondisi cuaca wilayah agraris desa:\n\n☀️ **Cuaca**: Cerah berawan di pagi hari, potensi hujan ringan di sore hari.\n🌱 **Rekomendasi**: Sangat baik untuk pemupukan susulan padi serta penanaman sayuran hortikultura.',
    action: 'komunitas',
    actionLabel: 'Info Cuaca Komunitas',
  },
  'Syarat surat pengantar dari desa?': {
    text: 'Pengurusan surat pengantar administrasi desa:\n\n1. Siapkan salinan **KTP** dan **Kartu Keluarga (KK)**.\n2. Dapatkan surat pengantar awal dari Ketua RT/RW setempat.\n3. Kunjungi Balai Desa pada jam pelayanan (Senin–Jumat, 08.00–15.00 WIB).',
    action: null,
    actionLabel: null,
  },
}

const VOICE_SAMPLES = [
  'Cara bayar tagihan listrik PLN?',
  'Cara Top Up saldo GV Pay?',
  'Cara buka toko di Pasar ESTO?',
  'Tips pupuk kompos organik sendiri',
]

export default function TanyaGV({
  currentScreen = 'beranda',
  navigate,
  mode = 'fab',
  openFromParent,
  onCloseParent,
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openFromParent !== undefined
  const open = isControlled ? openFromParent : internalOpen
  const setOpen = (val) => {
    if (isControlled) {
      if (!val && onCloseParent) onCloseParent()
    } else {
      setInternalOpen(val)
    }
  }

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [promptPage, setPromptPage] = useState(0)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Inisialisasi percakapan: pesan sambutan mengarahkan ke pertanyaan di bawah
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          text: 'Halo! Mau bantuan apa? Pilih pertanyaan di bawah atau langsung bicara.',
          time: 'Baru saja',
        },
      ])
    }
  }, [open])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, processing])

  const findBotResponse = (query) => {
    const qLower = query.toLowerCase().trim()
    if (RESPONSES[query]) return RESPONSES[query]

    if (qLower.includes('listrik') || qLower.includes('pln') || qLower.includes('token')) {
      return RESPONSES['Cara bayar tagihan listrik PLN?']
    }
    if (qLower.includes('top up') || qLower.includes('topup') || qLower.includes('saldo') || qLower.includes('gv pay')) {
      return RESPONSES['Cara Top Up saldo GV Pay?']
    }
    if (qLower.includes('pupuk') || qLower.includes('kompos') || qLower.includes('tani') || qLower.includes('organik')) {
      return RESPONSES['Tips pupuk kompos organik sendiri']
    }
    if (qLower.includes('buka toko') || qLower.includes('pasar') || qLower.includes('jual') || qLower.includes('esto')) {
      return RESPONSES['Cara buka toko di Pasar ESTO?']
    }
    if (qLower.includes('cuaca') || qLower.includes('hujan') || qLower.includes('tanam') || qLower.includes('panen')) {
      return RESPONSES['Prakiraan cuaca & musim tanam?']
    }
    if (qLower.includes('surat') || qLower.includes('rt') || qLower.includes('rw') || qLower.includes('desa')) {
      return RESPONSES['Syarat surat pengantar dari desa?']
    }

    return {
      text: `Saya memahami pertanyaan Anda mengenai "${query}". Anda dapat menanyakan panduan bayar tagihan, top up GV Pay, tips pupuk pertanian, belanja di Pasar ESTO, atau surat administrasi desa.`,
      action: null,
      actionLabel: null,
    }
  }

  const sendMessage = (text) => {
    if (!text || !text.trim()) return
    const cleanText = text.trim()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { role: 'user', text: cleanText, voice: false, time: now }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setProcessing(true)

    setTimeout(() => {
      const resp = findBotResponse(cleanText)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: resp.text,
          action: resp.action,
          actionLabel: resp.actionLabel,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setProcessing(false)
    }, 650)
  }

  const handleVoice = () => {
    if (listening) {
      setListening(false)
    } else {
      setListening(true)
      const sample = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)]
      setTimeout(() => {
        setListening(false)
        sendMessage(sample)
      }, 2200)
    }
  }

  const handleAction = (screen) => {
    if (screen && navigate) {
      setOpen(false)
      setTimeout(() => navigate(screen), 200)
    }
  }

  return (
    <>
      {/* Inline Header Button Mode */}
      {mode === 'inline' && (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-[0.94] shadow-sm"
          style={{
            background: open
              ? 'linear-gradient(135deg, #0C3E1E, #1B6B3A)'
              : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
            border: '1px solid rgba(27,107,58,0.2)',
          }}
        >
          <Sparkles size={13} style={{ color: open ? '#fff' : '#1B6B3A' }} />
          <span
            className="font-bold text-[11.5px]"
            style={{ color: open ? '#fff' : '#1B6B3A' }}
          >
            Tanya GV
          </span>
        </button>
      )}

      {/* Bottom Sheet Modal */}
      {open && (
        <div
          className="absolute inset-0 z-40 flex flex-col justify-end backdrop-blur-xs animate-fade-in"
          style={{ background: 'rgba(8,20,13,0.50)' }}
        >
          {/* Backdrop Dismiss Area */}
          <div className="flex-1" onClick={() => setOpen(false)} />

          {/* Bottom Sheet Card */}
          <div
            className="flex flex-col animate-slide-up rounded-t-[28px] overflow-hidden bg-white"
            style={{
              height: '88%',
              boxShadow: '0 -8px 36px rgba(0,0,0,0.22)',
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2.5 pb-1 bg-white flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Slim, Elegant Header */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 60%, #1B6B3A 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-white/20 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E7D32)' }}
                >
                  <Sparkles size={17} className="text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-white text-[14.5px] tracking-tight">Tanya GV</p>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10.5px] text-emerald-100/75 font-medium">
                    {listening ? 'Mendengarkan suara...' : 'AI Asisten G-Village'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMessages([
                      {
                        role: 'bot',
                        text: 'Halo! Mau bantuan apa? Pilih pertanyaan di bawah atau langsung bicara.',
                        time: 'Baru saja',
                      },
                    ])
                    setPromptPage(0)
                  }}
                  title="Mulai obrolan baru"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  onClick={() => {
                    setOpen(false)
                    setListening(false)
                  }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Listening State Overlay (Clean & Minimal) */}
            {listening ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-8 bg-gradient-to-b from-emerald-50/40 to-white">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping" />
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
                  >
                    <Mic size={24} className="text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 h-8">
                  {[10, 20, 32, 18, 28, 36, 22, 12].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-emerald-600"
                      style={{
                        height: h,
                        animation: `waveMini 0.5s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-[13px] font-bold text-gray-900">Mendengarkan...</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Silakan bicara sekarang</p>
                </div>

                <button
                  onClick={() => setListening(false)}
                  className="px-4 py-2 rounded-xl text-[11.5px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform mt-1"
                >
                  Batalkan
                </button>
                <style>{`@keyframes waveMini{from{transform:scaleY(.3)}to{transform:scaleY(1.1)}}`}</style>
              </div>
            ) : (
              <>
                {/* Chat Stream (Area Percakapan Lapang & Bersih - Pola Gambar 2) */}
                <div className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-3.5 no-scrollbar bg-[#FAFBF9]">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        m.role === 'user' ? 'items-end' : 'items-start'
                      } stagger-in`}
                    >
                      <div
                        className={`flex items-start gap-2.5 max-w-[90%] ${
                          m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        {m.role === 'bot' ? (
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5"
                            style={{
                              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)',
                            }}
                          >
                            <Sparkles size={12} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-xl bg-emerald-800 flex items-center justify-center text-white text-[10.5px] font-bold flex-shrink-0 mt-0.5 shadow-xs">
                            Saya
                          </div>
                        )}

                        {/* Bubble Body */}
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl shadow-xs text-[12.5px] leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-tr-xs'
                              : 'bg-[#EDEDED] text-gray-800 rounded-tl-xs'
                          }`}
                        >
                          <div className="whitespace-pre-line">{m.text}</div>

                          {/* Action Micro-Button (Clean & Non-Intrusive) */}
                          {m.role === 'bot' && m.action && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <button
                                onClick={() => handleAction(m.action)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold transition-all active:scale-95"
                              >
                                <Zap size={11} className="text-emerald-700" />
                                <span>{m.actionLabel}</span>
                                <ChevronRight size={12} className="text-emerald-600" />
                              </button>
                            </div>
                          )}

                          {/* Time */}
                          <div
                            className={`text-[9.5px] mt-1 text-right font-medium ${
                              m.role === 'user' ? 'text-emerald-200/70' : 'text-gray-400'
                            }`}
                          >
                            {m.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {processing && (
                    <div className="flex items-start gap-2 animate-fade-in">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
                        style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
                      >
                        <Sparkles size={12} className="text-white" />
                      </div>
                      <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200/80 flex items-center gap-2 shadow-xs rounded-tl-xs">
                        <span className="text-[11.5px] font-medium text-gray-500">
                          Tanya GV sedang mengetik...
                        </span>
                        <div className="flex items-center gap-1">
                          {[0, 1, 2].map((dot) => (
                            <div
                              key={dot}
                              className="w-1.5 h-1.5 rounded-full bg-emerald-600"
                              style={{
                                animation: `bounceDot 0.8s ease-in-out ${dot * 0.15}s infinite alternate`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <style>{`@keyframes bounceDot{from{transform:translateY(0);opacity:.4}to{transform:translateY(-4px);opacity:1}}`}</style>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Tiga Tombol Pertanyaan di Bagian Bawah Layar (Sesuai Pola Gambar 2) */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 pt-1 flex flex-col gap-2.5 flex-shrink-0">
                    {ALL_STARTER_PROMPTS[promptPage].map((item, pIdx) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={pIdx}
                          onClick={() => sendMessage(item.text)}
                          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left border border-gray-200 hover:border-emerald-600/40 transition-all hover:bg-emerald-50/40 active:scale-[0.98] group bg-white shadow-xs"
                        >
                          <IconComponent
                            size={18}
                            className="text-emerald-700 flex-shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <span className="font-medium text-gray-700 text-[13px] leading-snug flex-1">
                            {item.text}
                          </span>
                        </button>
                      )
                    })}

                    {/* Tombol ganti pertanyaan untuk mengakses pertanyaan Gambar 1 */}
                    <div className="flex items-center justify-between px-1 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 rounded-full transition-all ${promptPage === 0 ? 'bg-emerald-600 w-3.5' : 'bg-gray-300 w-1.5'}`} />
                        <span className={`h-1.5 rounded-full transition-all ${promptPage === 1 ? 'bg-emerald-600 w-3.5' : 'bg-gray-300 w-1.5'}`} />
                      </div>
                      <button
                        onClick={() => setPromptPage((p) => (p === 0 ? 1 : 0))}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 py-0.5 active:scale-95 transition-transform"
                      >
                        <RefreshCw size={10} />
                        <span>
                          {promptPage === 0
                            ? 'Pertanyaan lainnya (Tani, Cuaca, Surat)'
                            : 'Pertanyaan utama (Listrik, Top Up, Toko)'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Spacious & Comfortable Input Bar (Tetap di Paling Bawah) */}
                <div
                  className="px-4 py-3 flex items-center gap-2 flex-shrink-0 bg-white border-t border-gray-100"
                  style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.03)' }}
                >
                  <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-2.5 bg-gray-100/90 border border-gray-200/80 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                      placeholder="Ketik pertanyaan..."
                      className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-[12.5px]"
                    />
                    {input && (
                      <button
                        onClick={() => setInput('')}
                        className="text-gray-400 hover:text-gray-600 p-0.5 active:scale-90"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className={`w-9.5 h-9.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      input.trim()
                        ? 'bg-gradient-to-br from-emerald-600 to-green-800 text-white shadow-md active:scale-95'
                        : 'bg-gray-100 text-gray-400 opacity-60'
                    }`}
                  >
                    <Send size={14} className={input.trim() ? 'translate-x-0.2' : ''} />
                  </button>

                  {/* Mic Button */}
                  <button
                    onClick={handleVoice}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-emerald-700 to-green-900 text-white shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
                    title="Bicara dengan Suara"
                  >
                    <Mic size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
