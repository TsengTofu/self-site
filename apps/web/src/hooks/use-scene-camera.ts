"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

/** 鏡頭拉近目標區域後,四周留的一點呼吸空間(1 = 貼滿,0.9 = 縮小 10% 當邊界)。 */
const ZOOM_FIT_SCALE = 0.9;

/** 🔧 各 overlay 的鏡頭最大倍率:筆電不用放到滿版,適中就好;沒列的(海景)不設上限,維持沉浸感 */
const ZOOM_MAX_SCALE: Record<string, number> = {
  computer: 4.5,
};

/** 手機(<768px):拉近幅度再收斂,稍微推進即可,不用像桌機那麼近 */
const ZOOM_MAX_SCALE_MOBILE: Record<string, number> = {
  computer: 2.4,
};

function zoomSelectorFor(overlay: string | null) {
  if (overlay === "computer") return '[data-zoom-target="laptop"], [data-laptop-screen]';
  if (overlay === "ocean") return '[data-zoom-target="window"]';
  return null;
}

/**
 * 電腦 / 海景 overlay 開啟時,把整個場景鏡頭拉近目標區域;overlay 關閉時退回原位。
 * `resize` 時重新校正一次(不重播進場動畫),避免視窗尺寸改變後鏡頭跟目標區域對不準。
 */
export function useSceneCamera(stageRef: RefObject<HTMLDivElement | null>) {
  const overlay = useSceneStore((s) => s.overlay);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const zoomSelector = zoomSelectorFor(overlay);

    const apply = (animate: typeof gsap.set) => {
      if (zoomSelector) {
        const screen = stage.querySelector(zoomSelector);
        if (!screen) return;
        // 量測前先把鏡頭歸零:resize 時 stage 已經被縮放位移
        // 直接量會拿到相對現況的值再當絕對值寫回,鏡頭就飛掉
        gsap.set(stage, { scale: 1, x: 0, y: 0 });
        const s = screen.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const maxTable = window.innerWidth < 768 ? ZOOM_MAX_SCALE_MOBILE : ZOOM_MAX_SCALE;
        const scale = Math.min(
          Math.min(window.innerWidth / s.width, window.innerHeight / s.height) * ZOOM_FIT_SCALE,
          maxTable[overlay ?? ""] ?? Infinity,
        );
        const originX = s.left + s.width / 2 - stageRect.left;
        const originY = s.top + s.height / 2 - stageRect.top;

        gsap.set(stage, { transformOrigin: `${originX}px ${originY}px` });
        animate(stage, {
          scale,
          x: window.innerWidth / 2 - (s.left + s.width / 2),
          y: window.innerHeight / 2 - (s.top + s.height / 2),
          duration: 0.9,
          ease: "power3.inOut",
        });
      } else {
        animate(stage, { scale: 1, x: 0, y: 0, duration: 0.8, ease: "power3.inOut" });
      }
    };

    // 減少動態:鏡頭直接跳到定位,不做 zoom 過場
    apply(prefersReducedMotion() ? gsap.set : gsap.to);

    // 縮放中視窗尺寸改變(旋轉裝置、開發者工具開合等):直接校正定位,不重播動畫
    const onResize = zoomSelector
      ? () => {
          gsap.killTweensOf(stage);
          apply(gsap.set);
        }
      : null;
    if (onResize) window.addEventListener("resize", onResize);
    return () => {
      if (onResize) window.removeEventListener("resize", onResize);
      // 0.9s 內開關 overlay,不讓上一條 tween 跟新的疊著跑
      gsap.killTweensOf(stage);
    };
  }, [overlay, stageRef]);
}
