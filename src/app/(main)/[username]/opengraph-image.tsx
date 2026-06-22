import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateCTA } from "@/lib/generate-cta";

export const runtime = "nodejs";
export const alt = "Creator on Verse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
  let creator: { displayName: string; username: string; bio: string | null; avatar: string | null; verified: boolean } | null = null;

  try {
    const rows = await db.select({
      displayName: users.displayName,
      username: users.username,
      bio: users.bio,
      avatar: users.avatar,
      verified: users.verified,
    }).from(users).where(eq(users.username, params.username)).limit(1);
    creator = rows[0] ?? null;
  } catch {}

  const displayName = creator?.displayName ?? params.username;
  const bio = creator?.bio ?? "Creator on Verse";
  const avatar = creator?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`;
  const cta = generateCTA(bio);

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#07070f",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute", top: -100, left: -100,
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: -150, right: -100,
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />

      {/* Verse logo top-right */}
      <div style={{
        position: "absolute", top: 40, right: 48,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, color: "white", fontWeight: 900,
        }}>V</div>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 20, fontWeight: 600 }}>Verse</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        paddingLeft: 80, paddingRight: 80, gap: 60,
      }}>
        {/* Avatar */}
        <img
          src={avatar}
          width={180}
          height={180}
          style={{
            borderRadius: "50%",
            border: "4px solid rgba(124,58,237,0.5)",
            flexShrink: 0,
            background: "#1a1a2e",
          }}
        />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              fontSize: 52, fontWeight: 800, color: "white", lineHeight: 1.1,
            }}>{displayName}</span>
            {creator?.verified && (
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, color: "white", marginTop: 4,
              }}>✓</div>
            )}
          </div>
          <span style={{ fontSize: 26, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
            @{params.username}
          </span>
          <span style={{
            fontSize: 28, color: "rgba(255,255,255,0.7)", lineHeight: 1.4,
            display: "-webkit-box", overflow: "hidden",
          }}>
            {bio.length > 100 ? bio.slice(0, 100) + "…" : bio}
          </span>
        </div>
      </div>

      {/* CTA banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))",
        borderTop: "1px solid rgba(124,58,237,0.3)",
        padding: "28px 80px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 26, color: "white", fontWeight: 700, flex: 1 }}>
          Follow <span style={{ color: "#a78bfa" }}>@{params.username}</span> on Verse for {cta}
        </span>
        <div style={{
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          borderRadius: 14, padding: "14px 28px",
          fontSize: 22, fontWeight: 800, color: "white",
          flexShrink: 0, marginLeft: 40,
        }}>
          Follow on Verse →
        </div>
      </div>
    </div>,
    { ...size }
  );
}
