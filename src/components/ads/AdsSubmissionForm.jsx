import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, UploadCloud, X, Check, Loader2, Info, Eye, ExternalLink, 
  AlignLeft, Clapperboard, Sparkles, Play, 
  ArrowRight, ArrowLeft, Megaphone, Star, Tag, CheckCircle2,
  Calendar, Clock, ShieldCheck, AlertTriangle, ShieldAlert, RotateCcw,
  CreditCard, ChevronLeft, ChevronRight, CheckSquare, Square,
  MessageCircle, Search, Wrench, Briefcase, Plus, Image as ImageIcon,
  Video, Film, Compass
} from 'lucide-react';
import { useAds } from './AdsContext';
import LocationPickerMap from '@/components/maps/LocationPickerMap';

const DAILY_RATE = 8500;

// 2 Kategori Iklan Resmi GV (Iklan Produk & Iklan Promo dihapus)
const AD_CATEGORIES = [
  { 
    id: 'baris', 
    label: 'Iklan Baris', 
    icon: AlignLeft, 
    badge: 'Carousel Live', 
    desc: 'Tampil di Carousel Tab Live GV Media dengan tombol WhatsApp',
    placeholder: 'Cth: Sepeda Lipat Polygon Urbano 3 mulus 95% pemakaian santai...'
  },
  { 
    id: 'video', 
    label: 'Iklan Video', 
    icon: Clapperboard, 
    badge: 'In-Stream (15s)', 
    desc: 'Tayangan video bumper saat jeda siaran TV desa (maksimal 15 detik)',
    placeholder: 'Cth: Profil Desa Wisata Sukamaju & Paket Homestay Asri...'
  },
];

