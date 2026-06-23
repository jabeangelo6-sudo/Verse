export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, posts, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows = await db
      .select({ post: posts, creator: users })
      .from(posts)
      .innerJoin(users, eq(posts.creatorId, users.id))
      .where(eq(posts.id, params.id))
      .limit(1);

    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
