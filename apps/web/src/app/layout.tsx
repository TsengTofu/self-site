import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Nanum_Pen_Script } from "next/font/google";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, shareMeta } from "@/lib/site";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const nanumPen = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nanum-pen",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  ...shareMeta(SITE_TITLE, SITE_DESCRIPTION, "website"),
  // favicon 走 app/icon.png、app/apple-icon.png 檔案慣例，不需要手動 icons 設定
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // 讓內容延伸到瀏海/home indicator 區,搭配 safe-area-inset padding(見 mobile-dock)
  viewportFit: "cover",
  // 跟 body 的 bg-night、manifest 的 theme_color 同一個色值,瀏覽器工具列才不會差一階
  themeColor: "#1b2230",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${nanumPen.variable}`}>
      <body className="bg-night font-sans text-white antialiased">{children}</body>
    </html>
  );
}
