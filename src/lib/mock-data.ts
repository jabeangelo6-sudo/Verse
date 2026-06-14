export type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  posts: number;
  earnings: number;
  tokenSymbol: string;
  tokenPrice: number;
  tokenChange: number;
  coverGradient: string;
  walletAddress: string;
  tags: string[];
  // Early Believer
  earlyBelieverThreshold: number;
  foundingSubscriberSlots: number;
  foundingSubscriberPrice: number;
  // Expert verification
  expertCredential?: string;
  expertVerified?: boolean;
  // Reputation
  reputationScore: number;
  predictionAccuracy: number;
};

export type Post = {
  id: string;
  creator: Creator;
  type: "text" | "image" | "video" | "thread";
  content: string;
  media?: string;
  videoThumb?: string;
  likes: number;
  comments: number;
  tips: number;
  tipsUSD: number;
  reposts: number;
  createdAt: Date;
  isLiked: boolean;
  isReposted: boolean;
  isExclusive: boolean;
  tags: string[];
  // Proof of Humanity
  humanityScore: number;
  isHumanVerified: boolean;
  // Reputation staking
  hasStake: boolean;
  stakeAmount?: number;
  stakeYes?: number;
  stakeNo?: number;
  stakeTopic?: string;
  stakeDeadline?: Date;
  // Collab
  collaborators?: { creator: Creator; splitPercent: number }[];
  // Voice
  hasVoice: boolean;
  voiceLanguages?: string[];
  // Anonymous expert
  anonymousExpert?: { credential: string; zkProof: string };
};

export type Notification = {
  id: string;
  type: "like" | "follow" | "tip" | "comment" | "mention" | "token" | "early_believer" | "stake_resolved" | "sub_nft";
  actor: Creator;
  content: string;
  createdAt: Date;
  read: boolean;
  amount?: number;
};

