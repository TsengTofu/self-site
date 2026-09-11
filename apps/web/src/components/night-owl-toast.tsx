"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "self-site:night-owl";
const SHOW_DELAY_MS = 4000;
const VISIBLE_MS = 6000;
/** 深夜時段:00:00–05:59(本地時間) */
const NIGHT_OWL_END_HOUR = 6;

/**
 * 深夜彩蛋:本地時間 00:00–05:59 造訪時,延遲 4 秒冒出一句「你也是夜貓子吧」,顯示 6 秒。
 * 每次造訪(這個分頁存活期間)最多顯示一次,用 sessionStorage 記錄,不影響下次真的重新造訪。
 */
export function NightOwlToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (new Date().getHours() >= NIGHT_OWL_END_HOUR) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center md:bottom-8">
      <div
        role="status"
        className="rounded-full border border-ink-soft/15 bg-cream/95 px-5 py-2.5 text-sm text-ink shadow-lg backdrop-blur"
      >
        這個時間還醒著,你也是夜貓子吧 🌙
      </div>
    </div>
  );
}
