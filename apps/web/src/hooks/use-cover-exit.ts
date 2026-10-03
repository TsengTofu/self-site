"use client";

import { useRef, useState } from "react";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

/** 全螢幕 overlay 淡出的時間,要跟 globals.css 的 .cover-out 一致 */
const COVER_EXIT_MS = 260;

/**
 * 蓋住整個畫面的 overlay(電腦專案、海景)的關閉流程
 * 先叫鏡頭瞬間回到原位(還被不透明的 overlay 擋著,看不到),再淡出 overlay
 * 以前是 overlay 一拿掉就露出 0.8 秒放大中的模糊場景在縮回
 */
export function useCoverExit() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);

  const leave = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    window.dispatchEvent(new Event("scene:camera-reset"));
    if (prefersReducedMotion()) {
      closeOverlay();
      return;
    }
    setLeaving(true);
    window.setTimeout(closeOverlay, COVER_EXIT_MS);
  };

  return { leaving, leave };
}
