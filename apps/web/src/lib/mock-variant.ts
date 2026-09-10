"use client";

import { useEffect, useState } from "react";

/**
 * 🧪 MOCK 專用：讀網址參數切換設計提案。
 * - `?navv=list|sheet` 場景導覽造型（見 desk-experience；其他值 = 原始版）
 * - `?mkv=deck` /making-of 版型（deck = 橫向整合版；其他值 = 原始結合版）
 *
 * 沒帶參數 = 正式現狀，畫面零改變。
 * 使用者選定方案後：固化選中的版本，並把此檔與所有標了「MOCK」的分支一併移除。
 * （titlev / stylev / layoutv 已選定並固化，key 已移除。）
 */
export function useMockVariant(key: "navv" | "mkv"): string | null {
  const [variant, setVariant] = useState<string | null>(null);
  useEffect(() => {
    setVariant(new URLSearchParams(window.location.search).get(key));
  }, [key]);
  return variant;
}
