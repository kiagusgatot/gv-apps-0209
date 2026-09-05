import React, { useState, useEffect, useRef } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import SearchBar from '@/components/molecules/SearchBar'
import SectionHeader from '@/components/molecules/SectionHeader'
import ProductCard from '@/components/molecules/ProductCard'
import OrderCard from '@/components/molecules/OrderCard'
import CategoryPills from '@/components/molecules/CategoryPills'
import StoreCard from '@/components/molecules/StoreCard'
import WishlistSheet from '@/components/molecules/WishlistSheet'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '@/utils/productImages'
import { Search, SlidersHorizontal, ShoppingCart, Heart, Star, ChevronRight,
  Store, ArrowLeft, Minus, Plus, MapPin, CreditCard, Check, Package, Pencil,
  Sparkles, X, Tag, Truck, Clock, ChevronDown, Phone, MessageCircle, Navigation,
  CircleDot, Leaf, Coffee, Droplet, Palette, Wheat, Egg, Landmark, Wallet, Box, Scale, ScanLine,
  AlertTriangle, Trash2, Copy, CheckCircle2, Info, ShieldCheck, CloudRain, RotateCcw,
  PhoneCall, PhoneOff, Volume2, RefreshCw, CheckSquare, Square, ChevronUp, Zap, Ticket, Share2
} from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import { addBuyerOrder, updateBuyerOrder, cancelBuyerOrder, rateBuyerOrder, useBuyerOrders } from '@/utils/orderStore'

const PRIMARY = '#1B6B3A'

// ── Data ──────────────────────────────────────────────────
const CATS = ['Semua','Sayur','Buah','Pangan','Camilan','Minuman','Kerajinan','Lainnya']

