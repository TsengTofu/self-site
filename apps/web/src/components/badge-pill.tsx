"use client";

import type { ReactNode } from "react";
import { ROUND_BASE, TONE_CLASS, TONE_TEXT, useControlTone } from "@/lib/control-tone";

interface BadgePillProps {
  onClick: () => void;
  /** 讀屏念的完整說明,也是滑過時左邊冒出的文字 */
  label: string;
  children: ReactNode;
  /** 二態開關才給(aria-pressed);循環切換模式的不用 */
  pressed?: boolean;
  /** 換掉預設的文字顏色(例如離開橘) */
  textClassName?: string;
}

/**
 * 右上選單裡的圓形按鈕:畫面上只有圖示,說明放在 aria-label,
 * 桌機滑過時在左邊冒出一小段文字
 */
export function BadgePill({ onClick, label, children, pressed, textClassName }: BadgePillProps) {
  const tone = useControlTone();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`group ${ROUND_BASE} ${TONE_CLASS[tone]} ${textClassName ?? TONE_TEXT[tone]}`}
    >
      {children}
      <HoverLabel>{label}</HoverLabel>
    </button>
  );
}

/** 滑過按鈕時,左邊冒出的文字說明(觸控裝置沒有 hover,就靠 aria-label) */
export function HoverLabel({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-[#3a2e24]/90 px-2.5 py-1 text-xs font-medium text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}
