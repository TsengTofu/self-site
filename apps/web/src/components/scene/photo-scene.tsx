"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Image from "next/image";
import { ITEMS, ITEM_OVERLAY, type ItemId } from "@/lib/items";
import { useEffectivePhase, type DayPhase } from "@/hooks/use-time-of-day";
import { useSceneStore, selectIsOnline } from "@/stores/scene-store";
import { HOTSPOTS, IMAGE_W, IMAGE_H, hotspotBBox, type Hotspot } from "./hotspots";
import { CatPeekaboo } from "./cat-peekaboo";
import { ElementLayers, GIRL_STATES, type GirlState } from "./element-layers";
import roomEmpty from "../../../public/scene/room-empty.jpg";
import lightDawn from "../../../public/scene/light-dawn.png";
import lightDay from "../../../public/scene/light-day.png";
import lightSunset from "../../../public/scene/light-sunset.png";
import lightNight from "../../../public/scene/light-night.png";

export interface SceneProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
  /** 正在搖晃的物件(點到還沒實作的東西) */
  wigglingItem?: ItemId | null;
  /** 首訪提示脈衝正在播放(見 hooks/use-hotspot-hint.ts) */
  hinting?: boolean;
}

interface Tooltip {
  id: ItemId;
  x: number;
  y: number;
}

/**
 * 來電聲波圈的錨點 —— 由 phone 熱區的外接框中心推導(單一座標來源),
 * 不再另外手抄一組 cx/cy(舊值 cx=1313 cy=1028,推導後 ≈ 1313,1033,誤差在畫面上不可見)。
 */
const phoneHotspot = HOTSPOTS.find((spot) => spot.id === "phone");
const PHONE_BBOX = phoneHotspot ? hotspotBBox(phoneHotspot) : { x: 0, y: 0, w: 0, h: 0 };
const PHONE_CENTER_X = PHONE_BBOX.x + PHONE_BBOX.w / 2;
const PHONE_CENTER_Y = PHONE_BBOX.y + PHONE_BBOX.h / 2;
/** 響鈴 emoji 顯示在聲波圈上方一點的位置(相對電話中心的偏移) */
const RING_BELL_OFFSET_Y = -55;

/**
 * 時段打光層 — 使用者提供的四張帶 alpha 漸層圖,整張壓在場景上;
 * 白天幾乎透明,夜晚是藍色調 + 檯燈位置的暖黃光暈。
 */
const PHASE_LIGHTS: Record<DayPhase, typeof lightDay> = {
  dawn: lightDawn,
  day: lightDay,
  sunset: lightSunset,
  night: lightNight,
};

/**
 * 🔧 打光強度(細緻度調整入口):1 = 原圖強度,調小會讓該時段的光影變淡。
 * 想改光的「形狀/顏色」就直接覆蓋 public/scene/light-<phase>.png。
 */
const LIGHT_INTENSITY: Record<DayPhase, number> = {
  dawn: 1,
  day: 1,
  sunset: 1,
  night: 1,
};

interface PhotoSceneProps extends SceneProps {
  /** build 期讀到的元素圖層檔名清單(見 public/scene/elements/README.md) */
  availableElements: string[];
}

/**
 * 圖片場景:以插畫原圖為底,鋪上隱形互動熱區。
 * 底圖與熱區都以 cover 方式鋪滿,共用同一個座標系所以永遠對齊。
 */
