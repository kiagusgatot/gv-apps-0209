import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Mic, MicOff, Send, Zap, CreditCard, Store, Tv2, ArrowRightLeft, Package } from 'lucide-react'

// Context-aware quick suggestions per screen
const SUGGESTIONS = {
  beranda:  [
    { icon: Zap,             text: 'Cara bayar tagihan listrik?',  screen: 'bayar'  },
    { icon: CreditCard,      text: 'Cara Top Up GV Pay?',          screen: 'bayar'  },
    { icon: Store,           text: 'Cara buka toko di Pasar?',     screen: 'pasar'  },
  ],
  siaran:   [
    { icon: Tv2,             text: 'Cara tonton GV TV live?',      screen: null     },
    { icon: Tv2,             text: 'Cara upload video ke GV?',     screen: null     },
    { icon: Sparkles,        text: 'Cara jadi Kreator konten?',    screen: 'profile'},
  ],
  pasar:    [
    { icon: Store,           text: 'Cara checkout produk?',        screen: null     },
    { icon: Package,         text: 'Cara lacak pesanan?',          screen: null     },
    { icon: Store,           text: 'Cara buka toko sendiri?',      screen: 'profile'},
  ],
  bayar:    [
    { icon: CreditCard,      text: 'Cara Top Up GV Pay?',         screen: null     },
    { icon: Zap,             text: 'Tagihan gagal bayar?',         screen: null     },
    { icon: ArrowRightLeft,  text: 'Cara transfer ke warga lain?', screen: null     },
  ],
  profile:  [
    { icon: Sparkles,        text: 'Cara aktivasi jadi Penjual?',  screen: null     },
    { icon: CreditCard,      text: 'Cara gunakan poin GV?',        screen: null     },
    { icon: Sparkles,        text: 'Cara ubah profil desa?',       screen: null     },
  ],
}

// Pre-defined bot responses
const RESPONSES = {
  'Cara bayar tagihan listrik?':    { text: 'Untuk bayar tagihan listrik PLN, buka menu Bayar lalu pilih Tagihan → Listrik PLN. Masukkan ID Pelanggan dan konfirmasi pembayaran.',   action: 'bayar',   actionLabel: 'Buka Tagihan Listrik' },
  'Cara Top Up GV Pay?':            { text: 'Top Up GV Pay bisa dilakukan lewat transfer bank atau minimarket terdekat. Tap menu GV Pay di beranda, lalu pilih Top Up.',             action: 'bayar',   actionLabel: 'Buka GV Pay' },
  'Cara buka toko di Pasar?':       { text: 'Untuk buka toko di Pasar ESTO, aktifkan dulu capability Penjual di menu Profil Saya. Setelah aktif, kamu bisa langsung tambah produk.',action: 'profile', actionLabel: 'Aktivasi Penjual' },
  'Cara tonton GV TV live?':        { text: 'GV TV siaran langsung bisa ditonton di tab Siaran. Tap banner "GV TV Live" yang ada di bagian atas layar Siaran.',                       action: 'siaran',  actionLabel: 'Buka Siaran' },
  'Cara upload video ke GV?':       { text: 'Untuk upload video, kamu perlu aktifkan capability Kreator dulu di Profil Saya. Setelah aktif, ada tombol Upload di tab Siaran.',       action: 'profile', actionLabel: 'Aktivasi Kreator' },
  'Cara jadi Kreator konten?':      { text: 'Aktifkan capability Kreator di menu Profil Saya. Prosesnya mudah dan gratis. Setelah aktif, kamu bisa upload video dan podcast.',        action: 'profile', actionLabel: 'Aktivasi Kreator' },
  'Cara checkout produk?':          { text: 'Setelah memilih produk dan menambah ke keranjang, tap tombol "Lihat Keranjang" di bagian bawah layar, lalu pilih metode pembayaran.',    action: null,      actionLabel: null },
  'Cara lacak pesanan?':            { text: 'Pesanan aktif bisa dilacak di beranda — akan muncul kartu status pesanan otomatis. Atau buka menu Pasar → Pesananku.',                  action: 'pasar',   actionLabel: 'Buka Pasar' },
  'Cara buka toko sendiri?':        { text: 'Aktifkan capability Penjual di Profil Saya. Setelah aktif, kamu bisa tambah produk, kelola stok, dan terima pesanan dari warga lain.',  action: 'profile', actionLabel: 'Aktivasi Penjual' },
  'Tagihan gagal bayar?':           { text: 'Coba periksa saldo GV Pay kamu terlebih dahulu. Jika saldo cukup tapi masih gagal, coba lagi dalam beberapa menit atau hubungi bantuan.', action: null,    actionLabel: null },
  'Cara transfer ke warga lain?':   { text: 'Buka menu Transfer di beranda atau di tab Bayar. Masukkan nomor HP penerima, nominal, dan konfirmasi. Transfer berlaku sesama GV Pay.', action: 'bayar',   actionLabel: 'Buka Transfer' },
  'Cara aktivasi jadi Penjual?':    { text: 'Di halaman Profil Saya, tap "Aktivasi Penjual". Lengkapi data toko kamu dan mulai jualan di Pasar ESTO G-Village.',                    action: null,      actionLabel: null },
  'Cara gunakan poin GV?':          { text: 'Poin GV bisa ditukar dengan diskon transaksi atau produk di Pasar. Tap kartu Poin di halaman Profil untuk lihat pilihan penukaran.',    action: null,      actionLabel: null },
  'Cara ubah profil desa?':         { text: 'Pergi ke Profil Saya → Data Diri. Di sana kamu bisa mengubah nama, foto, dan desamu kapan saja.',                                       action: null,      actionLabel: null },
}

