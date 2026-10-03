import type { Metadata, Viewport } from "next";
import { Chiron_GoRound_TC, Gowun_Dodum } from "next/font/google";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, shareMeta } from "@/lib/site";
import { SkateTransition } from "@/components/skate-transition";
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
 * 首頁進場動畫:先蓋一層奶油色浮出「나의 공간」,淡出後家具一件件長出來
 * 在 <head> 同步判斷再寫到 <html data-intro>,不然場景會先閃出來再被蓋住
 * 只在首頁、同分頁第一次進來時播(播完就拿掉),減少動態時不播;網址帶 ?intro 可強制重播
 */
const INTRO_SCRIPT = `try{var d=document.documentElement,k="self-site:intro",f=new URLSearchParams(location.search).has("intro");if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&(f||!sessionStorage.getItem(k))){d.dataset.intro="on";sessionStorage.setItem(k,"1");setTimeout(function(){delete d.dataset.intro},4500)}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-intro 由上面的小程式在 hydration 前寫入,伺服器端沒有,所以要關掉這層的比對警告
    <html lang="zh-Hant" className={`${chironGoRound.variable} ${gowunDodum.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="bg-night font-sans text-white antialiased">
        {children}
        {/* 滑板轉場要跨頁播完,所以掛在這層 */}
        <SkateTransition />
      </body>
    </html>
  );
}
