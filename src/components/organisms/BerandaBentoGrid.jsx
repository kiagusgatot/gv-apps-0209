import React from 'react'
import {
  CreditCard, Plus, ArrowRightLeft, ScanLine, Grid3x3,
  Tv2, Radio, Play, ChevronRight, Package, AlertTriangle,
  Clock, Store, Clapperboard, Users, Zap, Check, Star,
  ShoppingBag, Wheat, Heart, MessageCircle, Bot, Sparkles,
  TrendingUp, ArrowUpRight
} from 'lucide-react'
import BentoCard from '@/components/molecules/BentoCard'
import SectionHeader from '@/components/molecules/SectionHeader'
import Badge from '@/components/atoms/Badge'
import AppButton from '@/components/atoms/AppButton'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

/**
 * BerandaBentoGrid Organism
 * Dynamic, multi-proportional Bento Grid layout for the home screen.
 * Adapts modularly to user personas (Warga Baru, Warga Aktif, Penjual, Kreator, Admin, Super Admin).
 */
export default function BerandaBentoGrid({
  userProfile,
  userData,
  navigate,
  onOpenQris,
  onOpenMore,
  onOpenTanyaGV,
  liveChannels = [],
  estoProducts = [],
  threads = [],
  rekomendasi = [],
}) {
  const p = userProfile || {
    name: userData?.name || 'Warga Baru',
    balance: 0,
    points: 0,
    capabilities: ['Member'],
    preferences: userData?.preferences || [],
  }

  const isSuperAdmin = p.capabilities?.includes('Super Admin')
  const isPenjual = p.capabilities?.includes('Penjual')
  const isSeller = isPenjual
  const isCreator = p.capabilities?.includes('Kreator')
  const isAdmin = p.capabilities?.includes('Admin Komunitas')
  const isNewUser = p.id === 'warga_baru' || (!p.hasTransactions && !p.hasActiveOrder && !p.hasWatchHistory && !isPenjual && !isCreator && !isAdmin)

  // Primary active channel for the live player bento
  const activeLive = liveChannels[0] || {
    name: 'GV TV',
    prog: 'Berita Desa Pagi',
    viewers: '1.2rb',
    type: 'TV',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=600&auto=format&fit=crop',
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-8 stagger-in">
      {/* ══════════════════════════════════════════════════════════
          1. HERO BENTO CARD — Saldo GV Pay & Core Actions (Col 2)
      ══════════════════════════════════════════════════════════ */}
      <BentoCard
        colSpan={2}
        variant="white"
        className="p-4 border border-white/80 shadow-brand-md"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 253, 244, 0.88) 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
              <CreditCard size={13} />
            </div>
            <span className="text-[11.5px] font-bold text-surface-600 uppercase tracking-wider">
              Saldo GV Pay
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('bayar')}
            className="text-[11px] font-bold text-brand hover:underline flex items-center gap-0.5"
          >
            <span>Dompet</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-3.5">
          <p className="text-[28px] font-extrabold text-surface-900 leading-none tabular-nums headline-display tracking-tight">
            {p.balance > 0 ? `Rp ${p.balance.toLocaleString('id')}` : 'Rp 0'}
          </p>
          <button
            type="button"
            onClick={() => navigate('profile-poin')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 active:scale-95 transition"
          >
            <Star size={11} className="text-amber-500" fill="currentColor" />
            <span className="text-[11px] font-bold tabular-nums">
              {(p.points || 0).toLocaleString('id')} Poin
            </span>
          </button>
        </div>

        {/* 4 Core Quick Actions */}
        <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-surface-200/60">
          {[
            { label: 'Top Up', icon: Plus, to: 'bayar-topup', g: ['#1B5E20', '#2E7D32'] },
            { label: 'Transfer', icon: ArrowRightLeft, to: 'bayar-transfer', g: ['#0D47A1', '#1976D2'] },
            { label: 'Scan QRIS', icon: ScanLine, action: onOpenQris, g: ['#0C3E1E', '#1B6B3A'] },
            { label: 'Layanan', icon: Grid3x3, action: onOpenMore, g: ['#37474F', '#546E7A'] },
          ].map((act) => (
            <button
              key={act.label}
              type="button"
              onClick={() => (act.action ? act.action() : navigate(act.to))}
              className="flex flex-col items-center gap-1 active:scale-90 transition-transform group"
            >
              <SkeuoIcon icon={act.icon} gradient={act.g} size="sm" />
              <span className="text-[11px] font-semibold text-surface-700 group-hover:text-surface-900 leading-tight">
                {act.label}
              </span>
            </button>
          ))}
        </div>
      </BentoCard>

      {/* ══════════════════════════════════════════════════════════
          2. ASYMMETRIC BENTO DUO:
             Left (Col 1): Sedang Tayang Live Mini-Player
             Right (Col 1): Urgency / Action Alert / Tanya GV
      ══════════════════════════════════════════════════════════ */}
      {/* Mini Live Player Bento (Col 1: Card GV TV) */}
      <BentoCard
        colSpan={1}
        variant="elevated"
        onClick={() => navigate('siaran')}
        className="p-0 overflow-hidden flex flex-col justify-between group cursor-pointer border border-white/80 shadow-brand-md"
        style={{
          minHeight: 168,
        }}
      >
        <div className="relative h-24 w-full overflow-hidden bg-surface-800 flex-shrink-0">
          <img
            src={activeLive.image}
            alt={activeLive.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-2 start-2">
            <Badge variant="live" size="sm" />
          </div>
          <div className="absolute bottom-2 start-2 end-2 flex items-center justify-between">
            <span className="text-white text-[12px] font-bold truncate drop-shadow-sm">
              {activeLive.name}
            </span>
            <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
              <Play size={10} fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="p-2.5 flex flex-col justify-between flex-1 bg-white">
          <p className="text-[11.5px] font-semibold text-surface-800 leading-tight line-clamp-1">
            {activeLive.prog}
          </p>
          <div className="flex items-center justify-between mt-1 text-[10.5px] text-surface-400 font-medium">
            <span>{activeLive.viewers} menonton</span>
            <span className="text-brand font-bold flex items-center gap-0.5">
              Live <ArrowUpRight size={10} />
            </span>
          </div>
        </div>
      </BentoCard>

      {/* Dynamic Context Bento (Col 1: Card Tanya GV & Quick Action) */}
      <div className="col-span-1 flex flex-col gap-2.5 h-full justify-between" style={{ minHeight: 168 }}>
        {/* Tanya GV AI Assistant Card */}
        <BentoCard
          colSpan={1}
          variant="elevated"
          onClick={onOpenTanyaGV}
          className="p-3 flex-1 flex flex-col justify-between border border-brand/20 shadow-brand-sm group cursor-pointer"
          style={{
            background: 'linear-gradient(145deg, rgba(240, 253, 244, 0.95), rgba(255, 255, 255, 0.92))',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-brand text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} className="text-brand" />
              <span>Tanya GV</span>
            </span>
            <div className="w-5 h-5 rounded-md bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
              <Bot size={13} />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-surface-900 text-[12px] font-bold leading-tight">
              Tanya GV AI
            </p>
            <p className="text-surface-500 text-[10px] mt-0.5">Asisten Desa Pintar →</p>
          </div>
        </BentoCard>

        {/* Secondary Quick Tile (Komunitas / Warga Sekitarmu) */}
        <BentoCard
          colSpan={1}
          variant="subtle"
          onClick={() => navigate('komunitas')}
          className="p-2.5 flex items-center justify-between active:scale-[0.98] transition cursor-pointer border border-surface-200/60"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Users size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-surface-900 truncate">Warga Sekitarmu</p>
              <p className="text-[9.5px] text-surface-400 truncate">Forum & info desa</p>
            </div>
          </div>
          <ChevronRight size={13} className="text-surface-400 flex-shrink-0" />
        </BentoCard>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. PERSONA CAPABILITY METRICS BENTO (Col 2)
      ══════════════════════════════════════════════════════════ */}
      {isSeller && !isSuperAdmin && p.tokoStats && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5 border border-brand/15">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Store size={15} className="text-brand" />
              <span className="text-[12px] font-extrabold text-surface-900">Performa Toko Hari Ini</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('pasar-toko')}
              className="text-[11px] font-bold text-brand hover:underline"
            >
              Kelola Toko →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 divide-x divide-surface-200/80 pt-1">
            <div className="text-center px-1">
              <p className="text-[16px] font-extrabold text-surface-900 tabular-nums">
                {p.tokoStats.orders}
              </p>
              <p className="text-[10px] text-surface-500 font-medium mt-0.5">Pesanan Baru</p>
            </div>
            <div className="text-center px-1">
              <p className="text-[16px] font-extrabold text-brand tabular-nums">
                Rp {Math.round(p.tokoStats.revenue / 1000)}rb
              </p>
              <p className="text-[10px] text-surface-500 font-medium mt-0.5">Omzet</p>
            </div>
            <div className="text-center px-1">
              <p className="text-[16px] font-extrabold text-surface-900 tabular-nums">
                {p.tokoStats.products}
              </p>
              <p className="text-[10px] text-surface-500 font-medium mt-0.5">Produk Aktif</p>
            </div>
          </div>
        </BentoCard>
      )}

      {isCreator && !isSuperAdmin && p.studioStats && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Clapperboard size={15} className="text-purple-600" />
              <span className="text-[12px] font-extrabold text-surface-900">Studio Kreator</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('studio')}
              className="text-[11px] font-bold text-purple-600 hover:underline"
            >
              Dashboard →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 divide-x divide-surface-200/80 pt-1">
            <div className="text-center px-1">
              <p className="text-[16px] font-extrabold text-surface-900 tabular-nums">
                {p.studioStats.views?.toLocaleString('id')}
              </p>
              <p className="text-[10px] text-surface-500 font-medium mt-0.5">Ditonton</p>
            </div>
            <div className="text-center px-1">
              <p className="text-[16px] font-extrabold text-amber-600 tabular-nums">
                {p.studioStats.points}
              </p>
              <p className="text-[10px] text-surface-500 font-medium mt-0.5">Poin Kreator</p>
            </div>
            <div className="text-center px-1">
              <p className="text-[16px] font-extrabold text-surface-900 tabular-nums">
                {p.studioStats.content}
              </p>
              <p className="text-[10px] text-surface-500 font-medium mt-0.5">Konten Tayang</p>
            </div>
          </div>
        </BentoCard>
      )}

      {isSuperAdmin && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5 border border-red-500/20">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[12px] font-extrabold text-surface-900">Super Admin Dashboard</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
              Semua Role
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {[
              { val: String(p.urgentOrders || 0), lbl: 'Pesanan', to: 'pasar-toko' },
              { val: String(p.adminStats?.pendingReports || 0), lbl: 'Laporan', to: 'komunitas' },
              { val: String(p.studioStats?.pendingContent || 0), lbl: 'Review', to: 'studio' },
              { val: p.adminStats?.totalMembers || '0', lbl: 'Anggota', to: 'komunitas' },
            ].map((m) => (
              <button
                key={m.lbl}
                type="button"
                onClick={() => navigate(m.to)}
                className="p-2 rounded-xl bg-surface-100/70 hover:bg-surface-200 transition text-center"
              >
                <p className="text-[15px] font-extrabold text-surface-900 tabular-nums">{m.val}</p>
                <p className="text-[9.5px] text-surface-500 font-medium">{m.lbl}</p>
              </button>
            ))}
          </div>
        </BentoCard>
      )}

      {/* ══════════════════════════════════════════════════════════
          4. WARGA BARU ONBOARDING CHECKLIST (Jika Warga Baru)
      ══════════════════════════════════════════════════════════ */}
      {isNewUser && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5">
          <p className="text-[13px] font-extrabold text-surface-900 mb-1">Mulai Perjalananmu</p>
          <p className="text-[11px] text-surface-500 mb-2.5">Langkah mudah untuk menikmati layanan desa</p>
          <div className="flex flex-col gap-2">
            {[
              { title: 'Isi Saldo GV Pay', sub: 'Mulai transaksi & bayar tagihan', to: 'bayar-topup', icon: Plus },
              { title: 'Gabung Komunitas Desa', sub: 'Berkenalan dengan warga sekitar', to: 'komunitas', icon: Users },
              { title: 'Belanja di Pasar ESTO', sub: 'Beli langsung dari hasil panen desa', to: 'pasar', icon: ShoppingBag },
            ].map((st, i) => (
              <button
                key={st.title}
                type="button"
                onClick={() => navigate(st.to)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-50 hover:bg-surface-100 transition text-left active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand flex-shrink-0 font-bold text-xs">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-surface-900 leading-tight">{st.title}</p>
                  <p className="text-[10px] text-surface-500 leading-tight mt-0.5">{st.sub}</p>
                </div>
                <ChevronRight size={14} className="text-surface-400" />
              </button>
            ))}
          </div>
        </BentoCard>
      )}

      {/* ══════════════════════════════════════════════════════════
          5. PASAR ESTO FRESH HARVEST BENTO (Col 2)
      ══════════════════════════════════════════════════════════ */}
      {!isNewUser && estoProducts.length > 0 && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-brand" />
              <h3 className="text-[13px] font-extrabold text-surface-900">Produk dari Desamu</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('pasar')}
              className="text-[11px] font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              <span>Belanja</span>
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {estoProducts.slice(0, 3).map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => navigate('pasar')}
                className="rounded-xl overflow-hidden bg-surface-50/80 border border-surface-200/60 text-left active:scale-[0.96] transition flex flex-col group"
              >
                <div className="h-16 w-full relative bg-surface-200 overflow-hidden">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand/10 text-brand">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                  <span className="absolute top-1 start-1 text-[9px] font-bold px-1 py-0.2 rounded bg-black/60 text-white backdrop-blur-sm">
                    {prod.cat || 'Lokal'}
                  </span>
                </div>
                <div className="p-1.5 flex-1 flex flex-col justify-between">
                  <p className="text-[10.5px] font-bold text-surface-900 line-clamp-1">
                    {prod.name}
                  </p>
                  <p className="text-[11px] font-black text-brand tabular-nums mt-0.5">
                    Rp {(prod.price || 0).toLocaleString('id')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </BentoCard>
      )}

      {/* ══════════════════════════════════════════════════════════
          6. SUARA KOMUNITAS & TRENDING FORUM BENTO (Col 2)
      ══════════════════════════════════════════════════════════ */}
      {!isNewUser && threads.length > 0 && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Wheat size={14} className="text-amber-600" />
              <h3 className="text-[13px] font-extrabold text-surface-900">Diskusi Hangat Warga</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('komunitas')}
              className="text-[11px] font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              <span>Forum</span>
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {threads.slice(0, 2).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => navigate('komunitas')}
                className="p-2.5 rounded-xl bg-surface-50/80 border border-surface-200/60 text-left active:scale-[0.98] transition hover:bg-surface-100/80"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className="text-[9.5px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: t.bg || '#E8F5E9', color: t.ic || '#2E7D32' }}
                  >
                    {t.community}
                  </span>
                  <span className="text-[10px] text-surface-400">{t.time} lalu</span>
                </div>
                <p className="text-[11.5px] font-bold text-surface-900 leading-snug line-clamp-2 mb-1.5">
                  {t.text}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-surface-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={11} /> {t.replies} balasan
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={11} /> {t.likes}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </BentoCard>
      )}

      {/* ══════════════════════════════════════════════════════════
          7. REKOMENDASI MEDIA & PODCAST (Col 2)
      ══════════════════════════════════════════════════════════ */}
      {rekomendasi.length > 0 && (
        <BentoCard colSpan={2} variant="elevated" className="p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[13px] font-extrabold text-surface-900">Rekomendasi untukmu</h3>
            <button
              type="button"
              onClick={() => navigate('siaran')}
              className="text-[11px] font-bold text-brand hover:underline"
            >
              Semua Media →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {rekomendasi.slice(0, 2).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate('siaran')}
                className="rounded-xl overflow-hidden bg-surface-50 border border-surface-200/60 text-left active:scale-[0.96] transition group"
              >
                <div className="h-16 w-full relative bg-surface-300">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, ${item.g?.[0] || '#1B6B3A'}, ${item.g?.[1] || '#2E7D32'})`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute top-1 start-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                    {item.type || 'VOD'}
                  </span>
                  <div className="absolute bottom-1 end-1 w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                    <Play size={8} fill="currentColor" />
                  </div>
                </div>
                <div className="p-1.5">
                  <p className="text-[11px] font-bold text-surface-900 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[9.5px] text-surface-400 mt-0.5">{item.dur || '15:00'}</p>
                </div>
              </button>
            ))}
          </div>
        </BentoCard>
      )}
    </div>
  )
}
