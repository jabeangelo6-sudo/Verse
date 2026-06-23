export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://verse-po2e.vercel.app";

async function stripe(path: string, body: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  if (!STRIPE_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const { userId, email, username } = await req.json();

    // Create Stripe Express account
    const account = await stripe("/accounts", {
      type: "express",
      email,
      "capabilities[transfers][requested]": "true",
      "capabilities[card_payments][requested]": "true",
      "business_profile[url]": `${APP_URL}/${username}`,
      "metadata[userId]": userId,
    });

    if (account.error) {
      return NextResponse.json({ error: account.error.message }, { status: 400 });
    }

    // Create onboarding link
    const link = await stripe("/account_links", {
      account: account.id,
      refresh_url: `${APP_URL}/wallet?stripe=refresh`,
      return_url: `${APP_URL}/api/stripe/callback?account=${account.id}&userId=${userId}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: link.url, accountId: account.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
