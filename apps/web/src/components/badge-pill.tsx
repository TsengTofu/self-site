"use client";

import type { ReactNode } from "react";

interface BadgePillProps {
  onClick: () => void;
  title: string;
  children: ReactNode;
  /** 二態開關才給(aria-pressed);循環切換模式的不用 */
  pressed?: boolean;
  /** 讀屏念的完整說明(畫面上只顯示圖示與主文字時,把模式等資訊放這裡) */
  label?: string;
}

/**
 * 右上角狀態膠囊的共用外觀 —— 在線狀態 / 時段兩顆共用同一套視覺
 * 定位交給呼叫端的容器(desk-experience.tsx 用一個 flex column 包起來),
 * 這裡只負責膠囊本身的樣式。
 */
export function BadgePill({ onClick, title, children, pressed, label }: BadgePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={label}
      aria-pressed={pressed}
      className="flex items-center gap-2 rounded-full border border-ink-soft/20 bg-cream/90 py-1.5 pl-3 pr-3.5 text-xs font-medium text-ink shadow-sm backdrop-blur transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-cream hover:shadow-md active:translate-y-0 active:scale-95"
    >
      {children}
    </button>
  );
}