const PRODUCTS = [
  { id:1,  name:'Tempe Mendoan Jumbo',   cat:'Pangan',    seller:'Pak Budi',    price:12000, orig:null,   unit:'5 pcs',    stock:24, rating:4.9, sold:'120+', Icon: CircleDot, g: ['#E65100', '#F57C00'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop', desc:'Tempe mendoan ukuran jumbo, dibuat segar setiap hari dari kedelai lokal pilihan. Cocok untuk lauk atau camilan.' },
  { id:2,  name:'Bayam Organik Segar',   cat:'Sayur',     seller:'Ibu Sari',    price:8500,  orig:null,   unit:'250 gr',   stock:40, rating:4.8, sold:'200+', Icon: Leaf, g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop', desc:'Bayam organik ditanam tanpa pestisida. Dipanen pagi hari, sampai ke tangan kamu masih segar.' },
  { id:3,  name:'Kopi Robusta Segar',    cat:'Minuman',   seller:'Pak Asep',    price:35000, orig:42000,  unit:'250 gr',   stock:15, rating:4.7, sold:'85+',  Icon: Coffee, g: ['#4E342E', '#6D4C41'], image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop', desc:'Kopi robusta dari perkebunan gunung Bogor, disangrai manual. Aroma kuat dengan rasa pahit yang seimbang.' },
  { id:4,  name:'Madu Hutan Murni',      cat:'Lainnya',   seller:'Pak Joko',    price:65000, orig:null,   unit:'250 ml',   stock:8,  rating:4.9, sold:'50+',  Icon: Droplet, g: ['#F57F17', '#FFCA28'], image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=600&auto=format&fit=crop', desc:'Madu hutan asli dari lebah liar Kalimantan. Tanpa campuran, sudah diuji di laboratorium pertanian.' },
  { id:5,  name:'Batik Tulis Lokal',     cat:'Kerajinan', seller:'Bu Erna',     price:85000, orig:null,   unit:'1 lembar', stock:6,  rating:4.6, sold:'30+',  Icon: Palette, g: ['#4A148C', '#AB47BC'], image: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?q=80&w=600&auto=format&fit=crop', desc:'Batik tulis tangan motif parang khas Jawa Barat. Dikerjakan oleh pengrajin lokal berpengalaman 20 tahun.' },
  { id:6,  name:'Pisang Kepok Matang',   cat:'Buah',      seller:'Pak Anto',    price:18000, orig:null,   unit:'1 sisir',  stock:20, rating:4.5, sold:'160+', Icon: Leaf, g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600&auto=format&fit=crop', desc:'Pisang kepok matang pohon dari kebun sendiri. Manis dan cocok untuk digoreng atau dikonsumsi langsung.' },
  { id:7,  name:'Keripik Singkong Pedas',cat:'Camilan',   seller:'Bu Dewi',     price:15000, orig:18000,  unit:'200 gr',   stock:30, rating:4.7, sold:'140+', Icon: CircleDot, g: ['#E65100', '#F57C00'], image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600&auto=format&fit=crop', desc:'Keripik singkong renyah dengan bumbu pedas level 3. Produksi UMKM desa, tanpa pengawet.' },
  { id:8,  name:'Beras Pandan Wangi',    cat:'Pangan',    seller:'Ibu Sari',    price:65000, orig:null,   unit:'5 kg',     stock:12, rating:4.9, sold:'75+',  Icon: Wheat, g: ['#827717', '#9E9D24'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop', desc:'Beras pandan wangi premium dari sawah organik desa Sukamakmur. Aroma harum dan pulen saat dimasak.' },
  { id:9,  name:'Telur Ayam Kampung',    cat:'Pangan',    seller:'Pak Rohmat',  price:32000, orig:null,   unit:'12 butir', stock:35, rating:4.8, sold:'220+', Icon: Egg, g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop', desc:'Telur ayam kampung asli, ayam dibesarkan bebas di halaman. Kuning telur lebih kuning dan bergizi tinggi.' },
  { id:10, name:'Jeruk Siam Manis',      cat:'Buah',      seller:'Pak Anto',    price:22000, orig:null,   unit:'1 kg',     stock:0,  rating:4.6, sold:'90+',  Icon: CircleDot, g: ['#EF6C00', '#FF9800'], image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=600&auto=format&fit=crop', desc:'Jeruk siam manis dari kebun sendiri di Bogor. Segar, tanpa pestisida, langsung dari pohon.' },
]

const SELLER_PRODUCTS_INIT = [
  { id:101, name:'Beras Pandan Wangi Premium 5kg', price:65000, unit:'5 kg',    stock:48, active:true,  Icon: Wheat, g: ['#827717', '#9E9D24'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop', cat:'Pangan',   desc:'Beras pandan wangi premium organik' },
  { id:102, name:'Sayur Bayam Organik Segar 250g', price:5000,  unit:'250 gr',  stock:120,active:true,  Icon: Leaf, g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop', cat:'Sayur',    desc:'Bayam organik segar tanpa pestisida' },
  { id:103, name:'Telur Ayam Kampung (12 butir)',  price:32000, unit:'12 butir',stock:30, active:true,  Icon: Egg, g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop', cat:'Pangan',   desc:'Telur ayam kampung asli dari peternakan' },
  { id:104, name:'Pupuk Organik Kompos 25kg',      price:45000, unit:'25 kg',   stock:2,  active:true,  Icon: Leaf, g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop', cat:'Lainnya',  desc:'Pupuk organik kompos untuk pertanian' },
  { id:105, name:'Bibit Cabai Rawit Lokal',        price:15000, unit:'50 biji', stock:0,  active:false, Icon: Leaf, g: ['#C62828', '#EF5350'], image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=600&auto=format&fit=crop', cat:'Lainnya',  desc:'Bibit cabai rawit lokal unggul tahan hama' },
]

// ── Data Toko Pilihan Resmi ESTO (Sumber: https://globalvillage.id/lokasi) ──
export const ESTO_STORES = [
  {
    id: 'store-1',
    name: 'ESTO Graha Mandala',
    type: 'Grosir Resmi',
    category: 'Grosir Sembako & Bahan Pokok',
    address: 'Kawasan Graha Mandala, Magelang',
    region: 'Jawa Tengah',
    rating: 4.9,
    soldCount: '1.2rb+ terjual',
    followers: 142,
    eta: '30 mnt',
    distance: '2.1 km',
    promoText: 'Beli Rp0, diskon Gratis Ongkir s/d Rp15RB',
    logoText: 'EGM',
    logoBg: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop',
    desc: 'Pusat grosir sembako resmi ESTO Magelang. Melayani pasokan beras, minyak goreng sawit, gula, dan kebutuhan pangan desa dengan harga grosir langsung petani.',
    products: [
      { id: 201, name: 'Minyak Goreng Sawit 2L', cat: 'Sembako', seller: 'ESTO Graha Mandala', price: 32000, orig: 36000, discount: '-11%', unit: '2 Liter', stock: 50, rating: 4.9, sold: '420+', location: 'Magelang', eta: '30 mnt', desc: 'Minyak goreng kelapa sawit higienis bermutu tinggi untuk memasak sehari-hari.' },
      { id: 202, name: 'Beras Pandan Wangi Premium 5kg', cat: 'Sembako', seller: 'ESTO Graha Mandala', price: 65000, orig: 72000, discount: '-10%', unit: '5 kg', stock: 35, rating: 4.9, sold: '680+', location: 'Magelang', eta: '30 mnt', desc: 'Beras pandan wangi pulen, bersih, dan harum dari sawah pilihan mitra binaan.' },
      { id: 203, name: 'Gula Pasir Kristal 1kg', cat: 'Sembako', seller: 'ESTO Graha Mandala', price: 16500, orig: 18000, discount: '-8%', unit: '1 kg', stock: 60, rating: 4.8, sold: '310+', location: 'Magelang', eta: '30 mnt', desc: 'Gula pasir kristal putih murni manis alami untuk sajian minuman dan kue keluarga.' },
      { id: 204, name: 'Tepung Terigu Serbaguna 1kg', cat: 'Sembako', seller: 'ESTO Graha Mandala', price: 12000, orig: 13500, discount: '-11%', unit: '1 kg', stock: 40, rating: 4.8, sold: '240+', location: 'Magelang', eta: '30 mnt', desc: 'Tepung terigu serbaguna protein sedang untuk aneka olahan kue dan gorengan.' },
      { id: 205, name: 'Mie Instan Kuah & Goreng (isi 5)', cat: 'Pangan', seller: 'ESTO Graha Mandala', price: 14500, orig: 16000, discount: '-9%', unit: '5 bungkus', stock: 80, rating: 4.9, sold: '520+', location: 'Magelang', eta: '30 mnt', desc: 'Paket 5 bungkus mie instan rasa favorit keluarga desa, praktis dan lezat.' },
      { id: 206, name: 'Telur Ayam Kampung (12 butir)', cat: 'Pangan', seller: 'ESTO Graha Mandala', price: 32000, orig: null, unit: '12 butir', stock: 25, rating: 4.9, sold: '190+', location: 'Magelang', eta: '30 mnt', desc: 'Telur ayam kampung segar organik dengan kuning telur pekat penuh nutrisi.' },
    ],
  },
  {
    id: 'store-2',
    name: 'Grosir GV Sleman',
    type: 'Grosir Resmi',
    category: 'Grosir Bahan Pokok Desa',
    address: 'Sleman, D.I. Yogyakarta',
    region: 'D.I. Yogyakarta',
    rating: 4.8,
    soldCount: '950+ terjual',
    followers: 98,
    eta: '25 mnt',
    distance: '1.8 km',
    promoText: 'Gratis Ongkir Min. Belanja Rp0',
    logoText: 'GVS',
    logoBg: 'linear-gradient(135deg, #0D47A1, #1976D2)',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    desc: 'Pusat grosir dan distributor kebutuhan pokok warga di Sleman & Yogyakarta. Produk selalu baru setiap minggu.',
    products: [
      { id: 207, name: 'Minyak Goreng Sawit 2L', cat: 'Sembako', seller: 'Grosir GV Sleman', price: 31500, orig: 35000, discount: '-10%', unit: '2 Liter', stock: 45, rating: 4.8, sold: '380+', location: 'Sleman', eta: '25 mnt', desc: 'Minyak goreng sawit jernih tidak mudah hitam untuk memasak.' },
      { id: 208, name: 'Susu UHT Full Cream 1L', cat: 'Minuman', seller: 'Grosir GV Sleman', price: 19500, orig: 22000, discount: '-11%', unit: '1 Liter', stock: 30, rating: 4.9, sold: '290+', location: 'Sleman', eta: '25 mnt', desc: 'Susu sapi segar full cream berkualitas tinggi kalsium untuk keluarga.' },
      { id: 209, name: 'Deterjen Bubuk Konsentrat 800g', cat: 'Kebutuhan Rumah', seller: 'Grosir GV Sleman', price: 18000, orig: 20000, discount: '-10%', unit: '800 gram', stock: 35, rating: 4.8, sold: '210+', location: 'Sleman', eta: '25 mnt', desc: 'Deterjen konsentrat ampuh membersihkan noda membandel dan harum tahan lama.' },
      { id: 210, name: 'Sabun Cuci Piring Jeruk Nipis', cat: 'Kebutuhan Rumah', seller: 'Grosir GV Sleman', price: 10500, orig: null, unit: '750 ml', stock: 40, rating: 4.7, sold: '340+', location: 'Sleman', eta: '25 mnt', desc: 'Cairan pencuci piring ekstrak jeruk nipis wangi segar kesat seketika.' },
      { id: 211, name: 'Garam Beryodium Halus 500g', cat: 'Sembako', seller: 'Grosir GV Sleman', price: 4500, orig: null, unit: '500 gram', stock: 70, rating: 4.9, sold: '460+', location: 'Sleman', eta: '25 mnt', desc: 'Garam dapur beryodium bersih halus untuk penambah cita rasa masakan.' },
      { id: 212, name: 'Teh Celup Melati Kotak (25 bag)', cat: 'Minuman', seller: 'Grosir GV Sleman', price: 7500, orig: null, unit: '25 kantong', stock: 55, rating: 4.8, sold: '180+', location: 'Sleman', eta: '25 mnt', desc: 'Teh wangi melati khas Jawa dengan aroma sedap menenangkan.' },
    ],
  },
  {
    id: 'store-3',
    name: 'Toko GV Bantul',
    type: 'Kios Resmi',
    category: 'Kios Sembako & Kelontong Warga',
    address: 'Bantul, D.I. Yogyakarta',
    region: 'D.I. Yogyakarta',
    rating: 4.8,
    soldCount: '680+ terjual',
    followers: 76,
    eta: '30 mnt',
    distance: '3.2 km',
    promoText: 'Voucher Diskon s/d Rp10RB',
    logoText: 'TGB',
    logoBg: 'linear-gradient(135deg, #E65100, #F57C00)',
    coverImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800&auto=format&fit=crop',
    desc: 'Kios sembako andalan warga Bantul. Belanja kebutuhan dapur dan rumah tangga serba lengkap dan cepat antar.',
    products: [
      { id: 213, name: 'Gula Pasir Kristal 1kg', cat: 'Sembako', seller: 'Toko GV Bantul', price: 16000, orig: 17500, discount: '-9%', unit: '1 kg', stock: 40, rating: 4.8, sold: '270+', location: 'Bantul', eta: '30 mnt', desc: 'Gula pasir kristal putih bersih dan higienis.' },
      { id: 214, name: 'Telur Ayam Kampung (12 butir)', cat: 'Pangan', seller: 'Toko GV Bantul', price: 31000, orig: 33000, discount: '-6%', unit: '12 butir', stock: 20, rating: 4.9, sold: '180+', location: 'Bantul', eta: '30 mnt', desc: 'Telur ayam kampung segar dari peternak lokal Bantul.' },
      { id: 215, name: 'Kopi Robusta Segar', cat: 'Minuman', seller: 'Toko GV Bantul', price: 34000, orig: null, unit: '250 gr', stock: 15, rating: 4.8, sold: '95+', location: 'Bantul', eta: '30 mnt', desc: 'Bubuk kopi robusta sangrai alami rasa mantap.' },
      { id: 216, name: 'Minyak Goreng Sawit 2L', cat: 'Sembako', seller: 'Toko GV Bantul', price: 32500, orig: 35000, discount: '-7%', unit: '2 Liter', stock: 25, rating: 4.8, sold: '150+', location: 'Bantul', eta: '30 mnt', desc: 'Minyak goreng kemasan bantal isi 2 liter.' },
    ],
  },
  {
    id: 'store-4',
    name: 'Toko GV Jogja Malioboro',
    type: 'Kios Resmi',
    category: 'Toko Pangan & Oleh-Oleh Desa',
    address: 'Malioboro, Yogyakarta',
    region: 'D.I. Yogyakarta',
    rating: 4.9,
    soldCount: '2.4rb+ terjual',
    followers: 310,
    eta: '20 mnt',
    distance: '0.9 km',
    promoText: 'Cashback 10% Semua Produk',
    logoText: 'TJM',
    logoBg: 'linear-gradient(135deg, #4A148C, #7B1FA2)',
    coverImage: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?q=80&w=800&auto=format&fit=crop',
    desc: 'Kios resmi ESTO Malioboro menyediakan ragam pangan sehat desa, madu murni, kopi lereng Merapi, dan kerajinan khas lokal.',
    products: [
      { id: 217, name: 'Madu Hutan Murni', cat: 'Lainnya', seller: 'Toko GV Jogja Malioboro', price: 65000, orig: 75000, discount: '-13%', unit: '250 ml', stock: 18, rating: 4.9, sold: '210+', location: 'Yogyakarta', eta: '20 mnt', desc: 'Madu hutan alam murni tanpa pemanis buatan.' },
      { id: 218, name: 'Keripik Singkong Pedas', cat: 'Camilan', seller: 'Toko GV Jogja Malioboro', price: 15000, orig: null, unit: '200 gr', stock: 35, rating: 4.8, sold: '430+', location: 'Yogyakarta', eta: '20 mnt', desc: 'Keripik renyah rasa pedas gurih khas desa.' },
      { id: 219, name: 'Batik Tulis Lokal', cat: 'Kerajinan', seller: 'Toko GV Jogja Malioboro', price: 85000, orig: 95000, discount: '-11%', unit: '1 lembar', stock: 8, rating: 4.9, sold: '60+', location: 'Yogyakarta', eta: '20 mnt', desc: 'Kain batik tulis karya pembatik senior binaan Global Village.' },
      { id: 220, name: 'Kopi Robusta Segar', cat: 'Minuman', seller: 'Toko GV Jogja Malioboro', price: 35000, orig: null, unit: '250 gr', stock: 22, rating: 4.8, sold: '180+', location: 'Yogyakarta', eta: '20 mnt', desc: 'Kopi robusta harum segar dipetik merah.' },
    ],
  },
  {
    id: 'store-5',
    name: 'Toko GV Malang Klojen',
    type: 'Kios Resmi',
    category: 'Toko Kebutuhan Harian & Rumah Tangga',
    address: 'Klojen, Malang',
    region: 'Jawa Timur',
    rating: 4.7,
    soldCount: '530+ terjual',
    followers: 54,
    eta: '35 mnt',
    distance: '4.5 km',
    promoText: 'Diskon Sembako Mingguan',
    logoText: 'TGM',
    logoBg: 'linear-gradient(135deg, #C2185B, #E91E63)',
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop',
    desc: 'Kios layanan resmi ESTO di Malang Raya. Memenuhi sembako, sabun mandi, kebutuhan dapur, dan sayur segar.',
    products: [
      { id: 221, name: 'Minyak Goreng Sawit 2L', cat: 'Sembako', seller: 'Toko GV Malang Klojen', price: 33000, orig: 36000, discount: '-8%', unit: '2 Liter', stock: 30, rating: 4.7, sold: '190+', location: 'Malang', eta: '35 mnt', desc: 'Minyak goreng sawit kemasan praktis 2L.' },
      { id: 222, name: 'Tepung Terigu Serbaguna 1kg', cat: 'Sembako', seller: 'Toko GV Malang Klojen', price: 12500, orig: null, unit: '1 kg', stock: 25, rating: 4.8, sold: '110+', location: 'Malang', eta: '35 mnt', desc: 'Tepung serbaguna untuk kebutuhan gorengan.' },
      { id: 223, name: 'Deterjen Bubuk Konsentrat 800g', cat: 'Kebutuhan Rumah', seller: 'Toko GV Malang Klojen', price: 18500, orig: 21000, discount: '-12%', unit: '800 gram', stock: 20, rating: 4.8, sold: '95+', location: 'Malang', eta: '35 mnt', desc: 'Deterjen bersih dan wangi lembut di tangan.' },
      { id: 224, name: 'Gula Pasir Kristal 1kg', cat: 'Sembako', seller: 'Toko GV Malang Klojen', price: 16500, orig: null, unit: '1 kg', stock: 35, rating: 4.7, sold: '140+', location: 'Malang', eta: '35 mnt', desc: 'Gula pasir kristal murni kemasan 1 kg.' },
    ],
  },
  {
    id: 'store-6',
    name: 'ESTO Tumata Drink',
    type: 'Kios Resmi',
    category: 'Minuman & Kebutuhan Segar',
    address: 'Banjarnegara',
    region: 'Jawa Tengah',
    rating: 4.8,
    soldCount: '420+ terjual',
    followers: 48,
    eta: '25 mnt',
    distance: '2.8 km',
    promoText: 'Beli 2 Lebih Hemat',
    logoText: 'ETD',
    logoBg: 'linear-gradient(135deg, #00796B, #009688)',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    desc: 'Kios minuman dan kesegaran alami desa Banjarnegara. Menyediakan susu segar, aneka teh herbal, kopi, madu, dan buah segar.',
    products: [
      { id: 225, name: 'Susu UHT Full Cream 1L', cat: 'Minuman', seller: 'ESTO Tumata Drink', price: 19000, orig: 21000, discount: '-10%', unit: '1 Liter', stock: 25, rating: 4.9, sold: '150+', location: 'Banjarnegara', eta: '25 mnt', desc: 'Susu UHT berkualitas lezat dan bergizi.' },
      { id: 226, name: 'Teh Celup Melati Kotak (25 bag)', cat: 'Minuman', seller: 'ESTO Tumata Drink', price: 7000, orig: null, unit: '25 kantong', stock: 30, rating: 4.8, sold: '120+', location: 'Banjarnegara', eta: '25 mnt', desc: 'Teh melati sedap wangi alami.' },
      { id: 227, name: 'Jeruk Siam Manis', cat: 'Buah', seller: 'ESTO Tumata Drink', price: 22000, orig: null, unit: '1 kg', stock: 20, rating: 4.7, sold: '90+', location: 'Banjarnegara', eta: '25 mnt', desc: 'Jeruk siam segar dipanen langsung dari kebun.' },
      { id: 228, name: 'Madu Hutan Murni', cat: 'Lainnya', seller: 'ESTO Tumata Drink', price: 62000, orig: 70000, discount: '-11%', unit: '250 ml', stock: 15, rating: 4.9, sold: '80+', location: 'Banjarnegara', eta: '25 mnt', desc: 'Madu alam hutan murni kaya khasiat.' },
    ],
  },
]

export const ALL_STORE_PRODUCTS = ESTO_STORES.flatMap(s => s.products || [])
export const ALL_PRODUCTS = [...PRODUCTS, ...ALL_STORE_PRODUCTS]

const BANNERS_ESTO = [
  {
    id: 1,
    title: 'PANEN SEGAR LANGSUNG PETANI',
    sub: 'Sayur, beras, dan telur organik dipanen pagi ini langsung dari sawah desa',
    tag: '🌾 100% ASLI DESA',
    cta: 'Belanja Panen Segar',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    g: ['#0C3E1E', '#1B6B3A'],
    Icon: Leaf,
  },
  {
    id: 2,
    title: 'BELANJA MINGGUAN DISKON 50%',
    sub: 'Stok sembako, beras & minyak goreng hemat dari Kios Resmi ESTO',
    tag: '⚡ PROMO XTRA HEMAT',
    cta: 'Klaim Diskon 50%',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop',
    g: ['#C2410C', '#EA580C'],
    Icon: Sparkles,
  },
  {
    id: 3,
    title: 'BELANJA INSTANT · 1 JAM TIBA',
    sub: 'Kebutuhan pokok diantar kilat oleh GV Man Express langsung ke rumahmu',
    tag: '🚀 KILAT 1 JAM TIBA',
    cta: 'Pesan Kilat Sekarang',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
    g: ['#991B1B', '#DC2626'],
    Icon: Zap,
  },
]

const SORT_OPTIONS = [
  { id:'terlaris',   label:'Terlaris' },
  { id:'harga_asc',  label:'Harga: Terendah' },
  { id:'harga_desc', label:'Harga: Tertinggi' },
  { id:'rating',     label:'Rating Tertinggi' },
]

const INITIAL_ADDRESSES = [
  {
    id: 1,
    label: 'Rumah',
    name: 'Budi Santoso',
    phone: '0812-3456-7890',
    address: 'Jl. Melati No. 14, RT 02 / RW 04, Desa Sukamaju, Kec. Sukamakmur, Bogor 16830',
    locationLabel: 'Jl. Melati No. 14, Desa Sukamaju',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Kebun / Kantor Desa',
    name: 'Budi Santoso',
    phone: '0812-3456-7890',
    address: 'Balai Warga Blok B, Desa Sukamaju, Kec. Sukamakmur, Bogor 16830',
    locationLabel: 'Balai Warga Desa Sukamaju',
    isDefault: false,
  },
]

// ── Address Management Modals ──────────────────────────────
function AddressListModal({ addresses, selectedId, onSelect, onAdd, onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-t-3xl flex flex-col animate-slide-up bg-white h-[85vh]">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{background:'#D4D8D0'}} />
        </div>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{borderBottom:'1px solid #E8EBE5'}}>
          <p className="text-[16px] font-extrabold headline-tight" style={{color:'#0F1A13'}}>Daftar Alamat</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-[0.96] transition-transform" style={{background:'#F3F5F1'}}>
            <X size={14} style={{color:'#6B7269'}}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative pb-24">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <MapPin size={24} className="text-gray-400" />
              </div>
              <p className="text-[14px] font-bold text-gray-700">Belum ada alamat</p>
              <p className="text-[12px] text-gray-500 mt-1 max-w-[200px]">Kamu belum menyimpan alamat pengiriman apapun.</p>
            </div>
          ) : (
            addresses.map(addr => (
              <button key={addr.id} onClick={() => onSelect(addr.id)}
                className="flex gap-3 items-start p-4 rounded-2xl text-left transition"
                style={{
                  border: selectedId === addr.id ? `2px solid #1B6B3A` : '2px solid #F0F0F0',
                  background: selectedId === addr.id ? `#1B6B3A08` : '#FAFAFA'
                }}>
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{borderColor: selectedId === addr.id ? '#1B6B3A' : '#D1D5DB'}}>
                    {selectedId === addr.id && <div className="w-2 h-2 rounded-full" style={{background:'#1B6B3A'}}/>}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                    {addr.label}
                    {selectedId === addr.id && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-bold">UTAMA</span>}
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 mt-1">{addr.name}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{addr.address}</p>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                    <Phone size={10}/> {addr.phone}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md" style={{borderTop:'1px solid #E8EBE5'}}>
          <button onClick={onAdd}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white flex items-center justify-center gap-2 active:scale-[0.96] transition-transform"
            style={{background:`linear-gradient(135deg, #1B6B3A, #15803d)`, boxShadow:'0 4px 16px rgba(27,107,58,0.25)'}}>
            <Plus size={16}/> Tambah Alamat Baru
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressFormModal({ draft, setDraft, onBack, onSave, onOpenMap }) {
  const isComplete = draft.label && draft.name && draft.phone && draft.address
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative rounded-t-3xl flex flex-col animate-slide-up bg-white h-[90vh]">
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{borderBottom:'1px solid #E8EBE5'}}>
          <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 active:scale-[0.96] transition-transform">
            <ArrowLeft size={16} className="text-gray-700"/>
          </button>
          <p className="text-[16px] font-extrabold headline-tight" style={{color:'#0F1A13'}}>Tambah Alamat</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 pb-24 no-scrollbar">
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Detail Lokasi</p>
            <button onClick={onOpenMap} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 active:scale-[0.96] transition-transform bg-gray-50">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <div className="text-left min-w-0 flex-1 pr-2">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{draft.locationLabel || 'Pilih Lokasi di Peta'}</p>
                  {draft.locationLabel && <p className="text-[11px] text-gray-500 mt-0.5">Sudah dipin</p>}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
            </button>
            <textarea placeholder="Alamat lengkap (Nama jalan, RT/RW, Patokan)" value={draft.address||''} onChange={e=>setDraft({...draft, address:e.target.value})}
              className="w-full mt-3 p-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-green-600 bg-white min-h-[80px]" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Info Kontak Penerima</p>
            <input type="text" placeholder="Nama Penerima" value={draft.name||''} onChange={e=>setDraft({...draft, name:e.target.value})}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-green-600 bg-white mb-3" />
            <input type="tel" placeholder="Nomor Telepon" value={draft.phone||''} onChange={e=>setDraft({...draft, phone:e.target.value})}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-green-600 bg-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Label Alamat</p>
            <div className="flex gap-2">
              {['Rumah', 'Kantor', 'Lainnya'].map(lbl => (
                <button key={lbl} onClick={()=>setDraft({...draft, label:lbl})}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-colors ${draft.label===lbl ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-transparent'} border`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md" style={{borderTop:'1px solid #E8EBE5'}}>
          <button onClick={onSave} disabled={!isComplete}
            className={`w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all ${isComplete ? 'active:scale-[0.96] opacity-100' : 'opacity-50'}`}
            style={{background:`linear-gradient(135deg, #1B6B3A, #15803d)`, boxShadow: isComplete ? '0 4px 16px rgba(27,107,58,0.25)' : 'none'}}>
            Simpan Alamat
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressMapModal({ onBack, onConfirm }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gray-100 animate-slide-up">
      <div className="absolute top-4 left-4 z-10 flex gap-2 w-full pr-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 active:scale-[0.96] transition-transform">
          <ArrowLeft size={18} className="text-gray-800" />
        </button>
        <div className="flex-1 bg-white shadow-md rounded-2xl px-4 py-2 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Cari alamat..." className="flex-1 text-[13px] outline-none" />
        </div>
      </div>
      
      {/* Map Graphic Mock */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-80" style={{filter:'grayscale(0.3)'}} />
        <div className="absolute inset-0 bg-green-900/10 pointer-events-none" />
        
        {/* Pin */}
        <div className="relative z-10 flex flex-col items-center pb-10">
          <div className="bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg mb-2 shadow-lg whitespace-nowrap">
            Geser peta untuk menyesuaikan
          </div>
          <div className="w-12 h-12 flex items-center justify-center drop-shadow-xl" style={{color:'#1B6B3A'}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
          </div>
        </div>
      </div>

      {/* Bottom confirmation sheet */}
      <div className="p-4 bg-white rounded-t-3xl shadow-lg flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-800">
          <MapPin size={18} className="text-emerald-700" />
          <span className="text-xs font-bold truncate">Desa Sukamaju, Kec. Sukamakmur, Bogor</span>
        </div>
        <button
          onClick={onConfirm}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-emerald-700 active:scale-95 transition shadow-md"
        >
          Pilih Lokasi Ini
        </button>
      </div>
    </div>
  )
}

// ── Cart Screen (Keranjang Belanja Mandiri) ─────────────────
function CartScreen({
  cart = {},
  setCart,
  selectedItems: propSelectedItems,
  setSelectedItems: propSetSelectedItems,
  sellerNotes: propSellerNotes,
  setSellerNotes: propSetSellerNotes,
  onBack,
  onCheckout,
  onExploreProducts,
  onBrowse,
  onUpdateQty,
  onRemoveItem,
  allProducts = PRODUCTS,
}) {
  const [internalSelected, setInternalSelected] = useState(() => new Set(Object.keys(cart).map(Number)))
  const [internalNotes, setInternalNotes] = useState({})
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null)
  const [voucherApplied, setVoucherApplied] = useState(true)

  const selectedItems = propSelectedItems || internalSelected
  const setSelectedItems = propSetSelectedItems || setInternalSelected
  const sellerNotes = propSellerNotes || internalNotes
  const setSellerNotes = propSetSellerNotes || setInternalNotes

  // Map cart entries to product objects
  const cartList = Object.entries(cart)
    .map(([id, qty]) => {
      const p = allProducts.find(x => x.id === Number(id))
      return p ? { ...p, cartQty: qty } : null
    })
    .filter(Boolean)

  // Group by seller
  const sellersMap = {}
  cartList.forEach(item => {
    if (!sellersMap[item.seller]) sellersMap[item.seller] = []
    sellersMap[item.seller].push(item)
  })
  const sellers = Object.keys(sellersMap)

  // Total calculation for checked items
  const checkedItems = cartList.filter(item => selectedItems.has(item.id) && item.stock > 0)
  const subtotal = checkedItems.reduce((acc, item) => acc + item.price * item.cartQty, 0)
  const discount = voucherApplied && checkedItems.length > 0 ? 5000 : 0
  const grandTotal = Math.max(0, subtotal - discount)

  const isAllSelected = cartList.length > 0 && cartList.filter(i => i.stock > 0).every(i => selectedItems.has(i.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set())
    } else {
      const allAvailableIds = cartList.filter(i => i.stock > 0).map(i => i.id)
      setSelectedItems(new Set(allAvailableIds))
    }
  }

  const toggleItemSelect = (id, stock) => {
    if (stock === 0) return
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSellerSelect = (sellerName) => {
    const sellerItems = sellersMap[sellerName].filter(i => i.stock > 0)
    const allSellerChecked = sellerItems.every(i => selectedItems.has(i.id))
    setSelectedItems(prev => {
      const next = new Set(prev)
      sellerItems.forEach(i => {
        if (allSellerChecked) next.delete(i.id)
        else next.add(i.id)
      })
      return next
    })
  }

  const updateItemQty = (id, newQty, stock) => {
    if (newQty <= 0) {
      const item = cartList.find(i => i.id === id)
      setDeleteConfirmItem(item)
      return
    }
    const safeQty = Math.min(newQty, stock)
    if (onUpdateQty) {
      onUpdateQty(id, safeQty)
    } else if (setCart) {
      setCart(prev => ({ ...prev, [id]: safeQty }))
    }
  }

  const removeItem = (id) => {
    if (onRemoveItem) {
      onRemoveItem(id)
    } else if (setCart) {
      setCart(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
    setSelectedItems(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setDeleteConfirmItem(null)
  }

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#FAFBF9' }}>
      {/* Top Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b"
        style={{ borderColor: 'rgba(27,107,58,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div>
            <p className="font-extrabold text-[15px] text-gray-900 leading-tight">Keranjang Belanja</p>
            <p className="text-[11px] text-gray-400 font-medium">{cartList.length} produk tersimpan</p>
          </div>
        </div>
        {cartList.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Kosongkan semua barang dari keranjang belanja?')) {
                setCart({})
                setSelectedItems(new Set())
              }
            }}
            className="text-[11.5px] font-semibold text-red-600 hover:text-red-700 active:scale-95 px-2 py-1"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3.5 flex flex-col gap-3.5 pb-28">
        {cartList.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm"
              style={{ background: '#E8F5E9' }}
            >
              <ShoppingCart size={32} style={{ color: PRIMARY }} />
            </div>
            <p className="text-[16px] font-extrabold text-gray-900 mb-1">Keranjang Belanjamu Kosong</p>
            <p className="text-[12px] text-gray-500 max-w-[260px] leading-relaxed mb-6">
              Yuk, temukan hasil panen segar, camilan khas, dan kerajinan tangan dari UMKM desa!
            </p>
            <button
              onClick={onExploreProducts || onBack}
              className="px-6 py-3 rounded-2xl text-[13px] font-bold text-white shadow-md active:scale-95 transition-all"
              style={{ background: PRIMARY }}
            >
              Mulai Belanja Produk Desa
            </button>
          </div>
        ) : (
          <>
            {/* Select All Bar */}
            <div className="bg-white rounded-2xl p-3 px-4 flex items-center justify-between border border-gray-100 shadow-xs">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 focus:ring-0"
                />
                <span className="text-[12.5px] font-bold text-gray-800">
                  Pilih Semua ({cartList.length} Produk)
                </span>
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                {checkedItems.length} dipilih
              </span>
            </div>

            {/* Grouped by Seller */}
            {sellers.map(sellerName => {
              const items = sellersMap[sellerName]
              const sellerAvailable = items.filter(i => i.stock > 0)
              const isSellerChecked = sellerAvailable.length > 0 && sellerAvailable.every(i => selectedItems.has(i.id))

              return (
                <div
                  key={sellerName}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col gap-3"
                >
                  {/* Seller Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSellerChecked}
                        onChange={() => toggleSellerSelect(sellerName)}
                        disabled={sellerAvailable.length === 0}
                        className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 focus:ring-0"
                      />
                      <div className="flex items-center gap-1.5">
                        <Store size={14} className="text-emerald-700" />
                        <span className="text-[13px] font-extrabold text-gray-900">{sellerName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                          Desa Sukamaju
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Items for this seller */}
                  <div className="flex flex-col gap-3">
                    {items.map(item => {
                      const isChecked = selectedItems.has(item.id) && item.stock > 0
                      const isOutOfStock = item.stock === 0
                      const isLowStock = item.stock > 0 && item.stock <= 4

                      return (
                        <div
                          key={item.id}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                            isOutOfStock
                              ? 'bg-gray-50/70 border-gray-200/80 opacity-70'
                              : isChecked
                              ? 'bg-emerald-50/25 border-emerald-600/30'
                              : 'bg-white border-gray-100'
                          }`}
                        >
                          {/* Item Checkbox */}
                          <div className="pt-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isOutOfStock}
                              onChange={() => toggleItemSelect(item.id, item.stock)}
                              className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 focus:ring-0 disabled:opacity-40"
                            />
                          </div>

                          {/* Item Image / Icon */}
                          <div
                            className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-xs"
                            style={{
                              background: item.image
                                ? 'transparent'
                                : `linear-gradient(135deg, ${item.g?.[0] || '#2E7D32'} 0%, ${item.g?.[1] || '#4CAF50'} 100%)`,
                            }}
                          >
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <item.Icon size={24} className="text-white drop-shadow-xs relative z-10" />
                            )}
                            {isOutOfStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-[9px] font-black text-white bg-red-600 px-1 py-0.5 rounded">
                                  HABIS
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 leading-snug truncate">{item.name}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{item.unit}</p>

                            {/* Stock badges */}
                            {isOutOfStock ? (
                              <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                                <AlertTriangle size={11} /> Stok sedang habis di toko
                              </p>
                            ) : isLowStock ? (
                              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
                                Sisa stok tinggal {item.stock} lagi!
                              </p>
                            ) : null}

                            {/* Price & Quantity Controls */}
                            <div className="flex items-center justify-between mt-2 pt-1">
                              <p className="text-[13px] font-extrabold text-emerald-800">
                                Rp {item.price.toLocaleString('id')}
                              </p>

                              {isOutOfStock ? (
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 text-[11px] font-bold flex items-center gap-1"
                                >
                                  <Trash2 size={12} /> Hapus
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => updateItemQty(item.id, item.cartQty - 1, item.stock)}
                                    className="w-6 h-6 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
                                  >
                                    <Minus size={11} />
                                  </button>
                                  <span className="text-[12.5px] font-bold text-gray-900 w-6 text-center tabular-nums">
                                    {item.cartQty}
                                  </span>
                                  <button
                                    onClick={() => updateItemQty(item.id, item.cartQty + 1, item.stock)}
                                    disabled={item.cartQty >= item.stock}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-white active:scale-95 transition-all ${
                                      item.cartQty >= item.stock ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'
                                    }`}
                                  >
                                    <Plus size={11} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmItem(item)}
                                    className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors ms-1"
                                    title="Hapus produk"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Seller Note Input */}
                  <div className="pt-2 border-t border-gray-100">
                    <input
                      type="text"
                      placeholder={`Catatan untuk ${sellerName} (misal: bungkus terpisah, pilih yang segar)`}
                      value={sellerNotes[sellerName] || ''}
                      onChange={(e) => setSellerNotes(prev => ({ ...prev, [sellerName]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-[11.5px] text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )
            })}

            {/* Voucher Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-3.5 border border-emerald-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Tag size={15} />
                </div>
                <div>
                  <p className="text-[12px] font-extrabold text-emerald-950">VOUCHER DESA: HEMATONGKIR</p>
                  <p className="text-[11px] text-emerald-700">Potongan ongkir Rp 5.000 terpasang</p>
                </div>
              </div>
              <button
                onClick={() => setVoucherApplied(!voucherApplied)}
                className="text-[11px] font-bold text-emerald-800 underline active:scale-95"
              >
                {voucherApplied ? 'Lepas' : 'Pakai'}
              </button>
            </div>

            {/* Ringkasan Belanja Cepat */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Ringkasan Biaya Produk</p>
              <div className="flex justify-between py-1 text-[12px] text-gray-600">
                <span>Subtotal ({checkedItems.length} produk terpilih)</span>
                <span className="font-semibold text-gray-900">Rp {subtotal.toLocaleString('id')}</span>
              </div>
              {voucherApplied && checkedItems.length > 0 && (
                <div className="flex justify-between py-1 text-[12px] text-emerald-700 font-medium">
                  <span>Diskon Promo Desa</span>
                  <span>-Rp 5.000</span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-1 border-t border-gray-100 text-[13px] font-extrabold text-gray-900">
                <span>Total Sementara</span>
                <span className="text-emerald-800 font-black">Rp {grandTotal.toLocaleString('id')}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Checkout Bar */}
      {cartList.length > 0 && (
        <div
          className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3 shadow-lg z-20"
        >
          <div className="min-w-0">
            <p className="text-[10.5px] text-gray-400 font-medium">Total Pembayaran ({checkedItems.length} barang):</p>
            <p className="text-[16px] font-black text-emerald-800 leading-tight">
              Rp {grandTotal.toLocaleString('id')}
            </p>
          </div>
          <button
            onClick={() => onCheckout(checkedItems, voucherApplied)}
            disabled={checkedItems.length === 0}
            className={`px-5 py-3.5 rounded-2xl text-[13px] font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
              checkedItems.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-700 to-green-800 text-white active:scale-95'
            }`}
          >
            <span>Checkout ({checkedItems.length})</span>
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-xl animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} />
            </div>
            <p className="text-[14px] font-extrabold text-gray-900 text-center">Hapus dari Keranjang?</p>
            <p className="text-[12px] text-gray-500 text-center mt-1 leading-relaxed">
              Apakah kamu yakin ingin mengeluarkan <span className="font-bold text-gray-800">{deleteConfirmItem.name}</span> dari keranjang?
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-[12px] font-bold text-gray-700 active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={() => removeItem(deleteConfirmItem.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-[12px] font-bold text-white shadow-sm active:scale-95"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Checkout Screen (Pengiriman & Rincian Transparan) ───────
function CheckoutScreen({
  items = [],
  sellerNotes = {},
  userProfile,
  onBack,
  onConfirm,
  addresses: propAddresses,
  setAddresses: propSetAddresses,
  selectedAddressId: propSelectedAddressId,
  setSelectedAddressId: propSetSelectedAddressId,
  hasVoucher = true,
}) {
  const [internalAddresses, setInternalAddresses] = useState(INITIAL_ADDRESSES)
  const [internalSelectedAddressId, setInternalSelectedAddressId] = useState(INITIAL_ADDRESSES[0]?.id || 1)

  const addresses = (propAddresses && propAddresses.length > 0) ? propAddresses : internalAddresses
  const setAddresses = propSetAddresses || setInternalAddresses
  const selectedAddressId = propSelectedAddressId !== undefined ? propSelectedAddressId : internalSelectedAddressId
  const setSelectedAddressId = propSetSelectedAddressId || setInternalSelectedAddressId

  const [delivery, setDelivery] = useState('reguler') // reguler, kilat, pickup
  const [payment, setPayment] = useState('gvpay') // gvpay, qris, transfer, cod

  // Address state
  const [addressModalView, setAddressModalView] = useState(null) // 'list', 'form', 'map'
  const [newAddressDraft, setNewAddressDraft] = useState({})

  const userBalance = userProfile?.balance ?? 125000

  const displayItems = (items && items.length > 0)
    ? items
    : [
        { ...PRODUCTS[0], qty: 2 },
        { ...PRODUCTS[1], qty: 1 },
      ]

  const subtotal = displayItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
  const ongkir = delivery === 'kilat' ? 12000 : delivery === 'reguler' ? 8000 : 0
  const biayaLayanan = 1000
  const diskonVoucher = hasVoucher && ongkir > 0 ? 5000 : 0
  const grandTotal = Math.max(0, subtotal + ongkir + biayaLayanan - diskonVoucher)

  const isGvPayInsufficient = payment === 'gvpay' && userBalance < grandTotal

  const DELIVERY_OPTIONS = [
    {
      id: 'reguler',
      label: 'GV Man Reguler',
      sub: 'Antar ke rumah · Est. 30-45 mnt',
      badge: 'Terpopuler',
      Icon: Truck,
      g: ['#1B5E20', '#2E7D32'],
      price: 8000,
    },
    {
      id: 'kilat',
      label: 'GV Man Kilat (Express)',
      sub: 'Prioritas langsung jalan · Est. 15-25 mnt',
      badge: 'Cepat Tiba',
      Icon: Zap,
      g: ['#E65100', '#F57C00'],
      price: 12000,
    },
    {
      id: 'pickup',
      label: 'Ambil Sendiri di Toko',
      sub: 'Ambil langsung ke lokasi kebun/toko penjual',
      badge: 'Gratis',
      Icon: Store,
      g: ['#0D47A1', '#1976D2'],
      price: 0,
    },
  ]

  const PAYMENT_OPTIONS = [
    {
      id: 'gvpay',
      label: 'GV Pay (Saldo Desa)',
      sub: `Saldo tersedia: Rp ${userBalance.toLocaleString('id')}`,
      Icon: CreditCard,
      g: ['#1B5E20', '#2E7D32'],
    },
    {
      id: 'qris',
      label: 'QRIS',
      sub: 'Scan QR m-Banking / e-Wallet (BCA, GoPay, OVO, dll)',
      Icon: ScanLine,
      g: ['#18181B', '#3F3F46'],
    },
    {
      id: 'transfer',
      label: 'Transfer Bank (VA)',
      sub: 'BRI, BCA, Mandiri, BNI',
      Icon: Landmark,
      g: ['#0D47A1', '#1976D2'],
    },
    {
      id: 'cod',
      label: 'Bayar di Tempat (COD)',
      sub: 'Bayar tunai kepada kurir GV Man saat tiba',
      Icon: Wallet,
      g: ['#E65100', '#F57C00'],
    },
  ]

  const activeAddress =
    (Array.isArray(addresses) && addresses.find(a => a && a.id === selectedAddressId)) ||
    (Array.isArray(addresses) && addresses[0]) ||
    INITIAL_ADDRESSES[0]

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#FAFBF9' }}>
      {/* Top Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b"
        style={{ borderColor: 'rgba(27,107,58,0.08)' }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <div>
          <p className="font-extrabold text-[15px] text-gray-900 leading-tight">Pengiriman & Pembayaran</p>
          <p className="text-[11px] text-gray-400 font-medium">Langkah konfirmasi pesanan</p>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3.5 flex flex-col gap-3 pb-24">
        {/* Shipping Address Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-700" />
              <p className="text-[11.5px] font-extrabold text-gray-500 uppercase tracking-wider">
                Alamat Pengiriman
              </p>
            </div>
            <button
              onClick={() => setAddressModalView('list')}
              className="text-[11.5px] font-bold text-emerald-700 hover:text-emerald-800 active:scale-95"
            >
              Ubah Alamat
            </button>
          </div>

          {activeAddress ? (
            <div className="flex gap-3 items-center p-2.5 rounded-xl bg-gray-50/70 border border-gray-200/60">
              <SkeuoIcon
                icon={MapPin}
                gradient={['#1B5E20', '#2E7D32']}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-extrabold text-gray-900">{activeAddress.label}</p>
                  <span className="text-[10px] font-bold text-gray-600">({activeAddress.name})</span>
                </div>
                <p className="text-[12px] text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                  {activeAddress.address}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <Phone size={10} /> {activeAddress.phone}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-[12.5px] text-gray-500 mb-2">Belum ada alamat pengiriman yang tersimpan</p>
              <button
                onClick={() => {
                  setNewAddressDraft({})
                  setAddressModalView('form')
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-[11.5px]"
              >
                + Tambah Alamat Baru
              </button>
            </div>
          )}
        </div>

        {/* Ordered Items Summary */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11.5px] font-extrabold text-gray-500 uppercase tracking-wider">
              Produk yang Dipesan ({displayItems.length})
            </p>
            <button onClick={onBack} className="text-[11px] font-bold text-emerald-700">
              Edit Keranjang
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {displayItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-2.5 border-b border-gray-50 last:border-0 last:pb-0">
                {(() => {
                  const imgSrc = getProductImage(item.name) || item.image
                  return (
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-xs border border-gray-100 bg-emerald-50/40">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <SkeuoIcon icon={item.Icon || Package} gradient={item.g || ['#1B5E20', '#2E7D32']} size="sm" />
                      )}
                    </div>
                  )
                })()}
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-bold text-gray-900 leading-snug truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {item.qty} × Rp {item.price.toLocaleString('id')}
                  </p>
                  {sellerNotes[item.seller] && (
                    <p className="text-[10.5px] text-emerald-700 font-medium italic truncate mt-0.5">
                      Catatan: "{sellerNotes[item.seller]}"
                    </p>
                  )}
                </div>
                <p className="text-[12.5px] font-extrabold text-emerald-800 flex-shrink-0">
                  Rp {(item.price * item.qty).toLocaleString('id')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <p className="text-[11.5px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">
            Pilihan Metode Pengiriman
          </p>
          <div className="flex flex-col gap-2">
            {DELIVERY_OPTIONS.map(d => {
              const isSelected = delivery === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setDelivery(d.id)}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl text-left border transition-all active:scale-[0.98] group ${
                    isSelected
                      ? 'bg-emerald-50/40 border-emerald-600 shadow-xs ring-1 ring-emerald-600/10'
                      : 'bg-white border-gray-200/80 hover:bg-gray-50'
                  }`}
                >
                  <SkeuoIcon icon={d.Icon} gradient={d.g} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[12.5px] font-extrabold text-gray-900">{d.label}</p>
                      {d.badge && (
                        <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {d.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{d.sub}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[12.5px] font-black text-gray-900">
                      {d.price === 0 ? <span className="text-emerald-700">Gratis</span> : `Rp ${d.price.toLocaleString('id')}`}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ms-1 ${
                      isSelected ? 'border-emerald-700' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-700" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <p className="text-[11.5px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">
            Metode Pembayaran
          </p>
          <div className="flex flex-col gap-2">
            {PAYMENT_OPTIONS.map(p => {
              const isSelected = payment === p.id
              const isInsufficient = p.id === 'gvpay' && userBalance < grandTotal

              return (
                <div key={p.id} className="flex flex-col">
                  <button
                    onClick={() => setPayment(p.id)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl text-left border transition-all active:scale-[0.98] group ${
                      isSelected
                        ? isInsufficient
                          ? 'bg-red-50/40 border-red-400'
                          : 'bg-emerald-50/40 border-emerald-600 shadow-xs ring-1 ring-emerald-600/10'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <SkeuoIcon icon={p.Icon} gradient={p.g} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-extrabold text-gray-900">{p.label}</p>
                      <p className={`text-[11px] mt-0.5 ${isInsufficient ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        {p.sub}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ms-1 ${
                        isSelected ? (isInsufficient ? 'border-red-500' : 'border-emerald-700') : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div
                          className={`w-2 h-2 rounded-full ${isInsufficient ? 'bg-red-500' : 'bg-emerald-700'}`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Insufficient balance alert */}
                  {isSelected && isInsufficient && (
                    <div className="mt-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={13} className="text-red-600 flex-shrink-0" />
                        <span>Saldo kurang Rp {(grandTotal - userBalance).toLocaleString('id')}</span>
                      </div>
                      <span className="font-bold underline cursor-pointer" onClick={() => setPayment('qris')}>
                        Ganti ke QRIS
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <p className="text-[11.5px] font-extrabold text-gray-500 uppercase tracking-wider mb-2.5">
            Rincian Pembayaran
          </p>
          <div className="flex justify-between py-1 text-[12px] text-gray-600">
            <span>Subtotal Produk</span>
            <span className="font-semibold text-gray-900">Rp {subtotal.toLocaleString('id')}</span>
          </div>
          <div className="flex justify-between py-1 text-[12px] text-gray-600">
            <span>Biaya Pengiriman ({delivery === 'pickup' ? 'Ambil Sendiri' : delivery.toUpperCase()})</span>
            <span className="font-semibold text-gray-900">
              {ongkir === 0 ? <span className="text-emerald-700">Gratis</span> : `Rp ${ongkir.toLocaleString('id')}`}
            </span>
          </div>
          <div className="flex justify-between py-1 text-[12px] text-gray-600">
            <span>Biaya Layanan & Pembinaan UMKM Desa</span>
            <span className="font-semibold text-gray-900">Rp {biayaLayanan.toLocaleString('id')}</span>
          </div>
          {diskonVoucher > 0 && (
            <div className="flex justify-between py-1 text-[12px] text-emerald-700 font-bold">
              <span>Diskon Ongkir Desa</span>
              <span>-Rp {diskonVoucher.toLocaleString('id')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2.5 mt-1.5 border-t border-gray-100 text-[14px] font-black text-gray-900">
            <span>Total Pembayaran</span>
            <span className="text-emerald-800 text-[16px]">Rp {grandTotal.toLocaleString('id')}</span>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
            <p className="text-[11px] text-emerald-900 leading-snug">
              <span className="font-bold">Transaksi Amanah Desa:</span> Dana baru diteruskan ke penjual setelah paket Anda periksa & terima.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3 shadow-lg z-20">
        <div className="min-w-0">
          <p className="text-[10.5px] text-gray-400 font-medium">Total Tagihan:</p>
          <p className="text-[16px] font-black text-emerald-800 leading-tight">
            Rp {grandTotal.toLocaleString('id')}
          </p>
        </div>
        <button
          onClick={() => {
            if (isGvPayInsufficient) {
              alert('Saldo GV Pay Anda tidak mencukupi. Silakan pilih metode pembayaran lain seperti QRIS atau COD.')
              return
            }
            onConfirm(payment, {
              items: displayItems,
              delivery,
              payment,
              subtotal,
              ongkir,
              biayaLayanan,
              diskonVoucher,
              total: grandTotal,
              address: activeAddress?.address || 'Desa Sukamaju',
              recipientName: activeAddress?.name || userProfile?.name || 'Warga GV',
              recipientPhone: activeAddress?.phone || '0812-3456-7890',
            })
          }}
          disabled={isGvPayInsufficient}
          className={`px-6 py-3.5 rounded-2xl text-[13px] font-black transition-all shadow-md ${
            isGvPayInsufficient
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-emerald-700 to-green-800 text-white active:scale-95'
          }`}
        >
          {isGvPayInsufficient ? 'Saldo Kurang' : payment === 'cod' ? 'Konfirmasi Pesanan COD' : 'Bayar Sekarang'}
        </button>
      </div>

      {/* Address Modals */}
      {addressModalView === 'list' && (
        <AddressListModal
          addresses={addresses}
          selectedId={selectedAddressId}
          onSelect={(id) => {
            setSelectedAddressId(id)
            setAddressModalView(null)
          }}
          onAdd={() => {
            setNewAddressDraft({})
            setAddressModalView('form')
          }}
          onClose={() => setAddressModalView(null)}
        />
      )}
      {addressModalView === 'form' && (
        <AddressFormModal
          draft={newAddressDraft}
          setDraft={setNewAddressDraft}
          onBack={() => setAddressModalView(addresses.length > 0 ? 'list' : null)}
          onOpenMap={() => setAddressModalView('map')}
          onSave={() => {
            const newAddr = { ...newAddressDraft, id: Date.now() }
            setAddresses([...addresses, newAddr])
            setSelectedAddressId(newAddr.id)
            setAddressModalView(null)
          }}
        />
      )}
      {addressModalView === 'map' && (
        <AddressMapModal
          onBack={() => setAddressModalView('form')}
          onConfirm={(locationLabel) => {
            setNewAddressDraft({ ...newAddressDraft, locationLabel })
            setAddressModalView('form')
          }}
        />
      )}
    </div>
  )
}

// ── Interactive Payment Flow ───────────────────────────────
function PaymentFlow({ method, total, onComplete, onBack }) {
  const [step, setStep] = useState('main') // main | processing | done
  const [pin, setPin] = useState('')
  const [bank, setBank] = useState('bri')
  const [timer, setTimer] = useState(900) // 15 min for QRIS
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (method === 'qris' && step === 'main') {
      const t = setInterval(() => setTimer(s => (s > 0 ? s - 1 : 0)), 1000)
      return () => clearInterval(t)
    }
  }, [method, step])

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const processPayment = (delay = 1400) => {
    setStep('processing')
    setTimeout(() => {
      setStep('done')
      setTimeout(() => {
        onComplete({ method, total, timestamp: Date.now() })
      }, 1000)
    }, delay)
  }

  const BANKS = [
    { id: 'bri', name: 'BRI Virtual Account', code: '8801928374928172', logo: '🏦' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', code: '8950293847582910', logo: '🏛️' },
    { id: 'bca', name: 'BCA Virtual Account', code: '1240293847593821', logo: '💳' },
  ]

  const handlePinKey = (val) => {
    if (val === 'del') {
      setPin(p => p.slice(0, -1))
    } else if (val === 'clear') {
      setPin('')
    } else if (pin.length < 6) {
      const nextPin = pin + val
      setPin(nextPin)
      if (nextPin.length === 6) {
        setTimeout(() => processPayment(1200), 300)
      }
    }
  }

  const copyVA = (code) => {
    navigator.clipboard?.writeText?.(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
          <RefreshCw size={28} className="animate-spin" />
        </div>
        <h3 className="text-lg font-black text-gray-900">Memproses Pembayaran...</h3>
        <p className="text-xs text-gray-500 mt-1">Menghubungkan ke sistem transaksi aman Global Village</p>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 animate-in zoom-in duration-200">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-lg font-black text-gray-900">Pembayaran Berhasil!</h3>
        <p className="text-xs text-gray-500 mt-1">Pesanan Anda segera disiapkan oleh penjual</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFBF9] relative">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3.5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 text-gray-700">
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-[14px] font-extrabold text-gray-900">
              {method === 'gvpay' ? 'PIN GV Pay' : method === 'qris' ? 'Pembayaran QRIS' : method === 'transfer' ? 'Transfer Virtual Account' : 'Konfirmasi COD'}
            </p>
            <p className="text-[11px] text-gray-400">Total: Rp {total.toLocaleString('id')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
          <ShieldCheck size={13} />
          <span>Aman</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col items-center">
        {/* Total Summary Banner */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-xs border border-gray-100 mb-5 text-center">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Tagihan</p>
          <p className="text-2xl font-black text-emerald-800 mt-0.5">Rp {total.toLocaleString('id')}</p>
        </div>

        {/* 1. GV PAY (6 Digit PIN) */}
        {method === 'gvpay' && (
          <div className="w-full max-w-sm flex flex-col items-center flex-1 justify-between">
            <div>
              <p className="text-[13px] font-bold text-gray-800 text-center mb-1">Masukkan 6 Digit PIN GV Pay</p>
              <p className="text-[11px] text-gray-400 text-center mb-6">PIN default demo: sembarang 6 angka</p>

              {/* PIN Dots */}
              <div className="flex justify-center gap-3 mb-8">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pin.length > idx
                        ? 'bg-emerald-700 border-emerald-700 scale-110'
                        : 'border-gray-300 bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Keypad */}
            <div className="w-full grid grid-cols-3 gap-3 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'del'].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => handlePinKey(val)}
                  className="h-14 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-center text-lg font-bold text-gray-800 active:scale-95 active:bg-gray-100 transition"
                >
                  {val === 'del' ? '⌫' : val === 'clear' ? 'C' : val}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. QRIS (Interactive QR Code & Countdown) */}
        {method === 'qris' && (
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center w-full">
              <div className="flex items-center gap-2 mb-3">
                <ScanLine size={18} className="text-emerald-700" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">QRIS Nasional</span>
              </div>

              {/* QR Code Container */}
              <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center relative p-3 mb-4">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GV-ORDER-MOCK-PAYMENT"
                  alt="QRIS"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-full mb-2">
                <Clock size={13} />
                <span>Batas Waktu: {fmt(timer)}</span>
              </div>
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Scan kode QR di atas menggunakan aplikasi e-wallet atau mobile banking apa saja.
              </p>
            </div>

            <button
              onClick={() => processPayment(1000)}
              className="w-full mt-5 py-3.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Simulasi Cek Status Pembayaran</span>
              <Check size={16} />
            </button>
          </div>
        )}

        {/* 3. VIRTUAL ACCOUNT TRANSFER */}
        {method === 'transfer' && (
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Pilih Bank</p>
              <div className="space-y-2">
                {BANKS.map((b) => (
                  <label
                    key={b.id}
                    onClick={() => setBank(b.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      bank === b.id ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{b.logo}</span>
                      <span className="text-[12px] font-bold text-gray-800">{b.name}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      bank === b.id ? 'border-emerald-600' : 'border-gray-300'
                    }`}>
                      {bank === b.id && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Selected VA Details */}
            {(() => {
              const activeBank = BANKS.find(b => b.id === bank) || BANKS[0]
              return (
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
                  <div>
                    <p className="text-[11px] text-gray-400">Nomor Virtual Account</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-base font-extrabold text-gray-900 tracking-wider">
                        {activeBank.code}
                      </span>
                      <button
                        onClick={() => copyVA(activeBank.code)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 active:scale-95 transition"
                      >
                        <Copy size={13} />
                        <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                    <p>• Masukkan kartu ATM atau buka m-Banking.</p>
                    <p>• Pilih menu Transfer &gt; Virtual Account.</p>
                    <p>• Masukkan nomor VA di atas dan konfirmasi nama penerima.</p>
                  </div>
                </div>
              )
            })()}

            <button
              onClick={() => processPayment(1200)}
              className="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Saya Sudah Transfer</span>
              <Check size={16} />
            </button>
          </div>
        )}

        {/* 4. COD (Bayar di Tempat) */}
        {method === 'cod' && (
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-3xl">
                🤝
              </div>
              <h4 className="text-[15px] font-extrabold text-gray-900">Bayar Tunai di Tempat (COD)</h4>
              <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                Siapkan uang pas sebesar <strong className="text-gray-900 font-extrabold">Rp {total.toLocaleString('id')}</strong> untuk diserahkan kepada kurir GV Man saat pesanan tiba.
              </p>
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-left">
                <ShieldCheck size={18} className="text-emerald-700 flex-shrink-0" />
                <span className="text-[11px] text-emerald-900 font-medium">
                  Periksa keutuhan paket sebelum kurir meninggalkan lokasi Anda.
                </span>
              </div>
            </div>

            <button
              onClick={() => processPayment(800)}
              className="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm shadow-md active:scale-95 transition"
            >
              Konfirmasi Pesanan COD
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Order Success Screen (Invoice & Live Tracking Gateway) ─
function OrderSuccessScreen({ order, onTrack, onHistory }) {
  const orderId = order?.id || `GV-${Date.now().toString().slice(-8)}`
  const nowTime = new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })
  const total = order?.total || 0

  return (
    <div className="flex flex-col h-full bg-[#FAFBF9] relative animate-in fade-in duration-200">
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col items-center justify-center text-center">
        {/* Animated Check */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 animate-ping absolute inset-0 opacity-40" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-700 to-green-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-emerald-700/30 relative">
            <Check size={40} strokeWidth={3} />
          </div>
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
          Pesanan Sukses Dibuat
        </span>
        <h2 className="text-2xl font-black text-gray-900">Terima Kasih!</h2>
        <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
          Pesananmu telah diteruskan ke penjual dan saat ini sedang dalam proses penyiapan.
        </p>

        {/* Invoice Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xs border border-gray-100 my-5 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="text-[11px] text-gray-400">Nomor Pesanan</p>
              <p className="text-[13px] font-extrabold text-gray-900 font-mono">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">Waktu</p>
              <p className="text-[12px] font-bold text-gray-800">{nowTime}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Metode Bayar</span>
              <span className="font-bold text-gray-800">{order?.payment || 'GV Pay'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pengiriman</span>
              <span className="font-bold text-gray-800">{order?.delivery || 'Pengiriman Kilat Desa'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-50 text-[13px]">
              <span className="font-bold text-gray-900">Total Pembayaran</span>
              <span className="font-extrabold text-emerald-800">Rp {total.toLocaleString('id')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-white border-t border-gray-100 space-y-2.5">
        <button
          onClick={onTrack}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-green-800 text-white text-sm font-extrabold shadow-lg shadow-emerald-700/25 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Navigation size={16} />
          <span>Lacak Pengiriman Live</span>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </button>
        <button
          onClick={onHistory}
          className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 text-xs font-bold active:scale-95 transition"
        >
          Lihat Riwayat Pesanan
        </button>
      </div>
    </div>
  )
}


// ── Order Data ─────────────────────────────────────────────
const STATUS_CONFIG = {
  waiting:   { label:'Menunggu Konfirmasi', color:'#F57F17', bg:'#FFF8E1' },
  confirmed: { label:'Dikonfirmasi',        color:'#1565C0', bg:'#E3F2FD' },
  preparing: { label:'Sedang Disiapkan',    color:'#E65100', bg:'#FFF3E0' },
  shipped:   { label:'Dalam Perjalanan',    color:'#1B6B3A', bg:'#E8F5E9' },
  done:      { label:'Selesai',             color:'#388E3C', bg:'#F1F8E9' },
  cancelled: { label:'Dibatalkan',          color:'#C62828', bg:'#FFEBEE' },
}
const SELLER_ACTIONS = {
  waiting:   { label:'Konfirmasi Pesanan', next:'confirmed' },
  confirmed: { label:'Mulai Siapkan',      next:'preparing' },
  preparing: { label:'Tandai Dikirim',     next:'shipped'   },
  shipped:   null,
  done:      null,
}

const DUMMY_BUYER_ORDERS = [
  {
    id: 'GV-20260902',
    date: 'Hari ini, 10:15',
    seller: 'Ibu Sari',
    payment: 'GV Pay',
    delivery: 'Pengiriman (Kilat Desa)',
    total: 37000,
    status: 'shipped',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    courier: { name: 'Agus Santoso', rating: 4.9, trips: '240+', vehicle: 'Honda Beat · B 4521 KDF', avatar: '👨' },
    items: [
      {
        id: 2,
        name: 'Bayam Organik Segar',
        qty: 2,
        price: 8500,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
        Icon: Leaf,
        g: ['#2E7D32', '#4CAF50'],
      },
      {
        id: 1,
        name: 'Tempe Mendoan Jumbo',
        qty: 1,
        price: 12000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
        Icon: CircleDot,
        g: ['#E65100', '#F57C00'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '10:15', label: 'Pesanan Dibuat', sub: 'Menunggu konfirmasi dari penjual' },
      { s: 'confirmed', time: '10:18', label: 'Penjual Mengonfirmasi', sub: 'Penjual menerima dan memverifikasi pesanan' },
      { s: 'preparing', time: '10:30', label: 'Pesanan Sedang Disiapkan', sub: 'Penjual menyiapkan paket dan mengemas produk' },
      { s: 'shipped', time: '10:45', label: 'Dalam Perjalanan ke Lokasimu', sub: 'GV Man sedang mengantar paket ke rumahmu' },
    ],
  },
  {
    id: 'GV-20260901',
    date: 'Hari ini, 08:30',
    seller: 'Pak Wahyu',
    payment: 'GV Pay',
    delivery: 'Pengiriman (Reguler)',
    total: 73000,
    status: 'waiting',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    items: [
      {
        id: 8,
        name: 'Beras Pandan Wangi Premium 5kg',
        qty: 1,
        price: 65000,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
        Icon: Wheat,
        g: ['#827717', '#9E9D24'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '08:30', label: 'Menunggu Konfirmasi Penjual', sub: 'Pesanan telah diteruskan ke mitra petani' },
    ],
  },
  {
    id: 'GV-20260815',
    date: '15 Agt 2026, 14:20',
    seller: 'Pak Asep',
    payment: 'Transfer Bank',
    delivery: 'Pengiriman (Reguler)',
    total: 108000,
    status: 'done',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    items: [
      {
        id: 3,
        name: 'Kopi Robusta Segar',
        qty: 1,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',
        Icon: Coffee,
        g: ['#4E342E', '#6D4C41'],
      },
      {
        id: 4,
        name: 'Madu Hutan Murni',
        qty: 1,
        price: 65000,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=600&auto=format&fit=crop',
        Icon: Droplet,
        g: ['#F57F17', '#FFCA28'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '14:20', label: 'Pesanan Dibuat', sub: 'Menunggu konfirmasi penjual' },
      { s: 'confirmed', time: '14:25', label: 'Pesanan Dikonfirmasi', sub: 'Penjual memverifikasi ketersediaan stok' },
      { s: 'preparing', time: '14:40', label: 'Pesanan Disiapkan', sub: 'Paket dikemas rapi' },
      { s: 'shipped', time: '15:05', label: 'Dalam Pengiriman', sub: 'GV Man mengantar paket' },
      { s: 'done', time: '15:45', label: 'Pesanan Selesai Diterima', sub: 'Paket telah diterima di alamat pemesan' },
    ],
  },
  {
    id: 'GV-20260718',
    date: '18 Jul 2026, 11:10',
    seller: 'Ibu Rina',
    payment: 'GV Pay',
    delivery: 'Pengiriman',
    total: 40000,
    status: 'cancelled',
    cancelReason: 'Ingin mengubah pesanan / alamat pengiriman',
    refundNotice: 'Dana Rp 40.000 telah dikembalikan 100% ke saldo GV Pay.',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    items: [
      {
        id: 9,
        name: 'Telur Ayam Kampung (10 butir)',
        qty: 1,
        price: 32000,
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop',
        Icon: Egg,
        g: ['#F57F17', '#FBC02D'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '11:10', label: 'Pesanan Dibuat', sub: 'Menunggu konfirmasi penjual' },
      { s: 'cancelled', time: '11:18', label: 'Pesanan Dibatalkan Pembeli', sub: 'Refund 100% saldo GV Pay berhasil' },
    ],
  },
]

const DUMMY_SELLER_ORDERS = [
  { id:'GV-S001', date:'Hari ini, 11:23', buyer:'Pak Wahyu', buyerAvatar:'👨', payment:'GV Pay',
    delivery:'Pengiriman', total:130000, status:'waiting',
    address:'Jl. Mawar No. 12, Desa Bojong',
    items:[{name:'Beras Pandan Wangi Premium 5kg',qty:2,price:65000,Icon:Wheat,g:['#827717','#9E9D24']}]},
  { id:'GV-S002', date:'Hari ini, 09:47', buyer:'Bu Rina',   buyerAvatar:'👩', payment:'COD',
    delivery:'Ambil Sendiri', total:50000, status:'confirmed',
    address:'Jl. Anggrek No. 5, Desa Sukamaju',
    items:[{name:'Bayam Organik Segar',qty:4,price:8500,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Telur Ayam Kampung',qty:1,price:32000,Icon:Egg,g:['#F57F17','#FBC02D']}]},
  { id:'GV-S003', date:'Kemarin, 15:10', buyer:'Pak Hendra', buyerAvatar:'👴', payment:'QRIS',
    delivery:'Pengiriman', total:65000, status:'done',
    address:'Jl. Melati No. 3, Desa Ciawi',
    items:[{name:'Pupuk Organik Kompos 25kg',qty:1,price:45000,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Bibit Cabai Rawit Lokal',qty:1,price:15000,Icon:Leaf,g:['#C62828','#EF5350']}]},
]

// ── Cancel Order Modal (with instant refund explanation) ───
export function CancelOrderModal({ order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('Ingin mengubah pesanan atau varian')
  const [customReason, setCustomReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const REASONS = [
    'Ingin mengubah pesanan atau varian',
    'Alamat pengiriman salah atau ingin diubah',
    'Menemukan harga lebih hemat di tempat lain',
    'Waktu pengiriman dirasa terlalu lama',
    'Lainnya (Tulis alasan di bawah)',
  ]

  const handleCancel = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      const finalReason = selectedReason.startsWith('Lainnya') ? (customReason.trim() || 'Alasan lainnya') : selectedReason
      onConfirm(order.id, finalReason)
      setIsSubmitting(false)
    }, 600)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 flex flex-col max-h-[85%] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3 flex-shrink-0" />
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 text-red-600 font-extrabold text-[15px]">
            <AlertTriangle size={18} />
            <span>Batalkan Pesanan</span>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-gray-400 p-1">Tutup</button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-bold text-amber-900">Kebijakan Pengembalian Dana (Refund)</p>
                <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                  Karena pesanan belum diproses kurir, dana sebesar <strong className="font-extrabold text-amber-950">Rp {order.total.toLocaleString('id')}</strong> akan langsung dikembalikan 100% ke saldo <strong className="font-bold text-emerald-800">GV Pay</strong> Anda secara instan tanpa potongan biaya.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-bold text-gray-800 mb-2.5">Pilih alasan pembatalan:</p>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label key={r} onClick={() => setSelectedReason(r)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition ${
                    selectedReason === r ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/40'
                  }`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedReason === r ? 'border-emerald-600' : 'border-gray-300'
                  }`}>
                    {selectedReason === r && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[12px] font-semibold text-gray-800">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason.startsWith('Lainnya') && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Tulis alasan spesifik Anda..."
              rows={2}
              className="w-full text-[12px] p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 bg-white"
            />
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 flex gap-2.5 flex-shrink-0">
          <button onClick={onClose} disabled={isSubmitting}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-[13px] font-bold text-gray-600 active:scale-95 transition">
            Kembali
          </button>
          <button onClick={handleCancel} disabled={isSubmitting}
            className="flex-1 py-3 rounded-2xl bg-red-600 text-white text-[13px] font-bold active:scale-95 transition shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5">
            {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : 'Konfirmasi Batal'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Order Detail Sheet (Buyer - bottom sheet) ──────────────
export function OrderDetailSheet({ order, onClose, onRate, onBuyAgain, onTrack, onCancelPrompt }) {
  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.waiting
  const isActive = ['confirmed', 'preparing', 'shipped'].includes(order.status)
  const canCancel = ['waiting', 'confirmed'].includes(order.status)

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}/>
      <div className="relative bg-white flex flex-col rounded-t-3xl"
        style={{maxHeight:'88%',boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[14px] font-extrabold text-gray-900">Detail Pesanan</p>
            <p className="text-[12px] text-gray-400">{order.id} · {order.date}</p>
          </div>
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{background:st.bg,color:st.color}}>
            {isActive && <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{background:st.color}}/>}
            {st.label}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
          
          {/* Active status banner if shipped */}
          {order.status === 'shipped' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#1B6B3A] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Truck size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[12.5px] font-extrabold text-emerald-950 leading-tight">Pesanan Sedang Diantar</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">GV Man sedang menuju ke lokasimu</p>
                </div>
              </div>
              <button
                onClick={() => { onClose(); onTrack(order) }}
                className="px-3.5 py-1.5 rounded-xl bg-[#1B6B3A] text-white text-[11.5px] font-bold active:scale-95 transition shadow-xs flex items-center gap-1.5"
              >
                <Navigation size={12} />
                <span>Lacak</span>
              </button>
            </div>
          )}

          {/* Cancelled reason & refund banner */}
          {order.status === 'cancelled' && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-red-900">Pesanan Telah Dibatalkan</p>
                  {order.cancelReason && <p className="text-[11px] text-red-700 mt-0.5">Alasan: "{order.cancelReason}"</p>}
                  <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>{order.refundNotice || 'Dana telah dikembalikan 100% ke saldo GV Pay.'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Items with Real Product Photos */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider">Produk yang Dibeli</p>
            {order.items.map((item, i) => {
              const itemImg = getProductImage(item)
              return (
                <div key={i} className="flex items-center gap-3.5 py-3 border-b border-gray-100/80 last:border-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-gray-200/70 bg-gray-50 flex-shrink-0 shadow-2xs">
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-extrabold text-gray-900 leading-snug line-clamp-1">{item.name}</p>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">
                      {item.qty} × Rp {item.price.toLocaleString('id')}
                    </p>
                  </div>
                  <p className="text-[13.5px] font-black tabular-nums flex-shrink-0" style={{ color: PRIMARY }}>
                    Rp {(item.qty * item.price).toLocaleString('id')}
                  </p>
                </div>
              )
            })}
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="text-[12px] font-bold text-gray-900">Total Pembayaran</span>
              <span className="text-[14px] font-extrabold tabular-nums" style={{ color: PRIMARY }}>
                Rp {order.total.toLocaleString('id')}
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Info Pengiriman & Pembayaran</p>
            {[
              ['Alamat Pengiriman', order.address || 'Desa Sukamaju'],
              ['Penjual', order.seller],
              ['Pembayaran', order.payment],
              ['Opsi Pengiriman', order.delivery],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-400">{l}</span>
                <span className="text-[12px] font-semibold text-gray-800 text-right max-w-[60%]">{v}</span>
              </div>
            ))}
          </div>

          {/* Riwayat Status Stepper (Synchronized with OrderTracking design) */}
          {order.timeline && (
            <div className="pt-2">
              <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
                Riwayat Status Pesanan
              </p>
              <div className="space-y-0">
                {order.timeline.map((t, i) => {
                  const isLast = i === order.timeline.length - 1
                  const isFinished = !isLast || order.status === 'done' || order.status === 'cancelled'
                  const isActive = isLast && order.status !== 'done' && order.status !== 'cancelled'

                  return (
                    <div key={i} className="flex gap-3 relative">
                      {/* Connector Line */}
                      {!isLast && (
                        <div
                          className="absolute left-[13px] top-7 w-0.5"
                          style={{
                            height: 40,
                            background: isFinished ? PRIMARY : '#E5E7EB',
                            transition: 'background 0.5s ease',
                          }}
                        />
                      )}

                      {/* Step Node */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300"
                        style={
                          isFinished
                            ? { background: PRIMARY }
                            : isActive
                            ? { background: '#fff', border: `2px solid ${PRIMARY}` }
                            : { background: '#F3F4F6', border: '2px solid #E5E7EB' }
                        }
                      >
                        {isFinished ? (
                          <Check size={14} className="text-white" strokeWidth={3} />
                        ) : isActive ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-[13px] font-bold leading-snug ${
                              isFinished ? 'text-gray-900' : 'text-emerald-800 font-extrabold'
                            }`}
                          >
                            {t.label}
                          </p>
                          <span className="text-[11px] text-gray-400 flex-shrink-0 font-mono">
                            {t.time}
                          </span>
                        </div>
                        {t.sub && (
                          <p
                            className={`text-[11.5px] mt-0.5 leading-relaxed ${
                              isFinished ? 'text-gray-500' : 'text-emerald-700/90 font-medium'
                            }`}
                          >
                            {t.sub}
                          </p>
                        )}
                        {isActive && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span className="text-[10.5px] font-bold text-emerald-700">Sedang berlangsung</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Existing rating */}
          {order.rating && (
            <div className="p-3 rounded-2xl" style={{background:'#FFF8E1'}}>
              <p className="text-[11px] font-bold text-gray-400 mb-2">Ulasan Anda</p>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(s=>(
                  <span key={s} className="text-xl" style={{color:s<=order.rating?'#F9A825':'#E0E0E0'}}>★</span>
                ))}
              </div>
              {order.ratingComment&&<p className="text-[12px] text-gray-600 italic">"{order.ratingComment}"</p>}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          {isActive && (
            <button
              onClick={() => { onClose(); onTrack(order) }}
              className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)', boxShadow: '0 4px 14px rgba(27,107,58,0.3)' }}
            >
              <Navigation size={15} />
              <span>Lacak Pengiriman Live</span>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </button>
          )}

          <div className="flex gap-2.5">
            {order.status==='done' && !order.rating && (
              <button onClick={()=>onRate(order)}
                className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-95 transition"
                style={{background:'#F9A825',boxShadow:'0 4px 12px rgba(249,168,37,0.4)'}}>
                ★ Beri Rating
              </button>
            )}
            {order.status==='done' && (
              <button onClick={()=>onBuyAgain(order)}
                className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 active:scale-95 transition">
                Beli Lagi
              </button>
            )}
            {canCancel && (
              <button onClick={()=>onCancelPrompt(order)}
                className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-red-600 bg-red-50/70 border border-red-200 active:scale-95 transition flex items-center justify-center gap-1.5">
                <AlertTriangle size={14} />
                <span>Batalkan</span>
              </button>
            )}
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold border border-gray-200 text-gray-600 active:scale-95 transition">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Rating Sheet ───────────────────────────────────────────
export function RatingSheet({ order, onClose, onSubmit }) {
  const [stars,   setStars]   = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const LABELS = ['','Mengecewakan','Kurang baik','Cukup baik','Bagus','Sangat bagus!']

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-10"
        style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5"/>
        <p className="text-[15px] font-extrabold text-gray-900 mb-1">Beri Rating Produk</p>
        <p className="text-[12px] text-gray-400 mb-5">dari {order.seller}</p>

        {/* Product items to rate */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          {order.items.map((item,i)=>(
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden relative"
                style={{background:item.image?'transparent':(item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5')}}>
                {item.image?<img src={item.image} alt="" className="w-full h-full object-cover border border-black/10"/>:(item.Icon?<item.Icon size={28} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={28} className="text-gray-400"/>)}
              </div>
              <p className="text-[11px] text-gray-500 text-center w-14 line-clamp-2">{item.name}</p>
            </div>
          ))}
        </div>

        {/* Star selector */}
        <div className="flex justify-center gap-3 mb-2">
          {[1,2,3,4,5].map(s=>(
            <button key={s}
              onMouseEnter={()=>setHovered(s)}
              onMouseLeave={()=>setHovered(0)}
              onClick={()=>setStars(s)}
              className="text-4xl transition-transform active:scale-110"
              style={{color:(hovered||stars)>=s?'#F9A825':'#E0E0E0',
                transform:(hovered||stars)>=s?'scale(1.15)':'scale(1)',
                transition:'all 0.15s ease'}}>
              ★
            </button>
          ))}
        </div>
        <p className="text-center text-[13px] font-bold mb-4"
          style={{color:stars?'#F9A825':'#9CA3AF',minHeight:20}}>
          {LABELS[hovered||stars]||'Tap bintang untuk memberi rating'}
        </p>

        {/* Comment */}
        <textarea value={comment} onChange={e=>setComment(e.target.value)}
          placeholder="Tulis ulasanmu (opsional)..."
          className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none resize-none mb-4"
          style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA',minHeight:80}}/>

        <button onClick={()=>stars>0&&onSubmit(order.id,stars,comment)}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition"
          style={{background:stars>0?'#F9A825':'#E0E0E0',
            boxShadow:stars>0?'0 4px 12px rgba(249,168,37,0.4)':'none'}}>
          Kirim Ulasan
        </button>
      </div>
    </div>
  )
}

// ── Order History Screen (kept for reference) ───────────────
function OrderHistoryScreen({ orders, onBack }) {
  const [filter, setFilter]     = useState('all')
  const [detail, setDetail]     = useState(null)
  const PRIMARY = '#1B6B3A'

  const filtered = filter==='all' ? orders
    : filter==='active' ? orders.filter(o=>!['done','cancelled'].includes(o.status))
    : orders.filter(o=>o.status==='done')

  if (detail) return <OrderDetailScreen order={detail} onBack={()=>setDetail(null)}/>

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-extrabold text-gray-900 text-[15px]">Pesanan Saya</p>
      </div>
      {/* Filter tabs */}
      <div className="flex bg-white border-b border-gray-100 flex-shrink-0">
        {[['all','Semua'],['active','Berlangsung'],['done','Selesai']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)}
            className="flex-1 py-3 text-[12px] font-bold transition"
            style={filter===id?{color:PRIMARY,borderBottom:`2.5px solid ${PRIMARY}`}:{color:'#9CA3AF',borderBottom:'2.5px solid transparent'}}>
            {lbl}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {filtered.length===0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-[14px] font-bold text-gray-900 mb-1">Belum ada pesanan</p>
            <p className="text-[12px] text-gray-400">Yuk mulai belanja produk lokal!</p>
          </div>
        )}
        {filtered.map(order=>{
          const st = STATUS_CONFIG[order.status]
          return (
            <button key={order.id} onClick={()=>setDetail(order)}
              className="bg-white rounded-2xl p-4 text-left active:scale-98 transition-transform"
              style={{boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] font-bold text-gray-400">{order.id}</p>
                  <p className="text-[12px] text-gray-300 mt-0.5">{order.date}</p>
                </div>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
                  style={{background:st.bg,color:st.color}}>{st.label}</span>
              </div>
              {/* Items */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0,3).map((item,i)=>(
                    <div key={i} className="w-10 h-10 rounded-[12px] flex items-center justify-center border-2 border-white shadow-inner relative overflow-hidden"
                      style={{background:item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5',zIndex:order.items.length-i}}>
                      {item.Icon?<item.Icon size={18} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={18} className="text-gray-400"/>}
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 line-clamp-2">
                    {order.items[0].name}{order.items.length>1?` +${order.items.length-1} lainnya`:''}
                  </p>
                  <p className="text-[12px] text-gray-400">dari {order.seller}</p>
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                <p className="text-[11px] text-gray-400">{order.delivery} · {order.payment}</p>
                <p className="text-[14px] font-extrabold" style={{color:PRIMARY}}>
                  Rp {order.total.toLocaleString('id')}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Order Detail Screen (Buyer) ────────────────────────────
function OrderDetailScreen({ order, onBack }) {
  const PRIMARY = '#1B6B3A'
  const st = STATUS_CONFIG[order.status]
  const allDone = order.status === 'done'
  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <div className="flex-1">
          <p className="font-extrabold text-gray-900 text-[14px]">Detail Pesanan</p>
          <p className="text-[12px] text-gray-400">{order.id}</p>
        </div>
        <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
          style={{background:st.bg,color:st.color}}>{st.label}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {/* Items */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Produk</p>
          {order.items.map((item,i)=>(
            <div key={i} className={`flex items-center gap-3 py-2.5 ${i<order.items.length-1?'border-b border-gray-50':''}`}>
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner relative overflow-hidden"
                style={{background:item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5'}}>
                {item.Icon?<item.Icon size={22} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={22} className="text-gray-400"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
              </div>
              <p className="text-[13px] font-bold flex-shrink-0" style={{color:PRIMARY}}>
                Rp {(item.qty*item.price).toLocaleString('id')}
              </p>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-1 border-t border-gray-100">
            <span className="text-[12px] font-bold text-gray-900">Total</span>
            <span className="text-[14px] font-extrabold" style={{color:PRIMARY}}>Rp {order.total.toLocaleString('id')}</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Info Pesanan</p>
          {[['Penjual',order.seller],['Pembayaran',order.payment],['Pengiriman',order.delivery],['Tanggal',order.date]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl px-4 py-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-4">Timeline</p>
          {order.timeline.map((t,i)=>{
            const isLast = i===order.timeline.length-1
            return (
              <div key={i} className="flex gap-3 relative">
                {!isLast && <div className="absolute left-[13px] top-7 w-0.5 h-8" style={{background:PRIMARY+'40'}}/>}
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{background:isLast&&allDone?PRIMARY:PRIMARY+'20'}}>
                  <Check size={13} style={{color:isLast&&allDone?'#fff':PRIMARY}}/>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <p className="text-[13px] font-bold text-gray-900">{t.label}</p>
                    <p className="text-[12px] text-gray-400 flex-shrink-0 ms-2">{t.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        {order.status==='done' && (
          <button onClick={()=>{onBuyAgain&&onBuyAgain(order);onClose()}}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold border-2"
            style={{borderColor:PRIMARY,color:PRIMARY}}>
            Beli Lagi
          </button>
        )}
      </div>
    </div>
  )
}

// ── Seller Order Management ────────────────────────────────
function SellerOrderSheet({ order, onClose, onUpdateStatus }) {
  const PRIMARY = '#1B6B3A'
  const st      = STATUS_CONFIG[order.status]
  const action  = SELLER_ACTIONS[order.status]
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white flex flex-col rounded-t-3xl"
        style={{maxHeight:'88%',boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[14px] font-extrabold text-gray-900">Detail Pesanan</p>
            <p className="text-[12px] text-gray-400">{order.id} · {order.date}</p>
          </div>
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{background:st.bg,color:st.color}}>{st.label}</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
          {/* Buyer */}
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={{background:'#F9FAFB'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{background:'#E8F5E9'}}>{order.buyerAvatar}</div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">{order.buyer}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{order.address}</p>
            </div>
          </div>
          {/* Items */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Produk Dipesan</p>
            {order.items.map((item,i)=>{
              const itemImg = getProductImage(item)
              return (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs relative overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={itemImg} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
                </div>
                <p className="text-[13px] font-bold flex-shrink-0" style={{color:PRIMARY}}>
                  Rp {(item.qty*item.price).toLocaleString('id')}
                </p>
                </div>
              )
            })}
          </div>
          {/* Info */}
          {[['Total',`Rp ${order.total.toLocaleString('id')}`],['Pembayaran',order.payment],['Pengiriman',order.delivery]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-1">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-bold" style={{color:l==='Total'?PRIMARY:'#374151'}}>{v}</span>
            </div>
          ))}
        </div>
        {/* Action */}
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100">
          {action ? (
            <button onClick={()=>{onUpdateStatus(order.id,action.next);onClose()}}
              className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
              style={{background:PRIMARY,boxShadow:`0 4px 12px ${PRIMARY}40`}}>
              {action.label}
            </button>
          ) : order.status==='done' ? (
            <div className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
              style={{background:'#F1F8E9'}}>
              <Check size={16} style={{color:PRIMARY}}/>
              <span className="text-[13px] font-bold" style={{color:PRIMARY}}>Pesanan Selesai</span>
            </div>
          ) : (
            <div className="w-full py-3.5 rounded-2xl flex items-center justify-center"
              style={{background:'#F5F5F5'}}>
              <span className="text-[13px] font-semibold text-gray-400">Menunggu pengiriman selesai</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ── Phone Call Simulation Modal ────────────────────────────
function PhoneCallModal({ courier, onClose }) {
  const [callDuration, setCallDuration] = useState(0)
  const [status, setStatus] = useState('Menghubungkan...')
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('Berdering...'), 1200)
    const t2 = setTimeout(() => setStatus('Terhubung'), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (status !== 'Terhubung') return
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000)
    return () => clearInterval(timer)
  }, [status])

  const formatSecs = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white p-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Panggilan Aman GV</span>
        </div>
        <button onClick={onClose} className="p-2 text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-600/30 animate-ping absolute inset-0 -m-2 opacity-50" />
          <div className="w-24 h-24 rounded-full bg-emerald-700/60 flex items-center justify-center text-4xl shadow-xl relative border-2 border-emerald-400/40">
            {courier.avatar || '👨'}
          </div>
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{courier.name}</h3>
        <p className="text-sm text-emerald-400 font-semibold mt-1">Driver GV Man · {courier.vehicle}</p>
        <p className="text-xs text-white/50 mt-3 font-mono">
          {status === 'Terhubung' ? formatSecs(callDuration) : status}
        </p>
      </div>

      <div className="flex flex-col gap-6 pb-6">
        <div className="flex justify-center gap-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 ${
              isMuted ? 'bg-white text-gray-950' : 'bg-white/15 text-white'
            }`}
          >
            <Volume2 size={20} />
          </button>
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 ${
              isSpeaker ? 'bg-white text-gray-950' : 'bg-white/15 text-white'
            }`}
          >
            <PhoneCall size={20} />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-600/40 active:scale-90 transition"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Courier Chat Modal (with quick chips & automated replies) ─
function CourierChatModal({ courier, onClose }) {
  const [chatLog, setChatLog] = useState([
    { from: 'driver', text: 'Halo kak! Saya Agus, driver GV Man yang mengantar pesananmu. Sedang menuju ke lokasimu ya 👍', time: '10:46' },
  ])
  const [msgInput, setMsgInput] = useState('')
  const chatBottomRef = useRef(null)

  const QUICK_CHIPS = [
    'Lokasi di mana mas?',
    'Pagar rumah warna hitam ya',
    'Titip di teras / satpam aja ya',
    'Hati-hati di jalan mas 🙏',
  ]

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

  const sendMsg = (text) => {
    const clean = (text || msgInput).trim()
    if (!clean) return
    const nowTime = new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })
    setChatLog((prev) => [...prev, { from: 'me', text: clean, time: nowTime }])
    if (!text) setMsgInput('')

    // Simulated quick driver reply
    setTimeout(() => {
      let reply = 'Siap kak, sudah tercatat! Segera saya laksanakan 🙏'
      if (clean.toLowerCase().includes('mana')) {
        reply = 'Sekitar 400 meter lagi kak, sudah masuk gang utama desa Sukamaju 🏍️'
      } else if (clean.toLowerCase().includes('pagar') || clean.toLowerCase().includes('hitam')) {
        reply = 'Siap kak, patokan pagar hitam sudah kelihatan. Sebentar lagi sampai depan rumah! 🏠'
      } else if (clean.toLowerCase().includes('teras') || clean.toLowerCase().includes('satpam')) {
        reply = 'Baik kak, paket akan saya letakkan rapi dan difotokan buktinya ya 👍'
      }
      setChatLog((prev) => [...prev, { from: 'driver', text: reply, time: new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' }) }])
    }, 1000)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95">
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0 border border-emerald-100">
            {courier.avatar || '👨'}
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-gray-900">{courier.name}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>GV Man · Aktif Mengantar</span>
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
          {courier.vehicle}
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-2.5 bg-gray-50/50">
        <div className="text-center my-1">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100/80 px-2.5 py-0.5 rounded-full">
            Hari ini
          </span>
        </div>

        {chatLog.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.from === 'driver' && (
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs me-1.5 flex-shrink-0 self-end mb-1">
                {courier.avatar || '👨'}
              </div>
            )}
            <div
              className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed shadow-xs ${
                m.from === 'me'
                  ? 'bg-emerald-800 text-white rounded-br-xs'
                  : 'bg-white text-gray-900 border border-gray-100 rounded-bl-xs'
              }`}
            >
              <p>{m.text}</p>
              <p className={`text-[9px] mt-1 text-right font-medium ${m.from === 'me' ? 'text-emerald-200' : 'text-gray-400'}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick response chips */}
      <div className="px-3 py-2 bg-white border-t border-gray-100 overflow-x-auto no-scrollbar flex gap-1.5 flex-shrink-0">
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => sendMsg(chip)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-[11px] font-semibold active:scale-95 transition hover:bg-emerald-100/60"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-100">
        <input
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
          placeholder="Tulis pesan ke driver..."
          className="flex-1 text-[12px] bg-gray-100/80 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600 transition"
        />
        <button
          onClick={() => sendMsg()}
          disabled={!msgInput.trim()}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 ${
            msgInput.trim() ? 'bg-emerald-700 text-white shadow-md' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Navigation size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Redesigned Order Tracking (with 6 phases, weather delay, route SVG, call/chat modals) ──
const DEFAULT_COURIER = {
  name: 'Agus Santoso',
  rating: 4.9,
  trips: '234',
  vehicle: 'Honda Beat · B 4521 KDF',
  avatar: '👨',
}

const FULL_TRACK_PHASES = [
  { id: 'confirmed', label: 'Pesanan Dikonfirmasi',       sub: 'Penjual menerima dan memverifikasi pesanan', icon: '✅' },
  { id: 'preparing', label: 'Pesanan Sedang Disiapkan',  sub: 'Produk sedang dikemas rapi & higienis',       icon: '📦' },
  { id: 'heading',   label: 'GV Man Menuju Toko',        sub: 'Driver meluncur menjemput paket di toko',     icon: '🛵' },
  { id: 'pickup',    label: 'GV Man Mengambil Paket',     sub: 'Paket telah diperiksa & dimuat di motor',     icon: '🛍️' },
  { id: 'onway',     label: 'Dalam Perjalanan ke Lokasimu', sub: 'Driver sedang melaju ke alamat tujuan',   icon: '🛣️' },
  { id: 'arrived',   label: 'Pesanan Tiba di Lokasi!',   sub: 'Paket telah sampai di depan rumah',           icon: '📍' },
]

export function OrderTracking({ order, onBack, onDone }) {
  const [phase, setPhase] = useState(4) // default to 'Dalam Perjalanan' for rich live impression
  const [eta, setEta] = useState(18)
  const [weatherDelay, setWeatherDelay] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [showItemsAccordion, setShowItemsAccordion] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)

  const courier = order?.courier || DEFAULT_COURIER
  const orderId = order?.id || 'GV-20260902'
  const isArrived = phase >= 5

  // Calculate adjusted ETA with weather
  const effectiveEta = isArrived ? 0 : Math.max(2, eta + (weatherDelay ? 10 : 0))

  // Realistic waypoint coordinates on asphalt road curve:
  const WAYPOINTS = [
    { x: 10.5, y: 72 }, // Phase 0: Konfirm (at Store Ibu Sari)
    { x: 26, y: 44 },   // Phase 1: Siap (Packaging)
    { x: 43, y: 31 },   // Phase 2: Jemput (GV Man to store)
    { x: 61, y: 35 },   // Phase 3: Ambil (Package picked up)
    { x: 77, y: 60 },   // Phase 4: Jalan (On the way to home)
    { x: 90, y: 47 },   // Phase 5: Tiba (Arrived at home)
  ]
  const motoPos = WAYPOINTS[phase] || WAYPOINTS[4]
  const progressRatio = phase / 5

  const phaseTimes = [
    '10:18',
    '10:30',
    '10:38',
    '10:45',
    '10:52',
    isArrived ? '11:05' : 'Estimasi 11:05',
  ]

  const currentPhaseObj = FULL_TRACK_PHASES[phase] || FULL_TRACK_PHASES[0]

  const toggleWeather = () => {
    setWeatherDelay((prev) => !prev)
  }

  return (
    <div className="flex flex-col h-full relative bg-[#FAFBF9]">
      {/* Call Simulation Modal */}
      {showCallModal && <PhoneCallModal courier={courier} onClose={() => setShowCallModal(false)} />}

      {/* Chat Simulation Modal */}
      {showChatModal && <CourierChatModal courier={courier} onClose={() => setShowChatModal(false)} />}

      {/* Receipt Confirmation Dialog */}
      {showReceiptDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-2xl">
              📦
            </div>
            <h4 className="text-[16px] font-extrabold text-gray-900">Konfirmasi Terima Pesanan?</h4>
            <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
              Pastikan produk yang diterima dalam kondisi baik, segar, dan sesuai dengan pesananmu.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowReceiptDialog(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-[12px] font-bold text-gray-600 active:scale-95 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowReceiptDialog(false)
                  onDone?.()
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-700 text-white text-[12px] font-bold active:scale-95 transition shadow-md shadow-emerald-700/20"
              >
                Sudah Diterima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 text-gray-700 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <p className="text-[15px] font-extrabold text-gray-900">Lacak Pengiriman</p>
              <p className="text-[11px] text-gray-400 font-medium">{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-emerald-800">LIVE TRACKING</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content (Prioritized Information Hierarchy) */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5 pb-24">
        {/* ── 1. Demo Controls Toolbar ── */}
        <div className="p-3 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Simulasi Alur Pengiriman</span>
            <button
              onClick={toggleWeather}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition active:scale-95 ${
                weatherDelay
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <CloudRain size={12} className={weatherDelay ? 'text-amber-700' : 'text-gray-400'} />
              <span>{weatherDelay ? 'Hujan (+10 mnt)' : 'Simulasi Hujan'}</span>
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {['Konfirm', 'Siap', 'Jemput', 'Ambil', 'Jalan', 'Tiba'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPhase(idx)
                  if (idx === 5) setEta(0)
                  else if (idx === 4) setEta(18)
                  else if (idx === 3) setEta(25)
                  else setEta(35)
                }}
                className={`py-1 rounded-lg text-[10px] font-extrabold transition ${
                  phase === idx
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Weather Alert Banner (Conditional) */}
        {weatherDelay && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 animate-in fade-in">
            <CloudRain size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-bold text-amber-950">Peringatan Cuaca: Hujan di Jalur Pengantaran</p>
              <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                Driver berkendara ekstra hati-hati demi keselamatan paket makanan Anda. Estimasi bertambah +10 menit.
              </p>
            </div>
          </div>
        )}

        {/* ── 2. HERO: Realistic Map Illustration & Estimasi Waktu Tiba ── */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {isArrived ? 'Status Pengantaran' : 'Estimasi Waktu Tiba'}
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {isArrived ? '🎉 Sudah Sampai!' : `${effectiveEta} Menit Lagi`}
              </p>
            </div>
            <span
              className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                isArrived
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isArrived ? 'Tiba di Lokasi' : 'Dalam Pengantaran'}
            </span>
          </div>

          {/* Realistic Cartographic Delivery Map with Terrain, River, Asphalt & Glowing GPS Route */}
          <div
            className="relative h-44 rounded-2xl overflow-hidden border border-emerald-200/70 shadow-inner bg-[#EBF5ED]"
          >
            <svg viewBox="0 0 340 160" className="absolute inset-0 w-full h-full select-none" preserveAspectRatio="none">
              <defs>
                <pattern id="villageGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D1E7D5" strokeWidth="0.6" strokeDasharray="2 2" />
                </pattern>
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Base terrain */}
              <rect width="340" height="160" fill="#E8F4EA" />
              <rect width="340" height="160" fill="url(#villageGrid)" />

              {/* Natural Agriculture & Plantation Zones */}
              <path d="M 0,0 L 110,0 C 95,30 115,55 90,75 L 0,80 Z" fill="#DCFCE7" opacity="0.75" />
              <path d="M 180,0 L 340,0 L 340,65 C 290,50 270,70 230,45 Z" fill="#DCFCE7" opacity="0.6" />
              <path d="M 160,110 C 200,95 240,120 340,105 L 340,160 L 140,160 Z" fill="#DCFCE7" opacity="0.7" />
              <path d="M 0,110 L 80,100 C 65,130 90,150 70,160 L 0,160 Z" fill="#DCFCE7" opacity="0.6" />

              {/* Village River / Canal */}
              <path
                d="M 130,0 C 135,45 105,75 145,115 C 160,130 150,150 165,160"
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 130,0 C 135,45 105,75 145,115 C 160,130 150,150 165,160"
                fill="none"
                stroke="#7DD3FC"
                strokeWidth="2"
                strokeDasharray="4 6"
                opacity="0.8"
              />

              {/* Secondary Local Village Streets */}
              <path d="M 0,40 L 95,40 L 95,110 L 15,110" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M 170,30 L 260,30 L 260,95 L 340,95" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M 115,140 L 240,140 L 240,80" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

              {/* Street Label Watermarks */}
              <text x="45" y="34" fontSize="7" fill="#64748B" fontWeight="700" opacity="0.7" letterSpacing="0.5">Gg. Melati</text>
              <text x="200" y="24" fontSize="7" fill="#64748B" fontWeight="700" opacity="0.7" letterSpacing="0.5">Jl. Sukamaju Raya</text>
              <text x="250" y="145" fontSize="7" fill="#64748B" fontWeight="700" opacity="0.7" letterSpacing="0.5">Kawasan Pertanian</text>

              {/* Main Asphalt Road */}
              <path
                d="M 35 115 C 95 115 80 45 170 50 C 245 55 255 125 305 75"
                fill="none"
                stroke="#334155"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 35 115 C 95 115 80 45 170 50 C 245 55 255 125 305 75"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />

              {/* Glowing Emerald GPS Route */}
              <path
                d="M 35 115 C 95 115 80 45 170 50 C 245 55 255 125 305 75"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="360"
                strokeDashoffset={360 * (1 - progressRatio)}
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                opacity="0.85"
              />
              <path
                d="M 35 115 C 95 115 80 45 170 50 C 245 55 255 125 305 75"
                fill="none"
                stroke="#1B6B3A"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="360"
                strokeDashoffset={360 * (1 - progressRatio)}
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />

              {/* Road White Center Dashes */}
              <path
                d="M 35 115 C 95 115 80 45 170 50 C 245 55 255 125 305 75"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Origin Store Pinpoint */}
              <g transform="translate(35, 115)" filter="url(#pinShadow)">
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                <text x="0" y="4" fontSize="13" textAnchor="middle">🏪</text>
              </g>

              {/* Destination Home Pinpoint */}
              <g transform="translate(305, 75)" filter="url(#pinShadow)">
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.5" />
                <text x="0" y="4" fontSize="13" textAnchor="middle">🏠</text>
              </g>
            </svg>

            {/* Dynamic Motorcycle Pin along realistic asphalt road */}
            <div
              className="absolute pointer-events-none transition-all duration-700 ease-out z-10"
              style={{
                left: `${motoPos.x}%`,
                top: `${motoPos.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-2.5 rounded-full bg-emerald-500/40 animate-ping" />
                <span className="absolute -inset-1 rounded-full bg-emerald-400/60" />
                <div className="w-9 h-9 rounded-full bg-[#1B6B3A] border-2 border-white flex items-center justify-center text-lg shadow-md relative z-10">
                  🏍️
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-md whitespace-nowrap shadow-xs">
                  {courier.name?.split(' ')[0]} · 30 km/j
                </div>
              </div>
            </div>

            {/* Top Overlay HUD */}
            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-extrabold text-emerald-950">GPS AKTIF · RUTE OPTIMAL</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 flex items-center justify-center shadow-xs text-[11px] font-bold text-gray-700">
                🧭
              </div>
            </div>

            {/* Origin & Destination Floating Tags */}
            <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between pointer-events-none">
              <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-gray-200/80 text-[9.5px] font-bold text-gray-700 shadow-2xs">
                🏪 Toko {order?.seller || 'Ibu Sari'}
              </span>
              <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-gray-200/80 text-[9.5px] font-bold text-gray-700 shadow-2xs">
                🏠 Lokasi Tujuan
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50 text-[11px]">
            <div>
              <p className="text-gray-400 font-medium">Titik Penjemputan</p>
              <p className="font-bold text-gray-800">Toko {order?.seller || 'Ibu Sari'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 font-medium">Jarak & Rute</p>
              <p className="font-bold text-emerald-800">
                {isArrived ? 'Sampai di Lokasi' : '1.4 km · ~30 km/jam'}
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Driver Pengantar Card (Prioritas Utama Aksi Pengguna: Telepon & Chat) ── */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Driver Pengantar</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              Driver Terpercaya Desa
            </span>
          </div>

          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              {courier.avatar || '👨'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-extrabold text-gray-900 truncate">{courier.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-[12px] font-bold text-gray-800">{courier.rating}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-400">{courier.trips || '240+'} pengantaran</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{courier.vehicle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setShowCallModal(true)}
              className="py-2.5 px-3 rounded-2xl border-2 border-emerald-700 text-emerald-800 text-[12px] font-bold flex items-center justify-center gap-2 active:scale-95 transition hover:bg-emerald-50/50"
            >
              <Phone size={14} />
              <span>Telepon</span>
            </button>
            <button
              onClick={() => setShowChatModal(true)}
              className="py-2.5 px-3 rounded-2xl bg-emerald-700 text-white text-[12px] font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-md shadow-emerald-700/20 hover:bg-emerald-800"
            >
              <MessageCircle size={14} />
              <span>Chat Driver</span>
            </button>
          </div>
        </div>

        {/* ── 4. Card Proses Pengiriman Lengkap (Stepper Vertikal Sesuai Referensi) ── */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Proses Pengiriman Lengkap
          </p>

          <div className="space-y-0">
            {FULL_TRACK_PHASES.map((p, i) => {
              const isDone = i < phase
              const isCurrent = i === phase
              const isUpcoming = i > phase
              const isLast = i === FULL_TRACK_PHASES.length - 1

              return (
                <div key={p.id} className="flex gap-3.5 relative">
                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className="absolute left-[13px] top-[26px] bottom-[-2px] w-[2px]"
                      style={{
                        background: isDone ? PRIMARY : '#E5E7EB',
                        transition: 'background 0.3s ease',
                      }}
                    />
                  )}

                  {/* Step Node */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-200"
                    style={
                      isDone
                        ? { background: PRIMARY }
                        : isCurrent
                        ? { background: '#fff', border: `2px solid ${PRIMARY}` }
                        : { background: '#F3F4F6' }
                    }
                  >
                    {isDone ? (
                      <Check size={14} className="text-white" strokeWidth={3} />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1B6B3A] animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>

                  {/* Step Details */}
                  <div className={`flex-1 min-w-0 ${isLast ? 'pb-1' : 'pb-5'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-[13.5px] leading-snug ${
                          isDone
                            ? 'font-bold text-gray-900'
                            : isCurrent
                            ? 'font-extrabold text-[#1B6B3A]'
                            : 'font-semibold text-gray-400'
                        }`}
                      >
                        {p.label}
                      </p>
                      <span className="text-[11px] font-mono text-gray-400 flex-shrink-0">
                        {phaseTimes[i]}
                      </span>
                    </div>
                    <p
                      className={`text-[11.5px] mt-0.5 leading-relaxed ${
                        isDone
                          ? 'text-gray-500'
                          : isCurrent
                          ? 'text-gray-600 font-medium'
                          : 'text-gray-300'
                      }`}
                    >
                      {p.sub}
                    </p>
                    {isCurrent && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1B6B3A] animate-pulse" />
                        <span className="text-[11px] font-extrabold text-[#1B6B3A]">
                          Sedang berlangsung
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 5. Rincian Paket yang Dikirim (Accordion Sekunder) ── */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <button
            onClick={() => setShowItemsAccordion((prev) => !prev)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <p className="text-[13px] font-bold text-gray-900">Rincian Paket yang Dikirim</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {order?.items?.length || 2} barang · Total Rp {(order?.total || 37000).toLocaleString('id')}
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              {showItemsAccordion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {showItemsAccordion && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              {(order?.items || [
                {
                  name: 'Bayam Organik Segar',
                  qty: 2,
                  price: 8500,
                  image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
                },
                {
                  name: 'Tempe Mendoan Jumbo',
                  qty: 1,
                  price: 12000,
                  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
                },
              ]).map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200/60">
                      {it.image ? (
                        <img src={it.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={14} className="m-auto text-gray-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold block">{it.name}</span>
                      <span className="text-gray-400 text-[11px]">× {it.qty}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 tabular-nums">
                    Rp {(it.price * it.qty).toLocaleString('id')}
                  </span>
                </div>
              ))}

              <div className="p-2.5 rounded-xl bg-gray-50 text-[11px] text-gray-600 mt-2">
                <p className="font-semibold text-gray-800">Alamat Tujuan:</p>
                <p className="text-gray-500 mt-0.5">
                  {order?.address || 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-20">
        {isArrived ? (
          <button
            onClick={() => setShowReceiptDialog(true)}
            className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white active:scale-95 transition shadow-lg flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
              boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Konfirmasi Pesanan Diterima</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1 py-3 px-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center gap-2.5">
              <Clock size={16} className="text-emerald-700 animate-pulse flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-gray-900 truncate">Dalam Pengantaran...</p>
                <p className="text-[10px] text-gray-500">Estimasi tiba ~{effectiveEta} menit</p>
              </div>
            </div>
            <button
              onClick={() => setPhase(5)}
              className="py-3 px-3.5 rounded-2xl text-[12px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 active:scale-95 transition hover:bg-emerald-100 flex-shrink-0"
              title="Percepat demo sampai tujuan"
            >
              Simulasi Tiba
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add / Edit Product Sheet ───────────────────────────────
function ProductFormSheet({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name:  initial?.name  || '',
    price: initial?.price || '',
    unit:  initial?.unit  || '',
    stock: initial?.stock || '',
    cat:   initial?.cat   || 'Sayur',
    desc:  initial?.desc  || '',
    image: initial?.image || null,
  })
  const fileRef = React.useRef(null)
  const isEdit  = !!initial
  const valid   = form.name.trim() && form.price && form.stock

  const handleImage = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f=>({...f, image: ev.target.result}))
    reader.readAsDataURL(file)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white flex flex-col"
        style={{borderRadius:'20px 20px 0 0',maxHeight:'90%',boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
          <p className="text-[15px] font-extrabold text-gray-900">{isEdit?'Edit Produk':'Tambah Produk'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'#F5F5F5'}}>
            <X size={14} className="text-gray-500"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-4 flex flex-col gap-4">

          {/* Foto Produk */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Foto Produk</p>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{background:'#F5F5F5',border:'1.5px dashed #E0E0E0'}}>
                {form.image
                  ? <img src={form.image} alt="" className="w-full h-full object-cover border border-black/10"/>
                  : <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📷</span>
                      <span className="text-[11px] text-gray-400">Belum ada</span>
                    </div>
                }
              </div>
              {/* Upload button */}
              <div className="flex flex-col gap-2">
                <button onClick={()=>fileRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
                  style={{background:PRIMARY}}>
                  {form.image ? 'Ganti Foto' : 'Upload Foto'}
                </button>
                {form.image && (
                  <button onClick={()=>setForm(f=>({...f,image:null}))}
                    className="px-4 py-2 rounded-xl text-[12px] font-semibold"
                    style={{background:'#FEF2F2',color:'#EF4444'}}>
                    Hapus Foto
                  </button>
                )}
                <p className="text-[11px] text-gray-400">JPG, PNG · Maks. 5 MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage}/>
            </div>
          </div>

          {/* Nama */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Nama Produk *</p>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="cth. Beras Pandan Wangi 5kg"
              className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
              style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
          </div>
          {/* Kategori */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATS.filter(c=>c!=='Semua').map(c=>(
                <button key={c} onClick={()=>setForm(f=>({...f,cat:c}))}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition"
                  style={form.cat===c?{background:PRIMARY,color:'#fff',borderColor:PRIMARY}:{background:'transparent',color:'#6B7280',borderColor:'#E0E0E0'}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Harga + Satuan */}
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-400 mb-2">Harga (Rp) *</p>
              <input value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}
                type="number" placeholder="0"
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
                style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-400 mb-2">Satuan</p>
              <input value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}
                placeholder="cth. kg, pcs"
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
                style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            </div>
          </div>
          {/* Stok */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Stok *</p>
            <input value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))}
              type="number" placeholder="0"
              className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
              style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
          </div>
          {/* Deskripsi */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Deskripsi</p>
            <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}
              placeholder="Ceritakan produkmu kepada pembeli..."
              className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none resize-none"
              style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA',minHeight:72}}/>
          </div>
        </div>
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100">
          <button onClick={()=>valid&&onSave({...form,price:Number(form.price),stock:Number(form.stock)})}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition"
            style={{background:valid?PRIMARY:'#E0E0E0'}}>
            {isEdit?'Simpan Perubahan':'Tambah Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sort Sheet (Opsi 1: Focused Sort Only, Zero Category Duplication) ───
function SortSheet({ currentSort, onSort, onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div
        className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200"
        style={{ maxHeight: '75%' }}
      >
        <div className="flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-3.5" />
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-extrabold text-gray-900">Urutkan Produk</p>
              <p className="text-[11.5px] text-gray-400">Pilih susunan katalog yang paling sesuai</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-95 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="py-2 flex flex-col divide-y divide-gray-50">
          {SORT_OPTIONS.map((s) => {
            const isSelected = currentSort === s.id
            return (
              <button
                key={s.id}
                onClick={() => {
                  onSort(s.id)
                  onClose()
                }}
                className={`flex items-center justify-between py-3 px-2 rounded-xl text-left transition ${
                  isSelected ? 'bg-emerald-50/70 font-extrabold text-emerald-950' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-[13px]">{s.label}</span>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-[#1B6B3A] bg-[#1B6B3A]' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Detail Toko Resmi ESTO (Shopee/Tokopedia Style) ────────────────────────
function StoreDetailScreen({
  store,
  onBack,
  cart,
  onAddToCart,
  onUpdateQty,
  liked,
  onToggleLike,
  onOpenDetail,
  onOpenCart,
  totalCart = 0,
  totalPrice = 0,
}) {
  const [activeStoreTab, setActiveStoreTab] = useState('toko') // 'toko' | 'produk' | 'kategori' | 'ulasan'
  const [storeSort, setStoreSort] = useState('populer') // 'populer' | 'terbaru' | 'terlaris' | 'harga_asc' | 'harga_desc'
  const [storeSearch, setStoreSearch] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [claimedVoucher, setClaimedVoucher] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [selectedCatFilter, setSelectedCatFilter] = useState('Semua')

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }

  // Filter store products
  let displayProducts = (store?.products || []).filter((p) => {
    const matchesSearch = !storeSearch || p.name.toLowerCase().includes(storeSearch.toLowerCase())
    const matchesCat = selectedCatFilter === 'Semua' || p.cat === selectedCatFilter
    return matchesSearch && matchesCat
  })

  if (storeSort === 'harga_asc') {
    displayProducts.sort((a, b) => a.price - b.price)
  } else if (storeSort === 'harga_desc') {
    displayProducts.sort((a, b) => b.price - a.price)
  } else if (storeSort === 'terlaris') {
    displayProducts.sort((a, b) => parseInt(b.sold) - parseInt(a.sold))
  } else if (storeSort === 'terbaru') {
    displayProducts = [...displayProducts].reverse()
  }

  const storeCategories = ['Semua', ...new Set((store?.products || []).map((p) => p.cat))]

  const REVIEWS_DUMMY = [
    {
      id: 1,
      name: 'Rian Hidayat',
      rating: 5,
      date: 'Kemarin',
      comment: 'Barang asli dan tersegel rapi. Pengiriman kilat cuma 25 menit sampai ke rumah. Beras pulen wangi sekali!',
      product: 'Beras Pandan Wangi Premium 5kg',
    },
    {
      id: 2,
      name: 'Siti Aminah',
      rating: 5,
      date: '3 hari lalu',
      comment: 'Minyak goreng sawit jernih, gula pasir kristal bersih. Harga grosir lebih murah dibanding warung biasa.',
      product: 'Minyak Goreng Sawit 2L',
    },
    {
      id: 3,
      name: 'Bambang Sudibyo',
      rating: 5,
      date: '1 minggu lalu',
      comment: 'Pelayanan cepat dan kurir desa ramah. Sangat memudahkan kebutuhan belanja sembako keluarga.',
      product: 'Telur Ayam Kampung (12 butir)',
    },
  ]

  return (
    <div className="h-full flex flex-col bg-[#FAFBF9] relative overflow-hidden">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900/90 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-md animate-fade-in flex items-center gap-2 pointer-events-none">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Fixed Store Header Navigation */}
      <div className="sticky top-0 z-30 bg-[#0C3E1E] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center active:scale-95 transition flex-shrink-0"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[14.5px] font-extrabold truncate text-white leading-tight">
              {store?.name || 'Detail Toko'}
            </h1>
            <p className="text-[10px] text-white/70 truncate flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>{store?.type || 'Kios Resmi ESTO'}</span>
              <span>·</span>
              <span>{store?.region || 'Jawa'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href)
              }
              showToast('Tautan toko disalin!')
            }}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center active:scale-95 transition"
            aria-label="Bagikan"
          >
            <Share2 size={15} className="text-white/80" />
          </button>
          <button
            onClick={onOpenCart}
            className="relative w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center active:scale-95 transition"
            aria-label="Keranjang"
          >
            <ShoppingCart size={15} className="text-white/80" />
            {totalCart > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {totalCart}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: totalCart > 0 ? 80 : 24 }}>
        {/* Store Hero Cover Photo */}
        <div className="relative h-28 w-full overflow-hidden bg-gray-900">
          <img
            src={store?.coverImage || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop'}
            alt={store?.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Store Profile Card (Floats over hero banner) */}
        <div className="px-3.5 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              {/* Logo Squircle */}
              <div
                className="w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm flex-shrink-0"
                style={{ background: store?.logoBg || 'linear-gradient(135deg, #1B6B3A, #2E7D32)' }}
              >
                {store?.logoText || 'GV'}
              </div>

              {/* Store Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-[15px] font-extrabold text-gray-900 leading-tight">
                    {store?.name}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-0.5">
                    <ShieldCheck size={10} />
                    {store?.type || 'Resmi'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {store?.rating}
                  </span>
                  <span>·</span>
                  <span>{store?.soldCount}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1.5 font-medium">
                  <span className="flex items-center gap-1">
                    <Zap size={11} className="text-amber-500" />
                    {store?.eta || '30 mnt'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={11} className="text-gray-400" />
                    {store?.distance || '2 km'} ({store?.address})
                  </span>
                </div>
              </div>
            </div>

            {/* Store Bio / Description */}
            {store?.desc && (
              <p className="text-[11.5px] text-gray-600 leading-relaxed bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                {store.desc}
              </p>
            )}

            {/* Actions: Follow + Chat */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsFollowing(!isFollowing)
                  showToast(isFollowing ? 'Batal mengikuti toko' : 'Berhasil mengikuti toko!')
                }}
                className={`py-2 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 border border-gray-200'
                    : 'bg-[#1B6B3A] text-white shadow-xs'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check size={14} />
                    <span>Mengikuti</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Ikuti Toko</span>
                  </>
                )}
              </button>

              <button
                onClick={() => showToast('Membuka obrolan resmi dengan penjual...')}
                className="py-2 rounded-xl text-[12px] font-extrabold border border-[#1B6B3A] text-[#1B6B3A] bg-emerald-50/40 hover:bg-emerald-50 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <MessageCircle size={14} />
                <span>Chat Penjual</span>
              </button>
            </div>
          </div>
        </div>

        {/* Store Voucher Strip */}
        <div className="px-3.5 pt-3">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-2.5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Ticket size={14} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11.5px] font-extrabold leading-tight truncate">
                  {store?.promoText || 'Diskon s/d Rp15.000'}
                </p>
                <p className="text-[9.5px] text-white/90">Klaim voucher khusus di toko ini</p>
              </div>
            </div>
            <button
              onClick={() => {
                setClaimedVoucher(true)
                showToast('Voucher berhasil diklaim!')
              }}
              disabled={claimedVoucher}
              className={`px-3 py-1 rounded-xl text-[10.5px] font-black transition active:scale-95 flex-shrink-0 ${
                claimedVoucher
                  ? 'bg-white/30 text-white cursor-default'
                  : 'bg-white text-orange-600 shadow-xs'
              }`}
            >
              {claimedVoucher ? 'Klaim ✓' : 'Klaim'}
            </button>
          </div>
        </div>

        {/* Store Tabs: [Toko, Produk, Kategori, Ulasan] */}
        <div className="px-3.5 pt-3">
          <div className="bg-white rounded-xl p-1 shadow-2xs border border-gray-100 flex items-center gap-1">
            {[
              { id: 'toko', label: 'Toko' },
              { id: 'produk', label: `Produk (${store?.products?.length || 0})` },
              { id: 'kategori', label: 'Kategori' },
              { id: 'ulasan', label: 'Ulasan (4.9)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveStoreTab(t.id)}
                className={`flex-1 py-2 text-center rounded-lg text-[11.5px] font-bold transition ${
                  activeStoreTab === t.id
                    ? 'bg-[#1B6B3A] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Toko & Tab 2: Produk */}
        {(activeStoreTab === 'toko' || activeStoreTab === 'produk') && (
          <div className="px-3.5 pt-3">
            {/* Search inside store */}
            <div className="mb-2.5">
              <SearchBar
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                onClear={() => setStoreSearch('')}
                placeholder={`Cari di ${store?.name}...`}
                className="w-full bg-white border border-gray-200/90 shadow-2xs text-[12px]"
              />
            </div>

            {/* Sub-sort chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
              {[
                { id: 'populer', label: 'Populer' },
                { id: 'terbaru', label: 'Terbaru' },
                { id: 'terlaris', label: 'Terlaris' },
                { id: 'harga_asc', label: 'Harga: Terendah' },
                { id: 'harga_desc', label: 'Harga: Tertinggi' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStoreSort(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                    storeSort === s.id
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Category filter if multiple categories */}
            {storeCategories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5">
                {storeCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCatFilter(c)}
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold whitespace-nowrap transition ${
                      selectedCatFilter === c
                        ? 'bg-[#1B6B3A] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Product Grid */}
            {displayProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-sm font-semibold">Tidak ada produk ditemukan</p>
                <button
                  onClick={() => {
                    setStoreSearch('')
                    setSelectedCatFilter('Semua')
                  }}
                  className="mt-2 text-xs text-[#1B6B3A] font-bold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-4">
                {displayProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    inCartQty={cart[p.id] || 0}
                    isLiked={liked.has(p.id)}
                    onToggleLike={onToggleLike}
                    onOpenDetail={onOpenDetail}
                    onAddToCart={onAddToCart}
                    onUpdateQty={onUpdateQty}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Kategori */}
        {activeStoreTab === 'kategori' && (
          <div className="px-3.5 pt-3 pb-6 flex flex-col gap-2.5">
            {storeCategories.filter(c => c !== 'Semua').map((cat) => {
              const catCount = (store?.products || []).filter(p => p.cat === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCatFilter(cat)
                    setActiveStoreTab('produk')
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs flex items-center justify-between hover:bg-gray-50 active:scale-[0.99] transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B6B3A] flex items-center justify-center font-bold text-sm">
                      {cat[0]}
                    </div>
                    <div>
                      <p className="text-[13.5px] font-extrabold text-gray-900">{cat}</p>
                      <p className="text-[11px] text-gray-400">{catCount} produk siap dikirim</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              )
            })}
          </div>
        )}

        {/* Tab 4: Ulasan */}
        {activeStoreTab === 'ulasan' && (
          <div className="px-3.5 pt-3 pb-6 flex flex-col gap-3">
            {/* Rating Summary Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-900 leading-none">
                    {store?.rating || 4.9}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-gray-200" />
                <div>
                  <p className="text-[12.5px] font-extrabold text-gray-900">99% Pembeli Puas</p>
                  <p className="text-[11px] text-gray-500">Berdasarkan ulasan terverifikasi</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
                Puas
              </span>
            </div>

            {/* Review List */}
            <div className="flex flex-col gap-2.5">
              {REVIEWS_DUMMY.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {rev.name[0]}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-gray-900 leading-tight">{rev.name}</p>
                        <p className="text-[9.5px] text-gray-400">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-[11.5px] text-gray-700 leading-relaxed mt-1">
                    "{rev.comment}"
                  </p>

                  <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-1 text-[10px] text-gray-400">
                    <span>Produk:</span>
                    <span className="font-semibold text-gray-600 truncate">{rev.product}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCart > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg max-w-md mx-auto">
          <button
            onClick={onOpenCart}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-between px-5 shadow-lg active:scale-95 transition"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
              boxShadow: '0 4px 14px rgba(27,107,58,0.3)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart size={18} />
              <span>Lihat Keranjang ({totalCart})</span>
            </div>
            <span className="tabular-nums font-extrabold text-[15px]">
              Rp {totalPrice.toLocaleString('id')}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Screen ────────────────────────────────────────────
export default function Pasar({ navigate, userProfile, initialTab }) {
  const [showEmptyCart, setEmptyCart] = useState(false)
  const [paymentMethod, setPayMethod] = useState('gvpay')
  const { orders: buyerOrders, cancelOrder, updateOrder } = useBuyerOrders()
  const [orderDetailSheet, setOrderDetail] = useState(null)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [orderToRate, setOrderToRate] = useState(null)
  const [orderFilter, setOrderFilter] = useState('all')
  const [selectedCats, setSelectedCats] = useState([])
  const [searchQ, setSearchQ] = useState('')
  const [sortBy, setSortBy] = useState('terlaris')
  const [showSort, setShowSort] = useState(false)
  const [cart, setCart] = useState({})
  const [liked, setLiked] = useState(new Set())
  const [detail, setDetail] = useState(null)
  const [detailQty, setDQty] = useState(1)
  const [screen, setScreen] = useState('list') // 'list' | 'cart' | 'checkout' | 'payment' | 'success' | 'tracking'
  const [bannerIdx, setBannerIdx] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  // Auto-advance promo banners every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % BANNERS_ESTO.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // E-commerce ESTO States
  const [selectedStore, setSelectedStore] = useState(null)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showAllStores, setShowAllStores] = useState(false)
  const [voucherClaimed, setVoucherClaimed] = useState(false)

  // Order routing details
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null)
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null)
  const [checkoutData, setCheckoutData] = useState(null)
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_ADDRESSES[0]?.id || 1)

  const isSeller = userProfile?.capabilities?.includes('Penjual')

  // Filter + search + sort (for community products in Produk dari Penjual)
  const communityProducts = PRODUCTS
    .filter(p => !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.seller.toLowerCase().includes(searchQ.toLowerCase()))

  const filtered = PRODUCTS
    .filter(p => selectedCats.length === 0 || selectedCats.includes(p.cat))
    .filter(p => !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.seller.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a,b) => {
      if (sortBy === 'harga_asc')  return a.price - b.price
      if (sortBy === 'harga_desc') return b.price - a.price
      if (sortBy === 'rating')     return b.rating - a.rating
      return parseInt(b.sold) - parseInt(a.sold) // terlaris
    })

  const totalCart = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(cart).reduce((s, [id, q]) => {
    const p = ALL_PRODUCTS.find(x => x.id === parseInt(id))
    return s + (p?.price || 0) * q
  }, 0)

  const addToCart = (id, qty = 1) => {
    const p = ALL_PRODUCTS.find(x => x.id === Number(id))
    if (!p || p.stock === 0) return
    setCart((prev) => {
      const current = prev[id] || 0
      const next = Math.min(p.stock, current + qty)
      return { ...prev, [id]: next }
    })
  }

  const updateCartQty = (id, qty) => {
    setCart((prev) => {
      if (qty <= 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: qty }
    })
  }

  const removeCartItem = (id) => {
    setCart((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const toggleLike = (id) => setLiked(p => {
    const n = new Set(p)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  const openDetail = (p) => {
    setDetail(p)
    setDQty(1)
  }

  const checkoutItems = Object.entries(cart)
    .map(([id, qty]) => {
      const p = ALL_PRODUCTS.find(x => x.id === Number(id))
      return p ? { ...p, qty } : null
    })
    .filter(Boolean)

  // Handle Order Cancellation with instant refund
  const handleConfirmCancelOrder = (orderId, reason) => {
    cancelOrder(orderId, reason)
    setOrderToCancel(null)
    if (orderDetailSheet && orderDetailSheet.id === orderId) {
      setOrderDetail(null)
    }
  }

  // --- Sub-Screen Routing ---
  if (screen === 'cart') {
    return (
      <CartScreen
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onCheckout={() => setScreen('checkout')}
        onBack={() => setScreen('list')}
        onBrowse={() => setScreen('list')}
        allProducts={ALL_PRODUCTS}
      />
    )
  }

  if (screen === 'checkout') {
    return (
      <CheckoutScreen
        items={checkoutItems}
        userProfile={userProfile}
        addresses={addresses}
        setAddresses={setAddresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        onBack={() => setScreen('cart')}
        onConfirm={(method, payload) => {
          setPayMethod(method)
          setCheckoutData(typeof payload === 'object' && payload !== null ? payload : { method, total: payload })
          setScreen('payment')
        }}
      />
    )
  }

  if (screen === 'payment') {
    const totalAmount = checkoutData?.total || (checkoutItems.reduce((s, i) => s + i.price * i.qty, 0) + 8000)
    return (
      <PaymentFlow
        method={paymentMethod}
        total={totalAmount}
        onBack={() => setScreen('checkout')}
        onComplete={() => {
          const nowStr = new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })
          const createdOrder = {
            id: `GV-${Date.now().toString().slice(-8)}`,
            date: `Hari ini, ${nowStr}`,
            seller: checkoutData?.items?.[0]?.seller || checkoutItems[0]?.seller || 'Penjual Pasar ESTO',
            payment: { gvpay: 'GV Pay', qris: 'QRIS', transfer: 'Transfer Bank', cod: 'Bayar di Tempat' }[paymentMethod] || 'GV Pay',
            delivery: checkoutData?.delivery === 'pickup' ? 'Ambil Sendiri di Toko' : checkoutData?.delivery === 'kilat' ? 'Pengiriman Kilat Desa (GV Man Express)' : 'Pengiriman Reguler Desa (GV Man)',
            address: checkoutData?.address || 'Jl. Melati No. 14, RT 02 / RW 04, Desa Sukamaju',
            recipientName: checkoutData?.recipientName || userProfile?.name || 'Warga GV',
            recipientPhone: checkoutData?.recipientPhone || '0812-3456-7890',
            note: checkoutData?.note || '',
            total: totalAmount,
            status: 'confirmed',
            items: (checkoutData?.items && checkoutData.items.length > 0)
              ? checkoutData.items
              : (checkoutItems.length > 0 ? checkoutItems : [{ name: 'Bayam Organik Segar', qty: 2, price: 8500 }]),
            courier: {
              name: 'Agus Santoso',
              rating: 4.9,
              trips: '234',
              vehicle: 'Honda Beat · B 4521 KDF',
              avatar: '👨',
            },
            timeline: [
              { s: 'waiting', time: nowStr, label: 'Pesanan dibuat & diverifikasi' },
              { s: 'confirmed', time: nowStr, label: 'Pembayaran sukses, penjual mengonfirmasi' },
            ],
          }
          addBuyerOrder(createdOrder)
          setLastCreatedOrder(createdOrder)
          setCart({})
          setScreen('success')
        }}
      />
    )
  }

  if (screen === 'success') {
    return (
      <OrderSuccessScreen
        order={lastCreatedOrder}
        onTrack={() => {
          setActiveTrackingOrder(lastCreatedOrder)
          setScreen('tracking')
        }}
        onHistory={() => {
          if (navigate) {
            navigate('profile-pesanan')
          } else {
            setScreen('list')
          }
        }}
      />
    )
  }

  if (screen === 'tracking') {
    const orderToTrack = activeTrackingOrder || buyerOrders.find((o) => o.status === 'shipped') || buyerOrders[0]
    return (
      <OrderTracking
        order={orderToTrack}
        onBack={() => {
          setScreen('list')
        }}
        onDone={() => {
          if (orderToTrack) {
            updateOrder(orderToTrack.id, { status: 'done' })
          }
          if (navigate) {
            navigate('profile-pesanan')
          } else {
            setScreen('list')
          }
        }}
      />
    )
  }

  // Store Detail View
  if (selectedStore) {
    return (
      <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
        <StoreDetailScreen
          store={selectedStore}
          onBack={() => setSelectedStore(null)}
          cart={cart}
          onAddToCart={addToCart}
          onUpdateQty={updateCartQty}
          liked={liked}
          onToggleLike={toggleLike}
          onOpenDetail={openDetail}
          onOpenCart={() => {
            setSelectedStore(null)
            setScreen('cart')
          }}
          totalCart={totalCart}
          totalPrice={totalPrice}
        />

        {/* Product detail bottom sheet inside Store view if detail opened */}
        {detail && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} />
            <div
              className="relative bg-white rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col"
              style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.2)' }}
            >
              <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mt-3 mb-2 flex-shrink-0" />
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={getProductImage(detail)}
                    alt={detail.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
                    }}
                  />
                  <button
                    onClick={() => toggleLike(detail.id)}
                    className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
                  >
                    <Heart
                      size={18}
                      className={liked.has(detail.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[17px] font-black text-gray-900">{detail.name}</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {detail.cat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-semibold">
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {detail.rating || 4.8}
                    </span>
                    <span>·</span>
                    <span>{detail.sold || '100+'} terjual</span>
                    <span>·</span>
                    <span>Toko: {detail.seller}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-[20px] font-black text-[#1B6B3A]">
                    Rp {detail.price?.toLocaleString('id')}
                  </span>
                  {detail.orig && (
                    <span className="text-xs text-gray-400 line-through">
                      Rp {detail.orig?.toLocaleString('id')}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">/{detail.unit}</span>
                </div>

                <p className="text-[12.5px] text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                  {detail.desc || 'Kualitas terjamin asli dan segar.'}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-700">Jumlah Pembelian</span>
                  <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl">
                    <button
                      onClick={() => setDQty(Math.max(1, detailQty - 1))}
                      className="text-gray-600 hover:text-black font-extrabold"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="text-sm font-extrabold tabular-nums text-gray-900 w-5 text-center">
                      {detailQty}
                    </span>
                    <button
                      onClick={() => setDQty(Math.min(detail.stock, detailQty + 1))}
                      className="text-[#1B6B3A] font-extrabold"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-100 bg-white flex gap-3 flex-shrink-0 pb-6">
                <button
                  onClick={() => {
                    addToCart(detail.id, detailQty)
                    setDetail(null)
                  }}
                  className="flex-1 py-3 rounded-2xl text-[13px] font-extrabold border-2 active:scale-95 transition"
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  + Keranjang
                </button>
                <button
                  onClick={() => {
                    addToCart(detail.id, detailQty)
                    setDetail(null)
                    setSelectedStore(null)
                    setScreen('checkout')
                  }}
                  className="flex-1 py-3 rounded-2xl text-[13px] font-extrabold text-white active:scale-95 transition shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)' }}
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </ScreenBackground>
    )
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">

      {/* Sort sheet (Opsi 1: Dedicated sort sheet) */}
      {showSort && (
        <SortSheet
          currentSort={sortBy}
          onSort={setSortBy}
          onClose={() => setShowSort(false)}
        />
      )}

      {/* Cancel Order Modal */}
      {orderToCancel && (
        <CancelOrderModal
          order={orderToCancel}
          onClose={() => setOrderToCancel(null)}
          onConfirm={handleConfirmCancelOrder}
        />
      )}

      {/* Empty cart sheet */}
      {showEmptyCart && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEmptyCart(false)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-5 pb-10"
            style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.15)' }}>
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#F5F5F5' }}>
                <ShoppingCart size={32} className="text-gray-300" />
              </div>
              <p className="text-[16px] font-extrabold text-gray-900 mb-2">Keranjang belanja kosong</p>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
                Belum ada produk yang ditambahkan. Yuk, temukan produk segar langsung dari petani desa!
              </p>
              <button onClick={() => setEmptyCart(false)}
                className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white shadow-md"
                style={{ background: PRIMARY }}>
                Mulai Belanja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified ScreenHeader */}
      {/* ── Dynamic Collapsible ESTO Header ── */}
      <header
        className="flex-shrink-0 relative select-none z-30 transition-all duration-300 ease-out shadow-md"
        style={{
          background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)',
          boxShadow: isScrolled
            ? '0 4px 20px rgba(12, 62, 30, 0.35)'
            : '0 2px 12px rgba(12, 62, 30, 0.2)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-10 -end-10 w-40 h-40 rounded-full pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)',
          }}
        />

        <div className={`relative px-4 z-10 transition-all duration-300 ease-out ${isScrolled ? 'pt-2.5 pb-2.5' : 'pt-3.5 pb-3'}`}>
          {/* Top Title & Actions Bar: Smoothly collapses on scroll */}
          <div
            className={`flex items-center justify-between transition-all duration-300 ease-out overflow-hidden ${
              isScrolled
                ? 'max-h-0 opacity-0 -translate-y-3 mb-0 pointer-events-none'
                : 'max-h-14 opacity-100 translate-y-0 mb-2.5'
            }`}
          >
            <div className="min-w-0">
              <h1 className="text-[20px] font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                ESTO
              </h1>
            </div>

            {/* Action Buttons: Wishlist & Cart */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.14)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onClick={() => setShowWishlist(true)}
                aria-label="Wishlist Produk Favorit"
              >
                <Heart
                  size={16}
                  className={liked.size > 0 ? 'text-red-400 fill-red-400' : 'text-white/80'}
                />
                {liked.size > 0 && (
                  <span
                    className="absolute -top-1 -end-1 w-4 h-4 rounded-full text-white text-[10px] font-black flex items-center justify-center tabular-nums bg-red-500"
                    style={{ boxShadow: '0 0 0 2px #0C3E1E' }}
                  >
                    {liked.size}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.14)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                onClick={() => setScreen('cart')}
                aria-label="Keranjang Belanja"
              >
                <ShoppingCart size={16} className="text-white/80" />
                {totalCart > 0 && (
                  <span
                    className="absolute -top-1 -end-1 w-4 h-4 rounded-full text-white text-[10px] font-black flex items-center justify-center tabular-nums"
                    style={{
                      background: '#EF4444',
                      boxShadow: '0 0 0 2px #0C3E1E',
                    }}
                  >
                    {totalCart}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sticky Search Bar Row: ALWAYS visible! */}
          <div className="w-full">
            <SearchBar
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onClear={() => setSearchQ('')}
              variant="surface"
              placeholder="Cari produk desa di ESTO..."
              className="w-full bg-white border border-gray-200/90 shadow-2xs rounded-2xl"
            />
          </div>
        </div>
      </header>

      {/* Main E-Commerce Catalog & Promotions */}
      <div
        onScroll={(e) => {
          const scrolled = e.currentTarget.scrollTop > 35
          if (scrolled !== isScrolled) {
            setIsScrolled(scrolled)
          }
        }}
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ paddingBottom: totalCart > 0 ? 80 : 20 }}
      >
        {/* Promo banners with high-impact image display & integrated pagination */}
        <div className="px-3.5 pt-2.5 pb-1.5">
          <div
            className="rounded-3xl overflow-hidden h-44 sm:h-48 relative cursor-pointer shadow-md active:scale-[0.99] transition-all duration-300 group"
            style={{
              background: `linear-gradient(135deg, ${BANNERS_ESTO[bannerIdx].g[0]}, ${BANNERS_ESTO[bannerIdx].g[1]})`,
            }}
          >
            {/* Background Promotional Image with Zoom Effect */}
            {BANNERS_ESTO[bannerIdx].image && (
              <img
                src={BANNERS_ESTO[bannerIdx].image}
                alt={BANNERS_ESTO[bannerIdx].title}
                key={BANNERS_ESTO[bannerIdx].id}
                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500 transform group-hover:scale-105 transition-transform duration-700"
              />
            )}

            {/* Gradient Overlays for High Legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, ${BANNERS_ESTO[bannerIdx].g[0]}F2 0%, ${BANNERS_ESTO[bannerIdx].g[1]}B3 55%, rgba(0,0,0,0.2) 100%)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Banner Promotional Content (Clean Visual Poster Format) */}
            <div className="absolute inset-0 flex flex-col justify-between p-4.5 sm:p-5 z-10">
              {/* Content Headline & Subtitle with Enhanced Readability */}
              <div className="flex-1 flex flex-col justify-center max-w-[280px] sm:max-w-[320px]">
                <h3 className="text-white font-black text-[17px] sm:text-[19px] leading-tight tracking-tight drop-shadow-md">
                  {BANNERS_ESTO[bannerIdx].title}
                </h3>
                <p className="text-white/90 text-[11.5px] sm:text-[12px] mt-1.5 line-clamp-2 leading-relaxed font-medium drop-shadow-sm">
                  {BANNERS_ESTO[bannerIdx].sub}
                </p>
              </div>

              {/* Bottom Row: Minimalist Floating Pagination Dots */}
              <div className="flex items-center justify-end pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-xs">
                  {BANNERS_ESTO.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        setBannerIdx(i)
                      }}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === bannerIdx ? 18 : 5,
                        background: i === bannerIdx ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                      }}
                      aria-label={`Banner slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Quick Voucher Strip (Image 5) */}
          <div className="px-3.5 pt-1 pb-2">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-2.5 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  <Ticket size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-extrabold leading-tight truncate">VOUCHER DISKON 50%</p>
                  <p className="text-[10px] text-white/90">s.d. Rp15.000 Min. Belanja Rp0</p>
                </div>
              </div>
              <button
                onClick={() => setVoucherClaimed(true)}
                disabled={voucherClaimed}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition active:scale-95 flex-shrink-0 ${
                  voucherClaimed
                    ? 'bg-white/30 text-white cursor-default'
                    : 'bg-white text-orange-600 shadow-xs'
                }`}
              >
                {voucherClaimed ? 'Klaim ✓' : 'Klaim'}
              </button>
            </div>
          </div>

          {/* ── Section Toko Pilihan (Image 2) ── */}
          <div className="pt-2 pb-2">
            <div className="px-3.5 flex items-center justify-between mb-2">
              <div>
                <h3 className="text-[14px] font-extrabold text-gray-900 leading-tight">
                  Toko Pilihan
                </h3>
                <p className="text-[11px] text-gray-500">
                  Kios & Grosir Resmi ESTO terdekat siap antar kilat
                </p>
              </div>
            </div>

            <div className="px-3.5 flex flex-col gap-3">
              {(showAllStores ? ESTO_STORES : ESTO_STORES.slice(0, 2)).map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onSelectStore={(s) => setSelectedStore(s)}
                  onSelectProduct={(product) => openDetail(product)}
                />
              ))}

              {/* Cek Toko Lainnya Toggle Button */}
              <button
                onClick={() => setShowAllStores(!showAllStores)}
                className="w-full py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-[12px] font-extrabold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-gray-50 active:scale-[0.99] transition mt-0.5"
              >
                <span>{showAllStores ? 'TAMPILKAN LEBIH SEDIKIT' : 'CEK TOKO LAINNYA'}</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform duration-200 ${showAllStores ? '-rotate-90' : 'rotate-90'}`}
                />
              </button>
            </div>
          </div>

          {/* ── Section Produk dari Penjual (Image 3) ── */}
          <div className="pt-3 pb-2">
            <div className="px-3.5 mb-2.5">
              <h3 className="text-[14px] font-extrabold text-gray-900 leading-tight">
                Produk dari Penjual
              </h3>
              <p className="text-[11px] text-gray-500">
                Pangan & olahan segar dari warga komunitas desa
              </p>
            </div>

            {/* Empty state for search */}
            {communityProducts.length === 0 && (
              <div className="py-12 text-center px-8 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl mb-2">
                  🔍
                </div>
                <p className="text-[13.5px] font-extrabold text-gray-900 mb-1">
                  Produk tidak ditemukan
                </p>
                <p className="text-[11.5px] text-gray-400 max-w-xs leading-relaxed mb-3">
                  Coba kata kunci lain untuk mencari produk dari penjual desa.
                </p>
                <button
                  onClick={() => setSearchQ('')}
                  className="px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 active:scale-95 transition"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* Product grid with ProductCard Molecule */}
            <div className="grid grid-cols-2 gap-3 px-3.5 pb-4">
              {communityProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  inCartQty={cart[p.id] || 0}
                  isLiked={liked.has(p.id)}
                  onToggleLike={toggleLike}
                  onOpenDetail={openDetail}
                  onAddToCart={(id, qty) => addToCart(id, qty)}
                  onUpdateQty={(id, qty) => updateCartQty(id, qty)}
                />
              ))}
            </div>
          </div>
        </div>

      {/* Sticky Cart Summary Bar */}
      {totalCart > 0 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
          <button
            onClick={() => setScreen('cart')}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-between px-5 shadow-lg active:scale-95 transition"
            style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)', boxShadow: '0 4px 14px rgba(27,107,58,0.3)' }}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart size={18} />
              <span>Lihat Keranjang ({totalCart})</span>
            </div>
            <span className="tabular-nums font-extrabold text-[15px]">
              Rp {totalPrice.toLocaleString('id')}
            </span>
          </button>
        </div>
      )}

      {/* Product Detail Bottom Sheet (confined to PhoneFrame) */}
      {detail && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in cursor-pointer"
            onClick={() => setDetail(null)}
          />
          <div className="relative bg-white flex flex-col rounded-t-3xl max-h-[85%] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 z-10">
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-gray-200" />
            </div>

            <div className="overflow-y-auto no-scrollbar px-5 pb-6">
              {/* Product hero banner */}
              <div
                className="rounded-2xl h-48 flex items-center justify-center shadow-inner mb-4 relative overflow-hidden"
                style={{
                  background: detail.image
                    ? 'transparent'
                    : detail.g
                    ? `linear-gradient(135deg, ${detail.g[0]} 0%, ${detail.g[1]} 100%)`
                    : '#F5F5F5',
                }}
              >
                {detail.image ? (
                  <img
                    src={detail.image}
                    alt={detail.name}
                    className="w-full h-full object-cover"
                  />
                ) : detail.Icon ? (
                  <detail.Icon
                    size={64}
                    className="text-white drop-shadow-md relative z-10"
                    strokeWidth={1.5}
                  />
                ) : (
                  <Package size={64} className="text-gray-400" />
                )}

                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="absolute top-3 start-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition text-gray-700"
                >
                  <X size={16} />
                </button>

                <span
                  className={`absolute top-3 end-3 text-xs font-extrabold px-3 py-1 rounded-xl shadow-xs ${
                    detail.stock === 0
                      ? 'bg-red-600 text-white'
                      : detail.stock <= 3
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white/95 text-emerald-800'
                  }`}
                >
                  {detail.stock === 0
                    ? 'Stok Habis'
                    : `Stok: ${detail.stock} (${detail.unit})`}
                </span>
              </div>

              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2 leading-snug">
                {detail.name}
              </h2>

              {/* Seller details badge */}
              <div className="flex items-center gap-3 pb-3 mb-3.5 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100 font-extrabold text-emerald-800 text-[14px] shadow-2xs">
                  {detail.seller[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-bold text-gray-900">{detail.seller}</p>
                  <p className="text-[11px] text-gray-400">Desa Sukamaju · Petani Mitra Resmi ESTO</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11.5px] font-bold text-gray-800">
                    {detail.rating} ({detail.sold})
                  </span>
                </div>
              </div>

              {/* Low stock alert */}
              {detail.stock > 0 && detail.stock <= 3 && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 mb-3.5 flex items-center gap-2.5 text-[11.5px] text-amber-900 font-bold">
                  <AlertTriangle size={16} className="text-amber-700 flex-shrink-0" />
                  <span>Sisa {detail.stock} unit lagi! Segera pesan sebelum kehabisan.</span>
                </div>
              )}

              {/* Out of stock alert */}
              {detail.stock === 0 && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 mb-3.5 flex items-center gap-3 text-[12px] text-red-700 font-bold">
                  <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
                  <div>
                    <p>Produk Ini Sedang Habis</p>
                    <p className="text-[11px] font-normal text-red-600/90 mt-0.5">
                      Penjual sedang menyiapkan panen berikutnya. Silakan cek produk sejenis lainnya.
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-[12.5px] text-gray-600 leading-relaxed mb-4">{detail.desc}</p>

              {/* Trust Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 mb-5 text-[11.5px] text-emerald-900 font-medium">
                <ShieldCheck size={18} className="text-emerald-700 flex-shrink-0" />
                <span>Jaminan Panen Segar & 100% Produk Asli Desa Tanpa Bahan Pengawet</span>
              </div>

              {/* Price & Quantity Stepper */}
              <div className="flex items-center justify-between pt-1 mb-2">
                <div>
                  <p className="text-2xl font-black tabular-nums text-[#1B6B3A]">
                    Rp {detail.price.toLocaleString('id')}
                  </p>
                  <p className="text-[11.5px] text-gray-400 font-medium">per {detail.unit}</p>
                </div>

                {detail.stock > 0 && (
                  <div className="flex items-center gap-2 bg-emerald-50/70 p-1 rounded-2xl border border-emerald-200/80">
                    <button
                      onClick={() => setDQty((q) => Math.max(1, q - 1))}
                      disabled={detailQty <= 1}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 ${
                        detailQty <= 1
                          ? 'bg-white text-gray-300 border border-gray-200'
                          : 'bg-white text-emerald-800 border border-emerald-600 shadow-2xs'
                      }`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-[16px] font-black text-emerald-950 w-7 text-center tabular-nums">
                      {detailQty}
                    </span>
                    <button
                      onClick={() => setDQty((q) => Math.min(detail.stock, q + 1))}
                      disabled={detailQty >= detail.stock}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition active:scale-95 shadow-2xs ${
                        detailQty >= detail.stock
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#1B6B3A]'
                      }`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Bottom Actions inside Bottom Sheet */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3 flex-shrink-0 pb-6">
              {detail.stock === 0 ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl text-[13px] font-extrabold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                >
                  Stok Habis
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      addToCart(detail.id, detailQty)
                      setDetail(null)
                    }}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-extrabold border-2 active:scale-95 transition"
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                  >
                    + Keranjang
                  </button>
                  <button
                    onClick={() => {
                      addToCart(detail.id, detailQty)
                      setDetail(null)
                      setScreen('checkout')
                    }}
                    className="flex-1 py-3.5 rounded-2xl text-[13px] font-extrabold text-white active:scale-95 transition shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                    }}
                  >
                    Beli Sekarang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Wishlist Drawer Sheet */}
      <WishlistSheet
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlistIds={Array.from(liked)}
        allProducts={ALL_PRODUCTS}
        onRemoveFavorite={toggleLike}
        onAddToCart={(p) => {
          addToCart(p.id, 1)
        }}
        onOpenDetail={(p) => openDetail(p)}
      />

      <BottomNav active="pasar" navigate={navigate} />
    </ScreenBackground>
  )
}
