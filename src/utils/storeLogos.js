/**
 * Official Store Logos for ESTO Partners
 * High-resolution, vector-crisp SVG data URIs tailored for 1:1 square containers.
 */

// Helper to encode SVG into Data URI
const svgToDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`

export const STORE_LOGOS = {
  // ESTO Graha Mandala - Magelang (Official Agricultural & Grocery Co-op)
  'store-1': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="egmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E4D26"/>
          <stop offset="100%" stop-color="#1B6B3A"/>
        </linearGradient>
        <filter id="egmShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
      <rect width="120" height="120" rx="20" fill="url(#egmGrad)"/>
      <rect x="4" y="4" width="112" height="112" rx="16" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25"/>
      <g filter="url(#egmShadow)">
        <!-- Market Basket & Wheat Motif -->
        <path d="M42 44 L78 44 C82 44 85 47 84 51 L79 78 C78 82 74 85 70 85 L50 85 C46 85 42 82 41 78 L36 51 C35 47 38 44 42 44 Z" fill="#ffffff" fill-opacity="0.95"/>
        <path d="M50 44 C50 34 70 34 70 44" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M60 52 L60 77" stroke="#1B6B3A" stroke-width="3" stroke-linecap="round"/>
        <path d="M49 54 L53 75" stroke="#1B6B3A" stroke-width="3" stroke-linecap="round"/>
        <path d="M71 54 L67 75" stroke="#1B6B3A" stroke-width="3" stroke-linecap="round"/>
      </g>
      <!-- Brand typography banner -->
      <rect x="18" y="90" width="84" height="20" rx="6" fill="#FBFBFA" filter="url(#egmShadow)"/>
      <text x="60" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#0E4D26" text-anchor="middle" letter-spacing="1">EGM · ESTO</text>
    </svg>
  `),

  // Grosir GV Sleman - Yogyakarta (Official Wholesale & Logistics Hub)
  'store-2': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="gvsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0D47A1"/>
          <stop offset="100%" stop-color="#1976D2"/>
        </linearGradient>
        <filter id="gvsShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
      <rect width="120" height="120" rx="20" fill="url(#gvsGrad)"/>
      <rect x="4" y="4" width="112" height="112" rx="16" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25"/>
      <g filter="url(#gvsShadow)">
        <!-- Warehouse / Logistics Box & Shield -->
        <path d="M60 28 L88 42 L88 72 L60 86 L32 72 L32 42 Z" fill="#ffffff" fill-opacity="0.95"/>
        <path d="M60 28 L60 86" stroke="#0D47A1" stroke-width="3" stroke-linecap="round"/>
        <path d="M32 42 L60 56 L88 42" stroke="#0D47A1" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="56" r="5" fill="#FFC107"/>
      </g>
      <!-- Brand banner -->
      <rect x="18" y="90" width="84" height="20" rx="6" fill="#FBFBFA" filter="url(#gvsShadow)"/>
      <text x="60" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#0D47A1" text-anchor="middle" letter-spacing="1">GVS · GROSIR</text>
    </svg>
  `),

  // Toko GV Bantul - Bantul (Neighborhood Grocery & Kiosk)
  'store-3': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="tgbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E65100"/>
          <stop offset="100%" stop-color="#FB8C00"/>
        </linearGradient>
        <filter id="tgbShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
      <rect width="120" height="120" rx="20" fill="url(#tgbGrad)"/>
      <rect x="4" y="4" width="112" height="112" rx="16" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25"/>
      <g filter="url(#tgbShadow)">
        <!-- Kiosk Awning & Bag -->
        <path d="M34 44 L86 44 L80 62 L40 62 Z" fill="#ffffff" fill-opacity="0.95"/>
        <path d="M38 62 L82 62 L78 84 L42 84 Z" fill="#ffffff" fill-opacity="0.85"/>
        <path d="M50 44 L50 62" stroke="#E65100" stroke-width="3"/>
        <path d="M60 44 L60 62" stroke="#E65100" stroke-width="3"/>
        <path d="M70 44 L70 62" stroke="#E65100" stroke-width="3"/>
        <circle cx="60" cy="73" r="4" fill="#E65100"/>
      </g>
      <!-- Brand banner -->
      <rect x="18" y="90" width="84" height="20" rx="6" fill="#FBFBFA" filter="url(#tgbShadow)"/>
      <text x="60" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#E65100" text-anchor="middle" letter-spacing="1">TGB · BANTUL</text>
    </svg>
  `),

  // Toko GV Jogja Malioboro (Heritage & Local Delights)
  'store-4': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="tjmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A148C"/>
          <stop offset="100%" stop-color="#7B1FA2"/>
        </linearGradient>
        <filter id="tjmShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
        </filter>
      </defs>
      <rect width="120" height="120" rx="20" fill="url(#tjmGrad)"/>
      <rect x="4" y="4" width="112" height="112" rx="16" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.25"/>
      <g filter="url(#tjmShadow)">
        <!-- Joglo / Heritage Motif -->
        <path d="M60 30 L84 48 L80 82 L40 82 L36 48 Z" fill="#ffffff" fill-opacity="0.95"/>
        <path d="M46 82 L46 60 L74 60 L74 82" fill="#4A148C"/>
        <path d="M60 38 L72 50 L48 50 Z" fill="#FFB300"/>
      </g>
      <!-- Brand banner -->
      <rect x="18" y="90" width="84" height="20" rx="6" fill="#FBFBFA" filter="url(#tjmShadow)"/>
      <text x="60" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#4A148C" text-anchor="middle" letter-spacing="1">JOGJA · ESTO</text>
    </svg>
  `),
}
