import type { MetadataRoute } from "next";
import config from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.name,
    short_name: config.name,
    description: config.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07070f",
    theme_color: "#07070f",
    orientation: "portrait",
    categories: ["social", "lifestyle"],
    icons: [
      { src: "/api/icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/icon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
