import React, { useState } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import SearchBar from '@/components/molecules/SearchBar'
import { ArrowLeft, Search, X, Clock, ChevronRight, Share2, Heart, MessageCircle, Bookmark } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

const PRIMARY = '#1B6B3A'

const CATS = ['Semua','Desa','Pertanian','Kesehatan','Pendidikan','Ekonomi']

const ARTICLES = [
  { id:1, cat:'Desa',        title:'Program Digitalisasi Desa Sukamaju Masuk 10 Besar Nasional',
    body:'Program digitalisasi yang diinisiasi oleh Badan Usaha Milik Desa (BUMDes) Sukamaju berhasil masuk dalam 10 besar program desa terbaik tingkat nasional. Program ini mencakup sistem informasi desa berbasis digital, pasar online untuk produk UMKM lokal, serta sistem pembayaran pajak desa secara elektronik.\n\nKepala Desa Sukamaju, Bapak Ahmad Fauzi, menyampaikan bahwa inovasi ini lahir dari kebutuhan warga yang ingin mengakses layanan desa dengan lebih mudah. "Kami ingin warga tidak perlu antri berjam-jam hanya untuk urusan administrasi," ujarnya.\n\nKe depan, desa berencana mengintegrasikan seluruh layanan publik ke dalam satu platform digital yang bisa diakses melalui smartphone.',
    source:'Redaksi GV', date:'Hari ini, 09:15', readTime:'4 mnt', g:['#1B5E20','#2E7D32'],    likes:142, comments:28, saved:false },
  { id:2, cat:'Pertanian',   title:'Harga Gabah Naik Rp 200/kg — Petani Desa Sambut Positif',
    body:'Harga gabah kering panen (GKP) di tingkat petani desa mengalami kenaikan sebesar Rp 200 per kilogram dalam dua minggu terakhir. Kenaikan ini disambut positif oleh para petani yang sebelumnya mengeluhkan rendahnya harga jual hasil panen.\n\nMenurut data yang dihimpun dari beberapa kelompok tani di desa, harga GKP kini mencapai Rp 4.800 per kilogram, naik dari posisi Rp 4.600 pada periode sebelumnya. Kenaikan ini dipicu oleh meningkatnya permintaan beras dari kota-kota besar menjelang akhir tahun.\n\nKetua Gapoktan Desa Sukamaju, Pak Slamet, mengingatkan petani untuk tidak tergesa-gesa menjual seluruh hasil panen. "Simpan sebagian untuk kebutuhan sendiri dan jadikan modal tanam musim depan," pesannya.',
    source:'Koresponden Desa', date:'Hari ini, 07:30', readTime:'3 mnt', g:['#33691E','#558B2F'],  likes:98, comments:41, saved:false },
  { id:3, cat:'Kesehatan',   title:'Posyandu Desa Sukamaju Raih Penghargaan Pelayanan Terbaik',
    body:'Posyandu Melati di Desa Sukamaju berhasil meraih penghargaan sebagai posyandu dengan pelayanan terbaik di tingkat kecamatan. Penghargaan ini diberikan oleh Dinas Kesehatan Kabupaten atas konsistensi layanan imunisasi, pemantauan gizi balita, dan penyuluhan kesehatan ibu.\n\nBidan koordinator desa, Bidan Yati, mengungkapkan bahwa keberhasilan ini tidak lepas dari dukungan penuh seluruh kader posyandu yang berjumlah 15 orang. "Mereka bertugas sukarela setiap bulan tanpa imbalan yang besar. Ini murni pengabdian," tuturnya.\n\nProgram unggulan posyandu saat ini adalah pemantauan stunting yang melibatkan 248 balita dari seluruh RW di desa.',
    source:'Redaksi GV', date:'Kemarin, 14:00', readTime:'3 mnt', g:['#880E4F','#C2185B'],  likes:76, comments:15, saved:true  },
  { id:4, cat:'Ekonomi',     title:'UMKM Desa Tembus Pasar Ekspor — Keripik Singkong Go International',
    body:'Usaha keripik singkong milik Bu Dewi dari Desa Sukamaju berhasil menembus pasar ekspor ke Malaysia dan Singapura. Produk yang awalnya hanya dijual di pasar tradisional lokal ini kini rutin dipesan oleh dua distributor dari negara tetangga.\n\nPerjalanan Bu Dewi menuju pasar ekspor dimulai ketika ia mengikuti pelatihan kemasan dan standar pangan yang diselenggarakan oleh Dinas Perindustrian. "Dulu kemasannya seadanya. Sekarang sudah ada kode PIRT dan label gizi," ceritanya.\n\nDalam sebulan, produksi keripik Bu Dewi mencapai 500 kilogram dengan omzet sekitar Rp 15 juta. Ia berencana merekrut 3 orang tetangga untuk memenuhi peningkatan permintaan.',
    source:'Koresponden Desa', date:'Kemarin, 10:30', readTime:'5 mnt', g:['#E65100','#F4511E'],  likes:215, comments:52, saved:false },
  { id:5, cat:'Pendidikan',  title:'SD Sukamaju Terima Bantuan 30 Laptop dari Program Kemendikbud',
    body:'SD Negeri Sukamaju 1 mendapat bantuan 30 unit laptop dari Program Digitalisasi Sekolah Kementerian Pendidikan dan Kebudayaan. Bantuan ini akan digunakan untuk mendukung pembelajaran berbasis teknologi di kelas 4, 5, dan 6.\n\nKepala Sekolah, Ibu Siti Rahayu, mengatakan bahwa sekolah akan mengintegrasikan perangkat tersebut dalam mata pelajaran Informatika yang mulai diwajibkan tahun ini. "Kami sudah siapkan ruang khusus dan guru yang terlatih," ujarnya.\n\nSebanyak 180 siswa akan merasakan manfaat langsung dari bantuan ini. Sekolah juga berencana membuka kelas komputer sore hari untuk orang tua yang ingin belajar teknologi.',
    source:'Redaksi GV', date:'2 hari lalu', readTime:'3 mnt', g:['#1565C0','#1976D2'],  likes:134, comments:33, saved:false },
  { id:6, cat:'Desa',        title:'Jalan Desa Sepanjang 2 km Kini Sudah Beraspal — Warga Lega',
    body:'Warga Desa Sukamaju akhirnya bisa menikmati jalan desa yang mulus setelah pembangunan aspal sepanjang 2 kilometer selesai dikerjakan. Proyek senilai Rp 800 juta ini dibiayai dari Dana Desa tahun anggaran 2026.\n\nSebelumnya, jalan tersebut hanya berupa tanah berbatu yang sangat sulit dilalui saat musim hujan. Petani yang mengangkut hasil panen pun kerap mengalami kesulitan.\n\n"Sekarang mau bawa gabah ke penggilingan sudah jauh lebih mudah. Dulu ban motor sering bocor di jalan itu," ujar Pak Rohmat, petani setempat.',
    source:'Kontributor Warga', date:'3 hari lalu', readTime:'2 mnt', g:['#4A148C','#7B1FA2'],  likes:89, comments:19, saved:false },
  { id:7, cat:'Pertanian',   title:'Teknik Tanam Padi Organik Hemat Air Mulai Diterapkan Petani Lokal',
    body:'Kelompok Tani Maju Bersama di Desa Sukamaju mulai menerapkan teknik System of Rice Intensification (SRI) yang diklaim mampu menghemat penggunaan air hingga 30 persen dibanding cara konvensional.\n\nTeknik ini diperkenalkan oleh Dinas Pertanian setempat melalui program penyuluhan tiga bulan lalu. Hasilnya, 20 anggota kelompok tani sudah mencoba dan melaporkan peningkatan produksi rata-rata 15 persen pada musim tanam pertama.\n\nPetani yang mencoba teknik ini juga tidak menggunakan pestisida kimia, sehingga kualitas beras yang dihasilkan memenuhi standar organik dan bisa dijual dengan harga lebih tinggi di pasar.',
    source:'Koresponden Desa', date:'4 hari lalu', readTime:'4 mnt', g:['#2E7D32','#388E3C'],  likes:67, comments:22, saved:false },
  { id:8, cat:'Ekonomi',     title:'BUMDes Sukamaju Buka Unit Usaha Tabungan Emas untuk Warga Desa',
    body:'Badan Usaha Milik Desa (BUMDes) Sukamaju resmi meluncurkan unit usaha tabungan emas yang diperuntukkan bagi warga desa. Program ini bekerja sama dengan lembaga keuangan syariah dan memungkinkan warga menabung mulai dari 0,1 gram emas.\n\n"Kami ingin warga punya alternatif investasi yang aman dan bisa dimulai dengan modal kecil," ujar Direktur BUMDes, Pak Hendra.\n\nDalam dua minggu sejak peluncuran, sudah ada 145 nasabah yang mendaftar dengan total simpanan setara 2,3 kilogram emas. Bulan depan, BUMDes berencana membuka unit usaha kredit mikro dengan bunga di bawah rata-rata koperasi.',
    source:'Redaksi GV', date:'5 hari lalu', readTime:'3 mnt', g:['#F57F17','#F9A825'],  likes:103, comments:37, saved:false },
]

