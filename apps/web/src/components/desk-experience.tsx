"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  PhotoScene,
  SCENE_EMPTY_CANDIDATES,
  SCENE_PRESENT_CANDIDATES,
} from "@/components/scene/photo-scene";
import { OverlayRoot } from "@/components/overlays/overlay-root";
import { MusicPlayer } from "@/components/music-player";
import { ReactionToast } from "@/components/reaction-toast";
import { MobileDock } from "@/components/mobile-dock";
import { StatusBadge } from "@/components/status-badge";
import { PhaseBadge } from "@/components/phase-badge";
import { RingBadge } from "@/components/ring-badge";
import { useSceneStore } from "@/stores/scene-store";
import { ITEMS, type ItemId } from "@/lib/items";
import { setupGsapTickerFallback } from "@/lib/gsap-setup";
import { usePresenceCycle } from "@/hooks/use-presence";
import { usePhoneRing } from "@/hooks/use-phone-ring";

setupGsapTickerFallback();

const DOUBLE_CLICK_MS = 280;

interface Tooltip {
  id: ItemId;
  x: number;
  y: number;
}

/** 整個首頁體驗的總指揮:場景、鏡頭、點擊路由、overlay。 */
export function DeskExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const overlay = useSceneStore((s) => s.overlay);
  const openItem = useSceneStore((s) => s.openItem);
  const reaction = useSceneStore((s) => s.reaction);

  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [wiggling, setWiggling] = useState<ItemId | null>(null);

  /* ---------- 場景模式:public/scene/ 有插畫底圖就用圖片場景,否則退回 SVG ---------- */
  const [emptySrc, setEmptySrc] = useState<string | null>(null);
  const [presentSrc, setPresentSrc] = useState<string | null>(null);

  useEffect(() => {
    const probe = (candidates: string[], onFound: (src: string) => void) => {
      const tryNext = (i: number) => {
        if (i >= candidates.length) return;
        const img = new Image();
        img.onload = () => onFound(candidates[i] as string);
        img.onerror = () => tryNext(i + 1);
        img.src = candidates[i] as string;
      };
      tryNext(0);
    };
    probe(SCENE_EMPTY_CANDIDATES, setEmptySrc);
    probe(SCENE_PRESENT_CANDIDATES, setPresentSrc);
  }, []);

  usePresenceCycle();
  usePhoneRing();

  /* ---------- 點到未實作物件時搖一下 ---------- */
  useEffect(() => {
    if (!reaction) return;
    setWiggling(reaction.itemId);
    const t = setTimeout(() => setWiggling(null), 450);
    return () => clearTimeout(t);
  }, [reaction]);

  /* ---------- 電腦:鏡頭拉近 / 拉遠 ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const zoomSelector =
      overlay === "computer"
        ? '[data-zoom-target="laptop"], [data-laptop-screen]'
        : overlay === "ocean"
          ? '[data-zoom-target="window"]'
          : null;

    if (zoomSelector) {
      const screen = stage.querySelector(zoomSelector);
      if (!screen) return;
      const s = screen.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const scale = Math.min(window.innerWidth / s.width, window.innerHeight / s.height) * 0.9;
      const originX = s.left + s.width / 2 - stageRect.left;
      const originY = s.top + s.height / 2 - stageRect.top;

      gsap.set(stage, { transformOrigin: `${originX}px ${originY}px` });
      gsap.to(stage, {
        scale,
        x: window.innerWidth / 2 - (s.left + s.width / 2),
        y: window.innerHeight / 2 - (s.top + s.height / 2),
        duration: 0.9,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(stage, { scale: 1, x: 0, y: 0, duration: 0.8, ease: "power3.inOut" });
    }
  }, [overlay]);

  /* ---------- 點擊路由(手機要分單擊/雙擊) ---------- */
  const handleItemClick = (id: ItemId, rect: DOMRect) => {
    setTooltip(null);
    if (id !== "phone") {
      openItem(id, rect);
      return;
    }
    // 電話正在響:直接進來電畫面
    const { phoneRinging, setPhoneRinging } = useSceneStore.getState();
    if (phoneRinging) {
      setPhoneRinging(false);
      openItem("phone", rect, { phoneApp: "incoming" });
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
  };

  const handleItemHover = (id: ItemId | null, rect?: DOMRect) => {
    if (!id || !rect || overlay) {
      setTooltip(null);
      return;
    }
    setTooltip({ id, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <div ref={rootRef} className="relative h-dvh w-full overflow-hidden">
      {/* 場景(鏡頭作用的那層) */}
      <div ref={stageRef} className="h-full w-full will-change-transform">
        {emptySrc ? (
          <PhotoScene
            onItemClick={handleItemClick}
            onItemHover={handleItemHover}
            wigglingItem={wiggling}
            emptySrc={emptySrc}
            presentSrc={presentSrc}
          />
        ) : (
          // 底圖載入前的安靜底色(圖片就緒後換成 PhotoScene)
          <div className="h-full w-full bg-[#f5ead9]" />
        )}
      </div>

      {/* 標題:手寫字直接落在插畫上,用奶油色光暈保持易讀(不加卡片底) */}
      <header
        className="rise-in pointer-events-none absolute left-4 top-4 z-20 select-none md:left-7 md:top-6"
        style={{
          animationDelay: "0.45s",
          textShadow:
            "0 1px 0 rgba(250,244,234,.95), 0 -1px 0 rgba(250,244,234,.9), 1px 0 0 rgba(250,244,234,.9), -1px 0 0 rgba(250,244,234,.9), 0 2px 6px rgba(250,244,234,.9), 0 0 18px rgba(250,244,234,.85), 0 0 34px rgba(250,244,234,.7)",
        }}
      >
        <p className="text-[10px] font-bold tracking-[0.35em] text-[#6d5843]">ON MY DESK</p>
        <h1 className="font-hand mt-0.5 text-4xl text-[#33271c] md:text-5xl">
          책상 위의 나 <span className="text-[#6d5340]">— Tofu</span>
        </h1>
        {/* 手繪感的波浪底線 */}
        <svg
          viewBox="0 0 220 10"
          className="-mt-1 h-2.5 w-48 text-[#d98f4e] md:w-56"
          aria-hidden
        >
          <path
            d="M3 6 Q 20 1 38 5 T 74 5 T 110 5 T 146 5 T 182 5 T 217 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
        <p className="mt-1.5 text-[11px] font-semibold text-[#4a3a2c] md:text-xs">
          桌上的每樣東西都藏著一部分的我,點點看 ✦
        </p>
      </header>

      {/* Hover 提示 */}
      {tooltip && !overlay && (
        <div
          className="pointer-events-none fixed z-30 hidden -translate-x-1/2 -translate-y-full rounded-full border border-white/10 bg-[#141824]/95 px-3.5 py-1.5 text-xs text-white shadow-xl md:block"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          <span className="mr-1">{ITEMS[tooltip.id].emoji}</span>
          {ITEMS[tooltip.id].hint}
        </div>
      )}

      <StatusBadge />
      <PhaseBadge />
      <RingBadge />
      <OverlayRoot />
      <MusicPlayer />
      <ReactionToast />
      <MobileDock onItemClick={handleItemClick} />
    </div>
  );
}
