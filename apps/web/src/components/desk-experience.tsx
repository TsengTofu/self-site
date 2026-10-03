"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoScene } from "@/components/scene/photo-scene";
import { OverlayRoot } from "@/components/overlays/overlay-root";
import { MusicPlayer } from "@/components/music-player";
import { ReactionToast } from "@/components/reaction-toast";
import { MobileDock } from "@/components/mobile-dock";
import { TopMenu } from "@/components/top-menu";
import { NightOwlToast } from "@/components/night-owl-toast";
import { useSceneStore } from "@/stores/scene-store";
import type { ItemId } from "@/lib/items";
import { setupGsapTickerFallback } from "@/lib/gsap-setup";
import { usePresenceCycle } from "@/hooks/use-presence";
import { useSceneCamera } from "@/hooks/use-scene-camera";
import { useItemClickRouter } from "@/hooks/use-item-click-router";
import { useHotspotHint } from "@/hooks/use-hotspot-hint";
import { useTitleEgg } from "@/hooks/use-title-egg";
import { useItemRoute } from "@/hooks/use-item-route";

setupGsapTickerFallback();

interface DeskExperienceProps {
  /** page.tsx(server component)用 fs.readdirSync 讀到的元素圖層檔名清單 */
  availableElements: string[];
}

/** 整個首頁體驗的總指揮:場景、鏡頭、點擊路由、overlay。 */
export function DeskExperience({ availableElements }: DeskExperienceProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  const reaction = useSceneStore((s) => s.reaction);
  const overlay = useSceneStore((s) => s.overlay);

  // 搖晃 450ms 後結束:記下「哪一次」已經搖完,不用另外存正在搖的物件
  const [doneNonce, setDoneNonce] = useState<number | null>(null);
  const wiggling: ItemId | null = reaction && reaction.nonce !== doneNonce ? reaction.itemId : null;

  usePresenceCycle();
  useSceneCamera(stageRef);
  useTitleEgg();
  useItemRoute();
  const handleItemClick = useItemClickRouter();
  const { hinting } = useHotspotHint();

  /* ---------- 點到未實作物件時搖一下 ---------- */
  useEffect(() => {
    if (!reaction) return;
    const t = setTimeout(() => setDoneNonce(reaction.nonce), 450);
    return () => clearTimeout(t);
  }, [reaction]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* overlay 開啟時整組背景 inert:焦點陷阱之外,螢幕閱讀器的虛擬游標
          也不該能瀏覽對話框後面的場景(overlay 本體是後面的兄弟節點,不受影響) */}
      <div inert={overlay !== null}>
        {/* 場景(鏡頭作用的那層) */}
        <div ref={stageRef} className="h-dvh w-full will-change-transform">
          {/* 進場動畫掛在這層(intro-scene),不碰鏡頭用的 stage */}
          <div className="intro-scene h-full w-full">
            <PhotoScene
              onItemClick={handleItemClick}
              wigglingItem={wiggling}
              hinting={hinting}
              availableElements={availableElements}
            />
          </div>
        </div>

        {/* 畫面上不放標題了,留一個只給螢幕閱讀器與搜尋引擎的 h1 */}
        <h1 className="sr-only">나의 공간 — Tofu Tseng 的房間</h1>

        {/* 右上角收合選單:在線狀態、時段、視覺製作歷程 */}
        <TopMenu />
        <MobileDock onItemClick={handleItemClick} />
      </div>

      {/* 進場動畫的蓋板(見 layout 的 INTRO_SCRIPT 與 globals.css 的 intro-*),
          只有 <html data-intro> 時才顯示 */}
      <div aria-hidden className="intro-title">
        <p className="font-hand text-4xl text-[#33271c] [-webkit-text-stroke:0.8px_currentColor] md:text-6xl">
          나의 공간
        </p>
      </div>

      <OverlayRoot />
      <MusicPlayer />
      <ReactionToast />
      <NightOwlToast />
    </div>
  );
}
