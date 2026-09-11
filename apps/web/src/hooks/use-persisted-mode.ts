"use client";

import { useEffect } from "react";

/**
 * 封裝右上角三顆 badge 重複的「還原上次手動設定」邏輯:
 * 掛載時讀一次 localStorage,交給 `restore` 判斷這個字串合不合法、要不要套用
 * (合法就在 `restore` 裡呼叫對應的 store setter)。
 *
 * 回傳一個 `persist` function,呼叫端在切換模式時用它寫回 / 清除 localStorage
 * (傳 `null` = 清除,通常對應「回到 auto」)。
 */
export function usePersistedMode(storageKey: string, restore: (saved: string) => void) {
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) restore(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在掛載時還原一次,restore 用當下閉包即可
  }, []);

  return (value: string | null) => {
    if (value === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, value);
  };
}
