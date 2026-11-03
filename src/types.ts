export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface MediaPost {
  id: string;
  type: 'video' | 'photo';
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
  };
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  comments: Comment[];
  rewardPiPerView: number;
  tags: string[];
  createdAt: string;
  isUserUploaded?: boolean;
}

export interface Transaction {
  id: string;
  type: 'reward_watch' | 'reward_upload' | 'reward_daily' | 'swap_pi_to_idr' | 'withdraw_idr';
  title: string;
  description: string;
  amountPi?: number;
  amountIdr?: number;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  paymentMethod?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface MarketData {
  currency: string;
  piPriceIdr: number;
  piPriceUsd: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCapIdr: number;
  volume24hIdr: number;
  rank: number;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  isKycVerified: boolean;
  piBalance: number;
  idrBalance: number;
  totalWatchedCount: number;
  totalPiEarned: number;
  referralCode: string;
  piWalletAddress: string;
  followersCount: number;
  followingCount: number;
  dailyCheckedIn: boolean;
  phone?: string;
  isRegistered?: boolean;
  watchedVideoIds?: string[];
}
