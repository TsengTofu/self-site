"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ITEMS, type ItemId } from "@/lib/items";
import { useEffectivePhase, type DayPhase } from "@/hooks/use-time-of-day";
import { useSceneStore, selectIsOnline } from "@/stores/scene-store";
import { HOTSPOTS, IMAGE_W, IMAGE_H, type Hotspot } from "./hotspots";
import { SceneOverlays } from "./scene-overlays";
import { CatPeekaboo } from "./cat-peekaboo";
import { ElementLayers } from "./element-layers";

export interface SceneProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
  onItemHover?: (id: ItemId | null, rect?: DOMRect) => void;
  /** 正在搖晃的物件(點到還沒實作的東西) */
  wigglingItem?: ItemId | null;
}

/** 依序探測這些檔名,找到就啟用圖片場景 */
export const SCENE_EMPTY_CANDIDATES = [
  "/scene/room-empty.jpg",
  "/scene/room-empty.png",
  "/scene/room-empty.webp",
];
/** 可選:同構圖但「有人坐在椅子上」的版本,提供後在座/離開會交叉淡變 */
export const SCENE_PRESENT_CANDIDATES = [
  "/scene/room-present.jpg",
  "/scene/room-present.png",
  "/scene/room-present.webp",
];

/**
 * 時段色調 — 用 multiply 混合做自然的光線變化,
 * 只調整明暗與色溫,不蓋掉插畫本身的顏色。
 */
const PHASE_TINT: Record<DayPhase, { color: string; opacity: number }> = {
  dawn: { color: "#f2d8e2", opacity: 0.35 },
  day: { color: "transparent", opacity: 0 },
  sunset: { color: "#f5cba6", opacity: 0.4 },
  night: { color: "#9fb0cf", opacity: 0.6 },
};

interface PhotoSceneProps extends SceneProps {
  /** 空景底圖網址 */
  emptySrc: string;
  /** 「有人版」圖片網址(沒有就不做在座淡變) */
  presentSrc: string | null;
}

/**
 * 圖片場景:以插畫原圖為底,鋪上隱形互動熱區。
 * 底圖與熱區都以 cover 方式鋪滿,共用同一個座標系所以永遠對齊。
 */
export function PhotoScene({
  onItemClick,
  onItemHover,
  wigglingItem,
  emptySrc,
  presentSrc,
}: PhotoSceneProps) {
  const phase = useEffectivePhase();
  const present = useSceneStore(selectIsOnline);
  const phoneRinging = useSceneStore((s) => s.phoneRinging);
  const tint = PHASE_TINT[phase];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<ItemId | null>(null);

  // 手機:預設把畫面捲到圖片中央(書桌區)
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, []);

  const handleClick = (id: ItemId) => (e: MouseEvent<SVGElement>) => {
    onItemClick(id, e.currentTarget.getBoundingClientRect());
  };
  const handleKey = (id: ItemId) => (e: KeyboardEvent<SVGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onItemClick(id, e.currentTarget.getBoundingClientRect());
    }
  };

  const shapeProps = (spot: Hotspot) => ({
    "data-item": spot.id,
    className: `photo-hotspot ${wigglingItem === spot.id ? "item-wiggle" : ""}`,
    role: "button" as const,
    tabIndex: 0,
    "aria-label": `${ITEMS[spot.id].label} — ${ITEMS[spot.id].hint}`,
    onClick: handleClick(spot.id),
    onKeyDown: handleKey(spot.id),
    onMouseEnter: (e: MouseEvent<SVGElement>) => {
      setHoveredItem(spot.id);
      onItemHover?.(spot.id, e.currentTarget.getBoundingClientRect());
    },
    onMouseLeave: () => {
      setHoveredItem(null);
      onItemHover?.(null);
    },
  });

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-x-auto overflow-y-hidden overscroll-x-contain bg-[#efe3d3] [scrollbar-width:none] md:overflow-hidden"
    >
      {/* 手機:高度貼滿、寬度依圖片比例 → 可左右滑動;桌機:填滿裁切 */}
      <div
        className="relative h-full md:w-full"
        style={{ aspectRatio: `${IMAGE_W} / ${IMAGE_H}` }}
      >
      {/* 底圖(空景) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={emptySrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {/* 有人版:在座時淡入(提供 room-present.* 後啟用) */}
      {presentSrc && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={presentSrc}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: present ? 1 : 0 }}
        />
      )}

      {/* 觸發點圖層插槽(手繪去背圖,疊在底圖上、時段色調之下,讓夜晚光線蓋得到) */}
      <ElementLayers hoveredItem={hoveredItem} />

      {/* 時段色調(依你的時區,multiply 只調光線不蓋顏色) */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-1000"
        style={{
          backgroundColor: tint.color,
          opacity: tint.opacity,
          mixBlendMode: "multiply",
        }}
      />
      {/* 夜晚加一點暖燈暈(screen 混合,像桌上有燈) */}
      {phase === "night" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 55% 62%, rgba(255,205,130,0.35), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* 分層活元素(海鷗、波光、浮塵)—— 疊在底圖上、熱區下 */}
      <SceneOverlays />

      {/* 互動熱區(與底圖同座標系,object-cover ↔ slice 對齊) */}
      <svg
        viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-label="我的書桌"
      >
        {/* 來電中:電話上冒出聲波圈(不吃事件,點擊仍落在電話熱區) */}
        {phoneRinging && (
          <g pointerEvents="none">
            <circle cx={1313} cy={1028} className="ring-pulse" />
            <circle cx={1313} cy={1028} className="ring-pulse" style={{ animationDelay: "0.55s" }} />
            <text
              x={1313}
              y={938}
              textAnchor="middle"
              fontSize={52}
              className="ring-bell"
            >
              🔔
            </text>
          </g>
        )}
        {HOTSPOTS.map((spot, i) => {
          const common = shapeProps(spot);
          return (
            <g key={`${spot.id}-${i}`}>
              {spot.rect && (
                <rect
                  {...common}
                  x={spot.rect.x}
                  y={spot.rect.y}
                  width={spot.rect.w}
                  height={spot.rect.h}
                  rx={14}
                />
              )}
              {spot.points && <polygon {...common} points={spot.points} />}
              {/* 鏡頭縮放目標:透明、不吃事件,只給鏡頭算位置 */}
              {spot.screenRect && (
                <rect
                  data-zoom-target={spot.id}
                  pointerEvents="none"
                  fill="transparent"
                  x={spot.screenRect.x}
                  y={spot.screenRect.y}
                  width={spot.screenRect.w}
                  height={spot.screenRect.h}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* 躲貓貓彩蛋(疊在最上層,只有貓身可點) */}
      <CatPeekaboo />
      </div>
    </div>
  );
}
