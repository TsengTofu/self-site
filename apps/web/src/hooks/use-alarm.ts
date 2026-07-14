"use client";

import { useCallback, useState } from "react";

export interface AlarmItem {
  id: string;
  /** HH:mm */
  time: string;
  label: string;
  enabled: boolean;
}

/**
 * ⏰ 鬧鐘邏輯預留區 — 這個 hook 是挖好的洞,邏輯由你實作。
 *
 * TODO(you):
 *  1. 持久化:localStorage 或後端 API
 *  2. 排程:時間到的時候觸發提醒(Notification API / setTimeout 對齊下一分鐘)
 *  3. 貪睡、重複週期(週一到週五)等規則
 *
 * 下面先給假資料 + 可運作的增刪改,讓 AlarmApp 的 UI 可以完整互動。
 */
export function useAlarms() {
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: "a1", time: "07:30", label: "起床寫 code", enabled: true },
    { id: "a2", time: "12:30", label: "訂手搖", enabled: false },
    { id: "a3", time: "23:00", label: "闔上筆電", enabled: true },
  ]);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }, []);

  const addAlarm = useCallback((time: string, label: string) => {
    // TODO(you): 驗證時間格式、排程觸發
    setAlarms((prev) => [
      ...prev,
      { id: `a${Date.now()}`, time, label: label || "新鬧鐘", enabled: true },
    ]);
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { alarms, toggleAlarm, addAlarm, removeAlarm };
}
