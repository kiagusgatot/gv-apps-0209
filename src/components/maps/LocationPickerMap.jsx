import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { ArrowLeft, Search, MapPin, LocateFixed, Plus, Minus, Check, Loader2, Compass } from 'lucide-react'

// Koordinat default: Desa Sukamaju, Kec. Sukamakmur, Bogor
const DEFAULT_CENTER = {
  lat: -6.6042,
  lng: 107.0395,
  label: 'Desa Sukamaju, Kec. Sukamakmur, Bogor',
}

// Preset landmark desa untuk akses cepat
const PRESET_LOCATIONS = [
  { name: 'Balai Desa Sukamaju', lat: -6.6025, lng: 107.0450 },
  { name: 'Pasar Tradisional Desa', lat: -6.6080, lng: 107.0320 },
  { name: 'Jl. Melati No. 14', lat: -6.6042, lng: 107.0395 },
  { name: 'Kawasan Pertanian Subur', lat: -6.6110, lng: 107.0480 },
]

export default function LocationPickerMap({
  initialLocation = '',
  initialCoords = null,
  onBack,
  onConfirm,
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const isDraggingRef = useRef(false)
  const abortControllerRef = useRef(null)

  const [isMapMoving, setIsMapMoving] = useState(false)
  const [currentCoords, setCurrentCoords] = useState(
    initialCoords || { lat: DEFAULT_CENTER.lat, lng: DEFAULT_CENTER.lng }
  )
  const [locationLabel, setLocationLabel] = useState(
    initialLocation && typeof initialLocation === 'string' && initialLocation.trim()
      ? initialLocation.trim()
      : DEFAULT_CENTER.label
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isLocating, setIsLocating] = useState(false)
  const [showPresets, setShowPresets] = useState(false)

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return

    const startLat = initialCoords?.lat || DEFAULT_CENTER.lat
    const startLng = initialCoords?.lng || DEFAULT_CENTER.lng

    // Inisialisasi map dengan Leaflet
    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 16,
      zoomControl: false, // gunakan custom zoom control yang mobile-friendly
      attributionControl: false,
    })

    // CartoDB Voyager tiles (estetik, bersih, modern, dan gratis tanpa API key)
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    )

    // Fallback jika CartoDB offline
    tileLayer.on('tileerror', () => {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)
    })

    tileLayer.addTo(map)
    mapInstanceRef.current = map

    // Event listener perpindahan kamera map
    map.on('movestart', () => {
      isDraggingRef.current = true
      setIsMapMoving(true)
    })

    map.on('moveend', () => {
      isDraggingRef.current = false
      setIsMapMoving(false)

      const center = map.getCenter()
      const newCoords = { lat: center.lat, lng: center.lng }
      setCurrentCoords(newCoords)
      fetchReverseGeocode(newCoords.lat, newCoords.lng)
    })

    // Perbaiki ukuran container jika dibuka dalam modal beranimasi
    const resizeTimer = setTimeout(() => {
      map.invalidateSize()
    }, 250)

    return () => {
      clearTimeout(resizeTimer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Reverse Geocoding via Nominatim OpenStreetMap (dengan fallback cerdas)
  const fetchReverseGeocode = async (lat, lng) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          signal: abortControllerRef.current.signal,
          headers: { 'Accept-Language': 'id' },
        }
      )
      if (res.ok) {
        const data = await res.json()
        if (data && data.display_name) {
          // Format nama alamat yang ringkas dan padat untuk mobile
          const addr = data.address || {}
          const road = addr.road || addr.village || addr.suburb || ''
          const village = addr.village || addr.city_district || 'Desa Sukamaju'
          const district = addr.county || addr.city || 'Bogor'

          let formatted = road ? `${road}, ${village}` : village
          if (district && !formatted.includes(district)) {
            formatted += `, ${district}`
          }

          setLocationLabel(formatted || data.display_name.split(',').slice(0, 3).join(','))
          return
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return
    }

    // Fallback jika offline atau Nominatim rate-limited
    // Cek jarak dengan preset terdekat
    const closest = PRESET_LOCATIONS.find((p) => {
      const d = Math.hypot(p.lat - lat, p.lng - lng)
      return d < 0.003
    })
    if (closest) {
      setLocationLabel(closest.name)
    } else {
      setLocationLabel(`Koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Sukamaju, Bogor)`)
    }
  }

  // Geocoding Search saat user mencari teks
  const handleSearchSubmit = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowPresets(false)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Sukamakmur Bogor'
        )}&limit=5&countrycodes=id`,
        { headers: { 'Accept-Language': 'id' } }
      )
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          setSearchResults(data)
          const first = data[0]
          selectSearchResult(parseFloat(first.lat), parseFloat(first.lon), first.display_name)
        } else {
          // Cek di preset lokal jika pencarian online nihil
          const matchPreset = PRESET_LOCATIONS.find((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          if (matchPreset) {
            selectSearchResult(matchPreset.lat, matchPreset.lng, matchPreset.name)
          }
        }
      }
    } catch {
      // Offline fallback
      const matchPreset = PRESET_LOCATIONS.find((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchPreset) {
        selectSearchResult(matchPreset.lat, matchPreset.lng, matchPreset.name)
      }
    } finally {
      setIsSearching(false)
    }
  }

  const selectSearchResult = (lat, lng, name) => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 })
    setCurrentCoords({ lat, lng })
    setLocationLabel(name)
    setSearchResults([])
  }

  // GPS Current Location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 })
        }
      },
      (err) => {
        setIsLocating(false)
        console.warn('Geolocation failed:', err.message)
        // Default ke pusat desa jika izin ditolak
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 16, { duration: 1 })
        }
      },
      { timeout: 6000, enableHighAccuracy: true }
    )
  }

  // Custom Zoom Control
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn()
  }
  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut()
  }

  // Konfirmasi Pilihan
  const handleConfirmLocation = () => {
    if (typeof onConfirm === 'function') {
      onConfirm({
        locationLabel: locationLabel || DEFAULT_CENTER.label,
        lat: currentCoords.lat,
        lng: currentCoords.lng,
      })
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gray-100 animate-slide-up overflow-hidden">
      {/* ── Top Bar Pencarian & Tombol Kembali ── */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center flex-shrink-0 active:scale-95 transition text-gray-800 border border-gray-100"
          >
            <ArrowLeft size={18} />
          </button>

          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl px-3.5 py-2 flex items-center gap-2 border border-gray-100"
          >
            {isSearching ? (
              <Loader2 size={16} className="text-emerald-700 animate-spin flex-shrink-0" />
            ) : (
              <Search size={16} className="text-gray-400 flex-shrink-0" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jalan, balai warga, patokan..."
              className="flex-1 text-[13px] bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-bold text-gray-400 hover:text-gray-600 px-1"
              >
                Clear
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => setShowPresets((v) => !v)}
            className={`w-11 h-11 rounded-2xl backdrop-blur-md shadow-lg flex items-center justify-center flex-shrink-0 active:scale-95 transition border ${
              showPresets
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-white/95 text-gray-800 border-gray-100'
            }`}
            title="Pilih Lokasi Cepat"
          >
            <Compass size={18} />
          </button>
        </div>

        {/* Quick Presets Dropdown */}
        {showPresets && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-2.5 border border-emerald-100 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
              Titik Populer Desa Sukamaju
            </p>
            {PRESET_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  selectSearchResult(preset.lat, preset.lng, preset.name)
                  setShowPresets(false)
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-emerald-50/80 active:scale-[0.98] transition text-[12.5px] font-semibold text-gray-800"
              >
                <MapPin size={14} className="text-emerald-700 flex-shrink-0" />
                <span className="truncate">{preset.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Leaflet Map Container ── */}
      <div className="flex-1 relative w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full select-none" />

        {/* Center Pin Overlay (Target Akurasi & Floating Pinpoint dengan Efek Angkat) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Titik Tembak / Ground Target Ring di Titik Tengah Presisi Peta (50%, 50%) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            {/* Target pulse ring */}
            <div className="w-5 h-5 rounded-full border-2 border-emerald-600/40 bg-emerald-500/15 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
            </div>
            {/* Bayangan Pin di Atas Tanah */}
            <div
              className="absolute w-4 h-1 rounded-full bg-black/30 blur-[2px] transition-all duration-200"
              style={{
                transform: isMapMoving ? 'scale(0.45)' : 'scale(1)',
                opacity: isMapMoving ? 0.25 : 0.6,
              }}
            />
          </div>

          {/* Floating Teardrop Pin (Ujung jarum pin bertumpu persis di titik 50%, 50%) */}
          <div
            className="absolute left-1/2 bottom-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform duration-200 ease-out origin-bottom"
            style={{
              transform: isMapMoving
                ? 'translate(-50%, -14px) scale(1.06)'
                : 'translate(-50%, 0) scale(1)',
            }}
          >
            {/* Status Tooltip di Atas Pin */}
            <div
              className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-lg mb-1.5 transition-all whitespace-nowrap ${
                isMapMoving
                  ? 'bg-emerald-800 text-white shadow-emerald-900/30 ring-2 ring-white/60'
                  : 'bg-gray-900/90 text-white backdrop-blur-xs'
              }`}
            >
              {isMapMoving ? 'Lepas untuk Menentukan Titik' : 'Geser peta untuk sesuaikan'}
            </div>

            {/* Teardrop Pin Marker dengan Ujung Presisi */}
            <div className="relative flex items-center justify-center">
              <svg
                width="38"
                height="46"
                viewBox="0 0 38 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <defs>
                  <linearGradient id="pinGradPicker" x1="0" y1="0" x2="38" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1B6B3A" />
                    <stop offset="1" stopColor="#0C3E1E" />
                  </linearGradient>
                </defs>
                <path
                  d="M19 0C8.506 0 0 8.506 0 19C0 31.5 19 46 19 46C19 46 38 31.5 38 19C38 8.506 29.494 0 19 0Z"
                  fill="url(#pinGradPicker)"
                />
                <circle cx="19" cy="18" r="8" fill="white" />
                <circle cx="19" cy="18" r="4.5" fill="#0C3E1E" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Floating Controls Kanan (Zoom & GPS) ── */}
        <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-2">
          {/* Tombol Pusatkan / Akurasi Titik Lokasi Saat Ini (GPS) */}
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-gray-700 active:scale-95 transition border border-gray-100 hover:bg-gray-50"
            title="Pusatkan / Akurasi titik lokasi saat ini"
          >
            {isLocating ? (
              <Loader2 size={18} className="text-emerald-700 animate-spin" />
            ) : (
              <LocateFixed size={18} className="text-emerald-800" strokeWidth={2.2} />
            )}
          </button>

          {/* Tombol Zoom */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-10 h-10 flex items-center justify-center text-gray-700 active:bg-gray-100 transition border-b border-gray-100"
              title="Perbesar Peta"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-10 h-10 flex items-center justify-center text-gray-700 active:bg-gray-100 transition"
              title="Perkecil Peta"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Sheet Konfirmasi Lokasi ── */}
      <div className="relative z-20 p-4 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 flex flex-col gap-3.5">
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto -mt-1" />

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
                {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
              </span>
            </div>
            <p className="text-[13.5px] font-extrabold text-gray-900 mt-1 leading-snug line-clamp-2">
              {locationLabel}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Titik ini akan digunakan kurir untuk memverifikasi penjemputan/pengantaran
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirmLocation}
          className="w-full py-3.5 rounded-2xl text-white font-black text-[13.5px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)',
            boxShadow: '0 6px 20px rgba(27,107,58,0.25)',
          }}
        >
          <Check size={17} strokeWidth={2.5} />
          <span>Pilih Lokasi Ini</span>
        </button>
      </div>
    </div>
  )
}
