"use client";

import { ITEMS, type ItemId } from "@/lib/items";
import { ItemIcon } from "@/components/item-icons";

const DOCK_ORDER: ItemId[] = [
  "phone",
  "laptop",
  "headphones",
  "backpack",
  "notebook",
  "skateboard",
  "window",
  "bookStack",
  "poster",
];

interface MobileDockProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
}

/** 手機版底部 dock:小螢幕上場景會被裁切,保證所有物件都點得到
 *  只放 icon 不放文字(名稱走 aria-label),所有物件平分寬度所以不用左右捲 */
export function MobileDock({ onItemClick }: MobileDockProps) {
  return (
    <nav
      aria-label="桌上的物件"
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      {/* 浮在場景上的半透明膠囊:不再是一整條實心底,看得到後面的地板 */}
      <ul className="flex items-center gap-0.5 rounded-2xl bg-cream/45 px-1.5 py-1 shadow-[0_4px_18px_rgba(60,40,20,.12)] ring-1 ring-white/50 backdrop-blur-md">
        {DOCK_ORDER.map((id) => {
          const meta = ITEMS[id];
          return (
            <li key={id} className="min-w-0 flex-1">
              <button
                type="button"
                aria-label={meta.label}
                onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
                className="grid h-11 w-full place-items-center rounded-xl text-ink-soft/85 transition active:scale-90 active:bg-ink-soft/10"
              >
                <ItemIcon id={id} className="size-6" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
