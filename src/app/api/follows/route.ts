import { NextRequest, NextResponse } from "next/server";
import { db, follows, users } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { followerId, followingId } = await req.json();
  if (!followerId || !followingId) return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  if (followerId === followingId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

  // Check if already following
  const existing = await db.select().from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .limit(1);

  if (existing.length > 0) {
    // Unfollow
    await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    await db.update(users).set({ followingCount: sql`${users.followingCount} - 1` }).where(eq(users.id, followerId));
    await db.update(users).set({ followerCount: sql`${users.followerCount} - 1` }).where(eq(users.id, followingId));
    return NextResponse.json({ following: false });
  }

  // Follow
  await db.insert(follows).values({ followerId, followingId });
  await db.update(users).set({ followingCount: sql`${users.followingCount} + 1` }).where(eq(users.id, followerId));
  await db.update(users).set({ followerCount: sql`${users.followerCount} + 1` }).where(eq(users.id, followingId));
  return NextResponse.json({ following: true }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const followerId = searchParams.get("followerId");
  const followingId = searchParams.get("followingId");

  if (!followerId || !followingId) return NextResponse.json({ error: "Missing ids" }, { status: 400 });

  const row = await db.select().from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .limit(1);

  return NextResponse.json({ following: row.length > 0 });
}
