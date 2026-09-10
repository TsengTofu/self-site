"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, X } from "lucide-react";
import { ITEMS, type ItemId } from "@/lib/items";
import { ItemIcon } from "@/components/item-icons";
import { PhaseSlider } from "./phase-slider";
import { PresenceChip } from "./presence-chip";
import { RingToggle } from "./ring-toggle";

/** 導覽清單(與舊 dock 同一組物件,順序沿用) */
const NAV_ITEMS: ItemId[] = [
  "phone",
  "laptop",
  "headphones",
  "backpack",
  "notebook",
  "skateboard",
  "window",
  "bookStack",
  "poster",
];

/** 展開造型:list=垂直清單 / sheet=底部面板(手機)· 置中卡片(桌機) */
export type OrbitShape = "list" | "sheet";

interface OrbitNavProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
  shape: OrbitShape;
}

/**
 * 圓形導覽鈕:收合時是右下角一顆圓,點開後展開所有可互動物件 + 場景設定
 * (時段滑桿、來電開關;在座狀態為純顯示)。
 * 兩種展開造型由 shape 決定,目前是 mock 比較階段(見 ?navv 參數)。
 */
export function OrbitNav({ onItemClick, shape }: OrbitNavProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Esc 收合;外部「輕點」收合 —— 但拖曳不收合,
  // 因為手機版場景本身要能左右滑動看全景(見 photo-scene 的橫向捲動容器)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    let down: { x: number; y: number; outside: boolean } | null = null;
    const isOutside = (t: EventTarget | null) => !rootRef.current?.contains(t as Node);
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, outside: isOutside(e.target) };
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      // 位移 < 8px 才算「點擊」;滑動場景不會誤關選單
      if (down.outside && isOutside(e.target) && moved < 8) setOpen(false);
      down = null;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [open]);

  const pick = (id: ItemId) => (e: React.MouseEvent<HTMLButtonElement>) => {
    onItemClick(id, e.currentTarget.getBoundingClientRect());
    setOpen(false);
  };

  /** 圓形觸發鈕(兩種造型共用) */
  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={open ? "收起導覽" : "打開導覽"}
      className="grid size-14 place-items-center rounded-full border border-ink-soft/20 bg-cream/95 text-ink shadow-lg backdrop-blur transition hover:scale-105 active:scale-95"
    >
      {open ? (
        <X className="size-6" strokeWidth={1.8} />
      ) : (
        <Compass className="size-6" strokeWidth={1.6} />
      )}
    </button>
  );

  /** 設定區(時段滑桿 + 在座顯示 + 來電開關) */
  const settings = (
    <div className="flex w-56 flex-col gap-2 rounded-2xl border border-ink-soft/15 bg-cream/95 p-2.5 shadow-lg backdrop-blur">
      <PhaseSlider className="border-0 bg-transparent p-0 shadow-none" />
      <div className="h-px bg-ink-soft/12" />
      <RingToggle />
      <div className="px-2.5 pb-0.5">
        <PresenceChip />
      </div>
    </div>
  );

  // ── 造型 1:垂直清單 ───────────────────────────────────────────
  if (shape === "list") {
    return (
      <div ref={rootRef} className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        <div
          className="flex flex-col items-end gap-2 transition-all duration-300"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(12px)",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {settings}
          <div className="flex max-h-[52vh] w-56 flex-col overflow-y-auto rounded-2xl border border-ink-soft/15 bg-cream/95 p-1.5 shadow-lg backdrop-blur [scrollbar-width:none]">
            {NAV_ITEMS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={pick(id)}
                tabIndex={open ? 0 : -1}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-ink transition hover:bg-ink-soft/10"
              >
                <ItemIcon id={id} className="size-5 text-ink-soft" />
                <span className="flex-1">{ITEMS[id].label}</span>
                <span className="text-[10px] text-ink-dim">{ITEMS[id].hint}</span>
              </button>
            ))}
          </div>
        </div>
        {trigger}
      </div>
    );
  }

  // ── 造型 2:面板(手機底部升起 / 桌機置中卡片)──────────────────
  return (
    <div ref={rootRef}>
      {/* 遮罩不吃事件(pointer-events-none):手機版場景仍可左右滑動看全景;
          關閉靠面板的 ✕、Esc、或在場景上「輕點」(見上方 pointerup 判定) */}
      {open && (
        <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-end bg-night/25 px-0 md:items-center md:px-4">
          <div className="rise-in pointer-events-auto mx-auto w-full max-w-lg rounded-t-3xl border-t border-ink-soft/15 bg-cream/97 p-5 pb-8 shadow-2xl md:mb-6 md:rounded-3xl md:border">
            <p className="mb-3 text-[10px] font-bold tracking-[0.3em] text-ink-dim">桌上的物件</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {NAV_ITEMS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={pick(id)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3 text-ink-soft transition hover:bg-ink-soft/10 active:scale-95"
                >
                  <ItemIcon id={id} className="size-6" />
                  <span className="text-[10px] text-ink-dim">{ITEMS[id].label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2.5 border-t border-ink-soft/12 pt-4">
              <PhaseSlider className="border-0 bg-transparent p-0 shadow-none" />
              <RingToggle />
              <div className="px-2.5">
                <PresenceChip />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-6 right-6 z-40">{trigger}</div>
    </div>
  );
}
