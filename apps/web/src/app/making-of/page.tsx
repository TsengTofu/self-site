import type { Metadata } from "next";
import { MakingOfView } from "@/components/making-of/making-of-view";

const TITLE = "視覺風格製作歷程 — Tofu Tseng";
const DESCRIPTION =
  "這個網站的房間插畫是怎麼被做出來的：從 AI 風格探索、生成圖撞牆、佔位符先行開發，到 Illustrator 手工重畫與拆層整合的完整歷程。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/making-of" },
  // openGraph 不會跟 layout 深合併，整個物件會被覆蓋，所以 images 要重列
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
    locale: "zh_TW",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

/** 視覺風格製作歷程：記錄這個網站的插畫場景從無到有的過程。 */
export default function MakingOfPage() {
  return <MakingOfView />;
}
