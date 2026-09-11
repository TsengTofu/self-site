"use client";

import { useSceneStore, type PhaseMode, type DayPhase } from "@/stores/scene-store";
import { useEffectivePhase } from "@/hooks/use-time-of-day";
import { usePersistedMode } from "@/hooks/use-persisted-mode";

/** 四段式滑桿的刻度(由早到晚),index 對應 range input 的值 */
const STOPS: { phase: DayPhase; icon: string; label: string }[] = [
  { phase: "dawn", icon: "🌅", label: "清晨" },
  { phase: "day", icon: "☀️", label: "白天" },
  { phase: "sunset", icon: "🌇", label: "夕陽" },
  { phase: "night", icon: "🌙", label: "夜晚" },
];

const STORAGE_KEY = "self-site:phase-mode";

/**
 * 時段滑桿(取代原本點擊循環的 PhaseBadge):四個刻度,拖曳直接跳到該時段。
 * 拖動 = 手動模式;按「自動」回到跟著使用者時區。
 */
export function PhaseSlider({ className = "" }: { className?: string }) {
  const mode = useSceneStore((s) => s.phaseMode);
  const setPhaseMode = useSceneStore((s) => s.setPhaseMode);
  const phase = useEffectivePhase();
  const index = STOPS.findIndex((s) => s.phase === phase);
  const current = STOPS[index] ?? STOPS[1]!;

  const persist = usePersistedMode(STORAGE_KEY, (saved) => {
    if (saved !== "auto" && STOPS.some((s) => s.phase === saved)) {
      setPhaseMode(saved as PhaseMode);
    }
  });

  const pick = (i: number) => {
    const next = STOPS[Math.max(0, Math.min(STOPS.length - 1, i))]!.phase;
    setPhaseMode(next);
    persist(next);
  };

  const toAuto = () => {
    setPhaseMode("auto");
    persist(null);
  };

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-2xl border border-ink-soft/20 bg-cream/90 px-3 py-2.5 shadow-sm backdrop-blur ${className}`}
    >
      <div className="flex items-center justify-between gap-3 text-xs text-ink">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-sm leading-none">{current.icon}</span>
          {current.label}
        </span>
        <button
          type="button"
          onClick={toAuto}
          className={`rounded-full px-2 py-0.5 text-[10px] transition ${
            mode === "auto"
              ? "bg-ink-soft/15 text-ink-soft"
              : "text-ink-dim hover:bg-ink-soft/10 hover:text-ink-soft"
          }`}
          title="跟著你的時區自動切換"
        >
          自動
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={STOPS.length - 1}
        step={1}
        value={index < 0 ? 1 : index}
        onChange={(e) => pick(Number(e.target.value))}
        aria-label={`場景時段:${current.label}`}
        className="phase-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[#f4d9b0] via-[#f6c98f] to-[#4a5b86]"
      />

      <div className="flex justify-between px-0.5 text-[9px] text-ink-dim">
        {STOPS.map((s) => (
          <span key={s.phase} className={s.phase === phase ? "font-bold text-ink-soft" : undefined}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
