import { useMemo } from "react";
import type { ItemId } from "@/lib/items";
import type { DayPhase } from "@/hooks/use-time-of-day";
import { HOTSPOTS, IMAGE_W, IMAGE_H, hotspotBBox, type Rect } from "./hotspots";
import { SkyOverlays } from "./scene-overlays";

/**
 * 場景元素圖層 —— 底圖是「清空房間」,畫面上所有家具/物件都是這裡逐層貼上的去背 PNG
 * (源檔 apps/web/assets/scene/elements/*.png,網站讀轉出的 public/scene/elements/*.webp)。
 *
 * 分兩種:
 * - 互動元素(slot):位置 = hotspots.ts 對應熱區的外接框(單一座標來源)。
 * - 裝飾元素(decor):不可點,位置寫在下面 DECOR;檔名不在 ITEMS 也沒關係。
 *
 * 疊放順序(空間深度)由 LAYERS 統一決定:越後面越靠近鏡頭。
 * 例:床在長板之後(蓋住板尾)、耳機貼在床上、椅子最前。
 */

export interface ElementSlot {
  id: ItemId;
  /** 底圖像素座標(與 hotspots.ts 同一套系統) */
  rect: Rect;
}

export const ELEMENT_SLOTS: ElementSlot[] = HOTSPOTS.filter((spot) => spot.slot).map((spot) => ({
  id: spot.id,
  rect: hotspotBBox(spot),
}));

/** 裝飾元素(不可點):name = elements/ 裡的檔名(不含副檔名)。
 *  櫃子與床刻意做大、超出畫面邊緣裁切(使用者的構圖意圖)。 */
export const DECOR = [
  { name: "cabinet", rect: { x: -60, y: 740, w: 504, h: 300 } },
  { name: "plant", rect: { x: 378, y: 552, w: 277, h: 410 } },
  { name: "lamp", rect: { x: 1105, y: 420, w: 149, h: 225 } },
  { name: "skateboard", rect: { x: 1505, y: 500, w: 191, h: 460 } },
  // 床位置經過覆蓋驗證:左緣垂墜角要蓋住底圖烘焙床的左下角(890,600 是能完全
  // 覆蓋的最低位置);床往右/往下移都會讓舊床露出來(底圖沒有打補丁)
  { name: "bed", rect: { x: 890, y: 600, w: 1258, h: 892 } },
  { name: "chair", rect: { x: 1008, y: 622, w: 320, h: 432 } },
] as const satisfies readonly { name: string; rect: Rect }[];

export type DecorName = (typeof DECOR)[number]["name"];

/** 貼圖框查表:模組層算一次,不用每次 render 重建 */
const SLOT_RECTS = new Map<string, Rect>(ELEMENT_SLOTS.map((slot) => [slot.id, slot.rect]));
const DECOR_RECTS = new Map<string, Rect>(DECOR.map((d) => [d.name, d.rect]));

/** 疊放順序(由後到前)。slot 引用 ItemId,decor 引用 DECOR name;打錯字 tsc 會擋 */
const LAYERS: (ItemId | DecorName)[] = [
  "backpack",
  "cabinet",
  "plant",
  "musicPlayer",
  "laptop",
  "lamp",
  "phone",
  "chair",
  "skateboard",
  "bed",
  "headphones",
];

/** 窗外海景:四時段版本(window-<phase>.png,已預先透視變形對齊玻璃四角) */
const WINDOW_VIEW_RECT: Rect = { x: 659, y: 203, w: 470, h: 410 };
const WINDOW_PHASES: DayPhase[] = ["dawn", "day", "sunset", "night"];

/** 人物狀態(girl-<state>.png):在座時隨機一種淡入,離開淡出(前景主角比例)。
 *  cat-peekaboo 的「躲盆栽後」藏點會把當前人物再疊繪一次(貓 < 盆栽 < 人),
 *  所以 GIRL_RECTS 要 export 共用。 */
export const GIRL_STATES = ["cat", "stretch", "music"] as const;
export type GirlState = (typeof GIRL_STATES)[number];
export const GIRL_RECTS: Record<GirlState, Rect> = {
  cat: { x: 525, y: 620, w: 430, h: 425 },      // 坐地上摸貓(矮櫃旁的地板)
  stretch: { x: 618, y: 255, w: 190, h: 790 },  // 站著伸懶腰(面向窗)
  music: { x: 1330, y: 545, w: 372, h: 468 },   // 抱膝聽歌(地上靠著床;此時床上耳機藏起來)
};