export const MOCK_CREATORS: Creator[] = [
  {
    id: "1",
    username: "solana_sage",
    displayName: "Sage Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sage&backgroundColor=b6e3f4",
    bio: "Web3 educator & DeFi researcher. Building in public since 2020. 🔮",
    verified: true,
    followers: 48200,
    following: 312,
    posts: 847,
    earnings: 28450.50,
    tokenSymbol: "SAGE",
    tokenPrice: 0.0842,
    tokenChange: 12.4,
    coverGradient: "from-purple-900 via-violet-800 to-indigo-900",
    walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    tags: ["DeFi", "Education", "Web3"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 100,
    foundingSubscriberPrice: 0.05,
    reputationScore: 94,
    predictionAccuracy: 78,
  },
  {
    id: "2",
    username: "pixel_dao",
    displayName: "Mia Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mia&backgroundColor=ffd5dc",
    bio: "Digital artist & NFT creator. Painting the metaverse one pixel at a time 🎨",
    verified: true,
    followers: 92100,
    following: 520,
    posts: 1204,
    earnings: 142300.00,
    tokenSymbol: "PIXEL",
    tokenPrice: 0.2341,
    tokenChange: -3.2,
    coverGradient: "from-pink-900 via-rose-800 to-orange-900",
    walletAddress: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    tags: ["NFT", "Art", "Design"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 50,
    foundingSubscriberPrice: 0.08,
    reputationScore: 88,
    predictionAccuracy: 65,
  },
  {
    id: "3",
    username: "defi_dave",
    displayName: "David Park",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david&backgroundColor=c0aede",
    bio: "Yield farmer | Protocol researcher | Making DeFi accessible to everyone 📈",
    verified: false,
    followers: 31500,
    following: 840,
    posts: 523,
    earnings: 18200.75,
    tokenSymbol: "DAVE",
    tokenPrice: 0.0512,
    tokenChange: 8.7,
    coverGradient: "from-cyan-900 via-teal-800 to-emerald-900",
    walletAddress: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    tags: ["DeFi", "Finance", "Crypto"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 200,
    foundingSubscriberPrice: 0.03,
    reputationScore: 72,
    predictionAccuracy: 61,
    expertCredential: "Verified Quantitative Analyst",
    expertVerified: true,
  },
  {
    id: "4",
    username: "zk_zara",
    displayName: "Zara Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zara&backgroundColor=d1f4e0",
    bio: "ZK proof enthusiast | Privacy advocate | Building the next generation of trustless systems 🔒",
    verified: true,
    followers: 67800,
    following: 289,
    posts: 932,
    earnings: 87650.00,
    tokenSymbol: "ZKZ",
    tokenPrice: 0.1823,
    tokenChange: 22.1,
    coverGradient: "from-emerald-900 via-green-800 to-teal-900",
    walletAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    tags: ["ZK", "Privacy", "Research"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 75,
    foundingSubscriberPrice: 0.12,
    reputationScore: 97,
    predictionAccuracy: 84,
    expertCredential: "Verified Cryptography PhD",
    expertVerified: true,
  },
  {
    id: "5",
    username: "nft_nova",
    displayName: "Nova James",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nova&backgroundColor=ffeaa7",
    bio: "Collector & curator of rare digital artifacts. Your guide to the NFT universe 🌌",
    verified: false,
    followers: 24300,
    following: 1100,
    posts: 389,
    earnings: 9800.25,
    tokenSymbol: "NOVA",
    tokenPrice: 0.0288,
    tokenChange: -1.4,
    coverGradient: "from-amber-900 via-yellow-800 to-orange-900",
    walletAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    tags: ["NFT", "Collecting", "Culture"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 150,
    foundingSubscriberPrice: 0.02,
    reputationScore: 81,
    predictionAccuracy: 70,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    creator: MOCK_CREATORS[0],
    type: "text",
    content: "Just finished a deep-dive into Eigenlayer's restaking mechanism. The implications for Ethereum security are massive — we're essentially creating a marketplace for decentralized trust. Thread incoming 🧵",
    likes: 2841,
    comments: 143,
    tips: 48,
    tipsUSD: 284.50,
    reposts: 621,
    createdAt: new Date(Date.now() - 1000 * 60 * 14),
    isLiked: true,
    isReposted: false,
    isExclusive: false,
    tags: ["Ethereum", "DeFi", "Restaking"],
    humanityScore: 98,
    isHumanVerified: true,
    hasStake: true,
    stakeAmount: 500,
    stakeYes: 1240,
    stakeNo: 380,
    stakeTopic: "ETH restaking will exceed $50B TVL by end of 2025",
    stakeDeadline: new Date("2025-12-31"),
    hasVoice: true,
    voiceLanguages: ["en", "es", "zh", "fr", "de", "ja", "ko", "pt", "ar", "hi", "ru", "tr"],
  },
  {
    id: "p2",
    creator: MOCK_CREATORS[1],
    type: "image",
    content: "\"Genesis\" — my latest collection dropping tomorrow. 48 pieces exploring the tension between digital permanence and human impermanence. Each piece stored forever on Arweave 🎨",
    media: "https://picsum.photos/seed/genesis/800/600",
    likes: 8420,
    comments: 512,
    tips: 182,
    tipsUSD: 4210.00,
    reposts: 1840,
    createdAt: new Date(Date.now() - 1000 * 60 * 47),
    isLiked: false,
    isReposted: false,
    isExclusive: false,
    tags: ["NFT", "Art", "Arweave"],
    humanityScore: 99,
    isHumanVerified: true,
    hasStake: false,
    collaborators: [
      { creator: MOCK_CREATORS[4], splitPercent: 30 },
    ],
    hasVoice: true,
    voiceLanguages: ["en", "zh", "ja", "ko", "fr"],
  },
  {
    id: "p3",
    creator: MOCK_CREATORS[3],
    type: "text",
    content: "Hot take: ZK proofs will make most KYC requirements obsolete within 5 years. You'll be able to prove you're over 18, live in a specific country, or have a certain income — without revealing any personal data. The privacy revolution is closer than you think.",
    likes: 4102,
    comments: 387,
    tips: 94,
    tipsUSD: 1203.00,
    reposts: 892,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isLiked: false,
    isReposted: true,
    isExclusive: false,
    tags: ["ZK", "Privacy", "Identity"],
    humanityScore: 97,
    isHumanVerified: true,
    hasStake: true,
    stakeAmount: 2000,
    stakeYes: 3100,
    stakeNo: 420,
    stakeTopic: "ZK proofs will replace KYC at 3+ major banks by 2029",
    stakeDeadline: new Date("2029-01-01"),
    hasVoice: true,
    voiceLanguages: ["en", "es", "de", "fr", "ar", "hi"],
    anonymousExpert: { credential: "Verified EU Regulatory Counsel", zkProof: "0xzkp_abc123" },
  },
  {
    id: "p4",
    creator: MOCK_CREATORS[2],
    type: "text",
    content: "🔒 Exclusive yield strategy: I've been running this 3-protocol loop for 6 months with consistent 28-42% APY. Holders of 100+ DAVE tokens get the full breakdown. Buy DAVE to unlock ↓",
    likes: 1820,
    comments: 204,
    tips: 67,
    tipsUSD: 892.00,
    reposts: 310,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isLiked: false,
    isReposted: false,
    isExclusive: true,
    tags: ["DeFi", "Yield", "Strategy"],
    humanityScore: 95,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: false,
  },
  {
    id: "p5",
    creator: MOCK_CREATORS[4],
    type: "image",
    content: "Found this absolute gem in the wild — a 2020 CryptoKitty that sold for 0.001 ETH is now listed at 8 ETH. Early NFT history is going to be incredibly valuable. Provenance matters.",
    media: "https://picsum.photos/seed/kitty/800/800",
    likes: 3290,
    comments: 178,
    tips: 52,
    tipsUSD: 318.00,
    reposts: 445,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isLiked: true,
    isReposted: false,
    isExclusive: false,
    tags: ["NFT", "History", "Collecting"],
    humanityScore: 72,
    isHumanVerified: false,
    hasStake: false,
    hasVoice: true,
    voiceLanguages: ["en", "ja", "ko", "zh"],
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "tip" as const,
    actor: MOCK_CREATORS[1],
    content: "tipped you",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    amount: 25.00,
  },
  {
    id: "n2",
    type: "early_believer" as const,
    actor: MOCK_CREATORS[3],
    content: "earned an Early Believer badge on your profile — they followed when you had 847 followers",
    createdAt: new Date(Date.now() - 1000 * 60 * 18),
    read: false,
  },
  {
    id: "n3",
    type: "stake_resolved" as const,
    actor: MOCK_CREATORS[0],
    content: "Your stake on \"ETH hits $10k\" resolved — you were right! +240 SAGE",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    amount: 240,
  },
  {
    id: "n4",
    type: "sub_nft" as const,
    actor: MOCK_CREATORS[2],
    content: "minted a Founding Subscriber NFT (#47 of 200) on your profile",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    amount: 0.03,
  },
  {
    id: "n5",
    type: "follow" as const,
    actor: MOCK_CREATORS[0],
    content: "started following you",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
  },
];

export const ME = {
  id: "me",
  username: "you",
  displayName: "Your Name",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you&backgroundColor=b6e3f4",
  bio: "Creator on Verse. Own your audience. 🌐",
  verified: false,
  followers: 1240,
  following: 89,
  posts: 34,
  earnings: 1820.50,
  tokenSymbol: "YOU",
  tokenPrice: 0.0124,
  tokenChange: 5.2,
  coverGradient: "from-violet-900 via-purple-800 to-indigo-900",
  walletAddress: "0x0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
  tags: ["Creator", "Web3"],
  earlyBelieverThreshold: 1000,
  foundingSubscriberSlots: 100,
  foundingSubscriberPrice: 0.02,
  reputationScore: 76,
  predictionAccuracy: 68,
};
