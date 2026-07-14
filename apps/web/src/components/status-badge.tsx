"use client";

import { useEffect } from "react";
import { useSceneStore, selectIsOnline, type PresenceMode } from "@/stores/scene-store";

const NEXT_MODE: Record<PresenceMode, PresenceMode> = {
  auto: "online",
  online: "away",
  away: "auto",
};

const MODE_LABEL: Record<PresenceMode, string> = {
  auto: "自動",
  online: "手動",
  away: "手動",
};

const STORAGE_KEY = "self-site:presence-mode";

/**
 * 右上角在線狀態。auto 模式跟著場景裡的女生(在座=上線);
 * 點擊循環切換 自動 → 上線 → 離開,手動選擇會記在 localStorage。
 */
export function StatusBadge() {
  const mode = useSceneStore((s) => s.presenceMode);
  const setPresenceMode = useSceneStore((s) => s.setPresenceMode);
  const online = useSceneStore(selectIsOnline);

  // 還原上次的手動設定
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as PresenceMode | null;
    if (saved === "online" || saved === "away") setPresenceMode(saved);
  }, [setPresenceMode]);

  const cycle = () => {
    const next = NEXT_MODE[mode];
    setPresenceMode(next);
    if (next === "auto") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      title="點擊切換:自動 → 上線 → 離開"
      className="fixed right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[#6b5647]/20 bg-[#faf4ea]/90 py-1.5 pl-3 pr-3.5 text-xs font-medium text-[#4a3c30] shadow-sm backdrop-blur transition hover:shadow-md md:right-8 md:top-8"
    >
      <span className="relative flex size-2.5">
        {online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5fae74] opacity-60" />
        )}
        <span
          className={`relative inline-flex size-2.5 rounded-full ${
            online ? "bg-[#4ba05f]" : "bg-[#c9a066]"
          }`}
        />
      </span>
      {online ? "上線" : "離開"}
      <span className="text-[10px] text-[#a08b74]">{MODE_LABEL[mode]}</span>
    </button>
  );
}
