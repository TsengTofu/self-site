"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSceneStore } from "@/stores/scene-store";
import type { ItemId } from "@/lib/items";

const DOUBLE_CLICK_MS = 280;

/**
 * 桌面物件的點擊路由:大多數物件單擊直接開 overlay;
 * 手機比較特別 —— 響鈴中點擊直接接聽(一般來電進來電畫面,鬧鐘觸發的響鈴直接進鬧鐘),
 * 沒響鈴時單擊進 Profile、雙擊(280ms 內)直接進鬧鐘。
 */
export function useItemClickRouter() {
  const phoneClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 單擊延遲中就卸載(例如換頁)時把 timer 清掉,不讓它對著沒了的場景開 overlay
  useEffect(
    () => () => {
      if (phoneClickTimer.current) clearTimeout(phoneClickTimer.current);
    },
    [],
  );

  // 只讀 store 的 getState,沒有依賴;useCallback 讓往下傳的 handler 不用每次 render 換新
  const handleItemClick = useCallback((id: ItemId, rect: DOMRect) => {
    // 廣播給場景:元素點擊小動畫 + 手機版捲動到對應範圍(photo-scene 監聽)
    window.dispatchEvent(new CustomEvent<ItemId>("scene:item-open", { detail: id }));

    if (id !== "phone") {
      useSceneStore.getState().openItem(id, rect);
      return;
    }

    const { phoneRinging, ringSource, setPhoneRinging, openItem } = useSceneStore.getState();

    // 電話正在響:直接接聽 —— 鬧鐘觸發的響鈴進鬧鐘頁,一般來電進來電畫面
    if (phoneRinging) {
      setPhoneRinging(false);
      openItem("phone", rect, { phoneApp: ringSource === "alarm" ? "alarm" : "incoming" });
      return;
    }

    if (phoneClickTimer.current) {
      // 第二下:直接進鬧鐘
      clearTimeout(phoneClickTimer.current);
      phoneClickTimer.current = null;
      openItem("phone", rect, { phoneApp: "alarm" });
      return;
    }

    phoneClickTimer.current = setTimeout(() => {
      phoneClickTimer.current = null;
      openItem("phone", rect, { phoneApp: "home" });
    }, DOUBLE_CLICK_MS);
  }, []);

  return handleItemClick;
}
