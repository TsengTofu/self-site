import type { MetadataRoute } from "next";

/** PWA/加到主畫面的最低限度資訊;icon 512 走 app/icon.png 檔案慣例的網址 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "On My Desk — Tofu Tseng",
    short_name: "On My Desk",
    description: "互動式桌面場景個人網站",
    start_url: "/",
    display: "standalone",
    // 啟動畫面跟 body 同底色,不會先亮後暗
    background_color: "#1b2230",
    theme_color: "#1b2230",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
