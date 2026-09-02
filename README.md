# G-Village Prototype v0.1

Prototype interaktif mobile application G-Village dibangun dengan React + Tailwind CSS.

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka di browser
# http://localhost:5173
```

## Layar yang Tersedia

### Onboarding Flow
| Layar | Deskripsi |
|-------|-----------|
| Welcome | Halaman selamat datang dengan ilustrasi desa |
| Register | Form daftar akun (nama + nomor HP) |
| OTP | Verifikasi 6-digit OTP |
| Pilih Desa | Pencarian dan pemilihan desa |
| Preferensi | Pilihan kebutuhan pengguna |
| Selesai | Konfirmasi onboarding berhasil |

### Aplikasi Utama
| Layar | Deskripsi |
|-------|-----------|
| Beranda | Home screen dengan balance, shortcut, banner, konten desa |
| Siaran | Listing konten GV TV, VOD, Radio, Podcast |
| Pasar | Product listing ala Segari — ESTO marketplace |
| Bayar | GV Pay, tagihan, riwayat transaksi |
| Profil Saya | Data user, poin, menu capability |

## Design System

- **Primary Color**: `#1B6B3A`
- **Design System**: Material Design 3 (MD3)
- **Icons**: Lucide React
- **Font**: Inter
- **Framework**: React 18 + Tailwind CSS 3

## Navigasi Prototype

Gunakan **sidebar kiri** di browser untuk berpindah antar layar secara bebas,
atau ikuti alur lengkap dari Welcome → Beranda untuk melihat onboarding flow.

## Build

```bash
npm run build
```
