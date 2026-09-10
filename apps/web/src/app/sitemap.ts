import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * lastModified 用「內容真的動過」的日期，不用 new Date() ——
 * 每次 build 都謊稱全站變更會讓搜尋引擎不信任這份 sitemap
 * TODO（資料庫化 Phase A 後）：改吃各內容表的 updatedAt
 */
const LAST_MODIFIED = {
  home: new Date("2026-08-01"),
  resume: new Date("2026-07-26"),
  makingOf: new Date("2026-08-06"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified: LAST_MODIFIED.resume,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/making-of`,
      lastModified: LAST_MODIFIED.makingOf,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
