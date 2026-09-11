"use client";

import { useSceneStore, selectIsOnline } from "@/stores/scene-store";

/**
 * 在座狀態 —— 純顯示,不可點(舊版 StatusBadge 可循環切換 auto/上線/離開)。
 * 場景裡人物在不在畫面上本身就是答案,這裡只是加一句文字說明。
 */
export function PresenceChip({ className = "" }: { className?: string }) {
  const online = useSceneStore(selectIsOnline);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-ink-soft ${className}`}
      aria-live="polite"
    >
      <span className="relative grid size-2 place-items-center">
        <span
          className={`size-2 rounded-full ${online ? "bg-[#5fae7a]" : "bg-[#d3b483]"}`}
          aria-hidden
        />
        {online && (
          <span className="absolute size-2 animate-ping rounded-full bg-[#5fae7a]/70" aria-hidden />
        )}
      </span>
      {online ? "在座上" : "離開一下"}
    </span>
  );
}
