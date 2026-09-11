import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Navigation, Maximize2, Minimize2, LocateFixed, Layers } from 'lucide-react'

// Titik Koordinat Nyata di Desa Sukamaju, Kec. Sukamakmur, Bogor
const STORE_COORDS = [-6.6085, 107.0325] // Toko Bu Sari (Titik Asal)
const HOME_COORDS = [-6.6022, 107.0452]  // Rumah Pembeli (Jl. Melati No. 14)

// Rute jalan desa nyata yang dilalui kurir motor
const ROAD_ROUTE = [
  [-6.6085, 107.0325], // 0: Toko Bu Sari
  [-6.6078, 107.0342],
  [-6.6070, 107.0360],
  [-6.6062, 107.0378],
  [-6.6052, 107.0398],
  [-6.6044, 107.0418],
  [-6.6035, 107.0435],
  [-6.6022, 107.0452], // 7: Rumah Pembeli
]

// Posisi Kurir berdasarkan 6 Fase Simulasi:
// 0: Konfirm, 1: Siap, 2: Jemput, 3: Ambil, 4: Jalan, 5: Tiba
// Diberikan offset titik terukur agar tidak bertumpuk (overlap) dengan pin Toko atau Rumah
const PHASE_DRIVER_POSITIONS = [
  [-6.6078, 107.0338], // 0: Konfirm (Kurir standby bersiap di rute dekat toko)
  [-6.6076, 107.0342], // 1: Siap (Kurir menuju toko saat barang dipacking)
  [-6.6068, 107.0365], // 2: Jemput (GV Man meluncur di rute menuju toko)
  [-6.6080, 107.0332], // 3: Ambil (Kurir parkir di depan toko, terpisah dari pin toko)
  [-6.6048, 107.0408], // 4: Jalan (Di tengah perjalanan ke rumah)
  [-6.6026, 107.0445], // 5: Tiba (Kurir berhenti di depan gerbang rumah penerima)
]

