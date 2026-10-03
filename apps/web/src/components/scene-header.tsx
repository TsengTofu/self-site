import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** 子頁按鈕:跟右上角狀態膠囊同一套外觀;滑過時微微浮起、箭頭往右上推,一看就知道會帶你去別頁 */
const PAGE_LINK =
  "group pointer-events-auto inline-flex items-center gap-1 rounded-full border border-ink-soft/20 bg-cream/90 py-1 pl-3 pr-2.5 text-xs font-medium text-ink shadow-sm backdrop-blur transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-cream hover:shadow-md active:translate-y-0 active:scale-95";
const PAGE_LINK_ARROW =
  "size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

/**
 * 場景左上角標題:常駐顯示,不再 hover 才展開
 * 左上角是淺色牆面,深色字直接放上去就讀得清楚,不加光暈也不加卡片底
 * 子頁做成按鈕,桌機手機都看得到
 */
export function SceneHeader() {
  return (
    <header
      className="rise-in pointer-events-none absolute left-4 top-4 z-20 select-none md:left-7 md:top-6"
      style={{ animationDelay: "0.45s" }}
    >
      <p className="text-[10px] font-bold tracking-[0.35em] text-[#6d5843]">MY SPACE</p>
      <h1 className="font-hand mt-0.5 text-2xl text-[#33271c] md:text-3xl">
        나의 공간
      </h1>

      {/* 手繪感的波浪底線 */}
      <svg viewBox="0 0 220 10" className="-mt-0.5 h-2.5 w-32 text-[#d98f4e] md:w-36" aria-hidden>
        <path
          d="M3 6 Q 20 1 38 5 T 74 5 T 110 5 T 146 5 T 182 5 T 217 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
      <p className="mt-1.5 text-[11px] font-semibold text-[#4a3a2c] md:text-xs">試著與空間互動吧！</p>

      <nav aria-label="子頁面" className="mt-2.5 flex flex-wrap gap-2">
        <Link href="/resume" className={PAGE_LINK}>
          職涯時間軸
          <ArrowUpRight className={PAGE_LINK_ARROW} strokeWidth={2} aria-hidden />
        </Link>
        <Link href="/making-of" className={PAGE_LINK}>
          視覺製作歷程
          <ArrowUpRight className={PAGE_LINK_ARROW} strokeWidth={2} aria-hidden />
        </Link>
      </nav>
    </header>
  );
}
