"use client";

import { useEffect, useRef, useState } from "react";
import { IMAGE_W, IMAGE_H } from "./hotspots";
import { DECOR, GIRL_RECTS, elementSrc, type DecorName, type GirlState } from "./element-layers";

/**
 * 找貓咪彩蛋:三花貓(豆漿)每次載入隨機出現在一個藏點,點到牠 → 跳一下,
 * 累計「找到幾次」存 localStorage。素材:assets/scene/elements/cat-<pose>.png 轉出的 .webp
 * 座標為底圖像素(與 hotspots 同系統);pointer-events 只開在貓身上。
 *
 * 躲藏效果:貓渲染在元素圖層之上(打光層之下),「躲在盆栽後面」的藏點
 * 是把盆栽(同一張 plant.png、同一個 DECOR rect)再疊繪一次在貓上面,
 * 形成真正的圖層遮擋 —— 貓露出的部分完全由盆栽的形狀決定。
 *
 * 人物「摸貓」狀態出現時,貓不單獨出現(同一隻貓,由 photo-scene 傳 hidden)。
 */

interface CatSpot {
  /** 對應 elements/cat-<pose>.webp */
  pose: "sleep" | "back" | "stretch" | "walk";
  x: number;
  y: number;
  /** 顯示寬高(底圖像素,依各姿勢原圖比例) */
  w: number;
  h: number;
  /** 疊繪在貓上面的裝飾元素(DECOR name),做「躲在後面」的遮擋 */
  coverWith?: DecorName;
  hint: string;
}

/** 藏點(使用者指定;開發可用 ?catspot=N 固定)。
 *  ⚠️ 桌機版底圖是 cover 裁切,太靠左右邊緣的藏點在窄視窗可能被裁掉。 */
const SPOTS: CatSpot[] = [
  // 0. 睡覺貓躲在盆栽後面(真圖層遮擋;頭在圖左側,右移讓頭藏進花盆後)
  { pose: "sleep", x: 460, y: 820, w: 200, h: 139, coverWith: "plant", hint: "躲在盆栽後面睡覺" },
  // 1. 睡覺貓在矮櫃上
  { pose: "sleep", x: 200, y: 650, w: 200, h: 139, hint: "在矮櫃上睡覺" },
  // 2. 睡覺貓在床上(枕頭邊)
  { pose: "sleep", x: 1690, y: 715, w: 200, h: 139, hint: "在床上睡覺" },
  // 3. 背對貓坐在椅子坐墊正中央
  { pose: "back", x: 1038, y: 657, w: 115, h: 179, hint: "坐在椅子上" },
  // 4. 伸展貓在矮櫃旁的地板
  { pose: "stretch", x: 460, y: 830, w: 220, h: 238, hint: "在矮櫃旁伸懶腰" },
  // 5. 伸展貓躲在盆栽後面(真圖層遮擋;頭與前爪藏進花盆後,只露屁股尾巴)
  { pose: "stretch", x: 475, y: 700, w: 230, h: 249, coverWith: "plant", hint: "躲在盆栽後面伸懶腰" },
  // 6. 走路貓在矮櫃上
  { pose: "walk", x: 235, y: 600, w: 200, h: 172, hint: "在矮櫃上散步" },
  // 7. 走路貓正走出畫面左緣(沿矮櫃頂,身體已出框,只剩尾巴;唯一允許超出邊界的藏點)
  { pose: "walk", x: -172, y: 602, w: 200, h: 172, hint: "走出畫面了(只剩尾巴)" },
];

const STORAGE_KEY = "self-site:cat-finds";

interface CatPeekabooProps {
  /** 人物摸貓狀態時 = true,貓不單獨出現 */
  hidden?: boolean;
  /** 在座/離開 —— 「躲盆栽後」藏點要把人物疊繪在貓與盆栽之上(貓 < 盆栽 < 人) */
  present: boolean;
  girlState: GirlState;
}

export function CatPeekaboo({ hidden = false, present, girlState }: CatPeekabooProps) {
  // SSR 期間不選點(避免 hydration mismatch),掛載後在 client 選一次
  const [spot, setSpot] = useState<CatSpot | null>(null);
  const [found, setFound] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("catspot");
    if (q !== null && !Number.isNaN(Number(q))) {
      setSpot(SPOTS[Math.abs(Number(q)) % SPOTS.length]!);
      return;
    }
    setSpot(SPOTS[Math.floor(Math.random() * SPOTS.length)]!);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const onFind = () => {
    if (found || hidden) return;
    setFound(true);
    const n = Number(localStorage.getItem(STORAGE_KEY) ?? "0") + 1;
    localStorage.setItem(STORAGE_KEY, String(n));
    setToast(n === 1 ? `找到貓咪了!牠正${spot?.hint} 🐈` : `又找到豆漿了 · 第 ${n} 次`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  if (spot === null) return null;

  // 「躲在後面」的遮擋物(同一張元素圖、同一個 DECOR rect,疊繪在貓上面)
  const cover = spot.coverWith
    ? DECOR.find((d) => d.name === spot.coverWith)
    : undefined;

  return (
    <>
      <svg
        viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden={hidden}
        style={{ opacity: hidden ? 0 : 1, transition: "opacity 700ms ease" }}
      >
        <g
          transform={`translate(${spot.x} ${spot.y})`}
          style={{ pointerEvents: hidden ? "none" : "auto", cursor: found ? "default" : "pointer" }}
          onClick={onFind}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFind();
            }
          }}
          role="button"
          tabIndex={hidden ? -1 : 0}
          aria-label="看看貓咪在做什麼"
        >
          {/* 點擊判定範圍(透明,略大於貓身) */}
          <rect x={-8} y={-8} width={spot.w + 16} height={spot.h + 16} fill="transparent" />
          <g className={found ? "cat-found" : "cat-peek"} pointerEvents="none">
            <image
              href={elementSrc(`cat-${spot.pose}`)}
              x={0}
              y={0}
              width={spot.w}
              height={spot.h}
              preserveAspectRatio="none"
            />
          </g>
        </g>
        {cover && (
          <>
            <image
              href={elementSrc(cover.name)}
              x={cover.rect.x}
              y={cover.rect.y}
              width={cover.rect.w}
              height={cover.rect.h}
              preserveAspectRatio="none"
              pointerEvents="none"
            />
            {/* 人物比盆栽更靠近鏡頭:把當前人物狀態再疊繪一次(與 element-layers
                同一張圖、同一個 rect、同步淡入淡出),形成 貓 < 盆栽 < 人 */}
            {girlState !== "cat" && (
              <image
                href={elementSrc(`girl-${girlState}`)}
                x={GIRL_RECTS[girlState].x}
                y={GIRL_RECTS[girlState].y}
                width={GIRL_RECTS[girlState].w}
                height={GIRL_RECTS[girlState].h}
                preserveAspectRatio="none"
                pointerEvents="none"
                style={{ opacity: present ? 1 : 0, transition: "opacity 700ms ease" }}
              />
            )}
          </>
        )}
      </svg>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center md:bottom-8">
          <div
            role="status"
            className="rounded-full border border-ink-soft/15 bg-cream/95 px-5 py-2.5 text-sm text-ink shadow-lg backdrop-blur"
          >
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