export function PhotoScene({
  onItemClick,
  wigglingItem,
  hinting = false,
  availableElements,
}: PhotoSceneProps) {
  const phase = useEffectivePhase();
  const present = useSceneStore(selectIsOnline);
  const phoneRinging = useSceneStore((s) => s.phoneRinging);
  const overlay = useSceneStore((s) => s.overlay);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<ItemId | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [girlState, setGirlState] = useState<GirlState>("cat");
  const [tappedItem, setTappedItem] = useState<ItemId | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 閒置預熱:首屏只載「當前」窗景/人物/打光,~2.5s 後才掛上其餘版本
  // (掛上即下載,之後的交叉淡變照舊零閃爍;省下首載約 3.5MB 中的大半)
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWarm(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // 元素被點到(含手機版 dock):元素彈一下;手機版順便把該元素捲進畫面中央
  useEffect(() => {
    const onItemOpen = (e: Event) => {
      const id = (e as CustomEvent<ItemId>).detail;
      setTappedItem(id);
      if (tapTimer.current) clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTappedItem(null), 400);

      const el = scrollRef.current;
      if (el && el.scrollWidth > el.clientWidth) {
        const spot = HOTSPOTS.find((s) => s.id === id);
        if (spot) {
          const bbox = hotspotBBox(spot);
          const cx = ((bbox.x + bbox.w / 2) / IMAGE_W) * el.scrollWidth;
          el.scrollTo({ left: cx - el.clientWidth / 2, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("scene:item-open", onItemOpen);
    return () => {
      window.removeEventListener("scene:item-open", onItemOpen);
      if (tapTimer.current) clearTimeout(tapTimer.current);
    };
  }, []);

  // 每次「上線」隨機挑一種人物狀態;開發校準可用 ?girl=cat|stretch|music 固定
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("girl");
    if (q && (GIRL_STATES as readonly string[]).includes(q)) {
      setGirlState(q as GirlState);
      return;
    }
    if (present) {
      setGirlState(GIRL_STATES[Math.floor(Math.random() * GIRL_STATES.length)]!);
    }
  }, [present]);

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

  const shapeProps = (spot: Hotspot) => {
    return {
      "data-item": spot.id,
      className: `photo-hotspot ${wigglingItem === spot.id ? "item-wiggle" : ""}`,
      role: "button" as const,
      tabIndex: 0,
      "aria-label": `${ITEMS[spot.id].label} — ${ITEMS[spot.id].hint}`,
      onClick: handleClick(spot.id),
      onKeyDown: handleKey(spot.id),
      onMouseEnter: (e: MouseEvent<SVGElement>) => {
        setHoveredItem(spot.id);
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ id: spot.id, x: rect.left + rect.width / 2, y: rect.top });
      },
      onMouseLeave: () => {
        setHoveredItem(null);
        setTooltip(null);
      },
      // 移除手繪 stroke 後,鍵盤 focus 仍需要可見提示 —— 比照 hover 亮起 beacon
      onFocus: (e: FocusEvent<SVGElement>) => {
        setHoveredItem(spot.id);
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ id: spot.id, x: rect.left + rect.width / 2, y: rect.top });
      },
      onBlur: () => {
        setHoveredItem(null);
        setTooltip(null);
      },
    };
  };

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-x-auto overflow-y-hidden overscroll-x-contain bg-cream-dim [scrollbar-width:none] [touch-action:pan-x_pinch-zoom] md:overflow-hidden"
    >
      {/* 手機:高度貼滿、寬度依圖片比例 → 可左右滑動;桌機:填滿裁切 */}
      <div className="relative h-full md:w-full" style={{ aspectRatio: `${IMAGE_W} / ${IMAGE_H}` }}>
        {/* 底圖(空景):SSR 直出、優先載入搶 LCP */}
        <Image
          src={roomEmpty}
          alt=""
          priority
          placeholder="blur"
          className="absolute inset-0 h-full w-full object-cover"
          sizes="(max-width: 767px) 1400px, 100vw"
          draggable={false}
        />

        {/* 元素圖層(去背圖逐層貼上,疊在底圖上、時段色調之下,讓夜晚光線蓋得到) */}
        <ElementLayers
          hoveredItem={hoveredItem}
          tappedItem={tappedItem}
          availableElements={availableElements}
          phase={phase}
          present={present}
          girlState={girlState}
          warm={warm}
        />

        {/* 找貓咪彩蛋(在打光層之下,吃得到時段光影;只有貓身可點);
            人物摸貓時同一隻貓不重複出現 */}
        <CatPeekaboo
          hidden={present && girlState === "cat"}
          present={present}
          girlState={girlState}
        />

        {/* 時段打光層(預熱後四張全掛載,跟著 phase 淡變;預熱前只掛當前時段) */}
        {(warm ? (Object.keys(PHASE_LIGHTS) as DayPhase[]) : [phase]).map((p) => (
          <Image
            key={p}
            src={PHASE_LIGHTS[p]}
            alt=""
            draggable={false}
            sizes="(max-width: 767px) 1400px, 100vw"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: phase === p ? LIGHT_INTENSITY[p] : 0 }}
          />
        ))}

        {/* 互動熱區(與底圖同座標系,object-cover ↔ slice 對齊) */}
        <svg
          viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          role="group"
          aria-label="我的書桌"
        >
          {/* 來電中:電話上冒出聲波圈(不吃事件,點擊仍落在電話熱區) */}
          {phoneRinging && (
            <g pointerEvents="none">
              <circle cx={PHONE_CENTER_X} cy={PHONE_CENTER_Y} className="ring-pulse" />
              <circle
                cx={PHONE_CENTER_X}
                cy={PHONE_CENTER_Y}
                className="ring-pulse"
                style={{ animationDelay: "0.55s" }}
              />
              <text
                x={PHONE_CENTER_X}
                y={PHONE_CENTER_Y + RING_BELL_OFFSET_Y}
                textAnchor="middle"
                fontSize={31}
                className="ring-bell"
              >
                🔔
              </text>
            </g>
          )}
          {HOTSPOTS.map((spot, i) => {
            const common = shapeProps(spot);
            // 只有「有功能」的熱區(ITEM_OVERLAY 非 null)才放圓圈提示,空物件不用騙人家可以點
            const hasBeacon = ITEM_OVERLAY[spot.id] !== null;
            const showHint = hinting && hasBeacon;
            const bbox = hotspotBBox(spot);
            const beaconX = bbox.x + bbox.w / 2;
            const beaconY = bbox.y + bbox.h / 2;
            return (
              <g key={`${spot.id}-${i}`}>
                {spot.rect && (
                  <rect
                    {...common}
                    x={spot.rect.x}
                    y={spot.rect.y}
                    width={spot.rect.w}
                    height={spot.rect.h}
                    rx={8}
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
                {/* 熱區圓圈提示(beacon):平常若隱若現,hover / focus / 首訪提示時亮起 */}
                {hasBeacon && (
                  <g
                    className={`hotspot-beacon ${hoveredItem === spot.id ? "beacon-active" : ""} ${showHint ? "beacon-hint" : ""}`}
                    transform={`translate(${beaconX} ${beaconY})`}
                    pointerEvents="none"
                    style={{ "--beacon-delay": `${i * 0.15}s` } as CSSProperties}
                  >
                    <circle className="beacon-ring" r={12} />
                    <circle className="beacon-dot" r={5} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

      </div>

      {/* Hover 提示(桌機) */}
      {tooltip && !overlay && (
        <div
          className="pointer-events-none fixed z-30 hidden -translate-x-1/2 -translate-y-full rounded-full border border-white/10 bg-[#141824]/95 px-3.5 py-1.5 text-xs text-white shadow-xl md:block"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          {ITEMS[tooltip.id].hint}
        </div>
      )}
    </div>
  );
}
