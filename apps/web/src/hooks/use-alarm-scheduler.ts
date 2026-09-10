"use client";

import { useEffect, useRef } from "react";
import { useSceneStore } from "@/stores/scene-store";
import { readStoredAlarms } from "@/hooks/use-alarm";

const CHECK_INTERVAL_MS = 30_000;
/** 時間到了但當下有 overlay 開著:這幾分鐘內關掉仍然會響,超過就當錯過 */
const GRACE_MINUTES = 5;

function minutesOfDay(hhmm: string) {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * 最小版鬧鐘排程:每 30 秒讀一次 localStorage 的鬧鐘清單(跟 use-alarm 共用同一把 key 與解析),
 * enabled 且時間落在「現在往回 GRACE_MINUTES 分鐘」內、今天還沒響過的 → 讓桌上的電話響(ringSource = "alarm")
 *
 * 有 overlay 開著或電話正在響時不插隊,但也不算響過,關掉 overlay 後下一輪補響
 * (以前是精確比對到分鐘,overlay 開超過一分鐘那顆鬧鐘就整個漏掉)
 *
 * 鈴聲需要使用者手勢才能初始化 AudioContext(見 lib/ring-tone.ts)——
 * 沒點過右上角「來電」開關就只有視覺響鈴,這是瀏覽器的自動播放限制,不是 bug
 * usePhoneRing() 的響鈴音效 effect 只看 phoneRinging,會自動接手,這裡不重複播放
 */
export function useAlarmScheduler() {
  const firedRef = useRef(new Set<string>());

  useEffect(() => {
    const check = () => {
      const { phoneRinging, overlay, setRingSource, setPhoneRinging } = useSceneStore.getState();
      if (phoneRinging || overlay) return;

      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const today = now.toDateString();
      const fired = firedRef.current;

      const due = (readStoredAlarms() ?? []).find((a) => {
        if (!a.enabled) return false;
        const diff = nowMin - minutesOfDay(a.time);
        return diff >= 0 && diff <= GRACE_MINUTES && !fired.has(`${today} ${a.time}`);
      });
      if (!due) return;

      fired.add(`${today} ${due.time}`);
      setRingSource("alarm");
      setPhoneRinging(true);
    };

    check();
    const timer = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);
}
