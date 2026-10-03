import type { Metadata, Viewport } from "next";
import { Chiron_GoRound_TC, Gowun_Dodum } from "next/font/google";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, shareMeta } from "@/lib/site";
import "./globals.css";

// 全站內文:圓體,跟手繪插畫的調性一致
// subsets 只決定預先載入哪一段;中文字是照 unicode-range 分片,用到哪段才下載哪段
const chironGoRound = Chiron_GoRound_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-chiron",
  display: "swap",
  // next/font 沒有這套字的量測資料,不能自動調備援字型的尺寸;直接指定系統中文字型當備援
  adjustFontFallback: false,
  fallback: ["PingFang TC", "Microsoft JhengHei", "Noto Sans TC", "system-ui", "sans-serif"],
});

// 韓文標題(場景左上「책상 위의 나」、手機裡的韓文)
const gowunDodum = Gowun_Dodum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gowun",
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

/**
 * 🧪 MOCK:首頁進場動畫提案 `?introv=fade|layers|lights|title`
 * 要在畫面畫出來之前就決定,不然場景會先出現、再突然消失重播(閃一下),
 * 所以在 <head> 裡同步讀網址,寫到 <html data-intro>,CSS 依這個屬性決定播哪一種
 * 選定後改成直接寫在 CSS,這段拿掉
 */
const INTRO_SCRIPT = `try{var v=new URLSearchParams(location.search).get("introv");if(/^(fade|layers|lights|title)$/.test(v||""))document.documentElement.dataset.intro=v}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-intro 由上面的小程式在 hydration 前寫入,伺服器端沒有,所以要關掉這層的比對警告
    <html lang="zh-Hant" className={`${chironGoRound.variable} ${gowunDodum.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="bg-night font-sans text-white antialiased">{children}</body>
    </html>
  );
}
