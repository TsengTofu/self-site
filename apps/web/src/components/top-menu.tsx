"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Music, Palette, X } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PhaseBadge } from "@/components/phase-badge";
import { BadgePill, HoverLabel } from "@/components/badge-pill";
import { EqBars } from "@/components/eq-bars";
import { useStartMusic } from "@/components/music-player";
import { ROUND_BASE, TONE_CLASS, TONE_TEXT, useControlTone } from "@/lib/control-tone";
import { useSceneStore, selectIsOnline } from "@/stores/scene-store";

/**
 * 右上角的收合選單:平常只有一顆圓鈕,點開往下展開
 * 在線狀態、時段、音樂開關、視覺製作歷程四顆圖示按鈕
 * 收合時圓鈕右上角留一顆狀態點(在線綠、離開灰),播音樂時左下角多一組跳動的音符
 */
export function TopMenu() {
  const [open, setOpen] = useState(false);
  const tone = useControlTone();
  const online = useSceneStore(selectIsOnline);
  const playing = useSceneStore((s) => s.playerMode !== "hidden" && s.currentSongId !== null);
  const closePlayer = useSceneStore((s) => s.closePlayer);
  const startMusic = useStartMusic();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // 點選單外面或按 Esc 就收起來
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const round = `group ${ROUND_BASE} ${TONE_CLASS[tone]} ${TONE_TEXT[tone]}`;

  return (
    <div ref={rootRef} className="fixed right-4 top-4 z-20 flex flex-col items-end gap-2 md:right-8 md:top-8">
      <button
        type="button"
        aria-label={open ? "收起選單" : "打開選單"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={round}
      >
        {open ? (
          <X className="size-[18px]" strokeWidth={2.1} aria-hidden />
        ) : (
          <Menu className="size-[18px]" strokeWidth={2.1} aria-hidden />
        )}
        {!open && playing && (
          <span aria-hidden className="absolute -bottom-0.5 -left-1 rounded-full bg-panel/85 px-1 py-0.5">
            <EqBars height={8} className="bg-[#f6c98f]" />
          </span>
        )}
        {!open && (
          <span aria-hidden className="absolute right-0.5 top-0.5 flex size-2.5">
            {online && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#5fae74] opacity-60" />
            )}
            <span
              className={`relative inline-flex size-2.5 rounded-full border border-cream ${online ? "bg-[#4ba05f]" : "bg-[#a39a91]"}`}
            />
          </span>
        )}
      </button>

      {/* 展開的按鈕:依序往下滑出 */}
      <div id={panelId} hidden={!open} className="flex flex-col items-end gap-2">
        {[
          <StatusBadge key="status" />,
          <PhaseBadge key="phase" />,
          <BadgePill
            key="music"
            onClick={playing ? closePlayer : startMusic}
            label={playing ? "關掉音樂" : "播放音樂"}
          >
            {playing ? <EqBars height={12} className="bg-current" /> : <Music className="size-[18px]" strokeWidth={2.1} aria-hidden />}
          </BadgePill>,
          <Link key="making-of" href="/making-of" aria-label="視覺製作歷程" className={round}>
            <Palette className="size-[18px]" strokeWidth={2.1} aria-hidden />
            <HoverLabel>視覺製作歷程</HoverLabel>
          </Link>,
        ].map((item, i) => (
          <div key={i} className="menu-item-in" style={{ animationDelay: `${i * 45}ms` }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
