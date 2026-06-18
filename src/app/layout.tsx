import type { Metadata, Viewport } from "next";
import "./globals.css";
import config from "@/lib/config";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: `${config.name} — ${config.tagline}`,
  description: config.description,
  keywords: ["creator economy", "web3", "decentralized", "censorship resistant"],
  openGraph: {
    title: `${config.name} — ${config.tagline}`,
    description: config.description,
    url: `https://${config.domain}`,
    siteName: config.name,
    images: [{ url: `https://${config.domain}/og.png`, width: 1200, height: 630 }],
    type: "website",
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `https://${config.domain}/og.png`,
      button: {
        title: `Open ${config.name}`,
        action: {
          type: "launch_frame",
          name: config.name,
          url: `https://${config.domain}`,
          splashImageUrl: `https://${config.domain}/og.png`,
          splashBackgroundColor: "#07070f",
        },
      },
    }),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07070f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
