"use client";

import { useCallback } from "react";
import { useSceneStore } from "@/stores/scene-store";
import type { ItemId } from "@/lib/items";

/**
 * 桌面物件的點擊路由:單擊直接開對應的 overlay
 * 先廣播 scene:item-open 給場景(元素點擊小動畫、手機版捲動到該物件)
 */
export function useItemClickRouter() {
  // 只讀 store 的 getState,沒有依賴;useCallback 讓往下傳的 handler 不用每次 render 換新
  return useCallback((id: ItemId, rect: DOMRect) => {
    window.dispatchEvent(new CustomEvent<ItemId>("scene:item-open", { detail: id }));
    useSceneStore.getState().openItem(id, rect);
  }, []);
}
