import { pgTable, text, integer, boolean, timestamp, decimal, uuid, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),                          // Privy DID
  username: text("username").unique(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  bio: text("bio").default(""),
  walletAddress: text("wallet_address"),
  email: text("email"),
  verified: boolean("verified").default(false),
  // Stats (denormalised for fast reads)
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
  postCount: integer("post_count").default(0),
  earnings: decimal("earnings", { precision: 18, scale: 2 }).default("0"),
  // Token
  tokenSymbol: text("token_symbol"),
  tokenPrice: decimal("token_price", { precision: 18, scale: 8 }).default("0"),
  tokenChange: decimal("token_change", { precision: 6, scale: 2 }).default("0"),
  // Features
  reputationScore: integer("reputation_score").default(50),
  predictionAccuracy: integer("prediction_accuracy").default(50),
  expertCredential: text("expert_credential"),
  expertVerified: boolean("expert_verified").default(false),
  tags: text("tags").array().default([]),
  coverGradient: text("cover_gradient").default("from-violet-900 via-purple-800 to-indigo-900"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: text("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").default("text"),                   // text | image | video
  content: text("content").notNull(),
  media: text("media"),
  isExclusive: boolean("is_exclusive").default(false),
  tags: text("tags").array().default([]),
  // Counts (denormalised)
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  repostCount: integer("repost_count").default(0),
  tipsUSD: decimal("tips_usd", { precision: 18, scale: 2 }).default("0"),
  // Proof of Humanity
  humanityScore: integer("humanity_score").default(95),
  isHumanVerified: boolean("is_human_verified").default(false),
  // Voice
  hasVoice: boolean("has_voice").default(false),
  // Reputation stake
  hasStake: boolean("has_stake").default(false),
  stakeAmount: decimal("stake_amount", { precision: 18, scale: 2 }),
  stakeYes: integer("stake_yes").default(0),
  stakeNo: integer("stake_no").default(0),
  stakeTopic: text("stake_topic"),
  stakeDeadline: timestamp("stake_deadline"),
  // Anonymous expert
  anonymousExpertCredential: text("anonymous_expert_credential"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  followerId: text("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: text("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.followerId, t.followingId] }) }));

export const likes = pgTable("likes", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.postId] }) }));

export const tips = pgTable("tips", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromId: text("from_id").notNull().references(() => users.id),
  toId: text("to_id").notNull().references(() => users.id),
  postId: uuid("post_id").references(() => posts.id),
  amountUSD: decimal("amount_usd", { precision: 18, scale: 2 }).notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientId: text("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actorId: text("actor_id").references(() => users.id),
  type: text("type").notNull(),
  content: text("content"),
  postId: uuid("post_id"),
  amount: decimal("amount", { precision: 18, scale: 2 }),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  creatorId: text("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaborators = pgTable("collaborators", {
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id),
  splitPercent: integer("split_percent").notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.postId, t.userId] }) }));

export type Comment = typeof comments.$inferSelect;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Tip = typeof tips.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
