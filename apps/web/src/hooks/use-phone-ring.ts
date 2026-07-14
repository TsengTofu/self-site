"use client";

import { useEffect } from "react";
import { useSceneStore } from "@/stores/scene-store";
import { startRingTone } from "@/lib/ring-tone";

/**
 * 來電排程:開關開著且沒有 overlay 時,隨機 8–20 秒後電話開始響;
 * 響 24 秒沒人接就先安靜(稍後排程會再打來)。
 * 響鈴期間播 WebAudio 鈴聲(需要開關點擊時 initRingAudio 過才有聲音)。
 */
export function usePhoneRing() {
  const enabled = useSceneStore((s) => s.phoneRingEnabled);
  const ringing = useSceneStore((s) => s.phoneRinging);
  const overlay = useSceneStore((s) => s.overlay);

  // 排程下一通來電
  useEffect(() => {
    if (!enabled || ringing || overlay) return;
    const delay = 8000 + Math.random() * 12000;
    const t = setTimeout(() => useSceneStore.getState().setPhoneRinging(true), delay);
    return () => clearTimeout(t);
  }, [enabled, ringing, overlay]);

  // 響太久沒接 → 自動掛斷
  useEffect(() => {
    if (!ringing) return;
    const t = setTimeout(() => useSceneStore.getState().setPhoneRinging(false), 24000);
    return () => clearTimeout(t);
  }, [ringing]);

  // 響鈴時播鈴聲
  useEffect(() => {
    if (!ringing) return;
    return startRingTone();
  }, [ringing]);
}
