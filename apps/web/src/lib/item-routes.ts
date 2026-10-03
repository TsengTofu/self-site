import type { ItemId, OverlayKind } from "@/lib/items";
import type { PlayerMode } from "@/stores/scene-store";

/**
 * 場景物件的網址:打開專案時網址變成 /projects,分享這個網址進來就直接看到專案
 * 一個網址對應一個「打開後的畫面」,所以耳機和音響共用 /music
 * 只有打開會有畫面的物件才有網址;海報、書架這類只冒一句話的沒有
 * 手機直接連到 /resume,也不需要另外的網址
 */
export const ITEM_ROUTES = {
  projects: { item: "laptop", title: "我的專案", description: "我做過的專案，有些可以直接在這裡點開來玩。" },
  music: { item: "headphones", title: "上班歌單", description: "我上班時在聽的歌。" },
  books: { item: "backpack", title: "最近讀的書", description: "背包裡最近在讀的書。" },
  notes: { item: "notebook", title: "喜歡的句子", description: "筆記本裡抄下來的句子。" },
  ocean: { item: "window", title: "窗外的海", description: "看著浪發呆一下。" },
  skateboard: { item: "skateboard", title: "滑板", description: "靠在鏡子旁的長板。" },
} as const satisfies Record<string, { item: ItemId; title: string; description: string }>;

export type ItemRoute = keyof typeof ITEM_ROUTES;

export const ITEM_ROUTE_SLUGS = Object.keys(ITEM_ROUTES) as ItemRoute[];

export function isItemRoute(value: string): value is ItemRoute {
  return Object.hasOwn(ITEM_ROUTES, value);
}

/** 網址路徑 → 物件網址;不是物件網址就回 null */
export function routeFromPath(pathname: string): ItemRoute | null {
  const slug = pathname.replace(/^\/|\/$/g, "");
  return isItemRoute(slug) ? slug : null;
}

const OVERLAY_ROUTE: Record<OverlayKind, ItemRoute> = {
  computer: "projects",
  books: "books",
  notebook: "notes",
  ocean: "ocean",
  skateboard: "skateboard",
};

/** 場景現在的狀態對應哪個網址;什麼都沒開就是 null(首頁) */
export function routeForScene(overlay: OverlayKind | null, playerMode: PlayerMode): ItemRoute | null {
  if (overlay) return OVERLAY_ROUTE[overlay];
  if (playerMode === "expanded") return "music";
  return null;
}
