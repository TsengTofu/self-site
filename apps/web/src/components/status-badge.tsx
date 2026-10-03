"use client";

import { useSceneStore, selectIsOnline, type PresenceMode } from "@/stores/scene-store";
import { usePersistedMode } from "@/hooks/use-persisted-mode";
import { BadgePill } from "@/components/badge-pill";

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
 * 上線是會呼吸的綠色點點,離開是不動的灰色點點
 */
export function StatusBadge() {
  const mode = useSceneStore((s) => s.presenceMode);
  const setPresenceMode = useSceneStore((s) => s.setPresenceMode);
  const online = useSceneStore(selectIsOnline);

  const persist = usePersistedMode(STORAGE_KEY, (saved) => {
    if (saved === "online" || saved === "away") setPresenceMode(saved as PresenceMode);
  });

  const cycle = () => {
    const next = NEXT_MODE[mode];
    setPresenceMode(next);
    persist(next === "auto" ? null : next);
  };

  const state = online ? "上線" : "離開";

  return (
    <BadgePill
      onClick={cycle}
      label={`${state}（${MODE_LABEL[mode]}）・點一下切換`}
    >
      {/* 上線:綠色點點加呼吸擴散;離開:灰色點點,不動 */}
      <span className="relative flex size-2.5">
        {online && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#5fae74] opacity-60" />
        )}
        <span className={`relative inline-flex size-2.5 rounded-full ${online ? "bg-[#4ba05f]" : "bg-[#a39a91]"}`} />
      </span>
    </BadgePill>
  );
}
