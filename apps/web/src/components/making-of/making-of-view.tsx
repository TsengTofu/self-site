"use client";

import { setupGsapTickerFallback } from "@/lib/gsap-setup";
import { MakingOfDeck } from "./making-of-deck";

// 這頁的進場動畫靠 GSAP；分頁在背景或內嵌預覽窗格時 rAF 會停擺，
// tween 會凍在 opacity:0 的起始狀態。沿用場景頁那套手動驅動 ticker 的保險
// （函式本身有 initialized 旗標，重複呼叫沒有副作用）。
setupGsapTickerFallback();

/** 版型定稿：照 Claude Design「視覺探索流程 v2」規格的 12 面板橫向 deck。
 *  舊結合版（making-of-hybrid）與其資料檔已移除，留在 git 歷史。 */
export function MakingOfView() {
  return <MakingOfDeck />;
}
