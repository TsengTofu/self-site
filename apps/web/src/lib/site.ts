import type { Metadata } from "next";

/**
 * 全站共用的網域常數 —— layout.tsx（metadataBase）、robots.ts、sitemap.ts 共用同一個值，
 * 避免各處各寫一份網域字串。
 *
 * 部署時在環境變數設 NEXT_PUBLIC_SITE_URL（例如 Vercel 專案設定）；本機與未設定時退回
 * localhost，分享 preview 才不會拿到 example.com 的壞圖。尾斜線一律去掉，
 * 不然 `${SITE_URL}/resume` 會變成 `//resume`
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "On My Desk";
export const SITE_TITLE = "On My Desk — Tofu Tseng";
export const SITE_DESCRIPTION = "互動式桌面場景個人網站：點點桌上的東西，認識我。";

/** 分享卡片圖：三個頁面共用；尺寸與 alt 給齊，爬蟲就不用先抓圖 */
export const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "手繪海景房的書桌場景 — Tofu Tseng 的個人網站",
};

/**
 * 各頁共用的 openGraph / twitter 區塊。
 * Next 的 openGraph 不會跟 layout 深合併（子頁一覆寫整個物件就被換掉），
 * 所以每頁都從這裡整組產，只換標題、描述與類型
 */
export function shareMeta(
  title: string,
  description: string,
  type: "website" | "profile" | "article",
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
      locale: "zh_TW",
      type,
    } as Metadata["openGraph"],
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
