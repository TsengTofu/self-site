"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSceneStore } from "@/stores/scene-store";
import { ITEM_LINK, ITEM_PAGE, type ItemId } from "@/lib/items";
import { startSprayTransition } from "@/components/spray-transition";

/** 換頁前等元素彈一下,不然點下去畫面直接跳走,感覺像沒點到 */
const LINK_DELAY_MS = 180;

/**
 * 桌面物件的點擊路由:單擊直接開對應的 overlay,ITEM_LINK 裡的物件改成換頁,
 * ITEM_PAGE 裡的物件先播噴漆轉場再換頁
 * 先廣播 scene:item-open 給場景(元素點擊小動畫、手機版捲動到該物件)
 */
export function useItemClickRouter() {
  const router = useRouter();
  return useCallback(
    (id: ItemId, rect: DOMRect) => {
      window.dispatchEvent(new CustomEvent<ItemId>("scene:item-open", { detail: id }));
      const page = ITEM_PAGE[id];
      if (page) {
        startSprayTransition(page);
        return;
      }
      const href = ITEM_LINK[id];
      if (href) {
        setTimeout(() => router.push(href), LINK_DELAY_MS);
        return;
      }
      useSceneStore.getState().openItem(id, rect);
    },
    [router],
  );
}
