export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://verse-po2e.vercel.app";

function buildEmailHtml({
  creatorName,
  creatorUsername,
  creatorAvatar,
  content,
  postId,
  isExclusive,
}: {
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  content: string;
  postId: string;
  isExclusive: boolean;
}) {
  const postUrl = `${APP_URL}/posts/${postId}`;
  const profileUrl = `${APP_URL}/${creatorUsername}`;
  const preview = content.slice(0, 160) + (content.length > 160 ? "…" : "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>New post from ${creatorName}</title>
</head>
<body style="margin:0;padding:0;background:#07070f;font-family:'Inter',system-ui,sans-serif;color:#f0f0fa;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070f;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Header -->
  <tr><td style="padding-bottom:32px;text-align:center;">
    <span style="font-size:22px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.02em;">Verse</span>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;">

    <!-- Creator row -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td width="44"><img src="${creatorAvatar}" width="44" height="44" style="border-radius:50%;background:#1a1a2e;" alt="${creatorName}"/></td>
      <td style="padding-left:12px;">
        <div style="font-weight:700;font-size:15px;color:#f0f0fa;">${creatorName}</div>
        <div style="font-size:13px;color:#6b7280;">@${creatorUsername}</div>
      </td>
      ${isExclusive ? `<td align="right"><span style="font-size:11px;background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.25);padding:3px 8px;border-radius:20px;font-weight:700;">Members only</span></td>` : ""}
    </tr>
    </table>

    <!-- Content -->
    <p style="font-size:16px;line-height:1.7;color:#e5e7eb;margin:0 0 24px;">${isExclusive ? "This is a members-only post. Join the Inner Circle to read it." : preview}</p>

    <!-- CTA -->
    <a href="${postUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;">
      ${isExclusive ? "Unlock post →" : "Read full post →"}
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding-top:24px;text-align:center;">
    <p style="font-size:12px;color:#4b5563;margin:0;">
      You're receiving this because you follow <a href="${profileUrl}" style="color:#7c3aed;text-decoration:none;">@${creatorUsername}</a> on Verse.<br/>
      <a href="${APP_URL}/settings" style="color:#4b5563;">Manage notifications</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  if (!RESEND_KEY) {
    return NextResponse.json({ error: "Email not configured — add RESEND_API_KEY" }, { status: 503 });
  }

  try {
    const { creatorName, creatorUsername, creatorAvatar, content, postId, isExclusive, subscriberEmails } = await req.json();

    if (!subscriberEmails?.length) {
      return NextResponse.json({ sent: 0 });
    }

    const html = buildEmailHtml({ creatorName, creatorUsername, creatorAvatar, content, postId, isExclusive: isExclusive ?? false });
    const subject = isExclusive
      ? `🔒 Members-only post from ${creatorName}`
      : `New post from ${creatorName} on Verse`;

    // Resend supports up to 50 recipients per call; batch if needed
    const batches: string[][] = [];
    for (let i = 0; i < subscriberEmails.length; i += 50) {
      batches.push(subscriberEmails.slice(i, i + 50));
    }

    let sent = 0;
    for (const batch of batches) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${creatorName} via Verse <notifications@verse.app>`,
          to: batch,
          subject,
          html,
        }),
      });
      if (res.ok) sent += batch.length;
    }

    return NextResponse.json({ sent });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
