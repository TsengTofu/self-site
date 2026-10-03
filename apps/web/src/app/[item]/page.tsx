import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeskExperience } from "@/components/desk-experience";
import { readAvailableElements } from "@/lib/scene-elements";
import { ITEM_ROUTES, ITEM_ROUTE_SLUGS, isItemRoute } from "@/lib/item-routes";
import { SITE_NAME, shareMeta } from "@/lib/site";

interface ItemPageProps {
  params: Promise<{ item: string }>;
}

// 只有 ITEM_ROUTES 裡的網址存在,其他一律 404;全部在 build 時產好靜態頁
export const dynamicParams = false;

export function generateStaticParams() {
  return ITEM_ROUTE_SLUGS.map((item) => ({ item }));
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { item } = await params;
  if (!isItemRoute(item)) return {};
  const { title, description } = ITEM_ROUTES[item];
  const fullTitle = `${title} — ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: `/${item}` },
    ...shareMeta(fullTitle, description, "website"),
  };
}

/**
 * 物件網址(/projects、/music…):畫面跟首頁一樣是整個房間,
 * 掛載後 use-item-route 讀網址,自動打開對應的物件
 */
export default async function ItemPage({ params }: ItemPageProps) {
  const { item } = await params;
  if (!isItemRoute(item)) notFound();
  return <DeskExperience availableElements={readAvailableElements()} />;
}
