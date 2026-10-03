"use client";

import { useMockVariant } from "@/lib/mock-variant";

/**
 * 🧪 MOCK:左上子頁按鈕與右上狀態膠囊的配色提案
 * `?btnv=glass|wall|ink`,沒帶參數 = 現行的奶油色
 * 選定之後把選中的那組留下,這個檔案和 btnv key 一起拿掉
 */
export type ControlTone = "cream" | "glass" | "wall" | "ink";

const TONES: readonly ControlTone[] = ["glass", "wall", "ink"];

export function useControlTone(): ControlTone {
  const v = useMockVariant("btnv");
  return TONES.find((t) => t === v) ?? "cream";
}

/** 膠囊共用的形狀與動態(滑過浮起、按下回彈) */
export const CONTROL_BASE =
  "inline-flex items-center gap-1.5 rounded-full border py-1.5 pl-2.5 pr-3 text-xs font-medium backdrop-blur-md transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95";

/** 只有圖示的圓形按鈕(右上選單裡用) */
export const ROUND_BASE =
  "relative grid size-10 place-items-center rounded-full border backdrop-blur-md transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95";

/** 各配色的底色與框線(文字顏色另外放,上線/離開要能蓋過去) */
export const TONE_CLASS: Record<ControlTone, string> = {
  // 現行:奶油色實底,最清楚但也最搶眼
  cream: "border-ink-soft/20 bg-cream/90 shadow-sm hover:bg-cream hover:shadow-md",
  // 霧面玻璃:透出後面的牆,跟場景融在一起
  glass: "border-white/50 bg-white/25 shadow-[0_1px_10px_rgba(60,40,20,.08)] hover:bg-white/45",
  // 牆面色:跟左上牆壁同色系,存在感最低
  wall: "border-[#d6c3a9]/80 bg-[#eee2d1]/80 hover:bg-[#eee2d1]",
  // 深色:小而清楚,夜景裡也讀得到
  ink: "border-transparent bg-[#3a2e24]/70 shadow-sm hover:bg-[#3a2e24]/85",
};

/** 各配色的預設文字顏色 */
export const TONE_TEXT: Record<ControlTone, string> = {
  cream: "text-ink",
  glass: "text-ink",
  wall: "text-ink-soft hover:text-ink",
  ink: "text-cream",
};

/** 上線/離開的顏色;深色底要用亮一點的版本 */
export function presenceColor(tone: ControlTone, online: boolean) {
  if (tone === "ink") return online ? "text-[#a6e0b4]" : "text-[#f2cb8f]";
  return online ? "text-[#3d8a52]" : "text-[#b0742c]";
}
