"use client";

import { useEffect } from "react";
import { Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import { useSceneStore, type PhaseMode, type DayPhase } from "@/stores/scene-store";
import { useEffectivePhase } from "@/hooks/use-time-of-day";
import { usePersistedMode } from "@/hooks/use-persisted-mode";
import { BadgePill } from "@/components/badge-pill";

const CYCLE: PhaseMode[] = ["auto", "dawn", "day", "sunset", "night"];

const PHASE_INFO: Record<DayPhase, { Icon: LucideIcon; label: string }> = {
  dawn: { Icon: Sunrise, label: "清晨" },
  day: { Icon: Sun, label: "白天" },
  sunset: { Icon: Sunset, label: "夕陽" },
  night: { Icon: Moon, label: "夜晚" },
};

const STORAGE_KEY = "self-site:phase-mode";

/**
 * 右上角時段切換器。auto 跟著你的時區(5-7 清晨/7-16 白天/16-19 夕陽/其餘夜晚);
 * 點擊循環 自動 → 清晨 → 白天 → 夕陽 → 夜晚,手動選擇記在 localStorage。
 * 開發校準可用 `?phase=dawn|day|sunset|night` 固定時段(不寫進 localStorage)
 */
export function PhaseBadge() {
  const mode = useSceneStore((s) => s.phaseMode);
  const setPhaseMode = useSceneStore((s) => s.setPhaseMode);
  const phase = useEffectivePhase();
  const { Icon, label } = PHASE_INFO[phase];

  const persist = usePersistedMode(STORAGE_KEY, (saved) => {
    if (saved !== "auto" && (CYCLE as string[]).includes(saved)) {
      setPhaseMode(saved as PhaseMode);
    }
  });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("phase");
    if (q && q !== "auto" && (CYCLE as string[]).includes(q)) setPhaseMode(q as PhaseMode);
  }, [setPhaseMode]);

  const cycle = () => {
    const next = CYCLE[(CYCLE.indexOf(mode) + 1) % CYCLE.length] as PhaseMode;
    setPhaseMode(next);
    persist(next === "auto" ? null : next);
  };

  return (
    <BadgePill
      onClick={cycle}
      title={`場景時段（目前${mode === "auto" ? "自動" : "手動"}）— 點擊切換：自動（跟著你的時區）→ 清晨 → 白天 → 夕陽 → 夜晚`}
      label={`場景時段：${label}（${mode === "auto" ? "自動" : "手動"}）`}
    >
      <Icon className="size-4" strokeWidth={2.1} aria-hidden />
      {label}
    </BadgePill>
  );
}
