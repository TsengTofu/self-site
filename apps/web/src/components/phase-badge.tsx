"use client";

import { useEffect } from "react";
import { useSceneStore, type PhaseMode, type DayPhase } from "@/stores/scene-store";
import { useEffectivePhase } from "@/hooks/use-time-of-day";

const CYCLE: PhaseMode[] = ["auto", "dawn", "day", "sunset", "night"];

const PHASE_INFO: Record<DayPhase, { icon: string; label: string }> = {
  dawn: { icon: "🌅", label: "清晨" },
  day: { icon: "☀️", label: "白天" },
  sunset: { icon: "🌇", label: "夕陽" },
  night: { icon: "🌙", label: "夜晚" },
};

const STORAGE_KEY = "self-site:phase-mode";

/**
 * 右上角時段切換器。auto 跟著你的時區(5-7 清晨/7-16 白天/16-19 夕陽/其餘夜晚);
 * 點擊循環 自動 → 清晨 → 白天 → 夕陽 → 夜晚,手動選擇記在 localStorage。
 */
export function PhaseBadge() {
  const mode = useSceneStore((s) => s.phaseMode);
  const setPhaseMode = useSceneStore((s) => s.setPhaseMode);
  const phase = useEffectivePhase();
  const info = PHASE_INFO[phase];

  // 還原上次的手動設定
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as PhaseMode | null;
    if (saved && saved !== "auto" && CYCLE.includes(saved)) {
      useSceneStore.getState().setPhaseMode(saved);
    }
  }, []);

  const cycle = () => {
    const next = CYCLE[(CYCLE.indexOf(mode) + 1) % CYCLE.length] as PhaseMode;
    setPhaseMode(next);
    if (next === "auto") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      title="場景時段 — 點擊切換:自動(跟著你的時區)→ 清晨 → 白天 → 夕陽 → 夜晚"
      className="fixed right-4 top-[3.6rem] z-20 flex items-center gap-2 rounded-full border border-[#6b5647]/20 bg-[#faf4ea]/90 py-1.5 pl-3 pr-3.5 text-xs font-medium text-[#4a3c30] shadow-sm backdrop-blur transition hover:shadow-md md:right-8 md:top-[4.6rem]"
    >
      <span className="text-sm leading-none">{info.icon}</span>
      {info.label}
      <span className="text-[10px] text-[#a08b74]">{mode === "auto" ? "自動" : "手動"}</span>
    </button>
  );
}
