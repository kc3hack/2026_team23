import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "キメ旅っ！",
    short_name: "TripScheduleApp",
    description: "旅行の日程を簡潔に確定させましょう",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/kimetabi-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",

      },
      {
        src: "/kimetabi-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      }
    ]
  }
}
