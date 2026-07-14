import type { ItemId } from "@/lib/items";

/**
 * 圖片場景的互動熱區 — 已依 Firefly 插畫(明亮海景房 v2,2752×1536)校準。
 *
 * 🔧 校準方式:換圖或位置不準時,在圖上量原圖像素座標,
 *    改下面的 rect(x, y, w, h)或 points;IMAGE_W / IMAGE_H 改成圖檔實際尺寸。
 *    同一個 id 可以有多個熱區;排序越後面,重疊時越優先吃到點擊。
 */
export const IMAGE_W = 2752;
export const IMAGE_H = 1536;

export interface Hotspot {
  id: ItemId;
  /** 矩形熱區 */
  rect?: { x: number; y: number; w: number; h: number };
  /** 多邊形熱區(斜放物件) */
  points?: string;
  /** 鏡頭縮放目標(拉近時對準的區域) */
  screenRect?: { x: number; y: number; w: number; h: number };
}

export const HOTSPOTS: Hotspot[] = [
  // 左牆藝術:Mond / SADE / 棕櫚畫(海報群)
  { id: "poster", rect: { x: 50, y: 75, w: 650, h: 760 } },
  // 右牆洞洞板:鑰匙圈、拍立得、小圖
  { id: "poster", rect: { x: 2085, y: 260, w: 530, h: 690 } },
  // 海景窗(點了拉近看海;下緣讓給 Marshall 與筆電,它們排後面優先)
  {
    id: "window",
    rect: { x: 980, y: 230, w: 740, h: 540 },
    screenRect: { x: 980, y: 230, w: 740, h: 500 },
  },
  // 黑膠收納櫃(左下)→ 保留觸發(音樂統一走耳機/音響)
  { id: "album", rect: { x: 0, y: 980, w: 490, h: 410 } },
  // 掛鉤上的格紋背包 → 書單
  { id: "backpack", rect: { x: 555, y: 390, w: 200, h: 385 } },
  // 掛鉤上的白帽(保留觸發)
  { id: "doll", rect: { x: 692, y: 405, w: 125, h: 145 } },
  // 窗台上的 Marshall 音響 → 歌單
  { id: "musicPlayer", rect: { x: 1545, y: 690, w: 205, h: 125 } },
  // 床上的耳機 → 歌單
  { id: "headphones", rect: { x: 2052, y: 1232, w: 240, h: 165 } },
  // 桌上檔案架(左)與書堆(右)(保留觸發)
  { id: "bookStack", rect: { x: 1060, y: 895, w: 160, h: 105 } },
  { id: "bookStack", rect: { x: 1692, y: 890, w: 165, h: 80 } },
  // 筆電(螢幕上有 code)→ 專案
  {
    id: "laptop",
    rect: { x: 1300, y: 750, w: 290, h: 250 },
    screenRect: { x: 1318, y: 765, w: 180, h: 140 },
  },
  // 馬克杯 → 保留觸發
  { id: "bubbleTea", rect: { x: 1542, y: 880, w: 85, h: 105 } },
  // 黃色筆記本 → 手寫句子
  { id: "notebook", rect: { x: 1090, y: 992, w: 185, h: 85 } },
  // 手機 → Profile / 鬧鐘
  { id: "phone", rect: { x: 1258, y: 998, w: 110, h: 70 } },
  // 斜靠鏡子的長板 → 彩蛋
  { id: "skateboard", points: "1908,762 2032,748 2068,1225 1938,1245" },
];
