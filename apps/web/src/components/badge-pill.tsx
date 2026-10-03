"use client";

import type { ReactNode } from "react";
import { CONTROL_BASE, TONE_CLASS, TONE_TEXT, useControlTone } from "@/lib/control-tone";

interface BadgePillProps {
  onClick: () => void;
  title: string;
  children: ReactNode;
  /** 二態開關才給(aria-pressed);循環切換模式的不用 */
  pressed?: boolean;
  /** 讀屏念的完整說明(畫面上只顯示圖示與主文字時,把模式等資訊放這裡) */
  label?: string;
  /** 換掉預設的文字顏色(例如上線綠、離開橘) */
  textClassName?: string;
}

/**
 * 右上角狀態膠囊的共用外觀 —— 在線狀態 / 時段兩顆共用同一套視覺
 * 定位交給呼叫端的容器(desk-experience.tsx 用一個 flex column 包起來),
 * 這裡只負責膠囊本身的樣式。
 */
export function BadgePill({ onClick, title, children, pressed, label, textClassName }: BadgePillProps) {
  const tone = useControlTone();
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={label}
      aria-pressed={pressed}
      className={`${CONTROL_BASE} ${TONE_CLASS[tone]} ${textClassName ?? TONE_TEXT[tone]}`}
    >
      {children}
    </button>
  );
}
