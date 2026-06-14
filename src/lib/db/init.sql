-- Run this once in the Neon SQL Editor to create all tables
-- Dashboard → SQL Editor → paste and run

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar TEXT,
  bio TEXT DEFAULT '',
  wallet_address TEXT,
  email TEXT,
  verified BOOLEAN DEFAULT FALSE,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  earnings DECIMAL(18,2) DEFAULT 0,
  token_symbol TEXT,
  token_price DECIMAL(18,8) DEFAULT 0,
  token_change DECIMAL(6,2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 50,
  prediction_accuracy INTEGER DEFAULT 50,
  expert_credential TEXT,
  expert_verified BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  cover_gradient TEXT DEFAULT 'from-violet-900 via-purple-800 to-indigo-900',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'text',
  content TEXT NOT NULL,
  media TEXT,
  is_exclusive BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  repost_count INTEGER DEFAULT 0,
  tips_usd DECIMAL(18,2) DEFAULT 0,
  humanity_score INTEGER DEFAULT 95,
  is_human_verified BOOLEAN DEFAULT FALSE,
  has_voice BOOLEAN DEFAULT FALSE,
  has_stake BOOLEAN DEFAULT FALSE,
  stake_amount DECIMAL(18,2),
  stake_yes INTEGER DEFAULT 0,
  stake_no INTEGER DEFAULT 0,
  stake_topic TEXT,
  stake_deadline TIMESTAMP,
  anonymous_expert_credential TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id TEXT NOT NULL REFERENCES users(id),
  to_id TEXT NOT NULL REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  amount_usd DECIMAL(18,2) NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES users(id),
  type TEXT NOT NULL,
  content TEXT,
  post_id UUID,
  amount DECIMAL(18,2),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collaborators (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  split_percent INTEGER NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

-- Indexes for fast feed and profile queries
CREATE INDEX IF NOT EXISTS posts_creator_id_idx ON posts(creator_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows(following_id);
CREATE INDEX IF NOT EXISTS notifications_recipient_id_idx ON notifications(recipient_id);
