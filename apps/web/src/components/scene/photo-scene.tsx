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
import { ITEMS, ITEM_LINK, ITEM_OVERLAY, ITEM_PAGE, type ItemId } from "@/lib/items";
import { useEffectivePhase, type DayPhase } from "@/hooks/use-time-of-day";
import { useSceneStore, selectIsOnline } from "@/stores/scene-store";
import { HOTSPOTS, IMAGE_W, IMAGE_H, beaconPoint, hotspotBBox, tipPoint, type Hotspot } from "./hotspots";
import { GIRL_LAYERS } from "./girl-layers";
import { CatPeekaboo } from "./cat-peekaboo";
import { ElementLayers, GIRL_STATES, type GirlState } from "./element-layers";
import { LetterBadge, letterBadgeBox } from "./letter-badge";
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

/** 換頁的物件(手機):不放提示點,改畫來信對話框 */
const LINK_SPOTS = HOTSPOTS.filter((spot) => ITEM_LINK[spot.id]);
/** 來信對話框尾巴指的位置:物件上緣偏左 */
const letterAnchor = (bbox: { x: number; y: number; w: number }) => ({ x: bbox.x + bbox.w * 0.2, y: bbox.y - 4 });
/** 有提示點的物件(會開畫面或換頁的);手機改用來信對話框,不在這裡 */
const BEACON_IDS = HOTSPOTS.filter(
  (spot) => ITEM_OVERLAY[spot.id] !== null || ITEM_PAGE[spot.id],
).map((spot) => spot.id);
/** 提示點輪流閃:每隔這麼久換下一個,同一時間只有一個在擴散(要跟 globals.css 的週期對上) */
const BEACON_GAP_S = 1.2;

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
        // 有鏡頭目標的物件(筆電、窗戶)交給鏡頭對焦,不另外捲動:
        // 兩個同時跑的話,鏡頭量到的是捲動前的位置,拉近後會偏一大段
        if (spot && !spot.screenRect) {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 網址參數與隨機只能掛載後讀,伺服器端選了會 hydration mismatch
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

  // 人物在座時,她的輪廓擋在觸發點前面;被她擋住或戴在身上的東西換位置(見 girl-layers.ts)
  const girlLayer = present ? GIRL_LAYERS[girlState] : null;
  const onTopSpots = girlLayer?.onTop ?? [];
  const belowSpots = HOTSPOTS.filter((spot) => !onTopSpots.some((s) => s.id === spot.id)).map(
    (spot): Hotspot => {
      const moved = girlLayer?.behind?.find((b) => b.id === spot.id);
      return moved ? { ...spot, ...moved } : spot;
    },
  );

  /** hover 文字提示:把物件指定的錨點(底圖座標)換成螢幕座標,cover 裁切與鏡頭縮放都算進去 */
  const showTooltip = (spot: Hotspot, el: SVGElement) => {
    const ctm = (el as SVGGraphicsElement).getScreenCTM();
    if (!ctm) return;
    const tip = tipPoint(spot);
    const p = new DOMPoint(tip.x, tip.y).matrixTransform(ctm);
    setTooltip({ id: spot.id, x: p.x, y: p.y });
  };

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
        showTooltip(spot, e.currentTarget);
      },
      onMouseLeave: () => {
        setHoveredItem(null);
        setTooltip(null);
      },
      // 移除手繪 stroke 後,鍵盤 focus 仍需要可見提示 —— 比照 hover 亮起 beacon
      onFocus: (e: FocusEvent<SVGElement>) => {
        setHoveredItem(spot.id);
        showTooltip(spot, e.currentTarget);
      },
      onBlur: () => {
        setHoveredItem(null);
        setTooltip(null);
      },
    };
  };

  /** 一個熱區的點擊形狀,加上鏡頭縮放目標(透明、不吃事件,只給鏡頭算位置) */
  const renderShape = (spot: Hotspot, i: number) => (
    <g key={`${spot.id}-${i}`}>
      {spot.rect && (
        <rect
          {...shapeProps(spot)}
          x={spot.rect.x}
          y={spot.rect.y}
          width={spot.rect.w}
          height={spot.rect.h}
          rx={8}
        />
      )}
      {spot.points && <polygon {...shapeProps(spot)} points={spot.points} />}
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

        {/* 換頁物件(手機)的來信對話框:在打光層下面,夜晚會跟場景一起變暗;
            只負責畫,點擊範圍在最上面的熱區那層 */}
        <svg
          viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {LINK_SPOTS.map((spot) => {
            const bbox = hotspotBBox(spot);
            return (
              <LetterBadge key={spot.id} {...letterAnchor(bbox)} active={hoveredItem === spot.id} />
            );
          })}
        </svg>

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
          {belowSpots.map(renderShape)}

          {/* 人物輪廓:擋住她身後的觸發點,點到她身上什麼都不會發生 */}
          {girlLayer && <polygon points={girlLayer.silhouette} fill="transparent" aria-hidden />}

          {/* 她身上的觸發點(例如戴在頭上的耳機),要排在輪廓後面才點得到 */}
          {onTopSpots.map(renderShape)}

          {/* 來信對話框的點擊範圍:對話框畫在打光層下面,點擊要在這層才不會被窗戶熱區擋住;
              對話框浮在人物前面,所以也排在輪廓後面 */}
          {LINK_SPOTS.map((spot) => {
            const anchor = letterAnchor(hotspotBBox(spot));
            const box = letterBadgeBox(anchor.x, anchor.y);
            return (
              <rect
                key={`letter-${spot.id}`}
                aria-hidden
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                fill="transparent"
                className="cursor-pointer"
                onClick={handleClick(spot.id)}
                onMouseEnter={() => setHoveredItem(spot.id)}
                onMouseLeave={() => setHoveredItem(null)}
              />
            );
          })}

          {/* 熱區圓圈提示(beacon):常駐小亮點,hover / focus / 首訪提示時更亮;只有「有功能」的物件才放 */}
          {[...belowSpots, ...onTopSpots].map((spot) => {
            const order = BEACON_IDS.indexOf(spot.id);
            if (order < 0) return null;
            const p = beaconPoint(spot);
            return (
              <g
                key={`beacon-${spot.id}`}
                className={`hotspot-beacon ${hoveredItem === spot.id ? "beacon-active" : ""} ${hinting ? "beacon-hint" : ""}`}
                transform={`translate(${p.x} ${p.y})`}
                pointerEvents="none"
                style={{ "--beacon-delay": `${order * BEACON_GAP_S}s` } as CSSProperties}
              >
                <circle className="beacon-ring" r={5} />
                <circle className="beacon-dot" r={4.5} />
              </g>
            );
          })}
        </svg>

      </div>

      {/* Hover 提示(桌機);換頁的物件(手機)已經有來信對話框,不再重複
          w-max:靠近右邊的物件(耳機、長板)不會被擠成一字一行 */}
      {tooltip && !overlay && !ITEM_LINK[tooltip.id] && (
        <div
          className="pointer-events-none fixed z-30 hidden w-max -translate-x-1/2 -translate-y-full rounded-full border border-white/10 bg-[#141824]/95 px-3.5 py-1.5 text-xs text-white shadow-xl md:block"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          {ITEMS[tooltip.id].hint}
        </div>
      )}
    </div>
  );
}
