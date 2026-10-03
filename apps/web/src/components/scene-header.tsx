"use client";

import Link from "next/link";
import { FileUser, Palette } from "lucide-react";
import { CONTROL_BASE, TONE_CLASS, TONE_TEXT, useControlTone } from "@/lib/control-tone";

/** 圖示滑過時往上跳一下,一看就知道可以點 */
const LINK_ICON = "size-4 transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:-rotate-6";

/**
 * 場景左上角標題:常駐顯示,不再 hover 才展開
 * 左上角是淺色牆面,深色字直接放上去就讀得清楚,不加光暈也不加卡片底
 * 子頁做成按鈕,桌機手機都看得到
 */
export function SceneHeader() {
  const tone = useControlTone();
  const link = `group pointer-events-auto ${CONTROL_BASE} ${TONE_CLASS[tone]} ${TONE_TEXT[tone]}`;

  return (
    <header
      className="rise-in pointer-events-none absolute left-4 top-4 z-20 select-none md:left-7 md:top-6"
      style={{ animationDelay: "0.45s" }}
    >
      <p className="text-[10px] font-bold tracking-[0.35em] text-[#6d5843]">MY SPACE</p>
      {/* Gowun Dodum 只有一種字重,加一點同色描邊讓它粗一些,字形不會走樣 */}
      <h1 className="font-hand mt-0.5 text-2xl text-[#33271c] [-webkit-text-stroke:0.6px_currentColor] md:text-3xl">
        나의 공간
      </h1>
      <p className="mt-1.5 text-[11px] font-semibold text-[#4a3a2c] md:text-xs">試著與空間互動吧！</p>

      <nav aria-label="子頁面" className="mt-2.5 flex flex-wrap gap-2">
        <Link href="/resume" className={link}>
          <FileUser className={LINK_ICON} strokeWidth={2.1} aria-hidden />
          履歷
        </Link>
        <Link href="/making-of" className={link}>
          <Palette className={LINK_ICON} strokeWidth={2.1} aria-hidden />
          視覺製作歷程
        </Link>
      </nav>
    </header>
  );
}
