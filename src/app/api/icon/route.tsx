import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get("size") ?? "192");
  const radius = Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
          borderRadius: radius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: Math.round(size * 0.44),
            fontWeight: 800,
            letterSpacing: "-0.03em",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          V
        </span>
      </div>
    ),
    { width: size, height: size }
  );
}
