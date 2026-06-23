import type { Metadata, Viewport } from "next";
import "./globals.css";
import config from "@/lib/config";
import dynamic from "next/dynamic";

const AppProviders = dynamic(
  () => import("@/components/providers/AppProviders").then(m => m.AppProviders),
  { ssr: false, loading: () => null }
);

const LanguageDetector = dynamic(
  () => import("@/components/providers/LanguageDetector").then(m => m.LanguageDetector),
  { ssr: false, loading: () => null }
);

const ServiceWorkerRegister = dynamic(
  () => import("@/components/providers/ServiceWorkerRegister").then(m => m.ServiceWorkerRegister),
  { ssr: false, loading: () => null }
);

export const metadata: Metadata = {
  title: `${config.name} — ${config.tagline}`,
  description: config.description,
  keywords: ["creator economy", "creator platform", "monetize content", "fan subscriptions"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: config.name,
  },
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
      <head>
        <link rel="apple-touch-icon" href="/api/icon?size=180" />
      </head>
      <body className="antialiased">
        <LanguageDetector />
        <ServiceWorkerRegister />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
