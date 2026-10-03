"use client";

import { useEffectivePhase } from "@/hooks/use-time-of-day";

/** 標題字色跟著時段換:夜晚牆面很暗,改用淺色字,其他時段牆面夠亮,用深色字 */
const TITLE_COLOR = {
  light: { eyebrow: "text-[#6d5843]", title: "text-[#33271c]" },
  dark: { eyebrow: "text-[#d3c5b2]", title: "text-[#f5ede1]" },
};

/**
 * 場景左上角標題:常駐顯示,不加光暈也不加卡片底,字色跟著時段的牆面明暗切換
 * 履歷從場景裡的手機進去,視覺製作歷程收進右上角的選單
 */
export function SceneHeader() {
  const phase = useEffectivePhase();
  const color = phase === "night" ? TITLE_COLOR.dark : TITLE_COLOR.light;

  return (
    <header
      className="rise-in pointer-events-none absolute left-4 top-4 z-20 select-none md:left-7 md:top-6"
      style={{ animationDelay: "0.45s" }}
    >
      <p className={`text-[10px] font-bold tracking-[0.35em] transition-colors duration-1000 ${color.eyebrow}`}>
        MY SPACE
      </p>
      {/* Gowun Dodum 只有一種字重,加一點同色描邊讓它粗一些,字形不會走樣 */}
      <h1
        className={`font-hand mt-0.5 text-2xl transition-colors duration-1000 [-webkit-text-stroke:0.6px_currentColor] md:text-3xl ${color.title}`}
      >
        나의 공간
      </h1>
    </header>
  );
}
