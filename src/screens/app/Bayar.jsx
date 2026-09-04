import React, { useState, useEffect, useRef } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import { Zap, Wifi, Phone, Tv2, Droplets, ArrowRightLeft, QrCode, History,
  ChevronRight, X, ArrowLeft, Check, Copy, CreditCard, Building2,
  Smartphone, RefreshCw, Clock, TrendingDown, TrendingUp, Search, HeartPulse, Plus } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

const PRIMARY = '#1B6B3A'
const S = { card:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)', cardMd:'0 6px 20px rgba(27,107,58,0.10), 0 2px 6px rgba(0,0,0,0.05)' }

// ── Helpers ────────────────────────────────────────────────
function SuccessScreen({ title, sub, detail, onDone }) {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-white px-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 animate-scale-in"
        style={{background:'linear-gradient(135deg, #E8F5E9, #C8E6C9)'}}>
        <Check size={36} style={{color:PRIMARY}}/>
      </div>
      <p className="text-[18px] font-extrabold text-gray-900 mb-2 text-center">{title}</p>
      <p className="text-[13px] text-gray-400 text-center leading-relaxed mb-6">{sub}</p>
      {detail && (
        <div className="w-full rounded-2xl p-4 mb-6 flex flex-col gap-2" style={{background:'#FAFBF9'}}>
          {Object.entries(detail).map(([k,v])=>(
            <div key={k} className="flex justify-between">
              <span className="text-[12px] text-gray-400">{k}</span>
              <span className="text-[12px] font-bold text-gray-900 tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onDone} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform"
        style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Selesai</button>
    </div>
  )
}

function PinInput({ onSubmit, onBack, title, sub, amount }) {
  const [pin, setPin] = useState('')
  useEffect(()=>{ if(pin.length===6) setTimeout(()=>onSubmit(), 300) },[pin])
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">{title || 'Masukkan PIN GV Pay'}</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{background:'#E8F5E9'}}>
          <span className="text-2xl">💳</span>
        </div>
        {amount && <p className="text-[13px] text-gray-400 mb-1">{sub || 'Total pembayaran'}</p>}
        {amount && <p className="text-[26px] font-extrabold mb-8 tabular-nums" style={{color:PRIMARY}}>Rp {amount.toLocaleString('id')}</p>}
        {!amount && <p className="text-[13px] text-gray-400 mb-8">{sub}</p>}
        <div className="flex gap-4 mb-10">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="w-4 h-4 rounded-full transition duration-200"
              style={{background:i<pin.length?PRIMARY:'#E0E0E0', transform:i<pin.length?'scale(1.1)':'scale(1)'}}/>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((n,i)=>(
            <button key={i}
              onClick={()=>{ if(n==='⌫') setPin(p=>p.slice(0,-1)); else if(n!==''&&pin.length<6) setPin(p=>p+n) }}
              className="h-14 rounded-2xl text-[18px] font-bold text-gray-900 transition active:scale-[0.96] hover:bg-gray-100"
              style={{background:n===''?'transparent':'#F5F5F5'}}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Checking({ label }) {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-white">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-spin"
        style={{border:`3px solid #E8F5E9`, borderTopColor:PRIMARY}}>
      </div>
      <p className="text-[14px] font-bold text-gray-900 mb-1">Mengecek data...</p>
      <p className="text-[12px] text-gray-400">{label}</p>
    </div>
  )
}

// ── Top Up ─────────────────────────────────────────────────
function TopUpFlow({ onDone, onBack, onTopUp }) {
  const [step, setStep]     = useState('nominal') // nominal | metode | pin | proses | sukses
  const [nominal, setNominal] = useState(null)
  const [metode,  setMetode]  = useState('transfer')
  const NOMINALS = [50000,100000,200000,500000,1000000,2000000]
  const METODE = [
    { id:'transfer', label:'Transfer Bank', sub:'BRI · BCA · Mandiri · BNI', icon:'🏦' },
    { id:'qris',     label:'QRIS',          sub:'Scan dari e-wallet / m-banking', icon:'⬛' },
    { id:'cc',       label:'Kartu Kredit',  sub:'Visa · Mastercard · JCB', icon:'💳' },
  ]

  useEffect(()=>{ if(step==='proses') { setTimeout(()=>{ onTopUp(nominal); setStep('sukses') }, 1800) } },[step])

  if (step==='pin')    return <PinInput onBack={()=>setStep('metode')} amount={nominal} onSubmit={()=>setStep('proses')}/>
  if (step==='proses') return <Checking label="Memproses top up GV Pay..."/>
  if (step==='sukses') return <SuccessScreen title="Top Up Berhasil!" sub={`Rp ${nominal.toLocaleString('id')} berhasil masuk ke GV Pay`}
    detail={{'Nominal':`Rp ${nominal.toLocaleString('id')}`,'Metode':METODE.find(m=>m.id===metode)?.label,'Waktu':new Date().toLocaleTimeString('id',{hour:'2-digit',minute:'2-digit'})}} onDone={onDone}/>

  if (step==='metode') return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={()=>setStep('nominal')} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Pilih Metode Pembayaran</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
        <div className="bg-blue-50 rounded-2xl px-4 py-3 flex items-center justify-between border border-blue-100">
          <span className="text-[12px] text-blue-700 font-semibold">Top Up</span>
          <span className="text-[16px] font-extrabold text-blue-700 tabular-nums">Rp {nominal?.toLocaleString('id')}</span>
        </div>
        {METODE.map(m=>(
          <button key={m.id} onClick={()=>setMetode(m.id)}
            className="flex items-center gap-3 p-4 rounded-2xl text-left transition bg-white"
            style={metode===m.id?{border:`2px solid ${PRIMARY}`,background:`${PRIMARY}06`,boxShadow:`0 2px 10px ${PRIMARY}20`}:{border:'2px solid #F0F0F0'}}>
            <span className="text-2xl flex-shrink-0">{m.icon}</span>
            <div className="flex-1"><p className="text-[13px] font-bold text-gray-900">{m.label}</p><p className="text-[12px] text-gray-400">{m.sub}</p></div>
            <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center" style={metode===m.id?{borderColor:PRIMARY}:{borderColor:'#D1D5DB'}}>
              {metode===m.id&&<div className="w-2 h-2 rounded-full" style={{background:PRIMARY}}/>}
            </div>
          </button>
        ))}
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button onClick={()=>setStep('pin')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Lanjutkan →</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Top Up GV Pay</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <p className="text-[12px] font-semibold text-gray-400 mb-3">Pilih Nominal</p>
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {NOMINALS.map(n=>(
            <button key={n} onClick={()=>setNominal(n)}
              className="py-3 rounded-2xl text-[13px] font-bold transition border-2 tabular-nums"
              style={nominal===n?{borderColor:PRIMARY,background:`${PRIMARY}08`,color:PRIMARY,boxShadow:`0 0 0 3px ${PRIMARY}12`}:{borderColor:'#F0F0F0',background:'white',color:'#374151'}}>
              Rp {n>=1000000?n/1000000+'jt':(n/1000)+'rb'}
            </button>
          ))}
        </div>
        <p className="text-[12px] font-semibold text-gray-400 mb-2">Atau masukkan nominal lain</p>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 bg-white border-2" style={{borderColor:nominal&&!NOMINALS.includes(nominal)?PRIMARY:'#E0E0E0'}}>
          <span className="text-gray-400 text-[13px]">Rp</span>
          <input type="number" placeholder="0" className="flex-1 outline-none text-base font-semibold text-gray-900 bg-transparent"
            onChange={e=>setNominal(e.target.value?Number(e.target.value):null)}/>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button disabled={!nominal} onClick={()=>setStep('metode')}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition active:scale-[0.96]"
          style={{background:nominal?'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)':'#E0E0E0'}}>Lanjutkan →</button>
      </div>
    </div>
  )
}

// ── Transfer ───────────────────────────────────────────────
function TransferFlow({ onDone, onBack, onTransfer }) {
  const [step,    setStep]   = useState('input')
  const [no,      setNo]     = useState('')
  const [nominal, setNominal]= useState('')
  const [note,    setNote]   = useState('')
  const [found,   setFound]  = useState(null)
  const ACCOUNTS = [
    {no:'081234567890',name:'Sari Dewi',    desa:'Desa Sukamaju'},
    {no:'087890123456',name:'Budi Santoso', desa:'Desa Nagrak'},
    {no:'082345678901',name:'Ibu Rina',     desa:'Desa Ciawi'},
  ]

  const cek = () => {
    const a = ACCOUNTS.find(x=>x.no===no||x.name.toLowerCase().includes(no.toLowerCase()))
    if (a) setFound(a)
    else setFound({name:'Tidak ditemukan', desa:''})
  }

  useEffect(()=>{ if(step==='proses') { setTimeout(()=>{ onTransfer(Number(nominal)); setStep('sukses') }, 1800) } },[step])

  if (step==='pin')    return <PinInput onBack={()=>setStep('konfirmasi')} amount={Number(nominal)} onSubmit={()=>setStep('proses')}/>
  if (step==='proses') return <Checking label="Memproses transfer..."/>
  if (step==='sukses') return <SuccessScreen title="Transfer Berhasil!" sub={`Rp ${Number(nominal).toLocaleString('id')} berhasil dikirim`}
    detail={{'Ke':found?.name,'No. HP':no,'Jumlah':`Rp ${Number(nominal).toLocaleString('id')}`,'Catatan':note||'-'}} onDone={onDone}/>

  if (step==='konfirmasi') return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={()=>setStep('input')} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Konfirmasi Transfer</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-4 spotlight-border" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:'#E8F5E9'}}>👤</div>
            <div><p className="text-[14px] font-bold text-gray-900">{found?.name}</p><p className="text-[11px] text-gray-400">{no} · {found?.desa}</p></div>
          </div>
          {[['Jumlah Transfer',`Rp ${Number(nominal).toLocaleString('id')}`],['Biaya Admin','Gratis'],['Sumber Dana','GV Pay'],['Catatan',note||'-']].map(([l,v])=>(
            <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-bold text-gray-900">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 rounded-2xl" style={{background:'#E8F5E9',border:`1px solid ${PRIMARY}30`}}>
          <CreditCard size={14} style={{color:PRIMARY}}/><span className="text-[12px] font-bold" style={{color:PRIMARY}}>Dibayar dari GV Pay</span>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button onClick={()=>setStep('pin')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Masukkan PIN →</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Transfer GV Pay</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[12px] font-semibold text-gray-400 mb-2">Nomor HP / Nama Penerima</p>
          <div className="flex gap-2">
            <input value={no} onChange={e=>setNo(e.target.value)} placeholder="Nomor HP atau nama"
              className="flex-1 rounded-2xl px-4 py-3 text-[13px] outline-none" style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            <button onClick={cek} className="px-4 py-3 rounded-2xl text-[12px] font-bold text-white flex-shrink-0 active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Cek</button>
          </div>
          {found && (
            <div className={`mt-3 flex items-center gap-2 p-3 rounded-xl ${found.desa?'bg-green-50':'bg-red-50'}`}>
              <span>{found.desa?'✅':'❌'}</span>
              <div><p className="text-[12px] font-bold" style={{color:found.desa?PRIMARY:'#C62828'}}>{found.name}</p>
                {found.desa&&<p className="text-[12px] text-gray-500">{found.desa}</p>}</div>
            </div>
          )}
        </div>
        {found?.desa && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
              <p className="text-[12px] font-semibold text-gray-400 mb-2">Jumlah Transfer</p>
              <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}>
                <span className="text-gray-400 font-semibold">Rp</span>
                <input type="number" value={nominal} onChange={e=>setNominal(e.target.value)} placeholder="0"
                  className="flex-1 outline-none text-[16px] font-bold text-gray-900 bg-transparent"/>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[10000,25000,50000,100000].map(n=>(
                  <button key={n} onClick={()=>setNominal(String(n))}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-bold border tabular-nums"
                    style={nominal===String(n)?{borderColor:PRIMARY,color:PRIMARY,background:`${PRIMARY}10`,boxShadow:`0 0 0 3px ${PRIMARY}12`}:{borderColor:'#E0E0E0',color:'#6B7280'}}>
                    {n>=1000?(n/1000)+'rb':n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
              <p className="text-[12px] font-semibold text-gray-400 mb-2">Catatan (opsional)</p>
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Untuk keperluan apa?"
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none" style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            </div>
          </>
        )}
      </div>
      {found?.desa && nominal && (
        <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
          <button onClick={()=>setStep('konfirmasi')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Lanjut Konfirmasi →</button>
        </div>
      )}
    </div>
  )
}

// ── Generic Bill Pay ───────────────────────────────────────
function BillPayFlow({ config, onDone, onBack, onPay }) {
  const [step,    setStep]  = useState('input')
  const [id,      setId]    = useState('')
  const [tagihan, setTagihan]= useState(null)

  useEffect(()=>{
    if(step==='cek') {
      setTimeout(()=>{
        setTagihan({ nama: config.dummyNama, periode: config.dummyPeriode, tagihan: config.dummyAmount, denda: config.dummyDenda||0 })
        setStep('detail')
      }, 1500)
    }
    if(step==='proses') { setTimeout(()=>{ onPay(tagihan.tagihan+tagihan.denda); setStep('sukses') }, 1800) }
  },[step])

  if (step==='cek')    return <Checking label={`Mengecek data ${config.label}...`}/>
  if (step==='pin')    return <PinInput onBack={()=>setStep('detail')} amount={tagihan?.tagihan+tagihan?.denda} onSubmit={()=>setStep('proses')}/>
  if (step==='proses') return <Checking label="Memproses pembayaran..."/>
  if (step==='sukses') return <SuccessScreen title="Pembayaran Berhasil!" sub={`${config.label} berhasil dibayar`}
    detail={{'Nama':tagihan?.nama,[config.idLabel]:id,'Periode':tagihan?.periode,'Tagihan':`Rp ${tagihan?.tagihan.toLocaleString('id')}`,'Token/No. Bukti':Math.random().toString(36).slice(2,10).toUpperCase()}} onDone={onDone}/>

  if (step==='detail') return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={()=>setStep('input')} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Detail Tagihan</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:config.bg}}>
            <config.Icon size={20} style={{color:config.ic}}/>
          </div>
          <div><p className="text-[14px] font-bold text-gray-900">{config.label}</p><p className="text-[11px] text-gray-400">{config.idLabel}: {id}</p></div>
        </div>
        <div className="bg-white rounded-2xl p-4 spotlight-border" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          {[['Nama Pelanggan',tagihan?.nama],['Periode',tagihan?.periode],['Tagihan',`Rp ${tagihan?.tagihan.toLocaleString('id')}`],
            ...(tagihan?.denda>0?[['Denda',`Rp ${tagihan?.denda.toLocaleString('id')}`]]:[]),
          ].map(([l,v])=>(
            <div key={l} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-bold text-gray-900">{v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-1 border-t border-gray-100">
            <span className="text-[13px] font-bold text-gray-900">Total Bayar</span>
            <span className="text-[15px] font-extrabold tabular-nums" style={{color:PRIMARY}}>Rp {(tagihan?.tagihan+(tagihan?.denda||0)).toLocaleString('id')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-2xl" style={{background:'#E8F5E9',border:`1px solid ${PRIMARY}30`}}>
          <CreditCard size={14} style={{color:PRIMARY}}/><span className="text-[12px] font-bold" style={{color:PRIMARY}}>Dibayar dari GV Pay</span>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button onClick={()=>setStep('pin')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Bayar Sekarang →</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">{config.label}</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{background:config.bg}}>
          <config.Icon size={24} style={{color:config.ic}} className="flex-shrink-0"/>
          <p className="text-[13px] font-bold" style={{color:config.ic}}>{config.label}</p>
        </div>
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[12px] font-semibold text-gray-400 mb-2">{config.idLabel}</p>
          <input value={id} onChange={e=>setId(e.target.value)} placeholder={config.idPlaceholder}
            className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none" style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
          {config.idHint && <p className="text-[12px] text-gray-400 mt-1">{config.idHint}</p>}
        </div>
        {config.extras && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
            {config.extras}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button disabled={!id} onClick={()=>setStep('cek')}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition active:scale-[0.96]"
          style={{background:id?'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)':'#E0E0E0'}}>Cek Tagihan →</button>
      </div>
    </div>
  )
}

// ── Pulsa & Data ───────────────────────────────────────────
function PulsaFlow({ onDone, onBack, onPay }) {
  const [step,     setStep]    = useState('input')
  const [operator, setOperator]= useState('telkomsel')
  const [phone,    setPhone]   = useState('')
  const [paket,    setPaket]   = useState(null)
  const OPERATORS = [{id:'telkomsel',label:'Telkomsel',color:'#E53935'},{id:'xl',label:'XL Axiata',color:'#1565C0'},{id:'indosat',label:'Indosat Ooredoo',color:'#F57F17'},{id:'tri',label:'Tri',color:'#C62828'}]
  const PAKETS = [
    {id:'p1',type:'Pulsa',label:'Pulsa Rp 25.000',    price:25500, bonus:''},
    {id:'p2',type:'Pulsa',label:'Pulsa Rp 50.000',    price:51000, bonus:''},
    {id:'p3',type:'Pulsa',label:'Pulsa Rp 100.000',   price:101000,bonus:''},
    {id:'d1',type:'Data', label:'1 GB / 7 hari',      price:15000, bonus:''},
    {id:'d2',type:'Data', label:'5 GB / 30 hari',     price:49000, bonus:''},
    {id:'d3',type:'Data', label:'10 GB + 10 GB Bonus',price:75000, bonus:'10 GB bonus malam'},
  ]
  useEffect(()=>{ if(step==='proses') { setTimeout(()=>{ onPay(paket.price); setStep('sukses') }, 1800) } },[step])
  if (step==='pin')    return <PinInput onBack={()=>setStep('konfirmasi')} amount={paket?.price} onSubmit={()=>setStep('proses')}/>
  if (step==='proses') return <Checking label="Memproses pembelian pulsa/data..."/>
  if (step==='sukses') return <SuccessScreen title="Berhasil!" sub="Pulsa/data berhasil dikirim"
    detail={{'Nomor':phone,'Paket':paket?.label,'Operator':OPERATORS.find(o=>o.id===operator)?.label,'Total':`Rp ${paket?.price.toLocaleString('id')}`}} onDone={onDone}/>

  if (step==='konfirmasi') return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={()=>setStep('input')} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Konfirmasi</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          {[['Nomor',phone],['Operator',OPERATORS.find(o=>o.id===operator)?.label],['Paket',paket?.label],['Total',`Rp ${paket?.price.toLocaleString('id')}`]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-bold text-gray-900">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button onClick={()=>setStep('pin')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Masukkan PIN →</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Pulsa & Data</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[12px] font-semibold text-gray-400 mb-2">Nomor HP</p>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08xxxxxxxxxx" type="tel"
            className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none" style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
        </div>
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[12px] font-semibold text-gray-400 mb-2">Operator</p>
          <div className="grid grid-cols-2 gap-2">
            {OPERATORS.map(op=>(
              <button key={op.id} onClick={()=>setOperator(op.id)}
                className="py-2.5 rounded-xl text-[12px] font-bold border-2 transition"
                style={operator===op.id?{borderColor:op.color,color:op.color,background:`${op.color}10`,boxShadow:`0 2px 8px ${op.color}25`}:{borderColor:'#F0F0F0',color:'#6B7280',background:'#FAFAFA'}}>
                {op.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[12px] font-semibold text-gray-400 mb-3">Pilih Paket</p>
          {['Pulsa','Data'].map(type=>(
            <div key={type} className="mb-3">
              <p className="text-[12px] font-bold text-gray-400 mb-2">{type.toUpperCase()}</p>
              <div className="flex flex-col gap-2">
                {PAKETS.filter(p=>p.type===type).map(p=>(
                  <button key={p.id} onClick={()=>setPaket(p)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition"
                    style={paket?.id===p.id?{borderColor:PRIMARY,background:`${PRIMARY}08`,boxShadow:`0 2px 8px ${PRIMARY}20`}:{borderColor:'#F0F0F0',background:'#FAFAFA'}}>
                    <div className="text-left">
                      <p className="text-[12px] font-bold text-gray-900">{p.label}</p>
                      {p.bonus&&<p className="text-[11px] text-green-600 font-semibold">{p.bonus}</p>}
                    </div>
                    <p className="text-[13px] font-extrabold tabular-nums" style={{color:PRIMARY}}>Rp {p.price.toLocaleString('id')}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {paket && phone && (
        <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
          <button onClick={()=>setStep('konfirmasi')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform tabular-nums" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
            Beli · Rp {paket.price.toLocaleString('id')} →
          </button>
        </div>
      )}
    </div>
  )
}

// ── QRIS ──────────────────────────────────────────────────
function QRISFlow({ onDone, onBack, onPay }) {
  const [step,    setStep]   = useState('input')
  const [nominal, setNominal]= useState('')
  const [timer,   setTimer]  = useState(300)
  useEffect(()=>{
    if(step==='qr') { const t=setInterval(()=>setTimer(s=>s>0?s-1:0),1000); return ()=>clearInterval(t) }
    if(step==='proses') { setTimeout(()=>{ onPay(Number(nominal)); setStep('sukses') },1500) }
  },[step])
  const fmt = s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
  if (step==='proses') return <Checking label="Memverifikasi pembayaran QRIS..."/>
  if (step==='sukses') return <SuccessScreen title="Pembayaran QRIS Berhasil!" sub="Transaksi berhasil dikonfirmasi"
    detail={{'Jumlah':`Rp ${Number(nominal).toLocaleString('id')}`,'No. Referensi':Math.random().toString(36).slice(2,10).toUpperCase()}} onDone={onDone}/>
  if (step==='qr') return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={()=>setStep('input')} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Scan QRIS</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-[13px] text-gray-400 mb-1">Jumlah Pembayaran</p>
        <p className="text-[26px] font-extrabold mb-5 tabular-nums" style={{color:PRIMARY}}>Rp {Number(nominal).toLocaleString('id')}</p>
        <div className="w-52 h-52 rounded-3xl p-4 mb-3" style={{background:'#fff',border:`3px solid ${PRIMARY}`,boxShadow:'0 4px 20px rgba(27,107,58,0.15)'}}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {[[0,0],[70,0],[0,70]].map(([x,y],i)=>(
              <g key={i}><rect x={x+2} y={y+2} width={26} height={26} rx={3} fill="none" stroke={PRIMARY} strokeWidth={3}/><rect x={x+8} y={y+8} width={14} height={14} rx={1} fill={PRIMARY}/></g>
            ))}
            {Array.from({length:180}).map((_,i)=>Math.random()>0.45?<rect key={i} x={30+Math.random()*45} y={30+Math.random()*45} width={3} height={3} rx={0.5} fill={PRIMARY} opacity={0.8}/>:null)}
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{background:timer>60?'#4CAF50':'#F44336'}}/>
          <p className="text-[13px] font-bold" style={{color:timer>60?'#2E7D32':'#C62828'}}>Berlaku {fmt(timer)}</p>
        </div>
        <p className="text-[11px] text-gray-400 text-center mb-6">Scan menggunakan m-banking atau e-wallet QRIS</p>
        <button onClick={()=>setStep('proses')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>Simulasi Bayar Berhasil</button>
      </div>
    </div>
  )
  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900">Bayar dengan QRIS</p>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6">
        <p className="text-[13px] text-gray-500 text-center mb-6">Masukkan nominal yang ingin dibayar</p>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-4 bg-white mb-4" style={{border:`2px solid ${PRIMARY}`}}>
          <span className="text-[16px] font-bold text-gray-400">Rp</span>
          <input type="number" value={nominal} onChange={e=>setNominal(e.target.value)} placeholder="0"
            className="flex-1 outline-none text-[24px] font-extrabold text-gray-900 bg-transparent text-center"/>
        </div>
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {[20000,50000,100000,200000].map(n=>(
            <button key={n} onClick={()=>setNominal(String(n))} className="px-3 py-1.5 rounded-xl text-[11px] font-bold border"
              style={nominal===String(n)?{borderColor:PRIMARY,color:PRIMARY,background:`${PRIMARY}10`}:{borderColor:'#E0E0E0',color:'#6B7280'}}>
              Rp {n>=1000?(n/1000)+'rb':n}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button disabled={!nominal} onClick={()=>setStep('qr')} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform" style={{background:nominal?'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)':'#E0E0E0'}}>Tampilkan QR Code →</button>
      </div>
    </div>
  )
}

// ── Riwayat ────────────────────────────────────────────────
function RiwayatScreen({ transactions, onBack }) {
  const [filter, setFilter] = useState('all')
  const [q,      setQ]      = useState('')
  const filtered = transactions
    .filter(t=>filter==='all'||(filter==='masuk'&&t.amount>0)||(filter==='keluar'&&t.amount<0))
    .filter(t=>!q||t.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#F0F2ED'}}><ArrowLeft size={16} className="text-gray-700"/></button>
        <p className="font-bold text-gray-900 flex-1">Riwayat Transaksi</p>
      </div>
      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{background:'#F5F5F5'}}>
          <Search size={14} className="text-gray-400 flex-shrink-0"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari transaksi..."
            className="flex-1 text-[13px] outline-none bg-transparent"/>
        </div>
      </div>
      {/* Filter */}
      <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
        {[['all','Semua'],['masuk','Masuk'],['keluar','Keluar']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)}
            className="flex-1 py-2.5 text-[12px] font-bold"
            style={filter===id?{color:PRIMARY,borderBottom:`2.5px solid ${PRIMARY}`}:{color:'#9CA3AF',borderBottom:'2.5px solid transparent'}}>
            {lbl}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.length===0&&<div className="py-16 text-center"><p className="text-3xl mb-2">📭</p><p className="text-[13px] text-gray-400">Tidak ada transaksi</p></div>}
        {filtered.map((t,i)=>(
          <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-gray-50">
            <SkeuoIcon
              icon={t.amount > 0 ? TrendingUp : TrendingDown}
              gradient={t.amount > 0 ? ['#1B5E20', '#2E7D32'] : [`${t.ic}dd`, t.ic]}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 line-clamp-2">{t.name}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{t.date}</p>
            </div>
            <span className="text-[14px] font-extrabold flex-shrink-0" style={{color:t.amount>0?PRIMARY:'#111827'}}>
              {t.amount>0?'+':''}Rp {Math.abs(t.amount).toLocaleString('id')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Bill configs ───────────────────────────────────────────
const BILL_CONFIGS = {
  listrik: { label:'Listrik PLN', Icon:Zap, bg:'#FFF3E0', ic:'#E65100', idLabel:'No. Pelanggan', idPlaceholder:'cth. 123456789012', idHint:'Lihat di tagihan PLN atau meteran',
    dummyNama:'Budi Santoso', dummyPeriode:'Juli 2026', dummyAmount:145000, dummyDenda:0 },
  air:     { label:'Air PDAM',    Icon:Droplets, bg:'#E3F2FD', ic:'#1565C0', idLabel:'ID Pelanggan', idPlaceholder:'cth. 0012345678', idHint:'Tertera pada kartu pelanggan PDAM',
    dummyNama:'Budi Santoso', dummyPeriode:'Juli 2026', dummyAmount:78000, dummyDenda:2500 },
  tv:      { label:'TV Kabel',    Icon:Tv2, bg:'#F3E5F5', ic:'#6A1B9A', idLabel:'No. Langganan', idPlaceholder:'cth. TV-123456',
    dummyNama:'Budi Santoso', dummyPeriode:'Agustus 2026', dummyAmount:120000, dummyDenda:0 },
  internet:{ label:'Internet',    Icon:Wifi, bg:'#E8EAF6', ic:'#3949AB', idLabel:'ID Pelanggan', idPlaceholder:'cth. INT-789012',
    dummyNama:'Budi Santoso', dummyPeriode:'Agustus 2026', dummyAmount:299000, dummyDenda:0 },
  bpjs:    { label:'BPJS Kesehatan',Icon:HeartPulse, bg:'#FCE4EC', ic:'#C62828', idLabel:'No. Peserta / NIK', idPlaceholder:'cth. 0001234567890',
    dummyNama:'Budi Santoso', dummyPeriode:'Agustus 2026', dummyAmount:59500, dummyDenda:0 },
  gas:     { label:'Gas / PGN',      Icon:Zap,       bg:'#FFF3E0', ic:'#F57F17', idLabel:'No. Pelanggan', idPlaceholder:'cth. 5210012345678',
    dummyNama:'Budi Santoso', dummyPeriode:'Agustus 2026', dummyAmount:180000, dummyDenda:0 },
  pendidikan:{ label:'Pendidikan',   Icon:Building2, bg:'#E8EAF6', ic:'#3949AB', idLabel:'No. Virtual Account', idPlaceholder:'cth. VA-9999123456',
    dummyNama:'Universitas Terbuka', dummyPeriode:'Semester Ganjil 2026', dummyAmount:2500000, dummyDenda:0 },
}

// ── Main ───────────────────────────────────────────────────
export default function Bayar({ navigate, userData, userProfile, initialScreen }) {
  const initBal = userProfile?.balance ?? 248500
  const [balance,     setBalance]   = useState(initBal)
  const [screen,      setScreen]    = useState(initialScreen || 'main')
  const [transactions,setTransactions] = useState([
    { name:'Token Listrik PLN',  date:'Kemarin 14:32', amount:-145000, bg:'#FFF3E0', ic:'#E65100' },
    { name:'Top Up GV Pay',      date:'3 hari lalu',   amount:+200000, bg:'#E8F5E9', ic:'#1B6B3A' },
    { name:'Pulsa 50rb',         date:'5 hari lalu',   amount:-50000,  bg:'#E8F5E9', ic:'#1B6B3A' },
    { name:'Transfer ke Budi',   date:'1 minggu lalu', amount:-75000,  bg:'#FFF8E1', ic:'#F57F17' },
    { name:'Bayar PDAM',         date:'2 minggu lalu', amount:-80500,  bg:'#E3F2FD', ic:'#1565C0' },
    { name:'Top Up GV Pay',      date:'3 minggu lalu', amount:+500000, bg:'#E8F5E9', ic:'#1B6B3A' },
  ])

  const addTrx = (name, amount, bg, ic) => {
    const newTrx = { name, date:`Baru saja`, amount, bg, ic }
    setTransactions(p=>[newTrx,...p])
  }

  const handleTopUp  = (amt) => { setBalance(b=>b+amt); addTrx('Top Up GV Pay', +amt, '#E8F5E9', PRIMARY) }
  const handlePay    = (name, amt, bg, ic) => { setBalance(b=>b-amt); addTrx(name, -amt, bg, ic) }
  const handleTransfer = (amt) => { setBalance(b=>b-amt); addTrx('Transfer GV Pay', -amt, '#FFF8E1','#F57F17') }

  const ACTIONS = [
    { label:'Listrik PLN',  Icon:Zap,            bg:'#FFF3E0', ic:'#E65100', screen:'listrik',  g: ['#E65100', '#F57C00'] },
    { label:'Pulsa & Data', Icon:Phone,           bg:'#E8F5E9', ic:'#1B6B3A', screen:'pulsa',    g: ['#1B5E20', '#2E7D32'] },
    { label:'Air PDAM',     Icon:Droplets,        bg:'#E3F2FD', ic:'#1565C0', screen:'air',      g: ['#0D47A1', '#1976D2'] },
    { label:'BPJS',         Icon:HeartPulse,      bg:'#FCE4EC', ic:'#C62828', screen:'bpjs',     g: ['#B71C1C', '#D32F2F'] },
    { label:'TV Kabel',     Icon:Tv2,             bg:'#F3E5F5', ic:'#6A1B9A', screen:'tv',       g: ['#4A148C', '#7B1FA2'] },
    { label:'Internet',     Icon:Wifi,            bg:'#E8EAF6', ic:'#3949AB', screen:'internet', g: ['#1A237E', '#303F9F'] },
    { label:'Transfer',     Icon:ArrowRightLeft,  bg:'#FFF8E1', ic:'#F57F17', screen:'transfer', g: ['#F57F17', '#FBC02D'] },
    { label:'Scan QRIS',    Icon:QrCode,          bg:'#FCE4EC', ic:'#AD1457', screen:'qris',     g: ['#880E4F', '#C2185B'] },
    { label:'Riwayat',      Icon:History,         bg:'#EFEBE9', ic:'#5D4037', screen:'riwayat',  g: ['#3E2723', '#5D4037'] },
  ]

  const goBack = () => setScreen('main')
  const done   = () => setScreen('main')

  // Render sub-screens
  if (screen==='topup')    return <TopUpFlow onDone={done} onBack={goBack} onTopUp={handleTopUp}/>
  if (screen==='transfer') return <TransferFlow onDone={done} onBack={goBack} onTransfer={handleTransfer}/>
  if (screen==='pulsa')    return <PulsaFlow onDone={done} onBack={goBack} onPay={amt=>handlePay('Pulsa & Data',amt,'#E8F5E9',PRIMARY)}/>
  if (screen==='qris')     return <QRISFlow onDone={done} onBack={goBack} onPay={amt=>handlePay('Bayar QRIS',amt,'#FCE4EC','#AD1457')}/>
  if (screen==='riwayat')  return <RiwayatScreen transactions={transactions} onBack={goBack}/>
  if (BILL_CONFIGS[screen]) {
    const cfg = BILL_CONFIGS[screen]
    return <BillPayFlow config={cfg} onDone={done} onBack={goBack} onPay={amt=>handlePay(cfg.label,amt,cfg.bg,cfg.ic)}/>
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* Unified ScreenHeader */}
      <ScreenHeader
        title="GV Pay"
        actions={
          <button
            type="button"
            onClick={() => setScreen('riwayat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <History size={13} className="text-white/80" />
            <span className="text-white font-bold text-[11.5px]">Riwayat</span>
          </button>
        }
      >
        {/* Balance card inside header */}
        <div
          className="rounded-2xl px-4 py-3.5"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[11px] font-bold">Saldo GV Pay</p>
              <p className="text-[28px] font-extrabold text-white leading-tight mt-0.5 tabular-nums drop-shadow-sm">
                Rp {balance.toLocaleString('id')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              <span className="text-white/90 text-[11px] font-semibold">
                {(userProfile?.points || 1240).toLocaleString('id')} Poin
              </span>
            </div>
          </div>

          {/* Quick actions (Top Up, Transfer, Scan) */}
          <div className="flex gap-2.5 justify-between mt-3 pt-3 border-t border-white/10">
            {[
              { lbl: 'Top Up', Icon: Plus, sc: 'topup', g: ['#1B5E20', '#2E7D32'] },
              { lbl: 'Transfer', Icon: ArrowRightLeft, sc: 'transfer', g: ['#0D47A1', '#1976D2'] },
              { lbl: 'Scan QRIS', Icon: QrCode, sc: 'qris', g: ['#0C3E1E', '#1B6B3A'] },
            ].map(({ lbl, Icon, sc, g }) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setScreen(sc)}
                className="flex items-center justify-center gap-2 flex-1 py-2 px-2.5 rounded-xl transition active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <SkeuoIcon icon={Icon} size="xs" gradient={g} shape="circle" />
                <span className="text-white text-[12px] font-bold">{lbl}</span>
              </button>
            ))}
          </div>
        </div>
      </ScreenHeader>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-20">
        {/* Services grid */}
        <div
          className="mx-4 rounded-3xl p-4 mb-4 border border-white/80"
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(27, 107, 58, 0.08)',
          }}
        >
          <p className="text-[14px] font-extrabold headline-tight text-surface-900 mb-3.5">Bayar & Beli</p>
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {ACTIONS.map(({label,Icon,g,ic,screen:sc})=> (
              <button key={label} onClick={()=>setScreen(sc)} className="flex flex-col items-center gap-1.5 active:scale-[0.96] transition-transform">
                <SkeuoIcon icon={Icon} gradient={g || (ic === '#1B6B3A' ? ['#1B5E20', '#2E7D32'] : [`${ic}dd`, ic])} size="md" />
                <span className="text-[10px] text-surface-800 font-bold text-center leading-tight w-full">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tagihan aktif */}
        <div className="mx-4 mb-4">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-[13px] font-extrabold headline-tight text-surface-900">Tagihan Aktif</p>
            <button onClick={()=>setScreen('listrik')} className="text-[11px] font-bold flex items-center gap-0.5 active:scale-95 transition text-brand" style={{color:PRIMARY}}>
              Lihat semua <ChevronRight size={14}/>
            </button>
          </div>
          <div
            className="rounded-3xl overflow-hidden border border-white/80"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(27, 107, 58, 0.08)',
            }}
          >
            <div className="flex items-center gap-3 p-4">
              <SkeuoIcon icon={Zap} gradient={['#E65100', '#F57C00']} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">PLN Pascabayar</span>
                  <span className="text-[10px] text-surface-400">Jatuh tempo 20 Ags</span>
                </div>
                <p className="text-[13px] font-bold text-surface-900 mt-0.5">Listrik Rumah - 5412 8890 1234</p>
                <p className="text-[13px] font-extrabold text-brand tabular-nums mt-0.5" style={{color:PRIMARY}}>Rp 148.500</p>
              </div>
              <button
                type="button"
                onClick={()=>setScreen('listrik')}
                className="px-3.5 py-2 rounded-xl text-[11.5px] font-bold text-white active:scale-95 transition shadow-xs"
                style={{background:PRIMARY}}
              >
                Bayar
              </button>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="mx-4 mb-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-[13px] font-extrabold headline-tight text-surface-900">Transaksi Terakhir</p>
            <button onClick={()=>setScreen('riwayat')} className="text-[11px] font-bold flex items-center gap-0.5 active:scale-95 transition text-brand">
              Semua <ChevronRight size={14}/>
            </button>
          </div>
          <div
            className="rounded-3xl overflow-hidden border border-white/80"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(27, 107, 58, 0.08)',
            }}
          >
            {transactions.slice(0,4).map((t,i)=>(
              <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i<3?'border-b border-surface-100':''}`}>
                <SkeuoIcon
                  icon={t.amount > 0 ? TrendingUp : TrendingDown}
                  gradient={t.amount > 0 ? ['#1B5E20', '#2E7D32'] : [`${t.ic}dd`, t.ic]}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-surface-900 leading-snug line-clamp-1">{t.name}</p>
                  <p className="text-[11px] text-surface-400 mt-0.5 font-medium">{t.date}</p>
                </div>
                <span className="text-[13px] font-extrabold flex-shrink-0 tabular-nums" style={{color:t.amount>0?PRIMARY:'#111827'}}>
                  {t.amount>0?'+':''}Rp {Math.abs(t.amount).toLocaleString('id')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav active="bayar" navigate={navigate}/>
    </ScreenBackground>
  )
}
