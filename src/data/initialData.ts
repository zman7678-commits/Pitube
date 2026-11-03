import { MediaPost, MarketData, Transaction, UserProfile } from '../types';

// Real CoinMarketCap & CoinGecko market price for Pi Network: ~$0.078 USD ≈ Rp 1.415 IDR
export const initialMarketData: MarketData = {
  currency: 'IDR',
  piPriceIdr: 1415,
  piPriceUsd: 0.078,
  change24h: 3.82,
  high24h: 1485,
  low24h: 1360,
  marketCapIdr: 96500000000,
  volume24hIdr: 4820000000,
  rank: 2845,
  lastUpdated: 'Live CoinMarketCap'
};

export const initialUserProfile: UserProfile = {
  id: 'user_pioneer_01',
  name: 'Pioneer Baru',
  handle: '@pioneerbaru',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  bio: 'Pioneer baru di pi Tube ⚡ Nonton video seru sambil kumpulin Pi Coin dari nol setiap hari!',
  isKycVerified: true,
  // STRICT ZERO BALANCE REQUIREMENT FOR NEW USERS
  piBalance: 0.0000,
  idrBalance: 0,
  totalWatchedCount: 0,
  totalPiEarned: 0.0000,
  referralCode: 'PITUBE-BARU01',
  piWalletAddress: 'GDN...PI000ZERO1234567890QWERTYUIOP',
  followersCount: 0,
  followingCount: 0,
  dailyCheckedIn: false,
  isRegistered: false,
};

// Reward calibrated: ~0.0015 Pi per video watch cycle (min 3 weeks of regular watching to earn 1 Pi)
export const initialPosts: MediaPost[] = [
  {
    id: 'post_video_1',
    type: 'video',
    title: '🔥 Info Pi Network Mainnet & Cara Tarik Rupiah!',
    description: 'Panduan lengkap cara nonton video di pi Tube dapat coin Pi dan konversi langsung ke rekening Rupiah & e-Wallet lokal #piNetwork #piTube #cryptoIndonesia #cuan',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=800&q=80',
    creator: {
      name: 'Crypto Pioneer ID',
      handle: '@cryptopioneer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    likes: 12450,
    isLiked: false,
    commentsCount: 389,
    sharesCount: 1280,
    rewardPiPerView: 0.0015,
    tags: ['piNetwork', 'cuan', 'piTube', 'rupiah'],
    createdAt: '10 menit yang lalu',
    comments: [
      {
        id: 'c1',
        userId: 'u_1',
        userName: 'Budi Santoso',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        text: 'Nonton santai sambil kumpulin Pi setiap hari, sistem rewardnya adil dan realistis 👍',
        timestamp: '5 menit lalu',
        likes: 42
      },
      {
        id: 'c2',
        userId: 'u_2',
        userName: 'Siti Rahma',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Harga Pi di CoinMarketCap terupdate nyata Rp 1.415, pas banget kumpulin dari pi Tube 🚀',
        timestamp: '8 menit lalu',
        likes: 19
      }
    ]
  },
  {
    id: 'post_video_2',
    type: 'video',
    title: 'Keindahan Alam Indonesia yang Bikin Tenang 🌄',
    description: 'Nonton panorama indah pegunungan sambil nambah pundi-pundi Pi Coin kamu! Tetap tonton sampai durasi selesai ya pioneers #travel #indonesia #alam #healing',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    creator: {
      name: 'Pesona Nusantara',
      handle: '@pesonanusantara',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    likes: 8930,
    isLiked: true,
    commentsCount: 215,
    sharesCount: 654,
    rewardPiPerView: 0.0015,
    tags: ['pesonaindonesia', 'nature', 'piTube'],
    createdAt: '25 menit yang lalu',
    comments: [
      {
        id: 'c3',
        userId: 'u_3',
        userName: 'Arif Hidayat',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Pemandangannya adem banget sambil dengar reward koin berdenting ting ting 🎉',
        timestamp: '15 menit lalu',
        likes: 11
      }
    ]
  },
  {
    id: 'post_photo_1',
    type: 'photo',
    title: 'Bukti Nyata Penarikan Saldo Rupiah ke DANA & Rekening Bank 💳',
    description: 'Alhamdulillah sudah masuk hasil tukar koin Pi dari pi Tube langsung ke e-Wallet! Rate bursa CoinMarketCap Rp 1.415/Pi. Yuk tonton video bareng!',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80',
    creator: {
      name: 'Rina Cuanku',
      handle: '@rinacrypto',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    likes: 15300,
    isLiked: false,
    commentsCount: 520,
    sharesCount: 2100,
    rewardPiPerView: 0.0010,
    tags: ['bukticair', 'piTube', 'dana', 'cuanonline'],
    createdAt: '1 jam yang lalu',
    comments: []
  },
  {
    id: 'post_video_3',
    type: 'video',
    title: 'Tutorial Super Cepat Tambah Kecepatan Nonton di pi Tube ⚡',
    description: 'Trik rahasia klaim Pi maksimal setiap hari dengan aktif beri like, komentar bermanfaat, dan bagikan video ke grup Pioneer!',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    creator: {
      name: 'Master Web3 ID',
      handle: '@masterweb3',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      isVerified: false
    },
    likes: 6420,
    isLiked: false,
    commentsCount: 184,
    sharesCount: 420,
    rewardPiPerView: 0.0015,
    tags: ['tips', 'tutorial', 'piNetwork', 'trikcuan'],
    createdAt: '3 jam yang lalu',
    comments: []
  },
  {
    id: 'post_photo_2',
    type: 'photo',
    title: 'Grafik Real-Time Pi Network di CoinMarketCap 📊',
    description: 'Pantau harga nyata Pi Network di bursa CoinMarketCap Rp 1.415 / Pi ($0.078 USD). Ekosistem pi Tube memberikan nilai nyata bagi para Pioneer.',
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80',
    creator: {
      name: 'Pi Global Community',
      handle: '@piglobal',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    likes: 19800,
    isLiked: true,
    commentsCount: 742,
    sharesCount: 3410,
    rewardPiPerView: 0.0010,
    tags: ['marketreal', 'coinmarketcap', 'crypto', 'pinetwork'],
    createdAt: '5 jam yang lalu',
    comments: []
  }
];

export const initialTransactions: Transaction[] = [];
