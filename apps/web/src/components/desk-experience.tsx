"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoScene } from "@/components/scene/photo-scene";
import { OverlayRoot } from "@/components/overlays/overlay-root";
import { MusicPlayer } from "@/components/music-player";
import { ReactionToast } from "@/components/reaction-toast";
import { MobileDock } from "@/components/mobile-dock";
import { SceneHeader } from "@/components/scene-header";
import { StatusBadge } from "@/components/status-badge";
import { PhaseBadge } from "@/components/phase-badge";
import { RingBadge } from "@/components/ring-badge";
import { NightOwlToast } from "@/components/night-owl-toast";
import { useSceneStore } from "@/stores/scene-store";
import type { ItemId } from "@/lib/items";
import { setupGsapTickerFallback } from "@/lib/gsap-setup";
import { usePresenceCycle } from "@/hooks/use-presence";
import { usePhoneRing } from "@/hooks/use-phone-ring";
import { useSceneCamera } from "@/hooks/use-scene-camera";
import { useItemClickRouter } from "@/hooks/use-item-click-router";
import { useHotspotHint } from "@/hooks/use-hotspot-hint";
import { useTitleEgg } from "@/hooks/use-title-egg";
import { useMockVariant } from "@/lib/mock-variant";
import { OrbitNav, type OrbitShape } from "@/components/nav/orbit-nav";
import { useAlarmScheduler } from "@/hooks/use-alarm-scheduler";

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

  const [wiggling, setWiggling] = useState<ItemId | null>(null);

  usePresenceCycle();
  usePhoneRing();
  useAlarmScheduler();
  useSceneCamera(stageRef);
  useTitleEgg();
  const handleItemClick = useItemClickRouter();
  const { hinting, replay: replayHint } = useHotspotHint();
  // 🧪 MOCK:導覽提案切換(?navv=list|sheet),無參數 / 0 = 原始版(右上角 + dock)
  const navv = useMockVariant("navv");
  const orbitShape = (["list", "sheet"] as const).includes(navv as OrbitShape)
    ? (navv as OrbitShape)
    : null;

  /* ---------- 點到未實作物件時搖一下 ---------- */
  useEffect(() => {
    if (!reaction) return;
    setWiggling(reaction.itemId);
    const t = setTimeout(() => setWiggling(null), 450);
    return () => clearTimeout(t);
  }, [reaction]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* overlay 開啟時整組背景 inert:焦點陷阱之外,螢幕閱讀器的虛擬游標
          也不該能瀏覽對話框後面的場景(overlay 本體是後面的兄弟節點,不受影響) */}
      <div inert={overlay !== null}>
        {/* 場景(鏡頭作用的那層) */}
        <div ref={stageRef} className="h-dvh w-full will-change-transform">
          <PhotoScene
            onItemClick={handleItemClick}
            wigglingItem={wiggling}
            hinting={hinting}
            availableElements={availableElements}
          />
        </div>

        <SceneHeader onReplayHint={replayHint} />

      {/* 🧪 MOCK 導覽提案(?navv=)
          未帶參數 / navv=0 → 原始版:右上角三顆藥丸 + 手機底部 dock(保留)
          navv=list|sheet → 圓形導覽鈕(收合時一顆圓,點開展開物件 + 設定),
                            手機與桌機共用;上線改純顯示、來電收進選單 */}
      {orbitShape ? (
        <OrbitNav onItemClick={handleItemClick} shape={orbitShape} />
      ) : (
        <>
          {/* 右上角狀態膠囊:在線 / 時段 / 來電,共用一個容器定位 */}
          <div className="fixed right-4 top-4 z-20 flex flex-col items-end gap-2 md:right-8 md:top-8">
            <StatusBadge />
            <PhaseBadge />
            <RingBadge />
          </div>
          <MobileDock onItemClick={handleItemClick} />
        </>
      )}
      </div>

      <OverlayRoot />
      <MusicPlayer />
      <ReactionToast />
      <NightOwlToast />
    </div>
  );
}
