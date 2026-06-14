import { NextRequest, NextResponse } from "next/server";
import { db, posts, users } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");
  const limit = Number(searchParams.get("limit") ?? "20");

  const query = db
    .select({ post: posts, creator: users })
    .from(posts)
    .innerJoin(users, eq(posts.creatorId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  if (creatorId) query.where(eq(posts.creatorId, creatorId));

  const rows = await query;
  return NextResponse.json({ posts: rows });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, content, type, media, isExclusive, tags, hasStake, stakeTopic, stakeAmount, stakeDeadline } = body;

    if (!creatorId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Simple AI humanity score (mock — replace with real AI call later)
    const humanityScore = Math.floor(Math.random() * 15) + 85;

    const [post] = await db.insert(posts).values({
      creatorId,
      content,
      type: type ?? "text",
      media,
      isExclusive: isExclusive ?? false,
      tags: tags ?? [],
      humanityScore,
      isHumanVerified: humanityScore >= 90,
      hasStake: hasStake ?? false,
      stakeTopic,
      stakeAmount: stakeAmount ? String(stakeAmount) : null,
      stakeDeadline: stakeDeadline ? new Date(stakeDeadline) : null,
    }).returning();

    // Increment user post count
    await db
      .update(users)
      .set({ postCount: db.$count(posts, eq(posts.creatorId, creatorId)) as any })
      .where(eq(users.id, creatorId));

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
