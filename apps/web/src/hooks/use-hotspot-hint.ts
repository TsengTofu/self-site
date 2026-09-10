"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "self-site:visited";
const START_DELAY_MS = 1200;
const HINT_DURATION_MS = 4000;

/**
 * 首訪提示脈衝:第一次造訪、延遲 1.2s 後,讓場景裡「有功能」的熱區脈衝提示 4 秒
 * (告訴摸不到 hover 的觸控裝置使用者「這裡可以點」),之後寫入 localStorage 不再自動播放。
 * `replay` 給 SceneHeader 的 ✦ 按鈕隨時手動重播用。
 */
export function useHotspotHint() {
  const [hinting, setHinting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const replay = useCallback(() => {
    clearTimers();
    setHinting(true);
    timers.current.push(setTimeout(() => setHinting(false), HINT_DURATION_MS));
  }, [clearTimers]);

  useEffect(() => {
    // 場景改 SSR 後,一律先掛載成「沒在提示」,首訪判斷搬進 effect(只在 client 跑)。
    if (localStorage.getItem(STORAGE_KEY)) return clearTimers;

    timers.current.push(
      setTimeout(() => {
        replay();
        localStorage.setItem(STORAGE_KEY, "1");
      }, START_DELAY_MS),
    );
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在掛載時判斷一次是否首訪
  }, []);

  return { hinting, replay };
}
