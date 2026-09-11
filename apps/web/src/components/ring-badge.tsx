"use client";

import { useSceneStore } from "@/stores/scene-store";
import { initRingAudio } from "@/lib/ring-tone";
import { usePersistedMode } from "@/hooks/use-persisted-mode";
import { BadgePill } from "@/components/badge-pill";

const STORAGE_KEY = "self-site:phone-ring";

/**
 * 右上角第三顆藥丸:來電開關。
 * 打開後場景裡的電話會不定時響起,點響鈴中的電話可以接聽。
 */
export function RingBadge() {
  const enabled = useSceneStore((s) => s.phoneRingEnabled);
  const setEnabled = useSceneStore((s) => s.setPhoneRingEnabled);

  // 還原上次設定(此時沒有使用者手勢,鈴聲會在第一次點擊後才有聲音)
  const persist = usePersistedMode(STORAGE_KEY, (saved) => {
    if (saved === "on") setEnabled(true);
  });

  const toggle = () => {
    initRingAudio(); // 在手勢中初始化 AudioContext,響鈴才有聲音
    const next = !enabled;
    setEnabled(next);
    persist(next ? "on" : null);
  };

  return (
    <BadgePill
      onClick={toggle}
      pressed={enabled}
      title="來電彩蛋 — 打開後,桌上的電話會不定時響起,接起來聊聊"
    >
      <span className="text-sm leading-none">{enabled ? "☎️" : "📴"}</span>
      來電
      <span className="text-[10px] text-[#a08b74]">{enabled ? "開" : "關"}</span>
    </BadgePill>
  );
}
