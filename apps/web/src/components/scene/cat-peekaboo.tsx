"use client";

import { useEffect, useRef, useState } from "react";
import { IMAGE_W, IMAGE_H } from "./hotspots";

/**
 * 躲貓貓彩蛋:每次載入,橘貓(豆漿)隨機躲在一個地點,只探出頭頂與耳朵。
 * 點到 → 整隻跳出來,累計「找到幾次」存 localStorage。
 * 貓的圖來自使用者生成的元素圖(public/scene/elements/cat.png,209×303)。
 * 座標為底圖像素(與 hotspots 同系統);pointer-events 只開在貓身上。
 */

interface Spot {
  x: number;
  /** 藏身邊緣線(貓從這條線後面探出來) */
  y: number;
  /** 這個點的貓顯示寬(底圖像素)— 逐點對齊旁邊物件的透視,而非全域縮放 */
  w: number;
  hint: string;
}

/** 這張底圖(明亮海景房 v2)的藏身點;w 依各點深度手動校準 */
const SPOTS: Spot[] = [
  { x: 690, y: 1180, w: 200, hint: "植物後面" },
  { x: 1480, y: 1420, w: 230, hint: "桌子底下" },
  { x: 2620, y: 1300, w: 215, hint: "床上" },
  { x: 250, y: 1065, w: 175, hint: "黑膠櫃後" },
  { x: 2350, y: 1000, w: 185, hint: "行李袋後" },
  { x: 1060, y: 828, w: 115, hint: "窗台" },
];

const STORAGE_KEY = "self-site:cat-finds";

/** 貓圖原始比例 209×303 */
const CAT_RATIO = 303 / 209;
/** 躲藏時露出的比例(頭頂+耳朵+眼睛 ≈ 上緣 1/3) */
const PEEK_RATIO = 0.33;

export function CatPeekaboo() {
  const [spot] = useState(() => {
    // 開發校準用:?catspot=N 固定藏身點
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("catspot");
      if (q !== null && !Number.isNaN(Number(q))) {
        return SPOTS[Math.abs(Number(q)) % SPOTS.length]!;
      }
    }
    return SPOTS[Math.floor(Math.random() * SPOTS.length)]!;
  });
  const [found, setFound] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const onFind = () => {
    if (found) return;
    setFound(true);
    const n = Number(localStorage.getItem(STORAGE_KEY) ?? "0") + 1;
    localStorage.setItem(STORAGE_KEY, String(n));
    setToast(n === 1 ? "找到貓咪了!牠叫豆漿 🐈" : `又找到豆漿了 · 第 ${n} 次`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const catW = spot.w;
  const catH = Math.round(catW * CAT_RATIO);
  const peekH = Math.round(catH * PEEK_RATIO);

  return (
    <>
      <svg
        viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden={!found}
      >
        <defs>
          {/* 躲藏時只露出邊緣線以上的部分 */}
          <clipPath id="cat-peek-clip">
            <rect x={-catW} y={-peekH - 4} width={catW * 2} height={peekH + 4} />
          </clipPath>
        </defs>
        <g
          transform={`translate(${spot.x} ${spot.y})`}
          style={{ pointerEvents: "auto", cursor: found ? "default" : "pointer" }}
          onClick={onFind}
          role="button"
          aria-label="找找看躲起來的貓"
        >
          <g
            className={`cat-peek ${found ? "cat-found" : ""}`}
            clipPath={found ? undefined : "url(#cat-peek-clip)"}
          >
            {/* 點擊判定範圍(透明,略大於露出的頭) */}
            <rect x={-catW / 2 - 10} y={-peekH - 14} width={catW + 20} height={peekH + 18} fill="transparent" />
            {/* 貓:躲藏時身體沉在邊緣線下,被 clip 掉;找到後整隻站上來 */}
            <image
              href="/scene/elements/cat.png"
              x={-catW / 2}
              y={found ? -catH : -peekH}
              width={catW}
              height={catH}
            />
          </g>
        </g>
      </svg>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center md:bottom-8">
          <div className="rounded-full border border-[#6b5647]/15 bg-[#faf4ea]/95 px-5 py-2.5 text-sm text-[#4a3c30] shadow-lg backdrop-blur">
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
