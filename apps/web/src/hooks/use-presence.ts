"use client";

import { useEffect } from "react";
import { useSceneStore } from "@/stores/scene-store";

/**
 * 驅動「自動在座循環」:在座 35–75 秒 → 離開 12–30 秒 → 回來。
 * 結果寫進 scene store(autoPresent),場景裡的女生與右上角狀態一起連動;
 * 手動模式(online / away)時循環照跑,但顯示以手動為準。
 */
export function usePresenceCycle() {
  const setAutoPresent = useSceneStore((s) => s.setAutoPresent);

  useEffect(() => {
    let timer: number;
    const schedule = (isPresent: boolean) => {
      const duration = isPresent
        ? 35_000 + Math.random() * 40_000
        : 12_000 + Math.random() * 18_000;
      timer = window.setTimeout(() => {
        setAutoPresent(!isPresent);
        schedule(!isPresent);
      }, duration);
    };
    schedule(true);
    return () => window.clearTimeout(timer);
  }, [setAutoPresent]);
}
