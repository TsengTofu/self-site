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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-soft/15 bg-cream/92 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="flex items-center gap-0.5 px-2 py-1.5">
        {DOCK_ORDER.map((id) => {
          const meta = ITEMS[id];
          return (
            <li key={id} className="min-w-0 flex-1">
              <button
                type="button"
                aria-label={meta.label}
                onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
                className="grid h-11 w-full place-items-center rounded-xl text-[#5a4a3c] transition active:scale-90 active:bg-ink-soft/10"
              >
                <ItemIcon id={id} className="size-7" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
