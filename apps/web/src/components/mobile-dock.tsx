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
  /** 🧪 MOCK(?navv=…):附加在 dock 尾端的內容(「⋯」鈕或控制項),選定方案後移除此 prop */
  trailing?: React.ReactNode;
}

/** 手機版底部 dock:小螢幕上場景會被裁切,保證所有物件都點得到。 */
export function MobileDock({ onItemClick, trailing }: MobileDockProps) {
  return (
    <nav
      aria-label="桌上的物件"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-soft/15 bg-cream/92 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
        {DOCK_ORDER.map((id) => {
          const meta = ITEMS[id];
          return (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
                className="flex w-16 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[#5a4a3c] transition active:scale-90 active:bg-ink-soft/10"
              >
                <ItemIcon id={id} className="size-6" />
                <span className="text-[10px] text-ink-dim">{meta.label}</span>
              </button>
            </li>
          );
        })}
        {trailing && <li className="flex shrink-0 items-center">{trailing}</li>}
      </ul>
    </nav>
  );
}
