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
  earlyBelieverThreshold: number;
  foundingSubscriberSlots: number;
  foundingSubscriberPrice: number;
  expertCredential?: string;
  expertVerified?: boolean;
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
  humanityScore: number;
  isHumanVerified: boolean;
  hasStake: boolean;
  stakeAmount?: number;
  stakeYes?: number;
  stakeNo?: number;
  stakeTopic?: string;
  stakeDeadline?: Date;
  collaborators?: { creator: Creator; splitPercent: number }[];
  hasVoice: boolean;
  voiceLanguages?: string[];
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
    username: "alex_builds",
    displayName: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4",
    bio: "I build in public. Software, startups, and the occasional bad take on AI. Ex-Google. Now independent.",
    verified: true,
    followers: 48200,
    following: 312,
    posts: 847,
    earnings: 28450.50,
    tokenSymbol: "ALEX",
    tokenPrice: 0,
    tokenChange: 0,
    coverGradient: "from-blue-900 via-violet-800 to-indigo-900",
    walletAddress: "",
    tags: ["Tech", "Startups", "AI"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 100,
    foundingSubscriberPrice: 9,
    reputationScore: 94,
    predictionAccuracy: 78,
  },
  {
    id: "2",
    username: "mia_creates",
    displayName: "Mia Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miachen&backgroundColor=ffd5dc",
    bio: "Creative director by day, digital artist by night. I make things that make people feel something. 🎨",
    verified: true,
    followers: 92100,
    following: 520,
    posts: 1204,
    earnings: 142300.00,
    tokenSymbol: "MIA",
    tokenPrice: 0,
    tokenChange: 0,
    coverGradient: "from-pink-900 via-rose-800 to-orange-900",
    walletAddress: "",
    tags: ["Art", "Design", "Creative"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 50,
    foundingSubscriberPrice: 19,
    reputationScore: 88,
    predictionAccuracy: 65,
  },
  {
    id: "3",
    username: "jordan_money",
    displayName: "Jordan Brooks",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordanbrooks&backgroundColor=c0aede",
    bio: "Personal finance for people who weren't born with money. No jargon. No sponsored garbage. Just the truth.",
    verified: false,
    followers: 31500,
    following: 840,
    posts: 523,
    earnings: 18200.75,
    tokenSymbol: "JB",
    tokenPrice: 0,
    tokenChange: 0,
    coverGradient: "from-emerald-900 via-teal-800 to-cyan-900",
    walletAddress: "",
    tags: ["Finance", "Money", "Business"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 200,
    foundingSubscriberPrice: 9,
    reputationScore: 72,
    predictionAccuracy: 61,
    expertCredential: "Certified Financial Planner",
    expertVerified: true,
  },
  {
    id: "4",
    username: "zara_moves",
    displayName: "Zara Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zarawilliams&backgroundColor=d1f4e0",
    bio: "Fitness coach & certified nutritionist. I'll show you the science, you bring the effort. No fads. No shortcuts.",
    verified: true,
    followers: 67800,
    following: 289,
    posts: 932,
    earnings: 87650.00,
    tokenSymbol: "ZW",
    tokenPrice: 0,
    tokenChange: 0,
    coverGradient: "from-emerald-900 via-green-800 to-teal-900",
    walletAddress: "",
    tags: ["Fitness", "Wellness", "Nutrition"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 75,
    foundingSubscriberPrice: 29,
    reputationScore: 97,
    predictionAccuracy: 84,
    expertCredential: "Certified Personal Trainer & Nutritionist",
    expertVerified: true,
  },
  {
    id: "5",
    username: "marcus_sounds",
    displayName: "Marcus Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcusjohnson&backgroundColor=ffeaa7",
    bio: "Music producer & songwriter. I made beats for three Grammy nominees. Now I make content about the craft.",
    verified: false,
    followers: 24300,
    following: 1100,
    posts: 389,
    earnings: 9800.25,
    tokenSymbol: "MJ",
    tokenPrice: 0,
    tokenChange: 0,
    coverGradient: "from-amber-900 via-orange-800 to-red-900",
    walletAddress: "",
    tags: ["Music", "Production", "Entertainment"],
    earlyBelieverThreshold: 1000,
    foundingSubscriberSlots: 150,
    foundingSubscriberPrice: 19,
    reputationScore: 81,
    predictionAccuracy: 70,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    creator: MOCK_CREATORS[0],
    type: "text",
    content: "I've interviewed 50 founders this year. The ones who succeed share one trait: they're obsessed with the problem, not the product.\n\nMost failed founders are in love with their solution. The successful ones are genuinely angry about a problem that exists in the world.\n\nFall in love with the problem. The product will follow.",
    likes: 4821,
    comments: 243,
    tips: 48,
    tipsUSD: 284.50,
    reposts: 1621,
    createdAt: new Date(Date.now() - 1000 * 60 * 14),
    isLiked: true,
    isReposted: false,
    isExclusive: false,
    tags: ["Startups", "Founder", "Business"],
    humanityScore: 98,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: true,
    voiceLanguages: ["en", "es", "fr", "de", "pt"],
  },
  {
    id: "p2",
    creator: MOCK_CREATORS[1],
    type: "image",
    content: "This took me 3 weeks. Every line is intentional. Some art is about beauty — this one is about grief. What do you see? 🎨",
    media: "https://picsum.photos/seed/artwork42/800/600",
    likes: 8420,
    comments: 512,
    tips: 182,
    tipsUSD: 4210.00,
    reposts: 1840,
    createdAt: new Date(Date.now() - 1000 * 60 * 47),
    isLiked: false,
    isReposted: false,
    isExclusive: false,
    tags: ["Art", "Design", "Creative"],
    humanityScore: 99,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: false,
  },
  {
    id: "p3",
    creator: MOCK_CREATORS[2],
    type: "text",
    content: "Financial advice they don't teach you:\n\n1. Your income is not your wealth\n2. Lifestyle inflation kills more portfolios than market crashes\n3. The best investment is the one you actually understand\n4. Compound interest only works if you don't touch it\n5. Most financial advisors make money when you transact, not when you win\n\nSave this. Read it again in 10 years.",
    likes: 12400,
    comments: 387,
    tips: 94,
    tipsUSD: 1203.00,
    reposts: 5892,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isLiked: false,
    isReposted: true,
    isExclusive: false,
    tags: ["Finance", "Money", "Investing"],
    humanityScore: 97,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: true,
    voiceLanguages: ["en", "es", "fr", "pt"],
  },
  {
    id: "p4",
    creator: MOCK_CREATORS[3],
    type: "text",
    content: "My actual workout routine for this month. The one I don't post on Instagram because it's too boring to go viral — but it's the one that actually works.\n\nJoin my Inner Circle to unlock the full plan ↓",
    likes: 1820,
    comments: 204,
    tips: 67,
    tipsUSD: 892.00,
    reposts: 310,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isLiked: false,
    isReposted: false,
    isExclusive: true,
    tags: ["Fitness", "Workout", "Health"],
    humanityScore: 95,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: false,
  },
  {
    id: "p5",
    creator: MOCK_CREATORS[4],
    type: "image",
    content: "3am studio session. The track that's been living in my head for 6 months finally came out tonight. You'll hear it eventually. 🎵",
    media: "https://picsum.photos/seed/studio88/800/500",
    likes: 3290,
    comments: 178,
    tips: 52,
    tipsUSD: 318.00,
    reposts: 445,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isLiked: true,
    isReposted: false,
    isExclusive: false,
    tags: ["Music", "Studio", "Production"],
    humanityScore: 72,
    isHumanVerified: false,
    hasStake: false,
    hasVoice: false,
  },
  {
    id: "p6",
    creator: MOCK_CREATORS[0],
    type: "image",
    content: "The architecture for my new app. 4 services, 2 databases, and a prayer that AWS doesn't go down on launch day 😅\n\nBuilding in public means showing the ugly parts too.",
    media: "https://picsum.photos/seed/techdiagram/800/600",
    likes: 2100,
    comments: 98,
    tips: 31,
    tipsUSD: 155.00,
    reposts: 412,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    isLiked: false,
    isReposted: false,
    isExclusive: false,
    tags: ["Tech", "Engineering", "BuildInPublic"],
    humanityScore: 96,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: false,
    collaborators: [
      { creator: MOCK_CREATORS[2], splitPercent: 20 },
    ],
  },
  {
    id: "p7",
    creator: MOCK_CREATORS[3],
    type: "image",
    content: "6 months. This is what showing up every day actually looks like. My client came in unable to run 1km — last week he finished a half marathon. Consistency > intensity. Every time.",
    media: "https://picsum.photos/seed/fitresult/800/700",
    likes: 9800,
    comments: 621,
    tips: 210,
    tipsUSD: 3200.00,
    reposts: 2100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isLiked: false,
    isReposted: false,
    isExclusive: false,
    tags: ["Fitness", "Transformation", "Motivation"],
    humanityScore: 99,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: true,
    voiceLanguages: ["en", "es", "fr"],
  },
  {
    id: "p8",
    creator: MOCK_CREATORS[4],
    type: "text",
    content: "Unpopular opinion: 90% of music production courses teach you to make music that sounds like it's from 2018.\n\nThe producers killing it right now learned by ear, not by watching tutorials. They reverse-engineered songs they loved. They broke things on purpose.\n\nYou can't shortcut taste. You have to develop it.",
    likes: 6700,
    comments: 334,
    tips: 88,
    tipsUSD: 640.00,
    reposts: 1890,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    isLiked: false,
    isReposted: false,
    isExclusive: false,
    tags: ["Music", "Production", "Opinion"],
    humanityScore: 82,
    isHumanVerified: false,
    hasStake: true,
    stakeAmount: 200,
    stakeYes: 4100,
    stakeNo: 890,
    stakeTopic: "Tutorial culture is making music more generic",
    stakeDeadline: new Date("2026-12-31"),
    hasVoice: false,
  },
  {
    id: "p9",
    creator: MOCK_CREATORS[1],
    type: "image",
    content: "New collection dropping Friday. 12 pieces, each one a different hour of the night. This is 3am — the loneliest and most honest hour. 🌙",
    media: "https://picsum.photos/seed/nightart/800/800",
    likes: 11200,
    comments: 892,
    tips: 340,
    tipsUSD: 8900.00,
    reposts: 3200,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    isLiked: true,
    isReposted: false,
    isExclusive: false,
    tags: ["Art", "Collection", "Digital"],
    humanityScore: 99,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: false,
    collaborators: [
      { creator: MOCK_CREATORS[4], splitPercent: 25 },
    ],
  },
  {
    id: "p10",
    creator: MOCK_CREATORS[2],
    type: "text",
    content: "The salary negotiation script that got me 40% more than the initial offer:\n\n\"I'm really excited about this role. Based on my research and experience, I was expecting something in the range of [X]. Is there flexibility there?\"\n\nThen — and this is the key — stay silent. Let them fill the silence.\n\nMost people talk themselves into a lower number. Don't.",
    likes: 18400,
    comments: 1240,
    tips: 520,
    tipsUSD: 7800.00,
    reposts: 9100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isLiked: false,
    isReposted: true,
    isExclusive: false,
    tags: ["Career", "Finance", "Negotiation"],
    humanityScore: 97,
    isHumanVerified: true,
    hasStake: false,
    hasVoice: true,
    voiceLanguages: ["en", "es", "fr", "de", "pt", "hi"],
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
    type: "follow" as const,
    actor: MOCK_CREATORS[3],
    content: "started following you",
    createdAt: new Date(Date.now() - 1000 * 60 * 18),
    read: false,
  },
  {
    id: "n3",
    type: "comment" as const,
    actor: MOCK_CREATORS[0],
    content: "commented on your post",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
  },
  {
    id: "n4",
    type: "like" as const,
    actor: MOCK_CREATORS[2],
    content: "liked your post",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "n5",
    type: "follow" as const,
    actor: MOCK_CREATORS[4],
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
  tokenPrice: 0,
  tokenChange: 0,
  coverGradient: "from-violet-900 via-purple-800 to-indigo-900",
  walletAddress: "",
  tags: ["Creator"],
  earlyBelieverThreshold: 1000,
  foundingSubscriberSlots: 100,
  foundingSubscriberPrice: 9,
  reputationScore: 76,
  predictionAccuracy: 68,
};
