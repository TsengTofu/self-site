import type { Metadata } from "next";
import { MakingOfScroll } from "@/components/making-of/making-of-scroll";
import { shareMeta } from "@/lib/site";

const TITLE = "視覺風格製作歷程（捲動版）— Tofu Tseng";
const DESCRIPTION = "作品集首頁 lofi 房間插畫的視覺探索紀錄，上下捲動版：每捲一次看一個章節。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // 內容跟 /making-of 一樣,canonical 指回原本那頁
  alternates: { canonical: "/making-of" },
  ...shareMeta(TITLE, DESCRIPTION, "article"),
};

/** 🧪 製作歷程的上下捲動版提案,原本的橫向 deck 在 /making-of 不動 */
export default function MakingOfScrollPage() {
  return <MakingOfScroll />;
}
