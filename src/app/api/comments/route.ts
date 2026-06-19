export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, comments, users, posts, notifications } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

  const rows = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      likeCount: comments.likeCount,
      creator: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatar: users.avatar,
        verified: users.verified,
      },
    })
    .from(comments)
    .leftJoin(users, eq(comments.creatorId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt))
    .limit(50);

  return NextResponse.json({ comments: rows });
}

export async function POST(req: NextRequest) {
  try {
    const { postId, creatorId, content } = await req.json();
    if (!postId || !creatorId || !content?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [comment] = await db.insert(comments)
      .values({ postId, creatorId, content: content.trim() })
      .returning();

    // Increment comment count on post
    await db.update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, postId));

    // Notify post creator (skip if self-comment)
    const post = await db.select({ creatorId: posts.creatorId }).from(posts).where(eq(posts.id, postId)).limit(1);
    if (post.length > 0 && post[0].creatorId !== creatorId) {
      await db.insert(notifications).values({
        recipientId: post[0].creatorId,
        actorId: creatorId,
        type: "comment",
        postId,
        content: `commented: "${content.trim().slice(0, 80)}"`,
      }).onConflictDoNothing();
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