function ArticleDetail({ article, onBack }) {
  const [liked,   setLiked]   = useState(false)
  const [saved,   setSaved]   = useState(article.saved)
  const [likes,   setLikes]   = useState(article.likes)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero (header floats on top of it) */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="h-44 flex items-end px-4 pb-4 relative overflow-hidden"
          style={{background:`linear-gradient(155deg,${article.g[0]},${article.g[1]})`}}>
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(circle at 85% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 55%)'}}/>
          <div className="absolute inset-0 pointer-events-none"
            style={{boxShadow:'inset 0 -40px 50px -20px rgba(0,0,0,0.25)'}}/>

          {/* Header controls, floated over hero */}
          <div className="absolute top-0 start-0 end-0 flex items-center gap-3 px-4 py-3 z-10">
            <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(8px)'}}>
              <ArrowLeft size={16} className="text-white"/>
            </button>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{background:'rgba(255,255,255,0.2)',backdropFilter:'blur(8px)',color:'#fff'}}>{article.cat}</span>
            <div className="flex-1"/>
            <button onClick={()=>setSaved(!saved)} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(8px)'}}>
              <Bookmark size={15} className={saved?'fill-green-400 text-green-400':'text-white'}/>
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(8px)'}}>
              <Share2 size={15} className="text-white"/>
            </button>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md relative z-10"
            style={{background:'rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.9)'}}>
            {article.source}
          </span>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-8">
          <h1 className="headline-tight text-[18px] font-extrabold text-gray-900 leading-snug mb-3">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[12px] text-gray-400">{article.date}</span>
            <span className="text-gray-200">·</span>
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-gray-400"/>
              <span className="text-[12px] text-gray-400">{article.readTime} baca</span>
            </div>
          </div>
          {/* Body paragraphs */}
          {article.body.split('\n\n').map((para, i) => (
            <p key={i} className="max-w-[65ch] text-[14px] text-gray-700 leading-relaxed mb-4">{para}</p>
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex-shrink-0 flex items-center justify-around px-4 py-3 bg-white border-t border-gray-100">
        <button onClick={()=>{setLiked(!liked);setLikes(l=>l+(liked?-1:1))}}
          className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors hover:bg-red-50"
          style={{color:liked?'#E53935':'#9CA3AF'}}>
          <Heart size={18} fill={liked?'#E53935':'none'} style={{color:liked?'#E53935':'#9CA3AF'}}/>
          {likes}
        </button>
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 px-3 py-1.5 rounded-full transition-colors hover:bg-gray-100 hover:text-gray-600">
          <MessageCircle size={18}/> {article.comments} Komentar
        </button>
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 px-3 py-1.5 rounded-full transition-colors hover:bg-gray-100 hover:text-gray-600">
          <Share2 size={18}/> Bagikan
        </button>
      </div>
    </div>
  )
}

export default function Berita({ navigate }) {
  const [cat,     setCat]    = useState('Semua')
  const [q,       setQ]      = useState('')
  const [showSearch,setSearch]= useState(false)
  const [article, setArticle]= useState(null)

  if (article) return <ArticleDetail article={article} onBack={()=>setArticle(null)}/>

  const filtered = ARTICLES
    .filter(a => cat==='Semua' || a.cat===cat)
    .filter(a => !q || a.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* Unified ScreenHeader */}
      <ScreenHeader
        title="Berita"
        subtitle="Kabar terbaru dari desa dan sekitarnya"
        actions={
          <button
            type="button"
            onClick={() => setSearch((v) => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95"
            style={{
              background: showSearch ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {showSearch ? <X size={16} className="text-white" /> : <Search size={16} className="text-white/80" />}
          </button>
        }
      >
        {/* Search */}
        {showSearch && (
          <div className="animate-slide-down">
            <SearchBar
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onClear={() => setQ('')}
              variant="glass-dark"
              placeholder="Cari berita desa..."
              autoFocus
            />
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-1">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition active:scale-95 ${
                cat === c
                  ? 'bg-white text-[#1B6B3A] shadow-xs'
                  : 'bg-white/15 text-white/70 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </ScreenHeader>

      {/* Article list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3" style={{paddingBottom:80}}>
        {/* Featured — first article */}
        {filtered.length > 0 && !q && cat==='Semua' && (
          <button onClick={()=>setArticle(filtered[0])}
            className="spotlight-border w-full rounded-3xl overflow-hidden text-left active:scale-[0.96] transition-transform"
            style={{boxShadow:`0 8px 24px ${filtered[0].g[0]}33`}}>
            <div className="h-40 flex items-end px-4 pb-4 relative overflow-hidden"
              style={{background:`linear-gradient(155deg,${filtered[0].g[0]},${filtered[0].g[1]})`,boxShadow:'inset 0 -30px 40px -15px rgba(0,0,0,0.3)'}}>
              <div className="absolute top-3 start-3">
                <span className="text-[11px] font-extrabold px-2 py-1 rounded-lg bg-white/20 text-white">
                  {filtered[0].cat}
                </span>
              </div>
            </div>
            <div className="bg-white px-4 pt-3 pb-4">
              <p className="text-[15px] font-extrabold text-gray-900 leading-snug mb-2">{filtered[0].title}</p>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-400">{filtered[0].source}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[12px] text-gray-400">{filtered[0].date}</span>
                <span className="text-gray-300">·</span>
                <Clock size={9} className="text-gray-400"/>
                <span className="text-[12px] text-gray-400">{filtered[0].readTime}</span>
              </div>
            </div>
          </button>
        )}

        {/* Rest of articles */}
        {(q || cat!=='Semua' ? filtered : filtered.slice(1)).map(a=>(
          <button key={a.id} onClick={()=>setArticle(a)}
            className="spotlight-border flex gap-3 bg-white rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform hover:shadow-md transition-shadow"
            style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
            {/* Thumbnail */}
            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center"
              style={{background:`linear-gradient(135deg,${a.g[0]},${a.g[1]})`}}>
              <span className="text-[11px] font-bold text-white/70 text-center px-1">{a.cat}</span>
            </div>
            {/* Content */}
            <div className="flex-1 py-3 pe-3 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5">{a.title}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[12px] text-gray-400">{a.source}</span>
                <span className="text-gray-200">·</span>
                <span className="text-[12px] text-gray-400">{a.date}</span>
              </div>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="flex items-center gap-0.5 text-[12px] text-gray-400">
                  <Heart size={10}/> {a.likes}
                </span>
                <span className="flex items-center gap-0.5 text-[12px] text-gray-400">
                  <MessageCircle size={10}/> {a.comments}
                </span>
                <div className="flex items-center gap-1 ms-auto">
                  <Clock size={9} className="text-gray-300"/>
                  <span className="text-[11px] text-gray-400">{a.readTime}</span>
                </div>
              </div>
            </div>
          </button>
        ))}

        {filtered.length===0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <p className="text-5xl mb-3">📰</p>
            <p className="text-[14px] font-bold text-gray-900 mb-1">Tidak ada berita</p>
            <p className="text-[12px] text-gray-400">Coba kategori atau kata kunci lain</p>
          </div>
        )}
      </div>

      <BottomNav active="siaran" navigate={navigate}/>
    </ScreenBackground>
  )
}
