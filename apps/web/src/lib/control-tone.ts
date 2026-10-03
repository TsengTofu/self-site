"use client";

import { useMockVariant } from "@/lib/mock-variant";
import { useEffectivePhase, type DayPhase } from "@/hooks/use-time-of-day";

/**
 * 🧪 MOCK:右上角選單按鈕的配色提案,沒帶參數 = 現行的奶油色
 * `?btnv=glass|wall|ink|sage|clay|sea|blush|outline|sticker|phase`
 * phase 不是固定顏色,會跟著時段換(清晨粉、白天奶油、黃昏陶土、夜晚深色)
 * 選定之後把選中的那組留下,這個檔案和 btnv key 一起拿掉
 */
export type ControlTone =
  "cream" | "glass" | "wall" | "ink" | "sage" | "clay" | "sea" | "blush" | "outline" | "sticker";

const TONES: readonly ControlTone[] = [
  "glass",
  "wall",
  "ink",
  "sage",
  "clay",
  "sea",
  "blush",
  "outline",
  "sticker",
];

/** btnv=phase 時,各時段用哪一組 */
const PHASE_TONE: Record<DayPhase, ControlTone> = {
  dawn: "blush",
  day: "cream",
  sunset: "clay",
  night: "ink",
};

export function useControlTone(): ControlTone {
  const v = useMockVariant("btnv");
  const phase = useEffectivePhase();
  if (v === "phase") return PHASE_TONE[phase];
  return TONES.find((t) => t === v) ?? "cream";
}

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
  // 鼠尾草綠:取自背包和床單,跟房間同色系但比奶油色清楚
  sage: "border-[#6f7f62]/40 bg-[#8a9a7b]/85 shadow-sm hover:bg-[#8a9a7b]",
  // 陶土色:取自盆栽,暖色、在牆上最跳
  clay: "border-[#a85f42]/40 bg-[#c97b5a]/85 shadow-sm hover:bg-[#c97b5a]",
  // 海藍:取自窗外的海,跟暖色牆面對比
  sea: "border-[#3f7590]/40 bg-[#5b8fa8]/80 shadow-sm hover:bg-[#5b8fa8]",
  // 清晨粉:柔和、存在感低,但比牆面色好認
  blush: "border-[#e2b7b0]/70 bg-[#f6dcd5]/85 shadow-sm hover:bg-[#f6dcd5]",
  // 只有線條:跟插畫的描線一樣,不加底色
  outline: "border-ink/60 bg-transparent hover:bg-ink/5",
  // 貼紙:白底黑框加實心陰影,像手繪貼紙
  sticker:
    "border-ink/80 bg-[#fffaf0] shadow-[2px_2px_0_rgba(62,50,38,0.85)] hover:shadow-[3px_3px_0_rgba(62,50,38,0.85)]",
};

/** 各配色的預設文字顏色 */
export const TONE_TEXT: Record<ControlTone, string> = {
  cream: "text-ink",
  glass: "text-ink",
  wall: "text-ink-soft hover:text-ink",
  ink: "text-cream",
  sage: "text-cream",
  clay: "text-cream",
  sea: "text-white",
  blush: "text-ink",
  outline: "text-ink",
  sticker: "text-ink",
};
