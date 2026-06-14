import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { id, email, displayName, avatar, walletAddress } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Upsert — create if new, update wallet if returning
    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(users)
        .set({ walletAddress: walletAddress || existing[0].walletAddress, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return NextResponse.json({ user: updated[0] });
    }

    // Generate a unique username from display name
    const base = (displayName ?? "creator").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
    const username = `${base}${Math.floor(Math.random() * 9000) + 1000}`;

    const tokenSymbol = username.slice(0, 4).toUpperCase();

    const [created] = await db.insert(users).values({
      id,
      email,
      displayName: displayName ?? "Creator",
      username,
      avatar: avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      walletAddress,
      tokenSymbol,
      tags: [],
    }).returning();

    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}