// 5 Sub-kategori untuk Iklan Baris
const SUB_KATEGORI_OPTIONS = [
  { id: 'Jual', label: 'Jual', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', gradient: 'from-emerald-700 to-green-900', icon: Tag },
  { id: 'Beli', label: 'Beli', badge: 'bg-blue-50 text-blue-800 border-blue-200', gradient: 'from-blue-700 to-indigo-900', icon: Search },
  { id: 'Cari', label: 'Cari', badge: 'bg-amber-50 text-amber-800 border-amber-200', gradient: 'from-amber-600 to-orange-800', icon: Search },
  { id: 'Jasa', label: 'Jasa', badge: 'bg-purple-50 text-purple-800 border-purple-200', gradient: 'from-purple-700 to-indigo-950', icon: Wrench },
  { id: 'Lowongan', label: 'Lowongan', badge: 'bg-teal-50 text-teal-800 border-teal-200', gradient: 'from-teal-700 to-cyan-950', icon: Briefcase },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatIndoDate(d) {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export default function AdsSubmissionForm({ onSuccess, initialData = null, onCancelEdit = null }) {
  const { submitAd, updateAndRetryAd } = useAds();

  // Multi-step View: 'form' (Step 1-2) | 'ai-checking' (Step 4) | 'ai-failed' (Step 4 Fail) | 'review-submitted' (Step 5)
  const [stepView, setStepView] = useState('form');
  const [showBottomSheetPreview, setShowBottomSheetPreview] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  // Field Refs for Auto-scroll on Validation Failure
  const judulRef = useRef(null);
  const deskripsiRef = useRef(null);
  const hargaRef = useRef(null);
  const whatsappRef = useRef(null);
  const lokasiRef = useRef(null);
  const videoBoxRef = useRef(null);
  const scheduleRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      const isVideoCat = initialData.kategori === 'video';
      return {
        kategori: isVideoCat ? 'video' : 'baris',
        subKategori: initialData.subKategori || 'Jual',
        judul: initialData.judul || initialData.materi || '',
        deskripsi: initialData.deskripsi || '',
        materi: initialData.materi || initialData.judul || '',
        tipe: initialData.tipe || 'jual',
        harga: initialData.harga || '',
        hargaLabel: initialData.hargaLabel || '',
        jangkauan: initialData.jangkauan || 'lokal',
        lokasi: initialData.lokasi || 'Desa Sukamaju, Kec. Sukamakmur, Bogor',
        coords: initialData.coords || { lat: -6.6042, lng: 107.0395 },
        radiusKm: 20, // fixed 20 km
        whatsapp: initialData.whatsapp || '081234567890',
        photos: Array.isArray(initialData.photos) ? initialData.photos.slice(0, 1) : [],
        videoUrl: initialData.videoUrl || '',
        videoDuration: initialData.videoDuration || null,
        videoFileName: initialData.videoFileName || '',
        revisionCount: initialData.revisionCount || 0,
        editAdId: initialData.id || null,
      };
    }
    return {
      kategori: 'baris',
      subKategori: 'Jual',
      judul: '',
      deskripsi: '',
      materi: '',
      tipe: 'jual',
      harga: '',
      hargaLabel: '',
      jangkauan: 'lokal',
      lokasi: 'Desa Sukamaju, Kec. Sukamakmur, Bogor',
      coords: { lat: -6.6042, lng: 107.0395 },
      radiusKm: 20,
      whatsapp: '08',
      photos: [],
      videoUrl: '',
      videoDuration: null,
      videoFileName: '',
      revisionCount: 0,
      editAdId: null,
    };
  });

  // Video Duration Validation Error
  const [videoError, setVideoError] = useState(null);

  // AI Simulation State
  const [simulateAiFail, setSimulateAiFail] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  // Schedule State: 'sprint' (3, 4, 5 days) vs 'custom' (multi-select dates)
  const [scheduleType, setScheduleType] = useState('sprint');
  const [sprintDays, setSprintDays] = useState(3); // 3 | 4 | 5
  
  // Custom multi-dates selection (Set of YYYY-MM-DD strings)
  const [customDates, setCustomDates] = useState(() => {
    return new Set(['2026-09-12']);
  });

  // Keep form data in sync with incoming initialData (e.g. from Riwayat -> Edit)
  useEffect(() => {
    if (initialData) {
      const isVideoCat = initialData.kategori === 'video';
      setFormData({
        kategori: isVideoCat ? 'video' : 'baris',
        subKategori: initialData.subKategori || 'Jual',
        judul: initialData.judul || initialData.materi || '',
        deskripsi: initialData.deskripsi || '',
        materi: initialData.materi || initialData.judul || '',
        tipe: initialData.tipe || 'jual',
        harga: initialData.harga || '',
        hargaLabel: initialData.hargaLabel || '',
        jangkauan: initialData.jangkauan || 'lokal',
        lokasi: initialData.lokasi || 'Desa Sukamaju, Kec. Sukamakmur, Bogor',
        coords: initialData.coords || { lat: -6.6042, lng: 107.0395 },
        radiusKm: 20,
        whatsapp: initialData.whatsapp || '081234567890',
        photos: Array.isArray(initialData.photos) ? initialData.photos.slice(0, 1) : [],
        videoUrl: initialData.videoUrl || '',
        videoDuration: initialData.videoDuration || null,
        videoFileName: initialData.videoFileName || '',
        revisionCount: initialData.revisionCount || 0,
        editAdId: initialData.id || null,
      });

      if (initialData.schedule) {
        if (initialData.schedule.type === 'custom' && Array.isArray(initialData.schedule.dates) && initialData.schedule.dates.length > 0) {
          setScheduleType('custom');
          setCustomDates(new Set(initialData.schedule.dates));
        } else if (initialData.schedule.type === 'sprint') {
          setScheduleType('sprint');
          setSprintDays(initialData.schedule.totalDays || 3);
        }
      }
      setStepView('form');
    }
  }, [initialData]);

  // Active Category Data (Default to baris if not found)
  const activeCategory = AD_CATEGORIES.find(c => c.id === formData.kategori) || AD_CATEGORIES[0];
  const activeSubKategori = SUB_KATEGORI_OPTIONS.find(s => s.id === formData.subKategori) || SUB_KATEGORI_OPTIONS[0];

  // Base reference date for 2026 calendar (Current date: 11 Sep 2026)
  const tomorrowDate = useMemo(() => new Date(2026, 8, 12), []);

  // Compute Active Schedule & Realtime Price
  const computedSchedule = useMemo(() => {
    if (scheduleType === 'sprint') {
      const start = new Date(tomorrowDate);
      const end = new Date(tomorrowDate);
      end.setDate(start.getDate() + (sprintDays - 1));

      const dates = [];
      const curr = new Date(start);
      while (curr <= end) {
        const y = curr.getFullYear();
        const m = String(curr.getMonth() + 1).padStart(2, '0');
        const d = String(curr.getDate()).padStart(2, '0');
        dates.push(`${y}-${m}-${d}`);
        curr.setDate(curr.getDate() + 1);
      }

      return {
        type: 'sprint',
        totalDays: sprintDays,
        dailyRate: DAILY_RATE,
        totalCost: sprintDays * DAILY_RATE,
        startDate: formatIndoDate(start),
        endDate: formatIndoDate(end),
        dates,
      };
    } else {
      const selectedArray = Array.from(customDates).sort();
      const count = selectedArray.length;
      let startStr = 'Belum dipilih';
      let endStr = 'Belum dipilih';

      if (count > 0) {
        const [sy, sm, sd] = selectedArray[0].split('-').map(Number);
        const [ey, em, ed] = selectedArray[count - 1].split('-').map(Number);
        startStr = formatIndoDate(new Date(sy, sm - 1, sd));
        endStr = formatIndoDate(new Date(ey, em - 1, ed));
      }

      return {
        type: 'custom',
        totalDays: count,
        dailyRate: DAILY_RATE,
        totalCost: count * DAILY_RATE,
        startDate: startStr,
        endDate: endStr,
        dates: selectedArray,
      };
    }
  }, [scheduleType, sprintDays, customDates, tomorrowDate]);

  // Handle Custom Date Toggle
  const toggleCustomDate = (dateStr) => {
    setCustomDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        if (next.size > 1) next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  // ─────────────────────────────────────────────────────────────
  // PHOTO HANDLING (MAKSIMAL 1 FOTO SAJA — TANPA CONTOH FOTO)
  // ─────────────────────────────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        photos: [uploadEvent.target.result],
      }));
    };
    reader.readAsDataURL(file);

    if (e.target) e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [],
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // VIDEO HANDLING (DURASI MAKSIMAL 15 DETIK)
  // ─────────────────────────────────────────────────────────────
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    const blobUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = blobUrl;

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(blobUrl);
      const duration = Math.round(tempVideo.duration);

      if (duration > 15) {
        setVideoError(`Durasi video Anda (${duration} detik) melebihi batas maksimal 15 detik! Silakan unggah klip video yang lebih singkat.`);
        setFormData((prev) => ({
          ...prev,
          videoUrl: '',
          videoDuration: null,
          videoFileName: '',
        }));
      } else {
        setVideoError(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFormData((prev) => ({
            ...prev,
            videoUrl: ev.target.result,
            videoDuration: duration || 1,
            videoFileName: file.name,
          }));
          if (formErrors.video) {
            setFormErrors((prev) => ({ ...prev, video: null }));
          }
        };
        reader.readAsDataURL(file);
      }
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      setVideoError('Gagal memuat format video. Pastikan format file MP4, WebM, atau MOV.');
    };

    if (e.target) e.target.value = '';
  };

  const handleAddSampleVideo = () => {
    setVideoError(null);
    setFormData((prev) => ({
      ...prev,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
      videoDuration: 10,
      videoFileName: 'demo-wisata-desa-10s.mp4',
    }));
    if (formErrors.video) {
      setFormErrors((prev) => ({ ...prev, video: null }));
    }
  };

  const handleRemoveVideo = () => {
    setVideoError(null);
    setFormData((prev) => ({
      ...prev,
      videoUrl: '',
      videoDuration: null,
      videoFileName: '',
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 2: VALIDATE AND OPEN PREVIEW (BOTTOM SHEET)
  // ─────────────────────────────────────────────────────────────
  const handleValidateAndOpenPreview = (e) => {
    if (e) e.preventDefault();
    const errors = {};
    let firstErrorRef = null;

    if (formData.kategori === 'baris') {
      // Judul Iklan Baris: maks 50 karakter & wajib
      if (!formData.judul || !formData.judul.trim()) {
        errors.judul = 'Judul iklan wajib diisi.';
        if (!firstErrorRef) firstErrorRef = judulRef;
      } else if (formData.judul.trim().length > 50) {
        errors.judul = 'Judul iklan maksimal 50 karakter.';
        if (!firstErrorRef) firstErrorRef = judulRef;
      }

      // Deskripsi Singkat: maks 120 karakter & wajib
      if (!formData.deskripsi || !formData.deskripsi.trim()) {
        errors.deskripsi = 'Deskripsi singkat iklan wajib diisi.';
        if (!firstErrorRef) firstErrorRef = deskripsiRef;
      } else if (formData.deskripsi.trim().length > 120) {
        errors.deskripsi = 'Deskripsi iklan maksimal 120 karakter.';
        if (!firstErrorRef) firstErrorRef = deskripsiRef;
      }

      // Nomor WhatsApp: format 08xx atau 62xx & wajib
      const rawPhone = (formData.whatsapp || '').trim();
      const digits = rawPhone.replace(/\D/g, '');
      if (!rawPhone) {
        errors.whatsapp = 'Nomor kontak WhatsApp wajib diisi.';
        if (!firstErrorRef) firstErrorRef = whatsappRef;
      } else if (!rawPhone.startsWith('08') && !rawPhone.startsWith('62')) {
        errors.whatsapp = 'Nomor kontak WhatsApp harus diawali format 08xx atau 62xx.';
        if (!firstErrorRef) firstErrorRef = whatsappRef;
      } else if (digits.length < 10 || digits.length > 15) {
        errors.whatsapp = 'Nomor kontak WhatsApp tidak valid (10-15 digit).';
        if (!firstErrorRef) firstErrorRef = whatsappRef;
      }
    } else if (formData.kategori === 'video') {
      // Judul Iklan Video: maks 60 karakter & wajib
      if (!formData.judul || !formData.judul.trim()) {
        errors.judul = 'Judul iklan video wajib diisi.';
        if (!firstErrorRef) firstErrorRef = judulRef;
      } else if (formData.judul.trim().length > 60) {
        errors.judul = 'Judul iklan video maksimal 60 karakter.';
        if (!firstErrorRef) firstErrorRef = judulRef;
      }

      // File Video: wajib diunggah & durasi <= 15 detik
      if (!formData.videoUrl) {
        errors.video = 'File video wajib diunggah (maksimal 15 detik).';
        if (!firstErrorRef) firstErrorRef = videoBoxRef;
      } else if (formData.videoDuration > 15) {
        errors.video = `Durasi video (${formData.videoDuration} detik) melebihi batas 15 detik.`;
        if (!firstErrorRef) firstErrorRef = videoBoxRef;
      }
    }

    // Target Wilayah: jika lokal, lokasi wajib
    if (formData.jangkauan === 'lokal') {
      if (!formData.lokasi || !formData.lokasi.trim() || formData.lokasi.trim().toLowerCase() === 'nasional') {
        errors.lokasi = 'Silakan pilih titik lokasi di peta terlebih dahulu.';
        if (!firstErrorRef) firstErrorRef = lokasiRef;
      }
    }

    // Jadwal wajib
    if (computedSchedule.totalDays < 1) {
      errors.schedule = 'Pilih minimal 1 tanggal jadwal penayangan.';
      if (!firstErrorRef) firstErrorRef = scheduleRef;
    }

    // If validation fails: scroll to first error field & highlight red
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (firstErrorRef && firstErrorRef.current) {
        firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputEl = firstErrorRef.current.querySelector('input, textarea') || firstErrorRef.current;
        inputEl?.focus?.();
      }
      return;
    }

    // Valid: Clear errors and open preview
    setFormErrors({});
    setShowBottomSheetPreview(true);
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 4: TRIGGER AI CHECKING & SIMULATION
  // ─────────────────────────────────────────────────────────────
  const handleStartAiCheck = () => {
    setShowBottomSheetPreview(false);
    setStepView('ai-checking');
    setAiStage(0);
    setAiProgress(10);

    setTimeout(() => {
      setAiStage(1);
      setAiProgress(55);
    }, 1200);

    setTimeout(() => {
      setAiStage(2);
      setAiProgress(85);
    }, 2500);

    setTimeout(async () => {
      setAiProgress(100);

      const textToCheck = `${formData.judul || ''} ${formData.deskripsi || ''} ${formData.materi || ''}`.toLowerCase();
      const sensitiveKeywords = ['judi', 'obat terlarang', 'senjata', 'palsu', 'investasi cepat untung'];
      const hasBadWord = sensitiveKeywords.some(kw => textToCheck.includes(kw));

      if (simulateAiFail || hasBadWord) {
        setStepView('ai-failed');
      } else {
        const isBaris = formData.kategori === 'baris';
        const payload = {
          kategori: formData.kategori,
          subKategori: isBaris ? (formData.subKategori || 'Jual') : 'Video',
          judul: formData.judul,
          deskripsi: isBaris ? (formData.deskripsi || '') : `Iklan Video Bumper (15s)`,
          materi: isBaris 
            ? `${formData.judul} - ${formData.deskripsi || ''}` 
            : `${formData.judul} [Video ${formData.videoDuration || 15}s]`,
          tipe: isBaris && (formData.subKategori === 'Beli' || formData.subKategori === 'Cari') ? 'beli' : 'jual',
          harga: isBaris ? (formData.harga ? Number(formData.harga) : null) : null,
          hargaLabel: isBaris 
            ? (formData.harga ? `Rp ${Number(formData.harga).toLocaleString('id-ID')}` : 'Hubungi Penjual') 
            : null,
          jangkauan: formData.jangkauan || 'lokal',
          lokasi: formData.jangkauan === 'nasional' ? 'Nasional' : (formData.lokasi || 'Desa Sukamaju, Kec. Sukamakmur, Bogor'),
          coords: formData.coords || { lat: -6.6042, lng: 107.0395 },
          radiusKm: formData.jangkauan === 'lokal' ? 20 : null,
          whatsapp: isBaris ? formData.whatsapp : null,
          photos: isBaris ? (formData.photos || []).slice(0, 1) : [],
          videoUrl: !isBaris ? formData.videoUrl : null,
          videoDuration: !isBaris ? formData.videoDuration : null,
          schedule: computedSchedule,
        };

        if (formData.editAdId) {
          await updateAndRetryAd(formData.editAdId, payload);
        } else {
          await submitAd(payload);
        }

        setStepView('review-submitted');
      }
    }, 3500);
  };

  // ─────────────────────────────────────────────────────────────
  // REUSABLE: TARGET WILAYAH SECTION (Tanpa Chip, HANYA Tombol Peta, Card Lokasi Terpilih)
  // ─────────────────────────────────────────────────────────────
  const renderTargetWilayah = (isBaris = false) => {
    const hasSelectedLocation = Boolean(formData.lokasi && formData.lokasi !== 'Nasional');
    const coords = formData.coords || { lat: -6.6042, lng: 107.0395 };

    return (
      <div ref={lokasiRef} className="space-y-3 pt-1">
        {/* Label Target Lokasi / Target Wilayah (HAPUS TAG / CHIP SESUAI POIN 1) */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-surface-700 flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-700" />
            <span>{isBaris ? 'Target Lokasi' : 'Target Wilayah'}</span>
            <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Toggle Nasional vs Lokal */}
        <div className="grid grid-cols-2 gap-2 bg-surface-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, jangkauan: 'nasional', lokasi: 'Nasional' }))}
            className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              formData.jangkauan === 'nasional'
                ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-600/20'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <span>Nasional</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({
              ...prev,
              jangkauan: 'lokal',
              lokasi: prev.lokasi === 'Nasional' ? 'Desa Sukamaju, Kec. Sukamakmur, Bogor' : (prev.lokasi || 'Desa Sukamaju, Kec. Sukamakmur, Bogor')
            }))}
            className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              formData.jangkauan === 'lokal'
                ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-600/20'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <span>Lokal (Radius 20 km)</span>
          </button>
        </div>

        {formData.jangkauan === 'nasional' ? (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-950 flex items-start gap-2">
            <Info size={14} className="text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Iklan akan ditayangkan secara luas ke seluruh pemirsa dan penonton siaran GV Media di seluruh Indonesia.
            </p>
          </div>
        ) : (
          <div className="space-y-3 bg-surface-50 border border-surface-200/80 rounded-2xl p-3.5">
            {/* Radius Wilayah: 20 km (Fixed) */}
            <div className="flex items-center justify-between bg-white border border-surface-200 rounded-xl px-3 py-2 text-xs">
              <span className="text-surface-500 text-[11px]">Radius Jangkauan:</span>
              <span className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[11px]">
                20 km (Tetap / Fixed)
              </span>
            </div>

            {/* Card Lokasi Terpilih dari Peta (Sama persis dengan card yang muncul di LocationPickerMap setelah pin dijatuhkan) */}
            {hasSelectedLocation ? (
              <div className="bg-white rounded-2xl border border-emerald-200/80 p-3.5 shadow-2xs space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                    <MapPin size={20} className="text-emerald-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                        Lokasi Terpilih
                      </span>
                      <span className="text-[10.5px] font-mono text-gray-400">
                        {typeof coords.lat === 'number' ? coords.lat.toFixed(4) : coords.lat}, {typeof coords.lng === 'number' ? coords.lng.toFixed(4) : coords.lng}
                      </span>
                    </div>
                    <p className="text-[13px] font-extrabold text-gray-900 mt-1 leading-snug break-words">
                      {formData.lokasi}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Titik pusat penyiaran iklan dalam radius 20 km
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center text-xs text-amber-900">
                <p className="font-semibold text-[11.5px]">Belum ada lokasi pusat yang dipilih</p>
                <p className="text-[10.5px] text-amber-700 mt-0.5">
                  Ketuk tombol "Pilih di Peta" di bawah untuk menentukan titik pusat jangkauan iklan.
                </p>
              </div>
            )}

            {/* HANYA Tombol "Pilih di Peta" (Input teks manual dihapus sesuai POIN 1) */}
            <div>
              <button
                type="button"
                onClick={() => setShowMapPicker(true)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MapPin size={15} className="text-emerald-300" />
                <span>{hasSelectedLocation ? 'Ubah Lokasi di Peta' : 'Pilih di Peta'}</span>
              </button>
              {formErrors.lokasi && (
                <p className="text-[10.5px] text-rose-600 font-semibold mt-1.5 text-center">{formErrors.lokasi}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 4: SCANNING AI (Tampilan Scanning 3-4 Detik)
  // ─────────────────────────────────────────────────────────────
  if (stepView === 'ai-checking') {
    const stageTexts = [
      'Memeriksa kesesuaian materi iklan...',
      'Memverifikasi kepatuhan terhadap pedoman penyiaran GV...',
      'Hampir selesai, memvalidasi durasi & target wilayah...',
    ];

    return (
      <div className="bg-white rounded-3xl border border-surface-200 p-6 sm:p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[460px] animate-fade-in space-y-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-700 shadow-sm animate-pulse">
            <ShieldCheck size={38} className="text-emerald-700" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600" />
          </span>
        </div>

        <div className="space-y-1.5 max-w-xs">
          <h3 className="text-base font-extrabold text-surface-900">
            Pengecekan AI Sedang Berlangsung
          </h3>
          <p className="text-xs text-emerald-800 font-semibold min-h-[36px] flex items-center justify-center transition-all duration-300">
            {stageTexts[aiStage]}
          </p>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="w-full bg-surface-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${aiProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-surface-400 font-bold">
            <span>Scan Otomatis</span>
            <span>{aiProgress}%</span>
          </div>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-xl p-3 text-[11px] text-surface-500 max-w-xs text-left leading-relaxed">
          <p className="font-semibold text-surface-700 mb-0.5">ℹ️ Verifikasi Cepat:</p>
          Sistem AI GV menyaring materi iklan untuk memastikan bebas dari unsur penipuan, judi, atau konten terlarang sebelum diajukan ke kurator komite.
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 4 (FAIL): AI DETEKSI PELANGGARAN & ATURAN 1X REVISI
  // ─────────────────────────────────────────────────────────────
  if (stepView === 'ai-failed') {
    const isLocked = (formData.revisionCount || 0) >= 1;

    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center min-h-[460px] animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border-2 border-rose-400/40 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
          <ShieldAlert size={34} />
        </div>

        <div className="text-center space-y-2 max-w-sm mb-6">
          <h3 className="text-base font-extrabold text-rose-950">
            Iklan Belum Lolos Pengecekan AI
          </h3>
          <p className="text-xs text-rose-800/90 leading-relaxed">
            Sistem mendeteksi format atau materi yang berpotensi melanggar ketentuan komunitas penyiaran GV.
          </p>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-1.5 mb-6 w-full max-w-sm">
          <p className="font-bold flex items-center gap-1.5 text-rose-900">
            <AlertTriangle size={15} className="text-rose-600 flex-shrink-0" />
            <span>Pemberitahuan Pelanggaran:</span>
          </p>
          <p className="leading-relaxed text-rose-900/90">
            Konten iklan terdeteksi belum memenuhi standar penayangan komunitas GV (misal: penawaran keuntungan tidak wajar, janji berlebihan, atau format nomor kontak).
          </p>
        </div>

        {isLocked ? (
          <div className="bg-surface-100 border border-surface-200 rounded-2xl p-4 text-xs text-surface-600 max-w-sm space-y-3 mb-6 text-center">
            <p className="font-bold text-surface-900">Iklan Tidak Dapat Diajukan Kembali</p>
            <p className="text-[11.5px] leading-relaxed">
              Iklan ini telah melewati batas revisi maksimal (1x). Untuk menjaga keamanan komunitas, iklan tidak dapat disunting kembali.
            </p>
            <button
              type="button"
              onClick={() => onSuccess?.()}
              className="w-full py-3 rounded-xl bg-surface-800 hover:bg-surface-900 text-white font-extrabold text-xs active:scale-95 transition cursor-pointer"
            >
              Kembali ke Riwayat Iklan
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-3">
            <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 py-1.5 px-3 rounded-xl text-center">
              ⚠️ Batas revisi: Tersisa 1x kesempatan perbaikan
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData(p => ({ ...p, revisionCount: (p.revisionCount || 0) + 1 }));
                setStepView('form');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Perbaiki Iklan</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 5: REVIEW KOMITE GV (Sedang Ditinjau)
  // ─────────────────────────────────────────────────────────────
  if (stepView === 'review-submitted') {
    return (
      <div className="bg-white rounded-3xl border border-surface-200 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center min-h-[460px] animate-fade-in text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-400/50 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
          <Clock size={38} className="text-amber-600" />
        </div>

        <div className="space-y-2 max-w-sm mb-6">
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Tahap 5 • Sedang Ditinjau
          </span>
          <h3 className="text-lg font-black text-surface-900 tracking-tight pt-1">
            Iklan Masuk Antrean Review Komite GV
          </h3>
          <p className="text-xs text-surface-600 leading-relaxed">
            Iklan Anda berhasil melewati pengecekan awal AI dan saat ini sedang ditinjau secara manual oleh tim kurasi Komite GV.
          </p>
        </div>

        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 text-xs space-y-2 mb-6 w-full max-w-sm text-left">
          <div className="flex items-center justify-between text-surface-700">
            <span className="text-[11px]">Estimasi Waktu Review:</span>
            <span className="font-extrabold text-amber-900">Maks. 1×24 Jam</span>
          </div>
          <div className="flex items-center justify-between text-surface-700 border-t border-surface-200/60 pt-2">
            <span className="text-[11px]">Status Pemberitahuan:</span>
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Notifikasi Aktif
            </span>
          </div>
          <p className="text-[10.5px] text-surface-500 pt-1 leading-snug">
            Setelah disetujui komite, Anda akan menerima notifikasi untuk menyelesaikan pembayaran sebelum iklan tayang.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSuccess?.()}
          className="w-full max-w-sm py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Lihat Status di Riwayat Iklan
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 1: FORM IKLAN + SECTION JADWAL & ESTIMASI HARGA
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-green-900 text-white rounded-2xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Megaphone size={20} className="text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-black">
                {formData.editAdId ? 'Edit & Ajukan Ulang Iklan' : 'Pasang Iklan Desa di GV Media'}
              </h3>
              <p className="text-[11px] text-emerald-100/80 mt-0.5 leading-relaxed">
                Jangkau ribuan pemirsa siaran TV desa, radio, dan siaran live warga secara tertarget.
              </p>
            </div>
          </div>
          {formData.editAdId && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-[10px] font-bold text-emerald-200 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleValidateAndOpenPreview} className="space-y-4">
        {/* ── SEKSI 1: PILIH KATEGORI IKLAN (HANYA BARIS & VIDEO) ── */}
        <div className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-surface-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <h4 className="text-xs font-extrabold text-surface-900">Pilih Kategori Iklan</h4>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              {activeCategory.badge}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {AD_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = formData.kategori === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, kategori: cat.id })}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between min-h-[82px] ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs ring-1 ring-emerald-600/20'
                      : 'border-surface-200/80 bg-surface-50/40 hover:bg-surface-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-700 text-white' : 'bg-surface-200/60 text-surface-600'}`}>
                      <Icon size={15} />
                    </div>
                    {isSelected && <Check size={15} className="text-emerald-700 font-bold" />}
                  </div>
                  <div className="mt-2">
                    <p className={`text-xs font-extrabold leading-tight ${isSelected ? 'text-emerald-950' : 'text-surface-800'}`}>
                      {cat.label}
                    </p>
                    <p className="text-[10px] text-surface-400 truncate mt-0.5">{cat.badge}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SEKSI 2: FORM DETAIL KHUSUS IKLAN BARIS ── */}
        {formData.kategori === 'baris' ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <h4 className="text-xs font-extrabold text-surface-900">Materi Iklan Baris</h4>
            </div>

            {/* Foto Produk/Iklan (Opsional, Maksimal 1 Foto Saja — Tanpa Contoh Foto) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700 flex items-center gap-1">
                  <ImageIcon size={13} className="text-emerald-700" />
                  <span>Foto Produk / Iklan</span>
                  <span className="text-[10.5px] text-surface-400 font-normal">(Opsional, maks 1)</span>
                </label>
                <span className="text-[10px] text-surface-400 font-bold">
                  {(formData.photos || []).length}/1 Foto
                </span>
              </div>

              {/* Upload Input & Single Thumbnail */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2 py-1">
                {/* Upload Button (Hanya jika belum ada foto) */}
                {(formData.photos || []).length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60 flex flex-col items-center justify-center text-emerald-800 transition active:scale-95 shrink-0 cursor-pointer"
                  >
                    <Plus size={18} />
                    <span className="text-[9px] font-bold mt-0.5">Tambah</span>
                  </button>
                )}

                {/* Thumbnail Preview 1 Foto */}
                {(formData.photos || []).map((photoUrl, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-xl border border-surface-200 overflow-hidden relative shrink-0 group shadow-2xs">
                    <img src={photoUrl} alt="Foto Iklan" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                      title="Hapus foto"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-Kategori: Jual / Beli / Cari / Jasa / Lowongan */}
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {SUB_KATEGORI_OPTIONS.map((sub) => {
                  const isSelected = formData.subKategori === sub.id;
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, subKategori: sub.id })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-surface-100 text-surface-700 hover:bg-surface-200 border border-surface-200/70'
                      }`}
                    >
                      <SubIcon size={12} className={isSelected ? 'text-white' : 'text-surface-500'} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Judul Iklan Baris (Maks 50 Karakter) */}
            <div ref={judulRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700">
                  Judul Iklan <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-surface-400 font-medium">
                  {(formData.judul || '').length}/50
                </span>
              </div>
              <input
                type="text"
                maxLength={50}
                placeholder="Cth: Sepeda Lipat Polygon Urbano 3 Mulus"
                value={formData.judul}
                onChange={(e) => {
                  setFormData({ ...formData, judul: e.target.value });
                  if (formErrors.judul) setFormErrors({ ...formErrors, judul: null });
                }}
                className={`w-full bg-surface-50 border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition ${
                  formErrors.judul ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-surface-200'
                }`}
              />
              {formErrors.judul && (
                <p className="text-[10.5px] text-rose-600 font-semibold mt-1">{formErrors.judul}</p>
              )}
            </div>

            {/* Deskripsi Singkat (Maks 120 Karakter) */}
            <div ref={deskripsiRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700">
                  Deskripsi Singkat <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-surface-400 font-medium">
                  {(formData.deskripsi || '').length}/120
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={120}
                placeholder="Cth: Kondisi mulus 95% pemakaian santai akhir pekan, ban tebal, rem hidrolik pakem."
                value={formData.deskripsi}
                onChange={(e) => {
                  setFormData({ ...formData, deskripsi: e.target.value });
                  if (formErrors.deskripsi) setFormErrors({ ...formErrors, deskripsi: null });
                }}
                className={`w-full bg-surface-50 border rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none placeholder:text-surface-400 leading-relaxed transition ${
                  formErrors.deskripsi ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-surface-200'
                }`}
              />
              {formErrors.deskripsi && (
                <p className="text-[10.5px] text-rose-600 font-semibold mt-1">{formErrors.deskripsi}</p>
              )}
            </div>

            {/* Harga (Opsional - Tombol Nego Dihapus) */}
            <div ref={hargaRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700">
                  Harga / Penawaran <span className="text-[10.5px] text-surface-400 font-normal">(Opsional)</span>
                </label>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-surface-500 pointer-events-none">Rp</span>
                <input
                  type="number"
                  placeholder="Contoh: 1850000"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              {formData.harga && !isNaN(formData.harga) && (
                <p className="text-[10.5px] text-emerald-700 font-semibold mt-1">
                  Terbaca: Rp {Number(formData.harga).toLocaleString('id-ID')}
                </p>
              )}
            </div>

            {/* Nomor Kontak WhatsApp (Wajib) */}
            <div ref={whatsappRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700 flex items-center gap-1">
                  <MessageCircle size={13} className="text-emerald-700" />
                  <span>Nomor Kontak WhatsApp</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-surface-400">Format: 08xx / 62xx</span>
              </div>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={formData.whatsapp}
                onChange={(e) => {
                  setFormData({ ...formData, whatsapp: e.target.value });
                  if (formErrors.whatsapp) setFormErrors({ ...formErrors, whatsapp: null });
                }}
                className={`w-full bg-surface-50 border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition ${
                  formErrors.whatsapp ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-surface-200'
                }`}
              />
              {formErrors.whatsapp ? (
                <p className="text-[10.5px] text-rose-600 font-semibold mt-1">{formErrors.whatsapp}</p>
              ) : (
                <p className="text-[10px] text-surface-400 mt-1">
                  Tombol "Hubungi" di carousel TV akan langsung membuka chat WhatsApp ke nomor ini.
                </p>
              )}
            </div>

            {/* Target Lokasi (Target Wilayah: Nasional vs Lokal 20km & Peta) */}
            {renderTargetWilayah(true)}
          </div>
        ) : (
          /* ── SEKSI 2: FORM DETAIL KHUSUS IKLAN VIDEO ── */
          <div className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-surface-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-extrabold text-surface-900">Materi Iklan Video</h4>
              </div>
              <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Maks. 15 Detik
              </span>
            </div>

            {/* Judul Iklan Video (Maks 60 Karakter) */}
            <div ref={judulRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700">
                  Judul Iklan Video <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-surface-400 font-medium">
                  {(formData.judul || '').length}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                placeholder="Cth: Profil Desa Wisata Sukamaju & Paket Homestay Asri"
                value={formData.judul}
                onChange={(e) => {
                  setFormData({ ...formData, judul: e.target.value });
                  if (formErrors.judul) setFormErrors({ ...formErrors, judul: null });
                }}
                className={`w-full bg-surface-50 border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition ${
                  formErrors.judul ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-surface-200'
                }`}
              />
              {formErrors.judul && (
                <p className="text-[10.5px] text-rose-600 font-semibold mt-1">{formErrors.judul}</p>
              )}
            </div>

            {/* Upload Video (Maksimal 15 Detik) */}
            <div ref={videoBoxRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-700 flex items-center gap-1">
                  <Clapperboard size={13} className="text-emerald-700" />
                  <span>Unggah File Video</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-surface-400 font-bold">
                  Durasi Maks. 15 Detik
                </span>
              </div>

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />

              {!formData.videoUrl ? (
                <div className="space-y-2">
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition active:scale-[0.99] flex flex-col items-center justify-center min-h-[130px] ${
                      videoError || formErrors.video
                        ? 'border-rose-300 bg-rose-50/30 text-rose-700'
                        : 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 text-emerald-800'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-2xs">
                      <UploadCloud size={22} />
                    </div>
                    <p className="text-xs font-extrabold">Pilih / Upload Video Iklan</p>
                    <p className="text-[10.5px] text-surface-400 mt-0.5">
                      Format MP4/WebM · Durasi maksimal 15 detik
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSampleVideo}
                    className="w-full py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>Pakai Contoh Video Demo (10 Detik)</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-surface-50 p-3 space-y-2.5">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner">
                    <video
                      src={formData.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={11} />
                        Durasi: {formData.videoDuration} detik (Lolos ≤ 15s)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="text-[10.5px] font-bold text-emerald-800 hover:text-emerald-950 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 transition cursor-pointer"
                      >
                        Ganti Video
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-[10.5px] font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Message if duration > 15s */}
              {videoError && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 mt-2 flex items-start gap-2 text-rose-900 text-xs animate-shake">
                  <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Video Ditolak:</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed">{videoError}</p>
                  </div>
                </div>
              )}
              {formErrors.video && !videoError && (
                <p className="text-[10.5px] text-rose-600 font-semibold mt-1">{formErrors.video}</p>
              )}
            </div>

            {/* Target Wilayah untuk Video (Nasional vs Lokal 20km & Peta) */}
            {renderTargetWilayah(false)}
          </div>
        )}

        {/* ── SEKSI 3: JADWAL & ESTIMASI HARGA (Tarif Rp 8.500/hari) ── */}
        <div ref={scheduleRef} className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-surface-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <h4 className="text-xs font-extrabold text-surface-900">Jadwal &amp; Estimasi Harga</h4>
            </div>
            <span className="text-[10.5px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Rp 8.500 / Hari
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-emerald-950">
            <Clock size={14} className="text-emerald-700 flex-shrink-0" />
            <span>Tayang 24 jam penuh per hari · Aktif 7 hari seminggu termasuk hari Minggu.</span>
          </div>

          {/* Mode Switch: Sprint vs Custom */}
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Pilihan Jadwal</label>
            <div className="grid grid-cols-2 gap-2 bg-surface-100/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setScheduleType('sprint')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  scheduleType === 'sprint' ? 'bg-white shadow-xs text-emerald-800 ring-1 ring-emerald-600/20' : 'text-surface-500'
                }`}
              >
                Sprint (Hari Berurutan)
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('custom')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  scheduleType === 'custom' ? 'bg-white shadow-xs text-emerald-800 ring-1 ring-emerald-600/20' : 'text-surface-500'
                }`}
              >
                Custom (Pilih Tanggal)
              </button>
            </div>
          </div>

          {/* SPRINT */}
          {scheduleType === 'sprint' ? (
            <div className="space-y-2">
              <span className="text-[11px] text-surface-500 block">
                Pilih durasi berturut-turut mulai besok (H+1: <strong>12 Sep 2026</strong>):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSprintDays(days)}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      sprintDays === days
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-black ring-1 ring-emerald-600/20 shadow-2xs'
                        : 'border-surface-200 bg-surface-50/60 text-surface-700 hover:bg-surface-100 font-bold'
                    }`}
                  >
                    <span className="block text-xs">{days} Hari</span>
                    <span className="text-[10px] text-surface-400 block font-normal">
                      {days === 3 ? '12-14 Sep' : days === 4 ? '12-15 Sep' : '12-16 Sep'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CUSTOM */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-surface-500">
                  Pilih tanggal (tanggal hari ini dan sebelumnya dinonaktifkan):
                </span>
                <span className="text-[10px] font-bold text-emerald-800">
                  {customDates.size} tanggal dipilih
                </span>
              </div>

              <div className="border border-surface-200 rounded-xl p-3 bg-surface-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-surface-800">September 2026</span>
                  <span className="text-[10px] text-surface-400">Pilih bebas</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-surface-400 mb-1">
                  <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  <span /><span />
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                    const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
                    const isDisabled = day <= 11;
                    const isSelected = customDates.has(dateStr);

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleCustomDate(dateStr)}
                        className={`h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isDisabled
                            ? 'text-surface-300 cursor-not-allowed bg-transparent'
                            : isSelected
                            ? 'bg-emerald-700 text-white shadow-2xs font-extrabold cursor-pointer'
                            : 'bg-white text-surface-700 hover:bg-emerald-50 border border-surface-200/60 cursor-pointer'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Realtime Price Calculation Box */}
          <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10.5px] text-emerald-800 block font-medium">Estimasi Biaya Iklan</span>
              <span className="text-xs text-emerald-950 font-bold">
                {computedSchedule.totalDays} Hari × Rp {DAILY_RATE.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-700 block">Total Estimasi</span>
              <span className="text-base font-black text-emerald-800 tabular-nums">
                Rp {computedSchedule.totalCost.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* ── STEP 2: SATU TOMBOL TUNGGAL (Preview & Pasang Iklan) ── */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)' }}
          >
            <Eye size={17} />
            <span>Preview &amp; Pasang Iklan</span>
            <ArrowRight size={16} />
          </button>
          <p className="text-center text-[10.5px] text-surface-400 mt-2">
            {formData.kategori === 'video'
              ? 'Periksa simulasi tayangan video bumper 15 detik sebelum verifikasi AI.'
              : 'Periksa tampilan kartu carousel dan konfirmasi jadwal sebelum verifikasi AI.'}
          </p>
        </div>
      </form>

      {/* ─────────────────────────────────────────────────────────────
          POIN 5: PREVIEW BOTTOM SHEET (Terikurung di container mobile ~390px)
          ───────────────────────────────────────────────────────────── */}
      {showBottomSheetPreview && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden animate-fade-in">
          {/* Backdrop dismiss terkurung di container mobile */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setShowBottomSheetPreview(false)}
          />

          {/* Bottom Sheet Modal Content */}
          <div
            className="relative bg-white rounded-t-3xl max-h-[90%] w-full overflow-y-auto no-scrollbar shadow-2xl animate-slide-up flex flex-col z-10"
            style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.25)' }}
          >
            {/* Drag handle */}
            <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto my-3 shrink-0" />

            {/* Header */}
            <div className="px-5 pb-3 border-b border-surface-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                  {formData.kategori === 'video' ? 'Preview Iklan Video' : 'Preview Iklan Baris'}
                </h3>
                <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                  {formData.kategori === 'video'
                    ? 'Simulasi tayangan video in-stream 15s saat jeda siaran TV desa'
                    : 'Simulasi tampilan di Carousel Tab Live GV Media'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBottomSheetPreview(false)}
                className="w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 text-gray-600 flex items-center justify-center transition active:scale-95 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto no-scrollbar">
              {formData.kategori === 'video' ? (
                /* Simulation Iklan Video In-Stream */
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-surface-400">
                    Simulasi Tayangan In-Stream Bumper:
                  </span>
                  
                  <div className="bg-surface-950 rounded-2xl overflow-hidden shadow-lg relative aspect-video flex items-center justify-center border border-surface-800">
                    {formData.videoUrl ? (
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-white/70 p-4">
                        <Clapperboard size={36} className="mx-auto mb-2 text-emerald-400" />
                        <p className="text-xs font-bold">{formData.judul || 'Judul Iklan Video'}</p>
                      </div>
                    )}
                    
                    {/* Channel / Program Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1 pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>GV TV AD</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-white/20 pointer-events-none">
                      {formData.videoDuration || 15}s
                    </div>
                  </div>

                  <div className="bg-surface-50 border border-surface-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-surface-900 line-clamp-1 flex-1 min-w-0 pr-2">
                      {formData.judul}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      {formData.jangkauan === 'nasional' ? 'Nasional' : `${formData.lokasi} (20 km)`}
                    </span>
                  </div>
                </div>
              ) : (
                /* Card Carousel Simulation Iklan Baris */
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-surface-400">
                    Tampilan di Carousel:
                  </span>
                  
                  <div className="bg-surface-100/80 p-3 rounded-2xl border border-surface-200/80 flex justify-center">
                    <div className="w-[285px] h-[86px] bg-white border border-gray-200 rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-2.5 relative overflow-hidden">
                      {/* Sisi Kiri */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border leading-none ${activeSubKategori.badge}`}>
                            {activeSubKategori.label}
                          </span>
                          <span className="text-[11px] font-black text-emerald-800 truncate leading-none">
                            {formData.harga ? `Rp ${Number(formData.harga).toLocaleString('id-ID')}` : 'Harga Hubungi'}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-gray-900 line-clamp-1 leading-snug tracking-tight">
                          {formData.judul || 'Judul Iklan Anda'}
                        </h4>

                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-extrabold text-white bg-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <MessageCircle size={10} className="text-white" />
                            <span>Hubungi</span>
                          </div>
                          <span className="text-[9.5px] text-gray-400 font-medium truncate max-w-[110px]">
                            {formData.jangkauan === 'nasional' ? 'Nasional' : formData.lokasi}
                          </span>
                        </div>
                      </div>

                      {/* Sisi Kanan: Foto Thumbnail atau Themed Colored Background */}
                      <div className="w-[66px] h-[66px] rounded-xl overflow-hidden shrink-0 border border-black/5 bg-gray-100 flex items-center justify-center relative shadow-inner">
                        {(formData.photos || []).length > 0 ? (
                          <img
                            src={formData.photos[0]}
                            alt="Thumbnail Iklan"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${activeSubKategori.gradient} flex flex-col items-center justify-center text-white relative`}>
                            <activeSubKategori.icon size={20} className="text-white/85" />
                            <span className="text-[8.5px] font-bold text-white/80 mt-0.5 tracking-wider uppercase">
                              {activeSubKategori.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detail Ringkasan Iklan & Jadwal */}
              <div className="bg-surface-50 border border-surface-200/80 rounded-2xl p-3.5 space-y-2.5 text-xs">
                {formData.kategori === 'baris' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-surface-500 text-[11px]">Deskripsi:</span>
                      <span className="text-surface-900 font-semibold max-w-[200px] text-right truncate">
                        {formData.deskripsi}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-surface-500 text-[11px]">Nomor WhatsApp:</span>
                      <span className="text-emerald-900 font-bold">{formData.whatsapp}</span>
                    </div>
                  </>
                )}
                {formData.kategori === 'video' && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500 text-[11px]">Durasi Video:</span>
                    <span className="text-emerald-900 font-extrabold">{formData.videoDuration || 15} Detik</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-surface-500 text-[11px]">Target Wilayah:</span>
                  <span className="text-surface-900 font-bold">
                    {formData.jangkauan === 'nasional' ? 'Nasional (Seluruh Indonesia)' : `${formData.lokasi} (Radius 20 km)`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-surface-200/60 pt-2">
                  <span className="text-surface-500 text-[11px]">Jadwal Penayangan:</span>
                  <span className="text-surface-900 font-extrabold">
                    {computedSchedule.type === 'sprint'
                      ? `Sprint ${computedSchedule.totalDays} Hari (${computedSchedule.startDate} - ${computedSchedule.endDate})`
                      : `Kustom ${computedSchedule.totalDays} Hari (${computedSchedule.dates?.join(', ')})`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-surface-200/60 pt-2">
                  <span className="text-surface-700 font-bold text-xs">Total Biaya Tayang:</span>
                  <span className="text-sm font-black text-emerald-800">
                    Rp {computedSchedule.totalCost.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Catatan Penyiaran Pukul 00:00 WIB */}
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-950 flex items-start gap-2">
                <Clock size={15} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Iklan mulai tayang pada <strong>{computedSchedule.startDate} pukul 00:00 WIB</strong> setelah disetujui kurator komite dan pembayaran diselesaikan.
                </p>
              </div>

              {/* AI Simulation Fail Toggle (Demo Only) */}
              <div className="flex items-center justify-between bg-surface-100/80 px-3.5 py-2.5 rounded-2xl text-xs text-surface-700 border border-surface-200/70">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className={simulateAiFail ? 'text-rose-600' : 'text-surface-400'} />
                  <div>
                    <p className="font-extrabold text-[11.5px] text-surface-900">Simulasikan AI Tolak Iklan</p>
                    <p className="text-[10px] text-surface-400">Demo uji coba skenario pelanggaran konten</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulateAiFail(!simulateAiFail)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
                    simulateAiFail ? 'bg-rose-600' : 'bg-surface-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      simulateAiFail ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Tombol CTA "Pasang Iklan Sekarang" */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartAiCheck}
                  className="w-full py-3.5 px-4 rounded-2xl text-white font-black text-sm shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)' }}
                >
                  <CheckCircle2 size={17} />
                  <span>Pasang Iklan Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          POIN 1: LOCATION PICKER MAP MODAL (Pilih di Peta)
          ───────────────────────────────────────────────────────────── */}
      {showMapPicker && (
        <LocationPickerMap
          initialLocation={formData.lokasi && formData.lokasi !== 'Nasional' ? formData.lokasi : 'Desa Sukamaju, Kec. Sukamakmur, Bogor'}
          initialCoords={formData.coords || { lat: -6.6042, lng: 107.0395 }}
          onBack={() => setShowMapPicker(false)}
          onConfirm={({ locationLabel, lat, lng }) => {
            setFormData(prev => ({
              ...prev,
              lokasi: locationLabel || 'Desa Sukamaju, Kec. Sukamakmur, Bogor',
              coords: { lat, lng }
            }));
            if (formErrors.lokasi) setFormErrors(prev => ({ ...prev, lokasi: null }));
            setShowMapPicker(false);
          }}
        />
      )}
    </div>
  );
}
