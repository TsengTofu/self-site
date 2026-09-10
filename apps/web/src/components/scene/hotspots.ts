import type { ItemId } from "@/lib/items";

/**
 * 圖片場景的互動熱區 — 已依「清空版海景房」(1920×1080,桌面淨空)校準。
 * 這張底圖上沒有烘焙互動物件:筆電/手機/音響/耳機/背包/長板全部改由
 * elements/ 的去背元素圖(slot)貼回來,熱區 rect = 元素圖的貼圖框。
 *
 * 🔧 校準方式:換圖或位置不準時,在圖上量原圖像素座標,
 *    改下面的 rect(x, y, w, h)或 points;IMAGE_W / IMAGE_H 改成圖檔實際尺寸。
 *    同一個 id 可以有多個熱區;排序越後面,重疊時越優先吃到點擊。
 */
export const IMAGE_W = 1920;
export const IMAGE_H = 1080;

/** 通用矩形(像素座標),bbox 計算與 rect 熱區共用同一個形狀。 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface HotspotBase {
  id: ItemId;
  /** 鏡頭縮放目標(拉近時對準的區域) */
  screenRect?: Rect;
  /** 標記這個熱區同時是元素圖層插槽錨點(見 element-layers.tsx 的 ELEMENT_SLOTS) */
  slot?: true;
}

/** 形狀二選一:矩形 rect 或多邊形 points(斜放物件);兩個都沒有 tsc 會擋,hotspotBBox 才不會算出 NaN */
export type Hotspot = HotspotBase &
  ({ rect: Rect; points?: never } | { points: string; rect?: never });

export const HOTSPOTS: Hotspot[] = [
  // 左牆兩個相框(上藍綠下酒紅)→ 海報群
  { id: "poster", rect: { x: 97, y: 120, w: 185, h: 240 } },
  { id: "poster", rect: { x: 95, y: 365, w: 200, h: 228 } },
  // 右牆 BOYNEXTDOOR 海報 → 海報群
  { id: "poster", rect: { x: 1305, y: 220, w: 235, h: 278 } },
  // 海景窗(下緣讓給窗台上的音響,它排後面優先)
  {
    id: "window",
    rect: { x: 648, y: 150, w: 520, h: 472 },
    screenRect: { x: 660, y: 185, w: 480, h: 390 },
  },
  // 掛鉤上的白帽(保留觸發)
  { id: "doll", rect: { x: 505, y: 225, w: 90, h: 128 } },
  // 掛鉤上的軍綠背包 → 書單(元素插槽)
  { id: "backpack", rect: { x: 355, y: 205, w: 166, h: 315 }, slot: true },
  // 桌上左側的音響 → 歌單(元素插槽)
  { id: "musicPlayer", rect: { x: 760, y: 592, w: 140, h: 89 }, slot: true },
  // 床尾的耳機 → 歌單(元素插槽;渲染順序在床之後,見 element-layers LAYERS)
  { id: "headphones", rect: { x: 1318, y: 852, w: 185, h: 125 }, slot: true },
  // 筆電(桌面中央)→ 專案(元素插槽)
  {
    id: "laptop",
    rect: { x: 925, y: 512, w: 250, h: 176 },
    screenRect: { x: 933, y: 520, w: 165, h: 115 },
    slot: true,
  },
  // 手機(桌上筆電左前)→ Profile / 鬧鐘(元素插槽)
  { id: "phone", rect: { x: 872, y: 672, w: 92, h: 50 }, slot: true },
  // 斜靠鏡子的長板 → 彩蛋。畫面由 element-layers 的 DECOR 渲染(板尾被床蓋住,
  // 貼圖框與點擊範圍不同),這裡只是可點的板身多邊形,不掛 slot
  { id: "skateboard", points: "1558,502 1660,525 1640,870 1520,845" },

  // ⏸ 這張底圖沒有的物件 —— 圖上補了(或做成元素圖)再開回來:
  // { id: "album", rect: ... },      // 黑膠矮櫃(音樂入口仍有耳機/音響)
  // { id: "bookStack", rect: ... },  // 桌上檔案架/書堆
  // { id: "bubbleTea", rect: ... },  // 馬克杯
  // { id: "notebook", rect: ..., slot: true }, // 筆記本(手寫句子 overlay 暫時沒入口)
];

/**
 * 熱區的外接框(bounding box)—— rect 熱區直接回傳 rect;
 * points(多邊形)熱區解析每個座標點,取 min/max 算外接框。
 * 給 ELEMENT_SLOTS(element-layers.tsx)與鏡頭/貼圖等需要「一個矩形」的地方共用。
 */
export function hotspotBBox(spot: Hotspot): Rect {
  if (spot.rect) return spot.rect;

  const coords = spot.points
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const [x = 0, y = 0] = pair.split(",").map(Number);
      return { x, y };
    });

  const xs = coords.map((p) => p.x);
  const ys = coords.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
}
