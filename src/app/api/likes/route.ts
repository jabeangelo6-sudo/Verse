export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, likes, posts, users, notifications } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId, postId } = await req.json();
    if (!userId || !postId) return NextResponse.json({ error: "Missing userId or postId" }, { status: 400 });

    // Insert like (ignore if already exists)
    await db.insert(likes).values({ userId, postId }).onConflictDoNothing();

    // Increment like count on post
    await db.update(posts)
      .set({ likeCount: sql`${posts.likeCount} + 1` })
      .where(eq(posts.id, postId));

    // Notify the post creator (don't notify self-likes)
    const post = await db.select({ creatorId: posts.creatorId }).from(posts).where(eq(posts.id, postId)).limit(1);
    if (post.length > 0 && post[0].creatorId !== userId) {
      await db.insert(notifications).values({
        recipientId: post[0].creatorId,
        actorId: userId,
        type: "like",
        postId,
        content: "liked your post",
      }).onConflictDoNothing();
    }

    return NextResponse.json({ liked: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, postId } = await req.json();
    if (!userId || !postId) return NextResponse.json({ error: "Missing userId or postId" }, { status: 400 });

    const deleted = await db.delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
      .returning();

    // Only decrement if a row was actually deleted
    if (deleted.length > 0) {
      await db.update(posts)
        .set({ likeCount: sql`GREATEST(${posts.likeCount} - 1, 0)` })
        .where(eq(posts.id, postId));
    }

    return NextResponse.json({ liked: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
