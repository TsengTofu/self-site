"use client";

import { useEffect, useRef } from "react";

const AWAY_TITLE = "(人不見了…)";
const WELCOME_BACK_TITLE = "歡迎回來 👋";
const WELCOME_BACK_MS = 2000;

/**
 * 分頁標題彩蛋:切走分頁時標題變「(人不見了…)」;切回來先顯示「歡迎回來 👋」,
 * 2 秒後還原成原本的標題。全部邏輯都在 effect 裡(SSR-safe,不動 document 直到 client 掛載後)。
 */
export function useTitleEgg() {
  const originalTitleRef = useRef<string | null>(null);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    originalTitleRef.current = document.title;

    const onVisibilityChange = () => {
      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
        restoreTimerRef.current = null;
      }

      if (document.hidden) {
        document.title = AWAY_TITLE;
        return;
      }

      document.title = WELCOME_BACK_TITLE;
      restoreTimerRef.current = setTimeout(() => {
        document.title = originalTitleRef.current ?? document.title;
        restoreTimerRef.current = null;
      }, WELCOME_BACK_MS);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
      if (originalTitleRef.current) document.title = originalTitleRef.current;
    };
  }, []);
}
