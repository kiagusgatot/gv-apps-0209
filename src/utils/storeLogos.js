/**
 * Official Store Logos for ESTO Partners
 * High-resolution, vector-crisp SVG data URIs tailored for 1:1 square containers.
 * Perfectly aligned with the reference design.
 */

const svgToDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`

export const STORE_LOGOS = {
  // 1. ESTO Graha Mandala (EGM - Emerald Green with bold white letters)
  'store-1': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="egmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#093E1B"/>
          <stop offset="100%" stop-color="#145A2C"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#egmGrad)"/>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.15"/>
      <text x="60" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">EGM</text>
    </svg>
  `),

  // 2. Grosir GV Sleman (GVS - Royal Blue with bold white letters)
  'store-2': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="gvsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0B429A"/>
          <stop offset="100%" stop-color="#1565C0"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#gvsGrad)"/>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.15"/>
      <text x="60" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">GVS</text>
    </svg>
  `),

  // 3. Toko GV Jogja Malioboro (Heritage Purple with Joglo roof icon & JOGJA - ESTO pill)
  'store-3': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="jogjaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A148C"/>
          <stop offset="100%" stop-color="#6A1B9A"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#jogjaGrad)"/>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.15"/>
      <!-- Joglo / Traditional House Outline -->
      <g transform="translate(36, 24)">
        <path d="M24 6 L44 26 L40 44 L8 44 L4 26 Z" fill="#FFFFFF"/>
        <rect x="18" y="26" width="12" height="18" rx="2" fill="#FFC107"/>
      </g>
      <!-- Bottom Capsule with text -->
      <rect x="18" y="80" width="84" height="20" rx="10" fill="#FFFFFF"/>
      <text x="60" y="94" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="9" fill="#4A148C" text-anchor="middle" letter-spacing="0.5">JOGJA - ESTO</text>
    </svg>
  `),

  // 4. Kios Desa Makmur (Mint Green with Leaf Emblem & Desa Makmur Text)
  'store-4': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="desaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E8F5E9"/>
          <stop offset="100%" stop-color="#F1F8E9"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#desaGrad)"/>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none" stroke="#C8E6C9" stroke-width="1.5"/>
      <!-- Leaf Icon -->
      <g transform="translate(48, 22)">
        <path d="M12 2 C18 6 24 16 20 26 C14 26 4 20 4 14 C4 8 8 4 12 2 Z" fill="#1B5E20"/>
        <path d="M12 10 C16 13 18 19 16 25" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <!-- Typography -->
      <text x="60" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#144D24" text-anchor="middle">Desa</text>
      <text x="60" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#144D24" text-anchor="middle">Makmur</text>
    </svg>
  `),

  // 5. Toko GV Malang Klojen (TGM - Berry Red/Magenta)
  'store-5': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="tgmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9C174D"/>
          <stop offset="100%" stop-color="#C2185B"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#tgmGrad)"/>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.15"/>
      <text x="60" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">TGM</text>
    </svg>
  `),

  // 6. ESTO Tumata Drink (ETD - Deep Teal & Cyan)
  'store-6': svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="etdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00695C"/>
          <stop offset="100%" stop-color="#00897B"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#etdGrad)"/>
      <rect x="2" y="2" width="116" height="116" rx="24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.15"/>
      <text x="60" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">ETD</text>
    </svg>
  `),
}
