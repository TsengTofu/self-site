"use client";

import { useCallback, useEffect, useState } from "react";

export interface AlarmItem {
  id: string;
  /** HH:mm */
  time: string;
  label: string;
  enabled: boolean;
}

export const ALARM_STORAGE_KEY = "self-site:alarms";

const DEFAULT_ALARMS: AlarmItem[] = [
  { id: "a1", time: "07:30", label: "起床寫 code", enabled: true },
  { id: "a2", time: "12:30", label: "訂手搖", enabled: false },
  { id: "a3", time: "23:00", label: "闔上筆電", enabled: true },
];

/**
 * 讀 localStorage 裡存的鬧鐘;沒存過(第一次造訪)就用預設三筆。
 * AlarmApp 只會在使用者點開手機的鬧鐘頁後才掛載(不在首頁 SSR 輸出裡),
 * 所以這裡可以直接同步讀 localStorage 當 useState 的初始值,不會有 hydration mismatch。
 */
function loadAlarms(): AlarmItem[] {
  // 安全網:目前 AlarmApp 只在 client 掛載,但若日後重構把它搬進 SSR 輸出,
  // 這層早退能避免 prerender 直接爆掉(拿到預設值,client 端再讀真值)
  if (typeof window === "undefined") return DEFAULT_ALARMS;
  return readStoredAlarms() ?? DEFAULT_ALARMS;
}

/**
 * 讀 localStorage 存的鬧鐘;沒存過或格式不對回 null,預設值由呼叫端決定
 * (鬧鐘 App 用預設三筆;排程器 use-alarm-scheduler 用空清單,沒開過鬧鐘頁就不該響)
 */
export function readStoredAlarms(): AlarmItem[] | null {
  try {
    const raw = localStorage.getItem(ALARM_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AlarmItem[]) : null;
  } catch {
    return null;
  }
}

/**
 * 鬧鐘資料 —— lazy-init 從 localStorage 讀,每次新增/刪除/切換都會寫回,
 * 重新整理頁面鬧鐘還在。API 維持不變(AlarmApp 不用改)。
 * 排程(時間到了響鈴)交給 hooks/use-alarm-scheduler.ts。
 */
export function useAlarms() {
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => loadAlarms());

  useEffect(() => {
    localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }, []);

  const addAlarm = useCallback((time: string, label: string) => {
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
