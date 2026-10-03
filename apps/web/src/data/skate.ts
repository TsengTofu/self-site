/**
 * 滑板頁(/skateboard)的內容,畫面在 components/skate/skate-view.tsx
 * 照片與清單都還是預留位置,之後有內容直接改這裡
 */
export interface SkatePhoto {
  /** 照片網址;還沒有就留空,畫面會顯示預留框 */
  src?: string;
  caption: string;
}

export interface SkateContent {
  eyebrow: string;
  title: string;
  intro: string;
  photos: { en: string; title: string; items: SkatePhoto[] };
  quests: { en: string; title: string; items: string[] };
  cta: { label: string; subject: string; back: string };
}

export const skate: SkateContent = {
  eyebrow: "FREE RIDE",
  title: "自由的味道",
  intro:
    "靠在鏡子旁的那塊長板。這一頁還在長，也許是學滑板的摔倒集錦，也許是人生的 side quest 清單。",
  photos: {
    en: "WIPEOUT REEL",
    title: "摔倒集錦",
    items: [{ caption: "照片預留" }, { caption: "照片預留" }, { caption: "照片預留" }],
  },
  quests: {
    en: "SIDE QUESTS",
    title: "人生的 side quest 清單",
    items: ["待補", "待補", "待補"],
  },
  cta: { label: "跟我說你的點子", subject: "滑板那格我有個點子！", back: "先滑回房間" },
};
