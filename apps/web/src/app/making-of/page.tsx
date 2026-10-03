import type { Metadata } from "next";
import { MakingOfView } from "@/components/making-of/making-of-view";
import { shareMeta } from "@/lib/site";

const TITLE = "視覺風格製作歷程 — Tofu Tseng";
const DESCRIPTION =
  "作品集首頁互動 lofi 房間插畫的視覺探索紀錄：Gemini ✕ ChatGPT ✕ Illustrator，兩週、兩次放棄、一次翻轉，從一張好看的圖到一套拆解後的圖層。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/making-of" },
  ...shareMeta(TITLE, DESCRIPTION, "article"),
};

/** 視覺風格製作歷程：記錄這個網站的插畫場景從無到有的過程（上下捲動，每捲一次一個章節）。 */
export default function MakingOfPage() {
  return <MakingOfView />;
}