/** 元素圖走 WebP(scripts/convert-elements.py 從同名 .png 轉出;PNG 留作源檔) */
export const elementSrc = (name: string) => `/scene/elements/${name}.webp`;

interface ElementLayersProps {
  /** 目前 hover 的物件(對應圖層會亮起) */
  hoveredItem: ItemId | null;
  /** 剛被點到的物件(元素彈一下,photo-scene 控制 400ms 後清除) */
  tappedItem: ItemId | null;
  /** page.tsx 在 server 端用 fs.readdirSync 讀到的檔名清單(不含副檔名) */
  availableElements: string[];
  /** 場景時段 —— 夜晚檯燈換點亮版(lamp-on.png) */
  phase: DayPhase;
  /** 在座/離開(StatusBadge / use-presence)—— 控制人物淡入淡出 */
  present: boolean;
  /** 在座時顯示哪種人物狀態 */
  girlState: GirlState;
  /** 閒置預熱完成前,窗景/人物只掛「當前那張」省下載;預熱後全掛維持交叉淡變 */
  warm: boolean;
}

export function ElementLayers({
  hoveredItem,
  tappedItem,
  availableElements,
  phase,
  present,
  girlState,
  warm,
}: ElementLayersProps) {
  const available = useMemo(() => new Set(availableElements), [availableElements]);
  // 聽歌狀態:床上的耳機被她拿去戴了 → 元素淡出(熱區仍在,音樂入口不受影響)
  const hideHeadphones = present && girlState === "music";

  return (
    <svg
      viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {/* 窗外海景(最底層):預熱後四時段全掛載,跟著 phase 淡變;
          預熱前只掛當前時段,避免 opacity:0 的圖也被下載 */}
      {WINDOW_PHASES.filter((p) => available.has(`window-${p}`) && (warm || p === phase)).map((p) => (
        <image
          key={`window-${p}`}
          href={elementSrc(`window-${p}`)}
          x={WINDOW_VIEW_RECT.x}
          y={WINDOW_VIEW_RECT.y}
          width={WINDOW_VIEW_RECT.w}
          height={WINDOW_VIEW_RECT.h}
          preserveAspectRatio="none"
          style={{ opacity: phase === p ? 1 : 0, transition: "opacity 1000ms ease" }}
        />
      ))}

      {/* 天空活元素(海鷗 + 浮塵):在窗景之上、家具/人物與打光層之下,
          所以海鷗會從站著的人物身後飛過,夜晚也吃得到夜色 */}
      <SkyOverlays />

      {LAYERS.map((name) => {
        const rect = SLOT_RECTS.get(name) ?? DECOR_RECTS.get(name);
        if (!rect || !available.has(name)) return null;
        // 檯燈:夜晚亮燈(lamp-on.png 已對齊同一畫布比例,直接換檔不位移)
        const file = name === "lamp" && phase === "night" && available.has("lamp-on")
          ? "lamp-on"
          : name;
        const interactive = SLOT_RECTS.has(name);
        return (
          <image
            key={name}
            href={elementSrc(file)}
            x={rect.x}
            y={rect.y}
            width={rect.w}
            height={rect.h}
            preserveAspectRatio="none"
            className={
              interactive
                ? `element-layer ${hoveredItem === name ? "element-layer-hover" : ""} ${tappedItem === name ? "element-tap" : ""}`
                : undefined
            }
            style={
              name === "headphones"
                ? { opacity: hideHeadphones ? 0 : 1, transition: "opacity 700ms ease" }
                : undefined
            }
          />
        );
      })}

      {/* 人物(最前景):在座時顯示當前狀態,離開時淡出;預熱前只掛當前狀態 */}
      {GIRL_STATES.filter((s) => available.has(`girl-${s}`) && (warm || s === girlState)).map((s) => (
        <image
          key={`girl-${s}`}
          href={elementSrc(`girl-${s}`)}
          x={GIRL_RECTS[s].x}
          y={GIRL_RECTS[s].y}
          width={GIRL_RECTS[s].w}
          height={GIRL_RECTS[s].h}
          preserveAspectRatio="none"
          style={{
            opacity: present && girlState === s ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        />
      ))}
    </svg>
  );
}
