import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AURISTRA'26 Upgrade",
    short_name: "Upgrade",
    description: "AI-powered skill upgrade platform",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#06b6d4",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
