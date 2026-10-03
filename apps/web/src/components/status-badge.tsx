"use client";

import { useSceneStore, selectIsOnline, type PresenceMode } from "@/stores/scene-store";
import { usePersistedMode } from "@/hooks/use-persisted-mode";
import { BadgePill } from "@/components/badge-pill";
import { Coffee, UserRoundCheck } from "lucide-react";
import { presenceColor, useControlTone } from "@/lib/control-tone";

const NEXT_MODE: Record<PresenceMode, PresenceMode> = {
  auto: "online",
  online: "away",
  away: "auto",
};

/** 模式說明只放在 title / aria-label,畫面上不再顯示「自動 / 手動」小字 */
const MODE_LABEL: Record<PresenceMode, string> = {
  auto: "自動",
  online: "手動",
  away: "手動",
};

const STORAGE_KEY = "self-site:presence-mode";

/**
 * 右上角在線狀態。auto 模式跟著場景裡的女生(在座=上線);
 * 點擊循環切換 自動 → 上線 → 離開,手動選擇會記在 localStorage。
 * 上線是綠色的人像打勾,離開是橘色的咖啡杯(去倒杯咖啡了)
 */
export function StatusBadge() {
  const mode = useSceneStore((s) => s.presenceMode);
  const setPresenceMode = useSceneStore((s) => s.setPresenceMode);
  const online = useSceneStore(selectIsOnline);
  const tone = useControlTone();

  const persist = usePersistedMode(STORAGE_KEY, (saved) => {
    if (saved === "online" || saved === "away") setPresenceMode(saved as PresenceMode);
  });

  const cycle = () => {
    const next = NEXT_MODE[mode];
    setPresenceMode(next);
    persist(next === "auto" ? null : next);
  };

  const Icon = online ? UserRoundCheck : Coffee;

  return (
    <BadgePill
      onClick={cycle}
      title={`目前${MODE_LABEL[mode]}・點擊切換：自動 → 上線 → 離開`}
      label={`在線狀態：${online ? "上線" : "離開"}（${MODE_LABEL[mode]}）`}
      textClassName={presenceColor(tone, online)}
    >
      <Icon className="size-4" strokeWidth={2.1} aria-hidden />
      {online ? "上線" : "離開"}
    </BadgePill>
  );
}
