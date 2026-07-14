"use client";

import { ITEMS, type ItemId } from "@/lib/items";
import { ItemIcon } from "@/components/item-icons";

const DOCK_ORDER: ItemId[] = [
  "phone",
  "laptop",
  "headphones",
  "backpack",
  "notebook",
  "album",
  "skateboard",
  "doll",
  "bubbleTea",
  "bookStack",
  "poster",
];

interface MobileDockProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
}

/** 手機版底部 dock:小螢幕上場景會被裁切,保證所有物件都點得到。 */
export function MobileDock({ onItemClick }: MobileDockProps) {
  return (
    <nav
      aria-label="桌上的物件"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#6b5647]/15 bg-[#faf4ea]/92 backdrop-blur md:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
        {DOCK_ORDER.map((id) => {
          const meta = ITEMS[id];
          return (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
                className="flex w-16 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[#5a4a3c] transition active:scale-90 active:bg-[#6b5647]/10"
              >
                <ItemIcon id={id} className="size-6" />
                <span className="text-[10px] text-[#8a7561]">{meta.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
