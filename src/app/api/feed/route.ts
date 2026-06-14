import { NextRequest, NextResponse } from "next/server";
import { db, posts, users, follows } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const tab = searchParams.get("tab") ?? "for-you";
  const limit = Number(searchParams.get("limit") ?? "20");

  let feedPosts;

  if (tab === "following" && userId) {
    // Get IDs the user follows
    const followingRows = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const followingIds = followingRows.map(r => r.followingId);

    if (followingIds.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    feedPosts = await db
      .select({ post: posts, creator: users })
      .from(posts)
      .innerJoin(users, eq(posts.creatorId, users.id))
      .where(inArray(posts.creatorId, followingIds))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  } else {
    // For You / Trending — return all recent posts
    feedPosts = await db
      .select({ post: posts, creator: users })
      .from(posts)
      .innerJoin(users, eq(posts.creatorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  return NextResponse.json({ posts: feedPosts });
}
