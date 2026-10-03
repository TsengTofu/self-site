import { ITEM_ROUTES, ITEM_ROUTE_SLUGS } from "./item-routes";

/**
 * 網站地圖:入口是房間,房間裡的東西各有網址(在房間裡打開),
 * 另外三個獨立頁面(履歷、滑板、製作歷程)都是從房間裡的物件連出去的
 *
 * /                 房間(入口)
 * ├ /projects …     房間裡打開的畫面(專案、音樂、人生指南、喜歡的句子、窗外的海)
 * ├ /resume         履歷(手機)
 * ├ /skateboard     自由的味道(滑板)
 * └ /making-of      視覺製作歷程(右上選單)
 */
export type PageId = "home" | "resume" | "skateboard" | "making-of";

export const PAGES: { id: PageId; href: string; label: string; en: string }[] = [
  { id: "home", href: "/", label: "房間", en: "MY SPACE" },
  { id: "resume", href: "/resume", label: "履歷", en: "RESUME" },
  { id: "skateboard", href: "/skateboard", label: "自由的味道", en: "SKATE" },
  { id: "making-of", href: "/making-of", label: "製作歷程", en: "MAKING OF" },
];

/** 房間裡打開的畫面 */
export const ROOM_LINKS = ITEM_ROUTE_SLUGS.map((slug) => ({
  href: `/${slug}`,
  label: ITEM_ROUTES[slug].title,
}));