export default function LiveTrackingMap({
  phase = 4,
  courier = null,
  storeName = 'Toko Ibu Sari',
  buyerAddress = 'Jl. Melati No. 14, Desa Sukamaju',
  height = '200px',
  interactive = false,
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const driverMarkerRef = useRef(null)
  const routePolylineRef = useRef(null)
  const activePolylineRef = useRef(null)

  const [isExpanded, setIsExpanded] = useState(false)

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Inisialisasi Map
    const map = L.map(mapContainerRef.current, {
      center: [-6.6053, 107.0388],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: true,
      touchZoom: true,
    })

    // CartoDB Voyager tiles (estetik, bersih, jalan desa terlihat tajam)
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    )
    tileLayer.on('tileerror', () => {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)
    })
    tileLayer.addTo(map)
    mapInstanceRef.current = map

    // ── 1. Polyline Casing Jalan (Lapisan Aspal Abu-abu Gelap) ──
    L.polyline(ROAD_ROUTE, {
      color: '#334155',
      weight: 7,
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.9,
    }).addTo(map)

    // ── 2. Polyline Rute GPS Hijau Emerald (Jalur Penuh) ──
    const fullRouteLine = L.polyline(ROAD_ROUTE, {
      color: '#10B981',
      weight: 4.5,
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.85,
    }).addTo(map)
    routePolylineRef.current = fullRouteLine

    // ── 3. Aksen Garis Putus-putus Tengah Rute ──
    L.polyline(ROAD_ROUTE, {
      color: '#FFFFFF',
      weight: 1.5,
      dashArray: '4, 6',
      lineCap: 'round',
      opacity: 0.9,
    }).addTo(map)

    // ── 4. Custom Icon Toko (Titik Asal) ──
    const storeIcon = L.divIcon({
      className: 'custom-store-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 32px; height: 32px; border-radius: 50%; background: #ffffff;
            border: 2.5px solid #059669; box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            display: flex; align-items: center; justify-center: center; font-size: 15px;
            cursor: pointer;
          ">
            🏪
          </div>
          <div style="
            background: #064E3B; color: #ffffff; font-size: 9px; font-weight: 800;
            padding: 2px 6px; border-radius: 6px; margin-top: 2px; white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          ">
            ${storeName}
          </div>
        </div>
      `,
      iconSize: [80, 48],
      iconAnchor: [40, 16],
    })

    L.marker(STORE_COORDS, { icon: storeIcon, zIndexOffset: 500 })
      .addTo(map)
      .bindTooltip(`<b>${storeName}</b><br><span style="font-size:11px;color:#059669;">Titik Pengambilan Paket</span>`, {
        direction: 'top',
        offset: [0, -18],
      })

    // ── 5. Custom Icon Rumah (Titik Tujuan) ──
    const homeIcon = L.divIcon({
      className: 'custom-home-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 32px; height: 32px; border-radius: 50%; background: #ffffff;
            border: 2.5px solid #DC2626; box-shadow: 0 4px 12px rgba(220,38,38,0.3);
            display: flex; align-items: center; justify-content: center; font-size: 15px;
            cursor: pointer;
          ">
            🏠
          </div>
          <div style="
            background: #991B1B; color: #ffffff; font-size: 9px; font-weight: 800;
            padding: 2px 6px; border-radius: 6px; margin-top: 2px; white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          ">
            Rumah Penerima
          </div>
        </div>
      `,
      iconSize: [80, 48],
      iconAnchor: [40, 16],
    })

    L.marker(HOME_COORDS, { icon: homeIcon, zIndexOffset: 500 })
      .addTo(map)
      .bindTooltip(`<b>Alamat Pembeli</b><br><span style="font-size:11px;color:#DC2626;">${buyerAddress}</span>`, {
        direction: 'top',
        offset: [0, -18],
      })

    // ── 6. Custom Icon Kurir Motor GV Man (Dinamis & Berdenyut) ──
    const driverInitPos = PHASE_DRIVER_POSITIONS[phase] || PHASE_DRIVER_POSITIONS[4]
    const driverName = courier?.name || 'Agus (GV Man)'

    const driverIcon = L.divIcon({
      className: 'custom-driver-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute; inset: -4px; border-radius: 50%; background: rgba(16,185,129,0.35);
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: absolute; inset: 0; border-radius: 50%; background: #1B6B3A;
              border: 2.5px solid #ffffff; box-shadow: 0 6px 16px rgba(27,107,58,0.5);
              display: flex; align-items: center; justify-content: center; font-size: 19px;
            ">
              🛵
            </div>
          </div>
          <div style="
            background: #111827; color: #ffffff; font-size: 9px; font-weight: 800;
            padding: 2px 7px; border-radius: 6px; margin-top: 3px; white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2);
          ">
            ${driverName}
          </div>
        </div>
      `,
      iconSize: [90, 56],
      iconAnchor: [45, 20],
    })

    const driverMarker = L.marker(driverInitPos, {
      icon: driverIcon,
      zIndexOffset: 1000,
    }).addTo(map)

    driverMarkerRef.current = driverMarker

    // Auto fit bounds agar Toko, Rumah, dan Rute pas terlihat di layar
    const bounds = L.latLngBounds([STORE_COORDS, HOME_COORDS]).pad(0.2)
    map.fitBounds(bounds, { animate: false })

    const resizeTimer = setTimeout(() => {
      map.invalidateSize()
      map.fitBounds(bounds, { animate: false })
    }, 250)

    return () => {
      clearTimeout(resizeTimer)
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update Posisi Kurir ketika `phase` berubah secara mulus
  useEffect(() => {
    if (!mapInstanceRef.current || !driverMarkerRef.current) return

    const targetPos = PHASE_DRIVER_POSITIONS[phase] || PHASE_DRIVER_POSITIONS[4]

    // Pindahkan marker kurir
    driverMarkerRef.current.setLatLng(targetPos)

    // Pan kamera sedikit mengikuti posisi kurir jika mendekati tiba
    if (phase === 5) {
      mapInstanceRef.current.panTo(HOME_COORDS, { animate: true, duration: 0.8 })
    } else if (phase === 0 || phase === 1) {
      mapInstanceRef.current.panTo(STORE_COORDS, { animate: true, duration: 0.8 })
    } else {
      // Fit bounds rute secara keseluruhan
      const bounds = L.latLngBounds([STORE_COORDS, HOME_COORDS]).pad(0.25)
      mapInstanceRef.current.fitBounds(bounds, { animate: true, duration: 0.8 })
    }
  }, [phase])

  // Recenter Route
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return
    const bounds = L.latLngBounds([STORE_COORDS, HOME_COORDS]).pad(0.25)
    mapInstanceRef.current.fitBounds(bounds, { animate: true, duration: 0.6 })
  }

  // Toggle Expand Size
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev)
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
        const bounds = L.latLngBounds([STORE_COORDS, HOME_COORDS]).pad(0.25)
        mapInstanceRef.current.fitBounds(bounds, { animate: true })
      }
    }, 200)
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-emerald-200/80 shadow-inner bg-[#EBF5ED] transition-all duration-300 ${
        isExpanded ? 'h-72' : ''
      }`}
      style={{ height: isExpanded ? '300px' : height }}
    >
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full select-none" />

      {/* ── Floating Badge Live Tracking di Pojok Kiri Atas ── */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-emerald-200/60">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
        </span>
        <span className="text-[10px] font-extrabold tracking-wider text-emerald-900 uppercase">
          {phase === 5 ? 'Tiba di Tujuan' : 'Live GPS Rute'}
        </span>
      </div>

      {/* ── Floating Action Buttons di Pojok Kanan Atas ── */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleRecenter}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition hover:bg-gray-50"
          title="Pusatkan Rute / Posisi"
        >
          <LocateFixed size={15} className="text-emerald-800" strokeWidth={2.2} />
        </button>

        <button
          type="button"
          onClick={handleToggleExpand}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition hover:bg-gray-50"
          title={isExpanded ? 'Perkecil Peta' : 'Perbesar Peta'}
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  )
}
