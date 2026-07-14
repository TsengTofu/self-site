"use client";

import { useEffect, useState } from "react";
import { useSceneStore, type DayPhase } from "@/stores/scene-store";

export type { DayPhase };

function phaseOf(hour: number): DayPhase {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 16) return "day";
  if (hour >= 16 && hour < 19) return "sunset";
  return "night";
}

/**
 * 依「使用者本地時區」回傳目前的自動時段。
 * SSR 先固定 day,掛載後校正並每分鐘更新一次。
 */
export function useTimeOfDay(): DayPhase {
  const [phase, setPhase] = useState<DayPhase>("day");

  useEffect(() => {
    const update = () => setPhase(phaseOf(new Date().getHours()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return phase;
}

/**
 * 實際生效的時段:右上角切換器選了手動就用手動,
 * auto 則跟著使用者時區。場景元件一律用這個。
 */
export function useEffectivePhase(): DayPhase {
  const auto = useTimeOfDay();
  const mode = useSceneStore((s) => s.phaseMode);
  return mode === "auto" ? auto : mode;
}
