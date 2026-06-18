export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, posts, users, follows, likes } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const tab = searchParams.get("tab") ?? "for-you";
  const limit = Number(searchParams.get("limit") ?? "20");

  let feedPosts;

  if (tab === "following" && userId) {
    const followingRows = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const followingIds = followingRows.map(r => r.followingId);
    if (followingIds.length === 0) return NextResponse.json({ posts: [] });

    feedPosts = await db
      .select({ post: posts, creator: users })
      .from(posts)
      .innerJoin(users, eq(posts.creatorId, users.id))
      .where(inArray(posts.creatorId, followingIds))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  } else {
    feedPosts = await db
      .select({ post: posts, creator: users })
      .from(posts)
      .innerJoin(users, eq(posts.creatorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  // Attach isLiked flag for each post if user is signed in
  if (userId && feedPosts.length > 0) {
    const postIds = feedPosts.map(r => r.post.id);
    const userLikes = await db
      .select({ postId: likes.postId })
      .from(likes)
      .where(eq(likes.userId, userId));

    const likedSet = new Set(userLikes.map(l => l.postId));
    return NextResponse.json({
      posts: feedPosts.map(r => ({ ...r, isLiked: likedSet.has(r.post.id) })),
    });
  }

  return NextResponse.json({ posts: feedPosts.map(r => ({ ...r, isLiked: false })) });
}
