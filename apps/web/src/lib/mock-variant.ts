"use client";

import { useSyncExternalStore } from "react";

/**
 * 🧪 MOCK 專用：讀網址參數切換設計提案。
 * - `?btnv=glass|wall|ink|sage|clay|sea|blush|outline|sticker|phase` 右上選單按鈕的配色（見 lib/control-tone）
 * - `?headerv=back|nav|crumb` 入口以外頁面的 header（見 components/site-header）
 *
 * 沒帶參數 = 正式現狀，畫面零改變。
 * 使用者選定方案後：固化選中的版本，並把此檔與所有標了「MOCK」的分支一併移除。
 * （titlev / stylev / layoutv / mkv / resumev / dockv / introv 已選定並固化，navv 兩案都不採用，key 已移除。）
 */
export function useMockVariant(key: "btnv" | "headerv"): string | null {
  // 伺服器端沒有網址參數,一律當作沒帶;hydration 後才讀真的網址
  return useSyncExternalStore(
    subscribeNothing,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );
}

/** 網址參數只在進頁面時讀一次,不用訂閱變化 */
const subscribeNothing = () => () => {};
