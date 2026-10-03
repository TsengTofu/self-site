"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Palette, X } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PhaseBadge } from "@/components/phase-badge";
import { HoverLabel } from "@/components/badge-pill";
import { ROUND_BASE, TONE_CLASS, TONE_TEXT, useControlTone } from "@/lib/control-tone";
import { useSceneStore, selectIsOnline } from "@/stores/scene-store";

/**
 * 右上角的收合選單:平常只有一顆圓鈕,點開往下展開
 * 在線狀態、時段、視覺製作歷程三顆圖示按鈕
 * 收合時如果在線,圓鈕角落留一顆綠點,不用打開也看得到狀態
 */
export function TopMenu() {
  const [open, setOpen] = useState(false);
  const tone = useControlTone();
  const online = useSceneStore(selectIsOnline);
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
        {!open && online && (
          <span aria-hidden className="absolute right-0.5 top-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#5fae74] opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full border border-cream bg-[#4ba05f]" />
          </span>
        )}
      </button>

      {/* 展開的按鈕:依序往下滑出 */}
      <div id={panelId} hidden={!open} className="flex flex-col items-end gap-2">
        {[
          <StatusBadge key="status" />,
          <PhaseBadge key="phase" />,
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
