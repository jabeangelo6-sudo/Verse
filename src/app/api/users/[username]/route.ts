import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  const [user] = await db.select().from(users).where(eq(users.username, params.username)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest, { params }: { params: { username: string } }) {
  const body = await req.json();
  const allowed = ["displayName", "bio", "avatar", "tags", "coverGradient"];
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.username, params.username))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: updated });
}
