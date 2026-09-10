"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SceneHeaderProps {
  /** 重播首訪提示脈衝（見 hooks/use-hotspot-hint.ts） */
  onReplayHint: () => void;
}

/**
 * 場景左上角標題：手寫字直接落在插畫上，用奶油色光暈保持易讀（不加卡片底）。
 * 極簡排版 —— 主標維持小尺寸不搶場景，副標與波浪底線平常收起，
 * hover / focus 標題區才展開（觸控裝置沒有 hover，靠場景本身與 dock 導覽即可）。
 */
export function SceneHeader({ onReplayHint }: SceneHeaderProps) {
  // 觸控裝置沒有 hover:首載先把展開區亮出來幾秒(副標 + 子頁連結),
  // 之後點標題可再切換;桌機不受影響(hover / focus 照舊)
  const [touchPeek, setTouchPeek] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    setTouchPeek(true);
    const t = setTimeout(() => setTouchPeek(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <header
      className="rise-in group pointer-events-none absolute left-4 top-4 z-20 select-none md:left-7 md:top-6"
      style={{
        animationDelay: "0.45s",
        textShadow:
          "0 1px 0 rgba(250,244,234,.95), 0 -1px 0 rgba(250,244,234,.9), 1px 0 0 rgba(250,244,234,.9), -1px 0 0 rgba(250,244,234,.9), 0 2px 6px rgba(250,244,234,.9), 0 0 18px rgba(250,244,234,.85), 0 0 34px rgba(250,244,234,.7)",
      }}
    >
      <p className="text-[10px] font-bold tracking-[0.35em] text-[#6d5843]">ON MY DESK</p>
      <h1 className="font-hand pointer-events-auto mt-0.5 text-2xl text-[#33271c] md:text-3xl">
        {/* 觸控裝置點標題切換展開區;做成 button 鍵盤才有路徑、讀屏才知道它可展開 */}
        <button
          type="button"
          aria-expanded={touchPeek}
          onClick={() => setTouchPeek((v) => !v)}
          className="text-left"
        >
          책상 위의 나 <span className="text-[#6d5340]">— Tofu</span>
        </button>
      </h1>

      {/* 展開區：hover 標題（或鍵盤 focus 到 ✦）時淡入 */}
      <div
        className="opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
        style={touchPeek ? { opacity: 1 } : undefined}
      >
        {/* 手繪感的波浪底線 */}
        <svg viewBox="0 0 220 10" className="-mt-1 h-2.5 w-32 text-[#d98f4e] md:w-36" aria-hidden>
          <path
            d="M3 6 Q 20 1 38 5 T 74 5 T 110 5 T 146 5 T 182 5 T 217 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#4a3a2c] md:text-xs">
          桌上的每樣東西都藏著一部分的我，點點看
          <button
            type="button"
            onClick={onReplayHint}
            aria-label="提示可以點的東西"
            title="提示可以點的東西"
            className="pointer-events-auto inline-grid size-4 place-items-center rounded-full transition hover:scale-125"
          >
            ✦
          </button>
        </p>
        {/* 真實內部連結：讓 /resume 與 /making-of 對爬蟲與螢幕閱讀器一步可達
            （視覺上收在展開區，但 DOM 常駐，不是 display:none） */}
        <nav aria-label="子頁面" className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold md:text-xs">
          <Link
            href="/resume"
            className="pointer-events-auto text-[#4a3a2c] underline decoration-[#d98f4e]/70 decoration-wavy underline-offset-4 transition hover:text-[#33271c]"
          >
            職涯時間軸
          </Link>
          <Link
            href="/making-of"
            className="pointer-events-auto text-[#4a3a2c] underline decoration-[#d98f4e]/70 decoration-wavy underline-offset-4 transition hover:text-[#33271c]"
          >
            視覺製作歷程
          </Link>
        </nav>
      </div>
    </header>
  );
}
