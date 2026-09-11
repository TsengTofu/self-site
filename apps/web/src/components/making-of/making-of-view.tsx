"use client";

import { setupGsapTickerFallback } from "@/lib/gsap-setup";
import { MakingOfHybrid } from "./making-of-hybrid";

// 這頁的進場動畫靠 GSAP；分頁在背景或內嵌預覽窗格時 rAF 會停擺，
// tween 會凍在 opacity:0 的起始狀態。沿用場景頁那套手動驅動 ticker 的保險
// （函式本身有 initialized 旗標，重複呼叫沒有副作用）。
setupGsapTickerFallback();

/** 版型已定稿：結合版（總覽 + 時間軸兩畫面左右切換）；journal / case / deck 提案都已移除。 */
export function MakingOfView() {
  return <MakingOfHybrid />;
}
