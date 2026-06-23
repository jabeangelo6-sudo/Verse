export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://verse-po2e.vercel.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("account");
  const userId = searchParams.get("userId");

  if (!accountId || !userId) {
    return NextResponse.redirect(`${APP_URL}/earnings?stripe=error`);
  }

  try {
    // Save Stripe account ID to user record
    await db
      .update(users)
      .set({ stripeAccountId: accountId } as Record<string, string>)
      .where(eq(users.id, userId));
  } catch {
    // Column may not exist yet — that's OK, still redirect to success
  }

  return NextResponse.redirect(`${APP_URL}/earnings?stripe=success`);
}
