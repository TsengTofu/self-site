"use client";

import type { ReactNode } from "react";

interface BadgePillProps {
  onClick: () => void;
  title: string;
  children: ReactNode;
  /** 二態開關才給(aria-pressed);循環切換模式的不用 */
  pressed?: boolean;
}

/**
 * 右上角狀態膠囊的共用外觀 —— 在線狀態 / 時段 / 來電三顆共用同一套視覺。
 * 定位交給呼叫端的容器(desk-experience.tsx 用一個 flex column 包三顆),
 * 這裡只負責膠囊本身的樣式。
 */
export function BadgePill({ onClick, title, children, pressed }: BadgePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={pressed}
      className="flex items-center gap-2 rounded-full border border-ink-soft/20 bg-cream/90 py-1.5 pl-3 pr-3.5 text-xs font-medium text-ink shadow-sm backdrop-blur transition hover:shadow-md"
    >
      {children}
    </button>
  );
}
