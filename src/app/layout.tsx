import type { Metadata, Viewport } from "next";
import "./globals.css";
import config from "@/lib/config";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: `${config.name} — ${config.tagline}`,
  description: config.description,
  keywords: ["creator economy", "web3", "decentralized", "censorship resistant"],
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
