"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { House, MoveHorizontal } from "lucide-react";
import { RAIL } from "@/data/making-of-v2";
import { setupGsapTickerFallback } from "@/lib/gsap-setup";
import { C, DeckPanel, DeckStyles, PANEL_BG, PANELS } from "./making-of-deck";

// 面板裡有 GSAP 動畫,背景分頁或內嵌預覽時 rAF 會停,沿用場景頁的 ticker 保險
setupGsapTickerFallback();

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

/**
 * 製作歷程的上下捲動版(/making-of/scroll):跟履歷頁一樣往下滑,
 * 每捲一次停在下一個面板(scroll snap),內容比畫面高的面板可以在裡面繼續捲
 * 面板內容跟橫向 deck 共用(DeckPanel),原本的 /making-of 不受影響
 */
export function MakingOfScroll() {
  const scrollerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  // 哪個面板佔畫面一半以上,就當作目前這一頁(右邊的點跟著亮)
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-panel]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.scrollPanel));
        }
      },
      { root, threshold: 0.5 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (index: number) => {
    const section = scrollerRef.current?.querySelector<HTMLElement>(`[data-scroll-panel="${index}"]`);
    section?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  const jumpToHash = (hash: string) => {
    const index = PANELS.findIndex((p) => p.hash === hash);
    if (index >= 0) jumpTo(index);
  };

  return (
    <main
      ref={scrollerRef}
      className="h-dvh snap-y snap-mandatory overflow-y-auto"
      style={{ backgroundColor: C.cream, color: "#3e3226" }}
    >
      <DeckStyles />

      {PANELS.map((panel, i) => (
        <section
          key={panel.key}
          id={panel.hash ?? undefined}
          data-scroll-panel={i}
          aria-label={RAIL[i]}
          // snap-always:一次滑動最多前進一頁,不會一口氣滑過好幾頁
          className="relative flex min-h-dvh snap-start snap-always flex-col justify-center"
          style={{ background: PANEL_BG[panel.key] }}
        >
          <DeckPanel panelKey={panel.key} reduced={reduced} onJump={jumpToHash} labActive={active === i} />
        </section>
      ))}

      {/* 左上:回到場景、切回橫向版 */}
      <nav aria-label="其他頁面" className="fixed left-4 top-4 z-20 flex gap-2 md:left-6 md:top-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f6f0e4]/90 px-3 py-1.5 text-xs font-medium text-[#3e3226] shadow-sm backdrop-blur transition hover:-translate-y-0.5"
        >
          <House className="size-3.5" aria-hidden />
          回到場景
        </Link>
        <Link
          href="/making-of"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f6f0e4]/90 px-3 py-1.5 text-xs font-medium text-[#3e3226] shadow-sm backdrop-blur transition hover:-translate-y-0.5"
        >
          <MoveHorizontal className="size-3.5" aria-hidden />
          橫向版
        </Link>
      </nav>

      {/* 右側頁碼點:目前這頁拉長亮起,點了直接跳過去 */}
      <nav
        aria-label="章節"
        className="fixed right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 rounded-full bg-[#f6f0e4]/85 px-1.5 py-3 shadow-sm backdrop-blur md:right-5"
      >
        {PANELS.map((panel, i) => (
          <button
            key={panel.key}
            type="button"
            aria-label={RAIL[i]}
            aria-current={active === i ? "true" : undefined}
            title={RAIL[i]}
            onClick={() => jumpTo(i)}
            className={`w-2 rounded-full transition-all duration-300 ${active === i ? "h-6 bg-[#3e3226]" : "h-2 bg-[#3e3226]/30 hover:bg-[#3e3226]/60"}`}
          />
        ))}
      </nav>
    </main>
  );
}
