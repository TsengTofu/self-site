import {
  Backpack,
  Headphones,
  Image as ImageIcon,
  Laptop,
  Library,
  NotebookPen,
  Smartphone,
  Waves,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { ItemId } from "@/lib/items";

/** 筆觸跟 Lucide 預設一樣用 2,太細在手機上看起來會發虛 */
const STROKE = 2;

/** Lucide 沒有滑板,照它的規格(24×24、圓角端點、同筆觸)自己畫一個 */
function SkateboardIcon(props: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 11.5c1.3 1.8 3.2 2.8 5.4 2.8h7.2c2.2 0 4.1-1 5.4-2.8" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

/**
 * 物件的線條 icon,給底部 dock 與圓形導覽用
 * Partial:只有進 dock / 導覽的物件才有(album、doll、bubbleTea 這類只在場景裡的沒有),缺項回傳 null
 */
const ICONS: Partial<Record<ItemId, LucideIcon | typeof SkateboardIcon>> = {
  phone: Smartphone,
  laptop: Laptop,
  headphones: Headphones,
  backpack: Backpack,
  notebook: NotebookPen,
  skateboard: SkateboardIcon,
  window: Waves,
  bookStack: Library,
  poster: ImageIcon,
};

interface ItemIconProps {
  id: ItemId;
  className?: string;
}

export function ItemIcon({ id, className }: ItemIconProps) {
  const Icon = ICONS[id];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={STROKE} aria-hidden />;
}
