import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Nanum_Pen_Script } from "next/font/google";
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
  title: "On My Desk — Tseng",
  description: "互動式桌面場景個人網站:點點桌上的東西,認識我。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#222b3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${nanumPen.variable}`}>
      <body className="bg-[#1b2230] font-sans text-white antialiased">{children}</body>
    </html>
  );
}
