import type { ItemId } from "@/lib/items";

/**
 * 物件的 monoline 線條 icon(24×24,stroke 繼承 currentColor),
 * 圓角筆觸呼應插畫的手繪描邊風。給底部 dock 等 UI 使用。
 *
 * Partial:只畫有進 dock / 導覽的物件(album、doll、bubbleTea 這類只在場景裡的沒有),
 * 缺項時 ItemIcon 回傳 null。
 */
const PATHS: Partial<Record<ItemId, React.ReactNode>> = {
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M10.5 18h3" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M12 15v3M8 20h8M3.5 20h.01" strokeWidth="1.8" />
      <path d="M8 8.5h5M8 11h3" opacity="0.6" />
    </>
  ),
  headphones: (
    <>
      <path d="M5 14a7 7 0 0 1 14 0" />
      <rect x="4" y="13.5" width="4" height="6.5" rx="2" />
      <rect x="16" y="13.5" width="4" height="6.5" rx="2" />
    </>
  ),
  backpack: (
    <>
      <path d="M7 9a5 5 0 0 1 10 0v10a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V9Z" />
      <path d="M9.5 4.5a2.5 2.5 0 0 1 5 0" />
      <path d="M9.5 14.5h5v3.5h-5z" />
    </>
  ),
  notebook: (
    <>
      <path d="M6 4.5h11a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6Z" />
      <path d="M6 4.5v15.5M9.5 9h5M9.5 12h3.5" />
    </>
  ),
  skateboard: (
    <>
      <path d="M4 12.5c1.2 1.6 3 2.5 5 2.5h6c2 0 3.8-.9 5-2.5" />
      <circle cx="8.5" cy="18" r="1.8" />
      <circle cx="15.5" cy="18" r="1.8" />
    </>
  ),
  bookStack: (
    <>
      <path d="M6 19.5V7l3-1v13.5M12.5 19.5v-12l3-1.2v13.2M9 19.5h9.5" />
    </>
  ),
  poster: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1.5" />
      <path d="M8 15.5l2.8-3.4 2.2 2.4 2-2.2 1 1.2" />
      <circle cx="12" cy="2.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 13c3-2 5-2 8 0s5 2 8 0" opacity="0.75" />
      <path d="M4 16.5c3-2 5-2 8 0s5 2 8 0" opacity="0.5" />
    </>
  ),
};

interface ItemIconProps {
  id: ItemId;
  className?: string;
}

export function ItemIcon({ id, className }: ItemIconProps) {
  const path = PATHS[id];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {path}
    </svg>
  );
}
