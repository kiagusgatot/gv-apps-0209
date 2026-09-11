import React, { useState, useEffect, useRef } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import { ArrowLeft, ArrowRight, Upload, Play, Crown, BarChart2,
  Eye, TrendingUp, ChevronRight, Video as VideoIcon,
  Edit2, Trash2, Send, Heart, MessageCircle, MoreHorizontal,
  X, PenSquare, Image as ImageIcon, Users, Sparkles,
  Check, Plus, ToggleRight, ToggleLeft, Star, Settings,
  Tv2, Clock, Info, Shield, Wallet, ArrowUpRight, RefreshCw } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import TanyaGV from '../../components/TanyaGV'

const PRIMARY = '#1B6B3A'
const S = {
  card:   '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
  cardMd: '0 4px 16px rgba(0,0,0,0.09), 0 2px 4px rgba(0,0,0,0.06)',
}

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

const PRIMARY_TABS = [
  { id: 'konten', label: 'Konten' },
  { id: 'membership', label: 'Membership' },
  { id: 'analitik', label: 'Analitik' },
]

// ── Helpers ────────────────────────────────────────────────
function now() {
  const d = new Date()
  return `${d.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'][d.getMonth()]}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// ── Data ───────────────────────────────────────────────────
const STUDIO_CONTENT_INIT = [
  { id:'sc1', title:'Panen Perdana Padi Organik',    ep:'Eps. 1', desc:'Tutorial lengkap cara panen padi organik perdana menggunakan metode SRI.', views:'4.2rb', likes:89,  dur:'12:34', g:['#1B5E20','#2E7D32'], isExclusive:false, status:'tayang' },
  { id:'sc2', title:'Cara Olah Tanah Bebas Kimia',   ep:'Eps. 2', desc:'Teknik pengolahan tanah tanpa bahan kimia sintetis untuk hasil yang lebih sehat.', views:'3.1rb', likes:67,  dur:'18:20', g:['#2E7D32','#388E3C'], isExclusive:false, status:'tayang' },
  { id:'sc3', title:'Pemilihan Bibit Unggul Lokal',  ep:'Eps. 3', desc:'Cara memilih bibit padi unggul lokal yang tahan hama dan cocok untuk lahan desa.', views:'2.8rb', likes:54,  dur:'15:40', g:['#1B5E20','#2E7D32'], isExclusive:false, status:'tayang' },
  { id:'sc4', title:'Teknik Penyiraman Efisien',     ep:'Eps. 1', desc:'', views:'—', likes:0, dur:'22:10', g:['#0D47A1','#1565C0'], isExclusive:true,  status:'tayang' },
  { id:'sc5', title:'Menghitung Keuntungan Panen',   ep:'Eps. 2', desc:'', views:'—', likes:0, dur:'19:30', g:['#4A148C','#7B1FA2'], isExclusive:true,  status:'review' },
]

const STUDIO_POSTS_INIT = [
  { id:'sp1', text:'Musim hujan sudah tiba! Ini 3 tips dari saya untuk mempersiapkan lahan padi agar hasil panen tetap optimal. Drainase yang baik adalah kuncinya 👇', timestamp:'2 jam lalu', editedAt:null, likes:142, comments:24, isExclusive:false, photo:null },
  { id:'sp2', text:'[Member] Rincian lengkap perhitungan ROI tanam padi organik vs konvensional selama 2 musim. Margin organik lebih tinggi 34% setelah biaya pupuk dihitung ulang.', timestamp:'1 hari lalu', editedAt:null, likes:89, comments:31, isExclusive:true, photo:null },
  { id:'sp3', text:'Terima kasih sudah mencapai 24 ribu pengikut! Milestone yang tidak pernah saya bayangkan ketika pertama kali upload video 🌾', timestamp:'3 hari lalu', editedAt:null, likes:334, comments:67, isExclusive:false, photo:null },
  { id:'sp4', text:'[Member] Q&A bulanan: Semua pertanyaan member tentang teknik irigasi dan manajemen air sudah dijawab. Ada 23 pertanyaan yang masuk bulan ini...', timestamp:'5 hari lalu', editedAt:null, likes:156, comments:89, isExclusive:true, photo:null },
]

// ── Upload Video Flow ──────────────────────────────────────
function UploadVideoFlow({ opt, onDone }) {
  const [step, setStep] = useState('pick')
  const [form, setForm] = useState({ title:'', ep:'', desc:'' })

  if (step === 'form') return (
    <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar" style={{maxHeight:'60vh'}}>
      <div className="flex items-center gap-2 pb-1 flex-shrink-0">
        <button onClick={()=>setStep('pick')}
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F0F0'}}>
          <ArrowLeft size={13} className="text-gray-500"/>
        </button>
        <p className="text-[13px] font-bold text-gray-900">{opt.label}</p>
        {opt.exclusive && <Crown size={12} style={{color:'#F9A825'}}/>}
      </div>

      {/* Drop zone */}
      <div className="border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 transition duration-300 hover:scale-[1.01]"
        style={{borderColor:`${opt.color}50`,background:`${opt.color}06`}}>
        <Upload size={22} style={{color:opt.color}}/>
        <p className="text-[12px] font-semibold text-gray-600">Tap untuk pilih file video</p>
        <p className="text-[12px] text-gray-400">MP4, MOV · maks. 500 MB</p>
      </div>

      {/* Judul */}
      <div>
        <p className="text-[11px] font-bold text-gray-500 mb-1.5">Judul Video</p>
        <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
          placeholder="Masukkan judul video..."
          className="w-full rounded-2xl px-4 py-2.5 text-[12px] outline-none spotlight-border"
          style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
      </div>

      {/* Label Episode — opsional */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <p className="text-[11px] font-bold text-gray-500">Label Episode</p>
          <span className="text-[11px] text-gray-400 px-1.5 py-0.5 rounded-md" style={{background:'#F0F0F0'}}>Opsional</span>
        </div>
        <input value={form.ep} onChange={e=>setForm(f=>({...f,ep:e.target.value}))}
          placeholder="Contoh: Eps. 6"
          className="w-full rounded-2xl px-4 py-2.5 text-[12px] outline-none spotlight-border"
          style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
      </div>

      {/* Deskripsi */}
      <div>
        <p className="text-[11px] font-bold text-gray-500 mb-1.5">Deskripsi</p>
        <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}
          placeholder="Ceritakan isi video ini kepada penonton..."
          className="w-full rounded-2xl px-4 py-2.5 text-[12px] outline-none resize-none spotlight-border"
          style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA',minHeight:72}}/>
      </div>

      <button onClick={onDone}
        className="w-full py-3 rounded-2xl text-[12px] font-bold text-white transition active:scale-[0.96]"
        style={{background:opt.exclusive?'linear-gradient(90deg,#F57F17,#F9A825)':'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
          boxShadow:`0 4px 12px ${opt.color}40`}}>
        Upload & Tayangkan
      </button>
    </div>
  )

  return (
    <button onClick={()=>setStep('form')}
      className="flex items-center gap-3 p-3.5 rounded-2xl text-left transition active:scale-[0.96] w-full"
      style={{background:'#F9FAFB',border:`1.5px solid ${opt.color}30`}}>
      <span className="text-xl flex-shrink-0">{opt.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-gray-900">{opt.label}</p>
        <p className="text-[12px] text-gray-400 mt-0.5">{opt.sub}</p>
      </div>
      {opt.exclusive && <Crown size={13} style={{color:'#F9A825'}} className="flex-shrink-0"/>}
      <ChevronRight size={14} className="text-gray-300 flex-shrink-0"/>
    </button>
  )
}

// ── Global Upload Modal (header shortcut — 4 opsi) ─────────
function GlobalUploadModal({ onClose, onVideoUpload, onPostCompose }) {
  const ALL_OPTS = [
    { icon:'🎬', label:'Video Publik',          sub:'Dapat ditonton semua pengguna GV',       color:PRIMARY,   type:'video', exclusive:false },
    { icon:'👑', label:'Video Members only',    sub:'Hanya untuk member channel-mu',           color:'#F9A825', type:'video', exclusive:true  },
    { icon:'✍️', label:'Post Teks Publik',      sub:'Postingan teks di tab Post',              color:PRIMARY,   type:'post',  exclusive:false },
    { icon:'🔒', label:'Post Teks Members only',sub:'Post eksklusif khusus member',            color:'#F9A825', type:'post',  exclusive:true  },
  ]
  const [videoOpt, setVideoOpt] = useState(null)

  if (videoOpt) return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative rounded-t-3xl px-5 pt-5 pb-8 bg-white animate-slide-up"
        style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.18)'}}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4"/>
        <UploadVideoFlow opt={videoOpt} onDone={onClose}/>
      </div>
    </div>
  )

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative rounded-t-3xl px-5 pt-5 pb-8 bg-white animate-slide-up"
        style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.18)'}}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5"/>
        <p className="text-[16px] font-extrabold text-gray-900 mb-1">Tambah Konten</p>
        <p className="text-[11px] text-gray-400 mb-4">Pilih jenis konten yang ingin kamu buat.</p>
        <div className="flex flex-col gap-3 mb-4">
          {ALL_OPTS.map(opt=>(
            <button key={opt.label}
              onClick={()=>{
                if (opt.type==='video') { setVideoOpt(opt) }
                else { onPostCompose(opt.exclusive ? 'member' : 'publik'); onClose() }
              }}
              className="flex items-center gap-3 p-3.5 rounded-2xl text-left transition active:scale-[0.96] w-full"
              style={{background:'#F9FAFB',border:`1.5px solid ${opt.color}25`}}>
              <span className="text-xl flex-shrink-0">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-gray-900">{opt.label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{opt.sub}</p>
              </div>
              {opt.exclusive && <Crown size={13} style={{color:'#F9A825'}} className="flex-shrink-0"/>}
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0"/>
            </button>
          ))}
        </div>
        <button onClick={onClose}
          className="w-full py-3 rounded-2xl text-[12px] font-semibold text-gray-400">
          Batal
        </button>
      </div>
    </div>
  )
}

// ── Tab: Konten (Video & Post via Sub-Toggle) ──────────────
function TabKonten({
  subTab,
  setSubTab,
  showUpload,
  setUpload,
  postComposeType,
  clearCompose,
  postTrigger,
  onEditVideoChange,
  onComposePostChange,
}) {
  const [contents, setContents] = useState(STUDIO_CONTENT_INIT)
  const [filter, setFilter]     = useState('all')
  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    if (postComposeType) {
      setSubTab?.('post')
    }
  }, [postComposeType, setSubTab])

  const filtered = contents.filter(c =>
    filter==='all'    ? true :
    filter==='publik' ? !c.isExclusive :
    filter==='member' ?  c.isExclusive :
    c.status===filter
  )

  const openEdit = c => {
    setEditItem(c)
    setEditForm({ title:c.title, ep:c.ep, desc:c.desc||'', isExclusive:c.isExclusive })
    onEditVideoChange?.(true)
  }

  const closeEdit = () => {
    setEditItem(null)
    onEditVideoChange?.(false)
  }

  const saveEdit = () => {
    setContents(prev => prev.map(c => c.id===editItem.id ? {...c,...editForm} : c))
    closeEdit()
  }

  const deleteItem = () => {
    setContents(prev => prev.filter(c => c.id!==editItem.id))
    closeEdit()
  }

  useEffect(() => {
    return () => {
      onEditVideoChange?.(false)
    }
  }, [onEditVideoChange])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Sub-Toggle (Video | Post) — Pill Style ── */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <div className="flex bg-surface-100 p-1 rounded-2xl border border-surface-200/70 shadow-2xs">
          <button
            type="button"
            onClick={() => setSubTab?.('video')}
            className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition flex items-center justify-center gap-1.5 active:scale-[0.98] ${
              subTab === 'video'
                ? 'bg-white text-surface-900 shadow-xs'
                : 'text-surface-500 hover:text-surface-800'
            }`}
          >
            <VideoIcon size={13} className={subTab === 'video' ? 'text-purple-700' : 'text-surface-400'} />
            <span>Video ({contents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab?.('post')}
            className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold transition flex items-center justify-center gap-1.5 active:scale-[0.98] ${
              subTab === 'post'
                ? 'bg-white text-surface-900 shadow-xs'
                : 'text-surface-500 hover:text-surface-800'
            }`}
          >
            <PenSquare size={13} className={subTab === 'post' ? 'text-purple-700' : 'text-surface-400'} />
            <span>Post ({STUDIO_POSTS_INIT.length})</span>
          </button>
        </div>
      </div>

      {subTab === 'video' ? (
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-28">
          {/* Action Toolbar without Upload button */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
              {[['all','Semua'],['tayang','Tayang'],['review','Review'],['publik','Publik'],['member','Members only']].map(([id,label])=>(
                <button key={id} onClick={()=>setFilter(id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
                    filter===id
                      ? 'bg-surface-900 text-white border-surface-900 shadow-2xs'
                      : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content list as elevated modern cards */}
          <div className="space-y-3">
            {filtered.map((c)=>(
              <div key={c.id} className="bg-white rounded-3xl p-3.5 border border-surface-100 shadow-sm transition hover:shadow-brand-sm flex gap-3.5 items-start">
                <div className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-xs"
                  style={{width:116,height:70,background:`linear-gradient(135deg,${c.g[0]},${c.g[1]})`}}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {c.isExclusive
                      ? <Crown size={18} style={{color:'#F9A825'}}/>
                      : <Play size={18} className="text-white/80" fill="rgba(255,255,255,0.6)"/>}
                  </div>
                  <span className="absolute bottom-1 end-1 text-[10px] font-black text-white px-1.5 py-0.5 rounded bg-black/60">
                    {c.dur}
                  </span>
                  {c.isExclusive && (
                    <div className="absolute top-1 start-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black">
                      Members
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-surface-900 leading-snug line-clamp-2">{c.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[11px] text-surface-400 font-medium">{c.ep}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border"
                      style={c.status==='review'
                        ? {background:'#FFF7ED',color:'#EA580C',borderColor:'#FFEDD5'}
                        : {background:'#ECFDF5',color:'#059669',borderColor:'#A7F3D0'}}>
                      {c.status==='review' ? '⏳ Review' : '✓ Tayang'}
                    </span>
                  </div>
                  {!c.isExclusive && c.views!=='—' && (
                    <div className="flex items-center gap-3 mt-2 text-[11.5px] text-surface-400">
                      <span className="flex items-center gap-1"><Eye size={11}/><span className="tabular-nums font-bold text-surface-700">{c.views}</span></span>
                      <span className="flex items-center gap-1">❤️ <span className="tabular-nums font-bold text-surface-700">{c.likes}</span></span>
                    </div>
                  )}
                </div>

                <button onClick={()=>openEdit(c)}
                  className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-600 transition active:scale-95 flex-shrink-0"
                  title="Edit Video">
                  <Edit2 size={14}/>
                </button>
              </div>
            ))}
          </div>

          {/* ── Edit metadata sheet ── */}
          {editItem && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEdit}/>
              <div className="relative rounded-t-3xl bg-white px-5 pt-4 pb-8 animate-slide-up"
                style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.18)'}}>
                <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4"/>
                {/* Preview */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative flex-shrink-0 rounded-xl overflow-hidden"
                    style={{width:64,height:40,background:`linear-gradient(135deg,${editItem.g[0]},${editItem.g[1]})`}}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={12} className="text-white/70" fill="rgba(255,255,255,0.5)"/>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 line-clamp-1">{editItem.title}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{editItem.dur}</p>
                  </div>
                </div>

                {/* Form edit */}
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Judul Video</label>
                    <input value={editForm.title||''} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))}
                      className="w-full text-[13px] font-semibold text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-700"/>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Episode / Keterangan</label>
                    <input value={editForm.ep||''} onChange={e=>setEditForm(f=>({...f,ep:e.target.value}))}
                      placeholder="Eps. 1"
                      className="w-full text-[13px] text-gray-800 px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-700"/>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Deskripsi</label>
                    <textarea value={editForm.desc||''} onChange={e=>setEditForm(f=>({...f,desc:e.target.value}))}
                      rows={2}
                      className="w-full text-[12px] text-gray-800 px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-700 resize-none"/>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1.5">Akses Video</label>
                    <div className="flex gap-2">
                      {[
                        { val:false, label:'Publik',       ico:'🌐', color:'#1B6B3A' },
                        { val:true,  label:'Members only', ico:'👑', color:'#F9A825' },
                      ].map(({val,label,ico,color})=>(
                        <button key={label} onClick={()=>setEditForm(f=>({...f,isExclusive:val}))}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-[11px] font-bold border-2 transition"
                          style={editForm.isExclusive===val
                            ? {borderColor:color,background:`${color}12`,color:color}
                            : {borderColor:'#E0E0E0',background:'#FAFAFA',color:'#9CA3AF'}}>
                          {ico} {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={saveEdit}
                  className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white mb-2 transition active:scale-[0.96]"
                  style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',boxShadow:`0 4px 12px ${PRIMARY}40`}}>
                  Simpan Perubahan
                </button>
                <button onClick={deleteItem}
                  className="w-full py-3 rounded-2xl text-[12px] font-semibold flex items-center justify-center gap-2 transition active:scale-[0.96]"
                  style={{color:'#EF4444',background:'#FEF2F2'}}>
                  <Trash2 size={13}/> Hapus Konten
                </button>
              </div>
            </div>
          )}

          {/* Upload video modal — 2 opsi video */}
          {showUpload && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setUpload(false)}/>
              <div className="relative rounded-t-3xl px-5 pt-5 pb-8 bg-white animate-slide-up"
                style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.18)'}}>
                <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5"/>
                <p className="text-[16px] font-extrabold text-gray-900 mb-1">Upload Video</p>
                <p className="text-[11px] text-gray-400 mb-4">Pilih tipe penayangan untuk video-mu.</p>
                <div className="flex flex-col gap-3 mb-4">
                  {[
                    {icon:'🎬',label:'Video Publik',      sub:'Dapat ditonton semua pengguna GV',color:PRIMARY,  exclusive:false},
                    {icon:'👑',label:'Video Members only',sub:'Hanya untuk member channel-mu',  color:'#F9A825',exclusive:true},
                  ].map(opt=>(
                    <UploadVideoFlow key={opt.label} opt={opt} onDone={()=>setUpload(false)}/>
                  ))}
                </div>
                <button onClick={()=>setUpload(false)}
                  className="w-full py-3 rounded-2xl text-[12px] font-semibold text-gray-400">
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <TabPost
          autoComposeType={postComposeType}
          clearAutoCompose={clearCompose}
          triggerOpenCompose={postTrigger}
          onComposeChange={onComposePostChange}
        />
      )}
    </div>
  )
}

// ── Tab: Post ──────────────────────────────────────────────
function TabPost({ autoComposeType, clearAutoCompose, triggerOpenCompose, onComposeChange }) {
  const [posts, setPosts]         = useState(STUDIO_POSTS_INIT)
  const [showCompose, setCompose] = useState(false)
  const [composeText, setText]    = useState('')
  const [composeType, setType]    = useState('publik')
  const [composePhoto, setPhoto]  = useState(null)   // base64 preview
  const [editingPost, setEditing] = useState(null)   // post yang sedang diedit
  const [menuOpen, setMenu]       = useState(null)
  const [filter, setFilter]       = useState('all')
  const fileRef                   = useRef(null)

  const openCompose = () => {
    setEditing(null); setText(''); setPhoto(null); setType('publik')
    setCompose(true)
    onComposeChange?.(true)
  }

  const closeCompose = () => {
    setText(''); setPhoto(null); setEditing(null)
    setCompose(false)
    onComposeChange?.(false)
  }

  const openEdit = p => {
    setEditing(p)
    setText(p.text)
    setType(p.isExclusive ? 'member' : 'publik')
    setPhoto(p.photo || null)
    setMenu(null)
    setCompose(true)
    onComposeChange?.(true)
  }

  useEffect(() => {
    if (triggerOpenCompose) {
      openCompose()
    }
  }, [triggerOpenCompose])

  // Dibuka dari header Upload → Post Teks
  useEffect(()=>{
    if (autoComposeType) {
      setType(autoComposeType)
      setText(''); setPhoto(null); setEditing(null)
      setCompose(true)
      onComposeChange?.(true)
      clearAutoCompose()
    }
  }, [autoComposeType])

  useEffect(() => {
    return () => {
      onComposeChange?.(false)
    }
  }, [onComposeChange])

  const handlePhoto = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const submitPost = () => {
    if (!composeText.trim()) return
    const ts = now()
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id===editingPost.id
        ? {...p, text:composeText, isExclusive:composeType==='member', photo:composePhoto, editedAt:ts}
        : p
      ))
    } else {
      setPosts(prev => [{
        id:`sp${Date.now()}`, text:composeText, timestamp:'Baru saja', editedAt:null,
        likes:0, comments:0, isExclusive:composeType==='member', photo:composePhoto,
      }, ...prev])
    }
    closeCompose()
  }

  const deletePost = id => { setPosts(p=>p.filter(x=>x.id!==id)); setMenu(null) }

  const filtered = posts.filter(p =>
    filter==='all'    ? true :
    filter==='publik' ? !p.isExclusive :
    p.isExclusive
  )

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
      <div className="flex gap-2 px-4 pt-2 pb-3 overflow-x-auto no-scrollbar">
        {[['all','Semua'],['publik','Publik'],['member','Members only']].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition duration-300"
            style={filter===id
              ? {background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',color:'#fff',borderColor:PRIMARY}
              : {background:'transparent',color:'#9CA3AF',borderColor:'#E0E0E0'}}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col pb-6">
        {filtered.length===0 ? (
          <div className="py-12 text-center px-6">
            <p className="text-3xl mb-3">📝</p>
            <p className="text-[14px] font-bold text-gray-900 mb-1">Belum ada post</p>
            <p className="text-[11px] text-gray-400">Buat post pertamamu untuk berinteraksi dengan pengikut.</p>
          </div>
        ) : filtered.map((p,i)=>(
          <div key={p.id} className="px-4 py-2.5">
            <div className="bg-white rounded-2xl p-4 w-full box-border"
              style={{boxShadow: '0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#1B5E20,#2E7D32)'}}>🌾</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[12px] font-bold text-gray-900">Pak Tani Bogor</p>
                    {p.isExclusive && (
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                        style={{background:'linear-gradient(90deg,#F57F17,#F9A825)',boxShadow:'0 2px 8px rgba(249,168,37,0.3)'}}>
                        <Crown size={8} className="text-white"/>
                        <span className="text-[11px] font-bold text-white">Members only</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    {p.timestamp}
                    {p.editedAt && (
                      <span className="text-gray-300"> · <span className="italic">diedit {p.editedAt}</span></span>
                    )}
                  </p>
                </div>
                <div className="relative">
                  <button onClick={()=>setMenu(menuOpen===p.id?null:p.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition active:scale-[0.96]"
                    style={{background:'#F5F5F5'}}>
                    <MoreHorizontal size={13} className="text-gray-500"/>
                  </button>
                  {menuOpen===p.id && (
                    <div className="absolute end-0 top-8 z-20 rounded-xl overflow-hidden animate-scale-in"
                      style={{background:'#fff',border:'1px solid #F0F0F0',minWidth:140,boxShadow:S.cardMd}}>
                      <button onClick={()=>openEdit(p)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold text-gray-700">
                        <Edit2 size={12}/> Edit Post
                      </button>
                      <div style={{height:1,background:'#F5F5F5'}}/>
                      <button onClick={()=>deletePost(p.id)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold text-red-500">
                        <Trash2 size={12}/> Hapus Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[13px] text-gray-800 leading-relaxed mb-3 whitespace-pre-wrap">{p.text}</p>

              {/* Photo preview (jika ada) */}
              {p.photo && (
                <div className="mb-3 rounded-2xl overflow-hidden"
                  style={{height:120,background:'#F0F0F0'}}>
                  <img src={p.photo} alt="" className="w-full h-full object-cover border border-black/10"/>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400"><Heart size={14} strokeWidth={2}/> <span className="tabular-nums">{p.likes}</span></span>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400"><MessageCircle size={14} strokeWidth={2}/> <span className="tabular-nums">{p.comments}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Compose / Edit sheet ── */}
      {showCompose && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeCompose}/>
          <div className="relative rounded-t-3xl bg-white flex flex-col"
            style={{maxHeight:'85%',boxShadow:'0 -4px 32px rgba(0,0,0,0.18)'}}>

            {/* Sheet header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
              <p className="text-[15px] font-extrabold text-gray-900">
                {editingPost ? 'Edit Post' : 'Buat Post'}
              </p>
              <button onClick={closeCompose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{background:'#F5F5F5'}}>
                <X size={15} className="text-gray-500"/>
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex-shrink-0 flex gap-2 px-5 pb-3">
              {[['publik','🌐 Publik'],['member','👑 Members only']].map(([id,label])=>(
                <button key={id} onClick={()=>setType(id)}
                  className="flex-1 py-2 rounded-full text-[11px] font-bold border transition"
                  style={composeType===id
                    ? id==='member'
                      ? {background:'linear-gradient(90deg,#F57F17,#F9A825)',color:'#fff',borderColor:'#F9A825'}
                      : {background:PRIMARY,color:'#fff',borderColor:PRIMARY}
                    : {background:'transparent',color:'#9CA3AF',borderColor:'#E0E0E0'}}>
                  {label}
                </button>
              ))}
            </div>

            {composeType==='member' && (
              <div className="mx-5 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2 flex-shrink-0"
                style={{background:'#FFF8E1',border:'1px solid #F9A82540'}}>
                <Crown size={12} style={{color:'#F9A825'}} className="flex-shrink-0"/>
                <p className="text-[12px] text-amber-700 leading-snug">Hanya member channel-mu yang bisa melihat post ini.</p>
              </div>
            )}

            {/* Text area */}
            <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#1B5E20,#2E7D32)'}}>🌾</div>
                <textarea value={composeText} onChange={e=>setText(e.target.value)}
                  placeholder="Tulis sesuatu untuk pengikutmu..."
                  autoFocus
                  className="flex-1 text-[13px] text-gray-800 leading-relaxed outline-none resize-none"
                  style={{minHeight:100,background:'transparent'}}/>
              </div>

              {/* Photo preview */}
              {composePhoto && (
                <div className="relative mt-3 ms-12 rounded-2xl overflow-hidden"
                  style={{height:140,background:'#F0F0F0'}}>
                  <img src={composePhoto} alt="" className="w-full h-full object-cover border border-black/10"/>
                  <button onClick={()=>setPhoto(null)}
                    className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{background:'rgba(0,0,0,0.55)'}}>
                    <X size={13} className="text-white"/>
                  </button>
                </div>
              )}
            </div>

            {/* Footer — attach photo + post */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 pb-6 pt-3 border-t border-gray-100">
              {/* Photo attach */}
              <button onClick={()=>fileRef.current?.click()}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-[0.96]"
                style={{background:composePhoto?`${PRIMARY}15`:'#F0F0F0'}}>
                <ImageIcon size={16} style={{color:composePhoto?PRIMARY:'#9CA3AF'}}/>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>

              <span className="text-[12px] text-gray-300 flex-shrink-0">{composeText.length} karakter</span>

              <button onClick={submitPost} disabled={!composeText.trim()}
                className="ms-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition"
                style={{background:composeText.trim()
                  ? composeType==='member'?'linear-gradient(90deg,#F57F17,#F9A825)':PRIMARY
                  :'#E0E0E0'}}>
                <Send size={13}/> {editingPost ? 'Simpan' : 'Posting'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab: Analitik ──────────────────────────────────────────
function TabAnalitik() {
  const WEEKLY = [65,80,45,90,110,75,95]
  const maxV   = Math.max(...WEEKLY)
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
      <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-4">
        {[
          {label:'Total Ditonton',value:'10.1rb',Icon:Eye,        color:'#1B6B3A',bg:'#E8F5E9'},
          {label:'Pengikut',      value:'24.8rb',Icon:Users,      color:'#1565C0',bg:'#E3F2FD'},
          {label:'Total Konten',  value:'18',    Icon:VideoIcon,  color:'#E65100',bg:'#FFF3E0'},
          {label:'Member Aktif',  value:'142',   Icon:Crown,      color:'#F9A825',bg:'#FFF8E1'},
        ].map(stat=>(
          <div key={stat.label} className="bg-white rounded-2xl p-3.5 spotlight-border stagger-in" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:stat.bg}}>
              <stat.Icon size={16} style={{color:stat.color}}/>
            </div>
            <p className="text-[18px] font-extrabold text-gray-900 headline-display tabular-nums">{stat.value}</p>
            <p className="text-[9.5px] text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 bg-white rounded-2xl p-4 mb-4 spotlight-border" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-gray-900">Tampilan Video 7 Hari</p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{background:'#E8F5E9'}}>
            <TrendingUp size={11} style={{color:PRIMARY}}/><span className="text-[12px] font-bold tabular-nums" style={{color:PRIMARY}}>+23%</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-20">
          {WEEKLY.map((v,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition duration-300" style={{height:`${(v/maxV)*64}px`,background:i===6?'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)':'#C8E6C9'}}/>
              <span className="text-[11px] text-gray-400">{['S','S','R','K','J','S','M'][i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 bg-white rounded-2xl p-4 mb-4 spotlight-border" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-gray-900">Performa Post</p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{background:'#E8F5E9'}}>
            <TrendingUp size={11} style={{color:PRIMARY}}/><span className="text-[12px] font-bold tabular-nums" style={{color:PRIMARY}}>+15%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[['721','Total Suka','❤️'],['211','Total Komentar','💬'],['4','Post Bulan Ini','📝']].map(([v,l,e])=>(
            <div key={l} className="text-center py-2 rounded-xl" style={{background:'#F9FAFB'}}>
              <p className="text-[11px] mb-0.5">{e}</p>
              <p className="text-[15px] font-extrabold text-gray-900 headline-display tabular-nums">{v}</p>
              <p className="text-[8.5px] text-gray-400 leading-tight">{l}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px] font-semibold text-gray-400 mb-2">Post Terpopuler</p>
        {STUDIO_POSTS_INIT.filter(p=>!p.isExclusive).slice(0,2).map((p,i)=>(
          <div key={p.id} className={`py-2.5 ${i===0?'border-b border-gray-50':''}`}>
            <p className="text-[11px] text-gray-700 line-clamp-2 mb-1">{p.text}</p>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-gray-400 flex items-center gap-1"><Heart size={10}/><span className="tabular-nums">{p.likes}</span></span>
              <span className="text-[12px] text-gray-400 flex items-center gap-1"><MessageCircle size={10}/><span className="tabular-nums">{p.comments}</span></span>
              <span className="text-[12px] text-gray-400 ms-auto">{p.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <p className="text-[13px] font-bold text-gray-900 mb-3">Video Terpopuler</p>
        <div className="flex flex-col gap-2">
          {STUDIO_CONTENT_INIT.filter(c=>!c.isExclusive).map((c,i)=>(
            <div key={c.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 spotlight-border transition-shadow duration-300 hover:shadow-md" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
              <span className="text-[13px] font-extrabold w-5 flex-shrink-0 tabular-nums"
                style={{color:i===0?'#F9A825':i===1?'#9CA3AF':'#CD7F32'}}>{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-gray-900 line-clamp-2">{c.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.ep} · <span className="tabular-nums">{c.views}</span> tampilan</p>
              </div>
              <span className="text-[12px] text-gray-500 flex items-center gap-1"><Eye size={11} className="text-gray-300"/><span className="tabular-nums">{c.views}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab definitions ────────────────────────────────────────
// ── Membership Settings Sheet ──────────────────────────────
const INIT_TIERS = []

function TabMembership() {
  const [tiers, setTiers] = useState(INIT_TIERS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [editId, setEditId] = useState(null)
  
  const [editData, setEditData] = useState({
    name: '', price: '', desc: '', benefits: ['']
  })
  const [errors, setErrors] = useState({})

  const PRIMARY = '#1B6B3A'

  const totalSubs = tiers.reduce((s, t) => s + (t.subscribers || 0), 0)
  const totalRev  = tiers.reduce((s, t) => s + (t.subscribers || 0) * t.price, 0)

  const openCreate = () => {
    setModalMode('create')
    setEditData({ name: '', price: '', desc: '', benefits: [''] })
    setErrors({})
    setIsModalOpen(true)
  }

  const openEdit = (tier) => {
    setModalMode('edit')
    setEditId(tier.id)
    setEditData({ name: tier.name, price: tier.price, desc: tier.desc || '', benefits: [...tier.benefits] })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const err = {}
    if (!editData.name.trim()) err.name = 'Nama tier wajib diisi'
    if (!editData.price || Number(editData.price) <= 0) err.price = 'Harga tidak valid'
    if (!editData.desc.trim()) err.desc = 'Deskripsi tier wajib diisi'
    const validBenefits = editData.benefits.filter(b => b.trim() !== '')
    if (validBenefits.length === 0) err.benefits = 'Minimal satu benefit'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const saveTier = () => {
    if (!validate()) return
    const cleanedBenefits = editData.benefits.filter(b => b.trim() !== '')
    
    if (modalMode === 'create') {
      const newId = Date.now()
      setTiers([...tiers, {
        id: newId,
        name: editData.name,
        price: Number(editData.price),
        desc: editData.desc,
        benefits: cleanedBenefits,
        active: true,
        subscribers: 0 // Start with 0
      }])
    } else {
      setTiers(p => p.map(t => t.id === editId ? { 
        ...t, 
        name: editData.name, 
        price: Number(editData.price), 
        desc: editData.desc, 
        benefits: cleanedBenefits 
      } : t))
    }
    setIsModalOpen(false)
  }

  const deleteTier = (tier) => {
    if (tier.subscribers > 0) {
      alert('Tidak dapat menghapus tier yang masih memiliki subscriber aktif. Silakan nonaktifkan tier ini terlebih dahulu.')
      return
    }
    if (window.confirm(`Hapus tier "${tier.name}"?`)) {
      setTiers(p => p.filter(t => t.id !== tier.id))
    }
  }

  const toggleTier = (id) => setTiers(p => p.map(t => t.id === id ? { ...t, active: !t.active } : t))
  
  const updateBenefit = (idx, val) => setEditData(p => ({ ...p, benefits: p.benefits.map((b, i) => i === idx ? val : b) }))
  const addBenefit = () => setEditData(p => ({ ...p, benefits: [...p.benefits, ''] }))
  const removeBenefit = (idx) => setEditData(p => ({ ...p, benefits: p.benefits.filter((_, i) => i !== idx) }))

  if (isModalOpen) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button onClick={() => setIsModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <p className="font-extrabold text-gray-900 flex-1">{modalMode === 'create' ? 'Buat Tier Baru' : 'Edit Tier'}</p>
          <button onClick={saveTier}
            className="px-4 py-2 rounded-xl text-[12px] font-bold text-white shadow-sm active:scale-95 transition-transform"
            style={{ background: PRIMARY }}>Simpan</button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-5">
          {/* Name */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>Nama Tier</span>
              {errors.name && <span className="text-red-500 font-bold">{errors.name}</span>}
            </p>
            <input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
              placeholder="Contoh: Pendukung, Sahabat Kreator"
              className={`w-full rounded-2xl px-4 py-3 text-[13px] outline-none border-[1.5px] ${errors.name ? 'border-red-300' : 'border-[#E0E0E0]'} bg-[#FAFAFA] focus:border-[#1B6B3A] transition-colors`} />
          </div>
          {/* Price */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>Harga per Bulan</span>
              {errors.price && <span className="text-red-500 font-bold">{errors.price}</span>}
            </p>
            <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 border-[1.5px] ${errors.price ? 'border-red-300' : 'border-[#E0E0E0]'} bg-[#FAFAFA] focus-within:border-[#1B6B3A] transition-colors`}>
              <span className="text-gray-400 text-[13px] font-semibold">Rp</span>
              <input type="number" value={editData.price} placeholder="15000"
                onChange={e => setEditData(p => ({ ...p, price: e.target.value }))}
                className="flex-1 outline-none text-[15px] font-bold text-gray-900 bg-transparent" />
            </div>
          </div>
          {/* Description */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>Deskripsi Tier</span>
              {errors.desc && <span className="text-red-500 font-bold">{errors.desc}</span>}
            </p>
            <textarea value={editData.desc} onChange={e => setEditData(p => ({ ...p, desc: e.target.value }))}
              placeholder="Deskripsikan nilai membership ini untuk pendukung Anda..."
              className={`w-full rounded-2xl px-4 py-3 text-[13px] outline-none border-[1.5px] min-h-[80px] ${errors.desc ? 'border-red-300' : 'border-[#E0E0E0]'} bg-[#FAFAFA] focus:border-[#1B6B3A] transition-colors`} />
          </div>
          {/* Benefits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Daftar Benefit</p>
              <button onClick={addBenefit}
                className="flex items-center gap-1 text-[11px] font-bold bg-[#F5FBF5] px-2 py-1 rounded-md"
                style={{ color: PRIMARY }}>
                <Plus size={12} /> Tambah
              </button>
            </div>
            {errors.benefits && <p className="text-[11px] font-bold text-red-500 mb-2">{errors.benefits}</p>}
            <div className="flex flex-col gap-2">
              {editData.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${PRIMARY}20` }}>
                    <Check size={10} style={{ color: PRIMARY }} />
                  </div>
                  <input value={b} onChange={e => updateBenefit(i, e.target.value)}
                    placeholder="Contoh: Akses grup khusus"
                    className="flex-1 rounded-xl px-3 py-2 text-[12px] outline-none border-[1.5px] border-[#E0E0E0] bg-[#FAFAFA] focus:border-[#1B6B3A]" />
                  {editData.benefits.length > 1 && (
                    <button onClick={() => removeBenefit(i)} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative bg-[#FAFBF9]">
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-gray-100 bg-white">
        <p className="text-[15px] font-extrabold text-gray-900">Kelola Membership</p>
        <p className="text-[12px] text-gray-400 mt-0.5">{totalSubs} subscriber aktif</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
        {/* Revenue summary */}
        <div className="rounded-2xl p-4 flex gap-4 shadow-sm"
          style={{ background: 'linear-gradient(135deg,#0C3E1E,#1B6B3A)' }}>
          <div className="flex-1">
            <p className="text-[12px] text-white/50 mb-0.5">Pendapatan bulanan</p>
            <p className="text-[20px] font-extrabold text-white">Rp {(totalRev * 0.7).toLocaleString('id')}</p>
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-white/50 mb-0.5">Total subscriber</p>
            <p className="text-[20px] font-extrabold text-white">{totalSubs}</p>
          </div>
        </div>

        {tiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-4 py-10 bg-white rounded-2xl border border-dashed border-gray-300 mt-2">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Crown size={24} className="text-green-600"/>
            </div>
            <p className="text-[14px] font-extrabold text-gray-900 mb-2">Belum ada tier membership</p>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-6">Buat tier membership untuk mulai menawarkan keuntungan khusus kepada pengikut Anda.</p>
            <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-white text-[12px] font-bold shadow-md active:scale-95 transition-transform" style={{background:PRIMARY}}>
              Buat Tier Pertama
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider -mb-1">Tier Membership</p>
            {tiers.map((tier, idx) => {
              const BADGES = ['🥉','🥈','🥇']
              return (
                <div key={tier.id} className="bg-white rounded-2xl overflow-hidden flex flex-col"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: tier.active ? `1.5px solid ${PRIMARY}20` : '1.5px solid #F0F0F0', opacity: tier.active ? 1 : 0.65 }}>
                  
                  {/* Tier header */}
                  <div className="flex items-start justify-between p-4 border-b border-gray-50 bg-[#FAFAFA]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{BADGES[idx]}</span>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Level {idx + 1}</p>
                        <p className="text-[14px] font-extrabold text-gray-900">{tier.name}</p>
                        <p className="text-[12px] font-bold" style={{ color: PRIMARY }}>
                          Rp {tier.price.toLocaleString('id')}/bulan
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-extrabold text-gray-900">{tier.subscribers}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Subs</p>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="px-4 pt-3 pb-2">
                    {tier.desc && <p className="text-[12px] text-gray-600 leading-relaxed mb-3 italic">"{tier.desc}"</p>}
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Benefit:</p>
                    {tier.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: tier.active ? `${PRIMARY}15` : '#E5E7EB' }}>
                          <Check size={9} style={{ color: tier.active ? PRIMARY : '#9CA3AF' }} />
                        </div>
                        <p className="text-[12px] text-gray-700 leading-snug">{b}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Bar */}
                  <div className="flex items-center gap-2 p-3 mt-auto border-t border-gray-50 bg-gray-50/50">
                    <button onClick={() => toggleTier(tier.id)} className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition flex justify-center items-center gap-1.5 ${tier.active ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                      {tier.active ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>}
                      {tier.active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button onClick={() => openEdit(tier)} className="flex-1 py-2 rounded-xl text-[11px] font-bold bg-[#E8F5E9] text-[#1B6B3A] transition flex justify-center items-center gap-1.5">
                      <Edit2 size={12}/> Edit
                    </button>
                    <button onClick={() => deleteTier(tier)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Add Tier Action */}
            {tiers.length < 3 ? (
              <button onClick={openCreate} className="w-full py-3 rounded-xl border border-dashed border-[#1B6B3A] text-[#1B6B3A] text-[12px] font-bold bg-[#F5FBF5] flex items-center justify-center gap-2 mt-2">
                <Plus size={14}/> Tambah Tier Baru
              </button>
            ) : (
              <div className="mt-2 text-center p-3 rounded-xl bg-gray-100 border border-gray-200">
                <p className="text-[11px] font-bold text-gray-500">Maksimal 3 tier membership telah tercapai.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Screen: Pengaturan Kreator (Halaman Sub-Screen Baru) ──
function CreatorSettingsScreen({ onBack, userProfile, userData, triggerToast, royaltiBalance = 1840000, onWithdrawClick }) {
  const [settingsTab, setSettingsTab] = useState('profil') // 'profil' | 'rekening'

  // Load from mockCreatorChannelInfo or fallback
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem('mockCreatorChannelInfo')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return {
      channelName: userProfile?.name ? `Channel ${userProfile.name}` : (userData?.name ? `Channel ${userData.name}` : 'Pak Tani Inovatif'),
      category: 'Pertanian & Agribisnis',
      bio: 'Berbagi pengalaman dan edukasi teknik pertanian modern, pupuk organik, dan inovasi desa mandiri.',
      avatar: '🌾',
      payoutMethod: 'gv_pay',
      accountNumber: userData?.phone || '0812-3456-7890',
      accountHolder: userProfile?.name || userData?.name || 'Pak Budi Santoso',
    }
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    try {
      localStorage.setItem('mockCreatorChannelInfo', JSON.stringify(form))
    } catch (e) {}
    setSaved(true)
    triggerToast?.('Pengaturan Kreator berhasil disimpan!')
    setTimeout(() => {
      setSaved(false)
      onBack?.()
    }, 400)
  }

  const SETTINGS_TABS = [
    { id: 'profil', label: 'Profil Channel' },
    { id: 'rekening', label: 'Rekening Pencairan' },
  ]

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      <ScreenHeader
        title="Pengaturan Kreator"
        onBack={onBack}
      />

      {/* Tabs Switcher: Profil Channel | Rekening Pencairan */}
      <div className="px-4 pt-1 bg-white border-b border-surface-200/80 flex-shrink-0">
        <NavTabs
          tabs={SETTINGS_TABS}
          activeTab={settingsTab}
          onChange={setSettingsTab}
          variant="underline-light"
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-fade-in">
            <Check size={16} className="text-emerald-600" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        {settingsTab === 'profil' && (
          <div className="space-y-4">
            {/* Foto / Avatar Channel */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3">
              <label className="block text-[11.5px] font-bold text-surface-600">
                Avatar / Foto Profil Channel
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-purple-200 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)' }}
                >
                  {form.avatar || '🌾'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-bold text-surface-700 mb-1.5">Pilih Avatar Kreator:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['🌾', '👨‍🌾', '🎥', '🌱', '💡', '🐔', '🚜', '🍲', '☕'].map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, avatar: emo }))}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition active:scale-95 border ${
                          form.avatar === emo
                            ? 'bg-purple-100 border-purple-600 scale-105 shadow-xs'
                            : 'bg-surface-50 border-surface-200 hover:bg-surface-100'
                        }`}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nama Channel & Kategori & Bio */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3.5">
              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Nama Channel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.channelName}
                  onChange={(e) => setForm((f) => ({ ...f, channelName: e.target.value }))}
                  placeholder="Contoh: Agrotech Desa Mandiri"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-extrabold text-surface-900 outline-none focus:border-purple-700 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1.5">
                  Kategori Utama Konten <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {KATEGORI_CHANNEL.map((cat) => {
                    const active = form.category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, category: cat }))}
                        className={`py-2 px-2.5 text-left text-[11px] rounded-xl font-bold transition flex items-center justify-between border ${
                          active
                            ? 'bg-purple-50 border-purple-700 text-purple-900 shadow-2xs'
                            : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-white'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {active && <Check size={12} className="text-purple-700 flex-shrink-0 ml-1" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11.5px] font-bold text-surface-600">
                    Bio / Deskripsi Singkat Channel
                  </label>
                  <span className="text-[10.5px] text-surface-400">
                    {(form.bio || '').length}/180
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={180}
                  value={form.bio || ''}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Deskripsikan fokus materi video dan karya yang Anda bagikan..."
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[12.5px] text-surface-800 outline-none focus:border-purple-700 focus:bg-white resize-none transition"
                />
              </div>
            </div>
          </div>
        )}

        {settingsTab === 'rekening' && (
          <div className="space-y-4">
            {/* Card Saldo Royalti & Pencairan */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-surface-400">
                  SALDO ROYALTI TERSEDIA
                </span>
                <span className="text-[10px] font-extrabold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <Sparkles size={10} className="text-purple-600"/> Siap Dicairkan
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-0.5">
                <div>
                  <p className="text-[20px] font-black text-surface-900 font-mono tracking-tight">
                    Rp {royaltiBalance.toLocaleString('id')}
                  </p>
                  <p className="text-[11px] font-medium text-surface-400 mt-0.5">
                    Royalti tayangan video & membership channel
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onWithdrawClick}
                  className="px-3.5 py-2 rounded-xl text-white font-extrabold text-[12px] shadow-sm active:scale-95 transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)' }}
                >
                  <span>Tarik Royalti</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>

            {/* Pilihan Bank / GV Pay */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-surface-400">
                  METODE PENCAIRAN ROYALTI
                </span>
                <Wallet size={16} className="text-purple-700" />
              </div>

              <div className="space-y-2">
                {BANK_OPTIONS.map((b) => {
                  const selected = form.payoutMethod === b.id
                  return (
                    <div
                      key={b.id}
                      onClick={() => setForm((f) => ({ ...f, payoutMethod: b.id }))}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        selected
                          ? 'border-purple-600 bg-purple-50/70 shadow-2xs font-bold text-purple-900'
                          : 'border-surface-200 bg-surface-50 hover:bg-white text-surface-700'
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

            {/* Nomor Rekening & Nama Pemilik */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11.5px] font-bold text-surface-600">
                    {form.payoutMethod === 'gv_pay' ? 'Nomor GV Pay' : 'Nomor Rekening'} <span className="text-red-500">*</span>
                  </label>
                  {userData?.phone && form.accountNumber !== userData.phone && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, accountNumber: userData.phone }))}
                      className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition active:scale-95"
                    >
                      Gunakan No. HP ({userData.phone})
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={
                    form.payoutMethod === 'gv_pay'
                      ? 'cth. 08123456789 (No. HP GV Pay)'
                      : 'cth. 1234567890 (No. Rekening)'
                  }
                  value={form.accountNumber || ''}
                  onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-mono font-bold text-surface-900 outline-none focus:border-purple-700 focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11.5px] font-bold text-surface-600">
                    Nama Pemilik Rekening <span className="text-red-500">*</span>
                  </label>
                  {(userProfile?.name || userData?.name) && form.accountHolder !== (userProfile?.name || userData?.name) && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, accountHolder: userProfile?.name || userData?.name }))}
                      className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition active:scale-95"
                    >
                      Gunakan Nama ({userProfile?.name || userData?.name})
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Nama sesuai KTP / Akun Bank"
                  value={form.accountHolder || ''}
                  onChange={(e) => setForm((f) => ({ ...f, accountHolder: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-surface-800 outline-none focus:border-purple-700 focus:bg-white transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Sticky Bottom Action */}
      <div className="flex-shrink-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-surface-200/80 z-20 shadow-lg">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded-2xl text-white font-bold text-[13.5px] shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition"
          style={{ background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)' }}
        >
          <Check size={18} strokeWidth={2.5} />
          <span>Simpan Pengaturan Kreator</span>
        </button>
      </div>
    </ScreenBackground>
  )
}

// ── Creator Application Flow ──────────────────────────────────
function CreatorApplicationFlow({ navigate }) {
  const [appStatus, setAppStatus] = useState(() => localStorage.getItem('mockCreatorAppStatus') || 'not_applied') // not_applied, draft, pending, revision, rejected
  
  useEffect(() => {
    localStorage.setItem('mockCreatorAppStatus', appStatus)
  }, [appStatus])

  const [step, setStep] = useState(1)
  const mockUser = { name: 'Agus Subianto', nik: '3201123456789012' }
  const [form, setForm] = useState({
    name: mockUser.name, bio: '',
    categories: [], contentTypes: [],
    agreed: false
  })
  const [errors, setErrors] = useState({})
  const PRIMARY = '#1B6B3A'

  const validate = () => {
    const err = {}
    if (step === 1) {
      if (!form.name.trim()) err.name = 'Nama kreator wajib diisi'
      if (!form.bio.trim()) err.bio = 'Bio kreator wajib diisi'
    } else if (step === 2) {
      if (form.categories.length === 0) err.categories = 'Pilih minimal satu kategori'
      if (form.contentTypes.length === 0) err.contentTypes = 'Pilih minimal satu format'
    } else if (step === 3) {
      if (!form.agreed) err.agreed = 'Anda harus menyetujui syarat & ketentuan'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    if (step < 3) setStep(s => s + 1)
    else setAppStatus('pending')
  }

  // --- RENDERS ---

  if (appStatus === 'not_applied') {
    return (
      <div className="flex flex-col h-full bg-[#FAFBF9]">
        <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
          <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
            <button onClick={()=>navigate('profile')} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)'}}>
              <ArrowLeft size={16} className="text-white/70"/>
            </button>
            <p className="font-extrabold text-white text-[20px] tracking-tight leading-tight">Kreator GV</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <Tv2 size={48} className="text-green-600"/>
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900 mb-3 tracking-tight">Jadilah Kreator GV</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-8">Bagikan pengetahuan, cerita, dan konten yang bermanfaat untuk komunitas GV. Mulai perjalanan Anda sebagai kreator sekarang.</p>
          <div className="flex flex-col gap-3 w-full text-left mb-8">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[12px] font-bold">1</span><span className="text-[13px] font-bold text-gray-700">Lengkapi profil kreator</span></div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[12px] font-bold">2</span><span className="text-[13px] font-bold text-gray-700">Pilih kategori dan format konten</span></div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[12px] font-bold">3</span><span className="text-[13px] font-bold text-gray-700">Ajukan untuk ditinjau tim GV</span></div>
          </div>
          <button onClick={()=>{setAppStatus('draft'); setStep(1)}} className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform" style={{background:PRIMARY}}>
            Mulai Pendaftaran
          </button>
        </div>
      </div>
    )
  }

  if (appStatus === 'pending' || appStatus === 'revision' || appStatus === 'rejected') {
    return (
      <div className="flex flex-col h-full bg-[#FAFBF9]">
        <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
          <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
            <button onClick={()=>navigate('profile')} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)'}}>
              <ArrowLeft size={16} className="text-white/70"/>
            </button>
            <p className="font-extrabold text-white text-[20px] tracking-tight leading-tight">Status Aplikasi</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center text-center px-5 pt-12 overflow-y-auto">
          {appStatus === 'pending' && (
            <>
              <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6"><Clock size={32} /></div>
              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Pengajuan Sedang Ditinjau</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-8">Tim GV sedang meninjau profil dan pengajuan Anda. Proses ini memakan waktu maksimal 1x24 jam kerja.</p>
            </>
          )}
          {appStatus === 'revision' && (
            <>
              <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6"><Info size={32} /></div>
              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Pengajuan Perlu Diperbaiki</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">Pengajuan Anda memerlukan beberapa penyesuaian sebelum dapat disetujui oleh tim GV.</p>
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left shadow-sm mb-6">
                <p className="text-[12px] font-bold text-amber-900 mb-1">Catatan dari Tim Kurasi:</p>
                <p className="text-[12px] text-amber-800 leading-relaxed">Mohon perbaiki bio kreator Anda agar lebih rinci dan mencerminkan format konten yang dipilih.</p>
              </div>
              <button onClick={()=>{setAppStatus('draft'); setStep(1)}} className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform" style={{background:PRIMARY}}>
                Perbaiki Pengajuan
              </button>
            </>
          )}
          {appStatus === 'rejected' && (
            <>
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6"><Info size={32} /></div>
              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Pengajuan Belum Disetujui</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">Mohon maaf, pengajuan Anda sebagai kreator belum dapat disetujui saat ini.</p>
              <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-left shadow-sm mb-6">
                <p className="text-[12px] font-bold text-red-900 mb-1">Alasan Penolakan:</p>
                <p className="text-[12px] text-red-800 leading-relaxed">Kategori konten yang diajukan tidak sesuai dengan pedoman komunitas GV saat ini.</p>
              </div>
              <button onClick={()=>{setAppStatus('draft'); setStep(1)}} className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform bg-gray-800">
                Ajukan Kembali
              </button>
            </>
          )}

          {/* Dev Tools */}
          <div className="mt-auto mb-6 pt-12 flex flex-col gap-2 opacity-30 hover:opacity-100 transition-opacity w-full">
            <p className="text-[10px] font-bold text-gray-400">DEV TOOLS (MOCK STATUS)</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-[11px] font-bold" onClick={()=>setAppStatus('pending')}>Pending</button>
              <button className="px-3 py-1.5 bg-amber-100 text-amber-600 rounded-lg text-[11px] font-bold" onClick={()=>setAppStatus('revision')}>Revision</button>
              <button className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-[11px] font-bold" onClick={()=>setAppStatus('rejected')}>Rejected</button>
              <button className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg text-[11px] font-bold" onClick={()=>alert('Untuk menyetujui, login dengan profile yang memiliki capability "Kreator". Di environment test, set ini secara global.')}>Approved (Mock)</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === DRAFT FORM ===
  const STEPS = [
    { label: 'Profil Kreator', sub: 'Foto, nama & bio' },
    { label: 'Kategori Konten', sub: 'Topik & format konten' },
    { label: 'Persetujuan', sub: 'Syarat & pengajuan' }
  ]

  return (
    <div className="flex flex-col h-full bg-[#FAFBF9]">
      <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
        <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
          <button onClick={()=>{
            if (step > 1) setStep(s=>s-1)
            else setAppStatus('not_applied')
          }} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)'}}>
            <ArrowLeft size={16} className="text-white/70"/>
          </button>
          <p className="font-extrabold text-white text-[16px] tracking-tight leading-tight">Aplikasi Kreator</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
        {/* Progress Header */}
        <div>
          <div className="flex gap-2 mb-3">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E0E0E0' }}>
                {i < step && <div className="w-full h-full rounded-full transition-all" style={{ background: `linear-gradient(90deg, ${PRIMARY}CC, ${PRIMARY})` }} />}
              </div>
            ))}
          </div>
          <p className="text-[14px] font-extrabold text-gray-900">Langkah {step} dari {STEPS.length}</p>
          <p className="text-[12px] text-gray-500">{STEPS[step-1].label}</p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="bg-[#E8F5E9] rounded-2xl p-4 border border-[#1B6B3A]20">
              <p className="text-[13px] font-bold text-gray-900 mb-1">Profil Publik Kreator</p>
              <p className="text-[12px] text-gray-600 leading-relaxed">Profil kreator Anda terpisah dari data identitas KTP. Informasi ini akan tampil secara publik di konten Anda.</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Foto Profil Kreator</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                  <span className="text-[20px] font-bold text-gray-400">{form.name.charAt(0)}</span>
                </div>
                <button className="px-4 py-2 text-[12px] font-bold text-[#1B6B3A] bg-[#1B6B3A]10 rounded-xl">Ubah Foto</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Nama Kreator / Display Name</span>
                {errors.name && <span className="text-red-500 font-bold">{errors.name}</span>}
              </p>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nama publik Anda" className={`w-full bg-white border ${errors.name?'border-red-300':'border-gray-200'} rounded-2xl px-4 py-3.5 text-[13px] outline-none focus:border-[#1B6B3A]`} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Bio Kreator</span>
                {errors.bio && <span className="text-red-500 font-bold">{errors.bio}</span>}
              </p>
              <textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Deskripsikan diri atau konten Anda..." className={`w-full bg-white border ${errors.bio?'border-red-300':'border-gray-200'} rounded-2xl px-4 py-3.5 text-[13px] outline-none min-h-[100px] focus:border-[#1B6B3A]`} />
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5 mt-2">
              <Shield size={16} className="text-gray-400 mt-0.5 flex-shrink-0"/>
              <div>
                <p className="text-[11px] font-bold text-gray-700">Identitas Terverifikasi</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Pengajuan ini terhubung dengan identitas terverifikasi: {mockUser.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between">
                <span>Kategori Utama</span>
                {errors.categories && <span className="text-red-500 font-bold">{errors.categories}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Pertanian & Desa', 'UMKM & Bisnis', 'Masak & Kuliner', 'Budaya Lokal', 'Pendidikan', 'Kesehatan', 'Teknologi', 'Lingkungan', 'Lainnya'].map(k=>(
                  <button key={k} onClick={()=>{
                    setForm(f=>({...f, categories: f.categories.includes(k) ? f.categories.filter(x=>x!==k) : [...f.categories, k]}))
                  }} className={`py-2 px-3.5 rounded-xl text-[12px] font-semibold transition ${form.categories.includes(k)?'bg-[#1B6B3A] text-white shadow-md border-transparent':'bg-white text-gray-600 border border-gray-200'}`} style={{borderWidth: form.categories.includes(k)?0:1}}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between">
                <span>Format Konten</span>
                {errors.contentTypes && <span className="text-red-500 font-bold">{errors.contentTypes}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Video', 'Post', 'Live', 'Podcast'].map(t=>(
                  <button key={t} onClick={()=>{
                    setForm(f=>({...f, contentTypes: f.contentTypes.includes(t) ? f.contentTypes.filter(x=>x!==t) : [...f.contentTypes, t]}))
                  }} className={`py-2 px-3.5 rounded-xl text-[12px] font-semibold transition ${form.contentTypes.includes(t)?'bg-[#1B6B3A] text-white shadow-md border-transparent':'bg-white text-gray-600 border border-gray-200'}`} style={{borderWidth: form.contentTypes.includes(t)?0:1}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Ringkasan Pengajuan</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] text-gray-500 w-24 flex-shrink-0">Kategori</span>
                  <span className="text-[12px] font-semibold text-gray-900 text-right">{form.categories.join(', ')}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[12px] text-gray-500 w-24 flex-shrink-0">Format</span>
                  <span className="text-[12px] font-semibold text-gray-900 text-right">{form.contentTypes.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5FBF5] rounded-2xl p-4 border border-[#1B6B3A]20">
              <p className="text-[13px] font-bold text-[#1B6B3A] mb-3">Persetujuan Kreator GV</p>
              <ul className="text-[12px] text-gray-700 leading-relaxed list-disc ms-4 mb-4 flex flex-col gap-2">
                <li>Pengajuan kreator akan ditinjau oleh tim kurasi GV.</li>
                <li>Mengajukan pendaftaran tidak menjamin persetujuan otomatis.</li>
                <li>Kreator wajib mematuhi pedoman komunitas dan nilai GV.</li>
                <li>Konten dapat ditinjau atau dimoderasi oleh tim GV.</li>
              </ul>
              
              <div className="h-px bg-[#1B6B3A]20 my-4"/>
              
              {errors.agreed && <p className="text-[12px] font-bold text-red-500 mb-2">{errors.agreed}</p>}
              <div className="flex items-start gap-3 p-1 cursor-pointer select-none" onClick={()=>setForm(f=>({...f,agreed:!f.agreed}))}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${form.agreed?'bg-[#1B6B3A] border-transparent':'bg-white border-[1.5px] border-gray-300'}`}>
                  {form.agreed && <Check size={14} className="text-white"/>}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-800 leading-relaxed">Saya menyatakan bahwa data yang saya berikan adalah benar, dan saya menyetujui Ketentuan Kreator GV.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-6 pt-3 border-t border-gray-100 bg-white">
        <button onClick={handleNext} 
          disabled={step === 3 && !form.agreed}
          className={`w-full h-14 rounded-2xl text-[14px] font-bold text-white transition-transform flex items-center justify-center shadow-md ${step === 3 && !form.agreed ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`} 
          style={{background:PRIMARY}}>
          {step < STEPS.length ? 'Lanjut →' : 'Ajukan untuk Review'}
        </button>
      </div>
    </div>
  )
}

// ── Modal Tarik Royalti Kreator ──────────────────────────────
function WithdrawRoyaltiModal({ balance, onClose, onSuccess }) {
  const [amount, setAmount] = useState(balance)
  const [submitting, setSubmitting] = useState(false)

  const handleWithdraw = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSuccess(amount)
      onClose()
    }, 800)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-surface-100">
          <div>
            <h3 className="text-[16px] font-black text-surface-900">Pencairan Royalti Kreator</h3>
            <p className="text-[11.5px] text-surface-400 mt-0.5">Tarik royalti siaran dan konten ke dompet terdaftar</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100">
            <X size={18}/>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
            <Wallet size={18}/>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-purple-700 font-bold uppercase tracking-wider">Rekening Royalti Terdaftar</p>
            <p className="text-[13px] font-extrabold text-surface-900 truncate">Dompet Digital GV Pay</p>
            <p className="text-[11.5px] text-surface-500 font-mono mt-0.5">0812-3456-7890</p>
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Nominal Royalti Ditarik</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[14px] font-bold text-surface-400">Rp</span>
            <input
              type="number"
              max={balance}
              value={amount}
              onChange={(e)=>setAmount(Number(e.target.value))}
              className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-10 pr-3.5 py-2.5 text-[15px] font-black text-surface-900 outline-none focus:border-purple-700"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[250000, 500000, balance].map((val)=>(
              <button key={val} type="button" onClick={()=>setAmount(val)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${amount===val?'bg-purple-50 text-purple-800 border-purple-300':'bg-surface-50 text-surface-600 border-surface-200'}`}>
                {val===balance ? 'Tarik Semua' : `Rp ${(val/1000).toFixed(0)}rb`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={submitting || amount <= 0 || amount > balance}
          className="w-full h-12 rounded-2xl text-white font-bold text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)' }}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin text-white"/>
              <span>Memproses...</span>
            </span>
          ) : (
            <>
              <ArrowUpRight size={16}/>
              <span>Konfirmasi Pencairan Royalti</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function Studio({ navigate, userProfile, initialUpload, initialTab, userData, initialView = 'main' }) {
  const [currentView, setCurrentView] = useState(initialView)
  const [tab, setTab]                 = useState(initialUpload ? 'konten' : (['konten', 'membership', 'analitik'].includes(initialTab) ? initialTab : 'konten'))
  const [subTab, setSubTab]           = useState('video') // 'video' | 'post'
  const [postTrigger, setPostTrigger] = useState(0)
  const [showUpload, setUpload]       = useState(initialUpload || false)
  const [isEditingVideo, setIsEditingVideo] = useState(false)
  const [isComposingPost, setIsComposingPost] = useState(false)
  const [tanyaOpen,  setTanyaOpen]    = useState(false)
  const [postComposeType, setPCType]  = useState(null)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [royaltiBalance, setRoyaltiBalance] = useState(1840000)
  const [toastMsg, setToastMsg]       = useState(null)

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const localCreatorStatus = (() => {
    try {
      return localStorage.getItem('mockCreatorAppStatus') || ''
    } catch (e) {
      return ''
    }
  })()

  const isCreator = userProfile?.capabilities?.includes('Kreator') ||
                    userProfile?.capabilities?.includes('Super Admin') ||
                    userProfile?.isCreator === true ||
                    userData?.isCreator === true ||
                    userData?.capabilities?.includes('Kreator') ||
                    localCreatorStatus === 'active'

  if (!isCreator) {
    return (
      <div className="flex flex-col h-full bg-[#FAFBF9]">
        <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
          <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
            <button onClick={()=>navigate('profile')} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)'}}>
              <ArrowLeft size={16} className="text-white/70"/>
            </button>
            <p className="font-extrabold text-white text-[16px] tracking-tight leading-tight">Kreator GV</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#7B1FA2]/10 text-[#7B1FA2] flex items-center justify-center mb-5 shadow-sm border border-[#7B1FA2]/20">
            <Sparkles size={36} />
          </div>
          <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Aktivasi Kreator Diperlukan</h2>
          <p className="text-[13px] text-gray-500 leading-relaxed mb-6 max-w-[280px]">
            Lengkapi alur pendaftaran dan aktivasi kreator untuk membuka seluruh fitur Studio, monetisasi, dan komunitas.
          </p>
          <button
            onClick={() => navigate('aktivasi-kreator')}
            className="w-full max-w-[300px] h-12 rounded-2xl text-[14px] font-bold text-white shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)' }}
          >
            Mulai Aktivasi Kreator
          </button>
          <button
            onClick={() => navigate('profile')}
            className="mt-3 text-[13px] font-semibold text-gray-400 py-2"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    )
  }

  // ── SUB-SCREEN PENGATURAN KREATOR MANDIRI ────────────────
  if (currentView === 'settings') {
    return (
      <div className="h-full flex flex-col relative">
        <CreatorSettingsScreen
          onBack={() => setCurrentView('main')}
          userProfile={userProfile}
          userData={userData}
          triggerToast={triggerToast}
          royaltiBalance={royaltiBalance}
          onWithdrawClick={() => setShowWithdraw(true)}
        />
        {showWithdraw && (
          <WithdrawRoyaltiModal
            balance={royaltiBalance}
            onClose={() => setShowWithdraw(false)}
            onSuccess={(wAmount) => {
              setRoyaltiBalance(b => b - wAmount)
              triggerToast(`Pencairan royalti Rp ${wAmount.toLocaleString('id')} sedang diproses ke GV Pay!`)
            }}
          />
        )}
      </div>
    )
  }



  const handlePostCompose = type => {
    setTab('konten')
    setPCType(type)
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* ── 1. HEADER (Title: Kreator GV saja, tanpa subtitle, ada icon Settings) ── */}
      <ScreenHeader
        title="Kreator GV"
        onBack={() => navigate('profile')}
        actions={
          <button
            type="button"
            onClick={() => setCurrentView('settings')}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 text-white/90 hover:text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
            title="Pengaturan Kreator"
          >
            <Settings size={17} />
          </button>
        }
      />

      {/* Floating Feedback Toast */}
      {toastMsg && (
        <div className="absolute top-16 left-4 right-4 z-40 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between text-[12px] font-bold animate-fade-in">
          <span>{toastMsg}</span>
          <button onClick={()=>setToastMsg(null)} className="text-white/60 hover:text-white"><X size={14}/></button>
        </div>
      )}

      {/* Modal Tarik Royalti */}
      {showWithdraw && (
        <WithdrawRoyaltiModal
          balance={royaltiBalance}
          onClose={()=>setShowWithdraw(false)}
          onSuccess={(wAmount)=>{
            setRoyaltiBalance(b => b - wAmount)
            triggerToast(`Pencairan royalti Rp ${wAmount.toLocaleString('id')} sedang diproses ke GV Pay!`)
          }}
        />
      )}

      {/* ── 2. TAB UTAMA (KONTEN | MEMBERSHIP | ANALITIK) — UNDERLINE STYLE ── */}
      <div className="px-4 pt-1 bg-white border-b border-surface-200/80 flex-shrink-0">
        <NavTabs
          tabs={PRIMARY_TABS}
          activeTab={tab}
          onChange={setTab}
          variant="underline-light"
        />
      </div>

      {/* ── 3. TAB BODY ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {tab === 'konten' && isCreator && (
          <TabKonten
            subTab={subTab}
            setSubTab={setSubTab}
            showUpload={showUpload}
            setUpload={setUpload}
            postComposeType={postComposeType}
            clearCompose={() => setPCType(null)}
            postTrigger={postTrigger}
            onEditVideoChange={setIsEditingVideo}
            onComposePostChange={setIsComposingPost}
          />
        )}
        {tab === 'membership' && isCreator && <TabMembership />}
        {tab === 'analitik'   && isCreator && <TabAnalitik />}
      </div>

      {/* ── 5. PINNED BOTTOM ACTION: UPLOAD VIDEO ── */}
      {tab === 'konten' && subTab === 'video' && isCreator && !isEditingVideo && !showUpload && (
        <div className="flex-shrink-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-surface-200/80 z-20 shadow-lg">
          <button
            type="button"
            onClick={() => setUpload(true)}
            className="w-full h-12 rounded-2xl text-white font-black text-[13.5px] shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>+ Upload Video</span>
          </button>
        </div>
      )}

      {/* ── 5. PINNED BOTTOM ACTION: BUAT POST BARU ── */}
      {tab === 'konten' && subTab === 'post' && isCreator && !isComposingPost && (
        <div className="flex-shrink-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-surface-200/80 z-20 shadow-lg">
          <button
            type="button"
            onClick={() => setPostTrigger(Date.now())}
            className="w-full h-12 rounded-2xl text-white font-black text-[13.5px] shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>+ Buat Post Baru</span>
          </button>
        </div>
      )}

      <BottomNav active="profile" navigate={navigate} />
    </ScreenBackground>
  )
}