const VOICE_SAMPLES = [
  'bayar listrik', 'top up GV Pay', 'buka toko', 'tonton TV', 'kirim uang'
]

export default function TanyaGV({ currentScreen = 'beranda', navigate, bottomOffset = 0, side = 'left', mode = 'fab', openFromParent, onCloseParent }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openFromParent !== undefined
  const open    = isControlled ? openFromParent : internalOpen
  const setOpen = (val) => {
    if (isControlled) { if (!val && onCloseParent) onCloseParent() }
    else setInternalOpen(val)
  }
  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [listening, setListening] = useState(false)
  const [processing,setProcessing]= useState(false)
  const chatEndRef = useRef(null)
  const inputRef   = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: `Halo! Mau bantuan apa? Pilih pertanyaan di bawah atau langsung bicara.` }])
    }
  }, [open])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', text: text.trim(), voice: false }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setProcessing(true)
    setTimeout(() => {
      const resp = RESPONSES[text.trim()] || {
        text: 'Maaf, saya belum punya jawaban untuk itu. Coba hubungi bantuan G-Village untuk informasi lebih lanjut.',
        action: null, actionLabel: null
      }
      setMessages(prev => [...prev, { role: 'bot', text: resp.text, action: resp.action, actionLabel: resp.actionLabel }])
      setProcessing(false)
    }, 900)
  }

  const sendVoice = (text) => {
    const userMsg = { role: 'user', text, voice: true }
    setMessages(prev => [...prev, userMsg])
    setProcessing(true)
    setTimeout(() => {
      // Find matching response
      const match = Object.keys(RESPONSES).find(k => k.toLowerCase().includes(text.toLowerCase().split(' ')[0]))
      const resp = match ? RESPONSES[match] : {
        text: `Saya dengar "${text}". Bisa jelaskan lebih detail? Atau pilih dari pertanyaan di bawah.`,
        action: null, actionLabel: null
      }
      setMessages(prev => [...prev, { role: 'bot', text: resp.text, action: resp.action, actionLabel: resp.actionLabel }])
      setProcessing(false)
    }, 1000)
  }

  const handleVoice = () => {
    if (listening) {
      setListening(false)
      const sample = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)]
      setTimeout(() => sendVoice(sample), 300)
    } else {
      setListening(true)
      // Auto-stop after 3 seconds in prototype
      setTimeout(() => {
        setListening(false)
        const sample = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)]
        setTimeout(() => sendVoice(sample), 300)
      }, 3000)
    }
  }

  const handleAction = (screen) => {
    if (screen && navigate) {
      setOpen(false)
      setTimeout(() => navigate(screen), 200)
    }
  }

  const suggestions = SUGGESTIONS[currentScreen] || SUGGESTIONS.beranda

  return (
    <>
      {/* Inline header button — only in inline mode */}
      {mode === 'inline' && (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all active:scale-[0.92]"
          style={{
            background: open ? 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' : '#E8F5E9',
            boxShadow: open ? '0 4px 16px rgba(27,107,58,0.25)' : undefined,
          }}>
          <Sparkles size={12} style={{color: open ? '#fff' : '#1B6B3A'}}/>
          <span className="font-semibold text-[11px]" style={{color: open ? '#fff' : '#1B6B3A'}}>Tanya GV</span>
        </button>
      )}

      {/* Bottom sheet overlay */}
      {open && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end backdrop-blur-sm animate-fade-in"
          style={{background:'rgba(8,20,13,0.45)'}}>
          {/* Backdrop dismiss */}
          <div className="flex-1" onClick={()=>setOpen(false)}/>
          <div className="flex flex-col animate-slide-up"
            style={{borderRadius:'20px 20px 0 0', height:'82%',
              backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
              background:'rgba(255,255,255,0.92)',
              boxShadow:'0 -4px 32px rgba(15,26,19,0.12), 0 0 0 1px rgba(27,107,58,0.06)',
              display:'flex', flexDirection:'column'}}>
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{background:'rgba(27,107,58,0.2)'}}/>
            </div>

          {/* Header */}
          <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-2 pb-3"
            style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A)', borderRadius:'0'}}>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{background:'rgba(255,255,255,0.15)'}}>
              <Sparkles size={16} className="text-white"/>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[14px]" style={{color:'#fff'}}>Tanya GV</p>
              {listening
                ? <p className="text-[10px] font-semibold" style={{color:'#A7E3BE'}}>Sedang mendengarkan...</p>
                : <p className="text-[10px]" style={{color:'rgba(255,255,255,0.7)'}}>AI Asisten G-Village</p>}
            </div>
            <button onClick={()=>{ setOpen(false); setMessages([]); setListening(false) }}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-[0.92]"
              style={{background:'rgba(255,255,255,0.15)'}}>
              <X size={15} className="text-white"/>
            </button>
          </div>

            {/* Listening State */}
            {listening ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full animate-ping" style={{background:'rgba(27,107,58,.18)'}}/>
                  <div className="absolute w-16 h-16 rounded-full" style={{boxShadow:'0 0 0 4px rgba(27,107,58,0.12)'}}/>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
                    style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A)', boxShadow:'0 4px 16px rgba(27,107,58,0.35)'}}>
                    <Mic size={26} className="text-white"/>
                  </div>
                </div>
                {/* Waveform */}
                <div className="flex items-center gap-1" style={{height:28}}>
                  {[8,14,22,28,20,14,8].map((h,i) => (
                    <div key={i} className="rounded-full" style={{
                      width:3, height:h, background:'#1B6B3A',
                      animation:`wave ${0.6+i*0.08}s ease-in-out infinite alternate`,
                    }}/>
                  ))}
                </div>
                <p className="text-gray-900 font-semibold" style={{fontSize:12}}>Sedang mendengarkan...</p>
                <p className="text-gray-400" style={{fontSize:10}}>Bicara sekarang</p>
                <button onClick={handleVoice}
                  className="px-5 py-2 rounded-full text-gray-500 font-medium transition-all active:scale-[0.92]" style={{fontSize:11,background:'rgba(27,107,58,0.08)'}}>
                  Ketuk untuk berhenti
                </button>
                <style>{`@keyframes wave{from{transform:scaleY(.4)}to{transform:scaleY(1)}}`}</style>
              </div>
            ) : (
              <>
                {/* Chat area */}
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 no-scrollbar">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex stagger-in ${m.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
                      {m.role === 'bot' && (
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A)'}}>
                          <Sparkles size={10} className="text-white"/>
                        </div>
                      )}
                      <div className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                        m.role === 'user'
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}
                        style={{
                          background: m.role === 'user' ? 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' : 'rgba(27,107,58,0.06)',
                          borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          borderInlineStart: m.role === 'bot' ? '2px solid rgba(27,107,58,0.2)' : undefined,
                          boxShadow: m.role === 'user' ? '0 2px 10px rgba(27,107,58,0.25)' : undefined,
                        }}>
                        {m.role === 'user' && m.voice && (
                          <div className="flex items-center gap-1 mb-1 opacity-70">
                            <Mic size={9} className="text-white"/>
                            <span style={{fontSize:8,color:'rgba(255,255,255,.7)'}}>Voice</span>
                          </div>
                        )}
                        <p style={{fontSize:10,lineHeight:1.5}}>{m.text}</p>
                        {m.role === 'bot' && m.action && (
                          <button onClick={() => handleAction(m.action)}
                            className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-white font-semibold transition-all active:scale-[0.92]"
                            style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A)',fontSize:9, boxShadow:'0 2px 8px rgba(27,107,58,0.3)'}}>
                            <Zap size={10}/>
                            {m.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {processing && (
                    <div className="flex items-end gap-2 animate-fade-in">
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center"
                        style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A)'}}>
                        <Sparkles size={10} className="text-white"/>
                      </div>
                      <div className="px-3 py-2 rounded-2xl flex gap-1 items-center"
                        style={{background:'rgba(27,107,58,0.06)', borderInlineStart:'2px solid rgba(27,107,58,0.2)'}}>
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{
                            background:'#1B6B3A', opacity:.5,
                            animation:`bounce 0.8s ease-in-out ${i*0.15}s infinite alternate`
                          }}/>
                        ))}
                        <style>{`@keyframes bounce{from{transform:translateY(0);opacity:.5}to{transform:translateY(-4px);opacity:1}}`}</style>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}/>
                </div>

                {/* Quick suggestions — shown when chat is empty (only greeting) */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex flex-col gap-1.5 flex-shrink-0">
                    {suggestions.map(({ icon: Icon, text }) => (
                      <button key={text} onClick={() => sendMessage(text)}
                        className="spotlight-border flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left border transition-colors hover:bg-[rgba(27,107,58,0.05)] active:scale-[0.98]"
                        style={{borderColor:'rgba(27,107,58,0.15)',background:'rgba(255,255,255,0.6)'}}>
                        <Icon size={13} style={{color:'#1B6B3A',flexShrink:0}}/>
                        <span className="font-medium text-gray-800" style={{fontSize:10}}>{text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Input row */}
                <div className="px-4 pb-3 pt-2 flex items-center gap-2 flex-shrink-0"
                  style={{borderTop:'1px solid rgba(27,107,58,0.08)', background:'rgba(255,255,255,0.5)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)'}}>
                  <div className="flex-1 flex items-center gap-2 rounded-full px-3 py-2"
                    style={{background:'rgba(27,107,58,0.06)', border:'1px solid rgba(27,107,58,0.1)'}}>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                      placeholder="Ketik pertanyaan..."
                      className="flex-1 bg-transparent outline-none text-gray-800"
                      style={{fontSize:10}}
                    />
                  </div>
                  {/* Send (secondary) */}
                  <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-[0.92]"
                    style={{
                      background: input.trim() ? 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' : '#E5E7EB',
                      opacity: input.trim() ? 1 : 0.5,
                      boxShadow: input.trim() ? '0 2px 10px rgba(27,107,58,0.3)' : undefined,
                    }}>
                    <Send size={13} className={input.trim() ? 'text-white' : 'text-gray-400'}/>
                  </button>
                  {/* Mic (primary — larger) */}
                  <button onClick={handleVoice}
                    className={`flex items-center justify-center flex-shrink-0 transition-all active:scale-[0.92] ${listening ? 'animate-pulse' : ''}`}
                    style={{
                      width: 36, height: 36, borderRadius: 18,
                      background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)',
                      boxShadow: listening
                        ? '0 4px 16px rgba(27,107,58,0.45), 0 0 0 4px rgba(27,107,58,0.15)'
                        : '0 4px 16px rgba(27,107,58,0.3)',
                    }}>
                    <Mic size={16} className="text-white"/>
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
