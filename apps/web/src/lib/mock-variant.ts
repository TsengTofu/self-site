"use client";

import { useEffect, useState } from "react";

/**
 * 🧪 MOCK 專用：讀網址參數切換設計提案。
 * - `?btnv=glass|wall|ink` 右上選單按鈕的配色（見 lib/control-tone）
 *
 * 沒帶參數 = 正式現狀，畫面零改變。
 * 使用者選定方案後：固化選中的版本，並把此檔與所有標了「MOCK」的分支一併移除。
 * （titlev / stylev / layoutv / mkv / resumev / dockv / introv 已選定並固化，navv 兩案都不採用，key 已移除。）
 */
export function useMockVariant(key: "btnv"): string | null {
  const [variant, setVariant] = useState<string | null>(null);
  useEffect(() => {
    setVariant(new URLSearchParams(window.location.search).get(key));
  }, [key]);
  return variant;
}
