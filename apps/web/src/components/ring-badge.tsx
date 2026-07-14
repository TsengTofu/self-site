"use client";

import { useEffect } from "react";
import { useSceneStore } from "@/stores/scene-store";
import { initRingAudio } from "@/lib/ring-tone";

const STORAGE_KEY = "self-site:phone-ring";

/**
 * 右上角第三顆藥丸:來電開關。
 * 打開後場景裡的電話會不定時響起,點響鈴中的電話可以接聽。
 */
export function RingBadge() {
  const enabled = useSceneStore((s) => s.phoneRingEnabled);
  const setEnabled = useSceneStore((s) => s.setPhoneRingEnabled);

  // 還原上次設定(此時沒有使用者手勢,鈴聲會在第一次點擊後才有聲音)
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "on") {
      useSceneStore.getState().setPhoneRingEnabled(true);
    }
  }, []);

  const toggle = () => {
    initRingAudio(); // 在手勢中初始化 AudioContext,響鈴才有聲音
    const next = !enabled;
    setEnabled(next);
    if (next) localStorage.setItem(STORAGE_KEY, "on");
    else localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="來電彩蛋 — 打開後,桌上的電話會不定時響起,接起來聊聊"
      className="fixed right-4 top-[6.2rem] z-20 flex items-center gap-2 rounded-full border border-[#6b5647]/20 bg-[#faf4ea]/90 py-1.5 pl-3 pr-3.5 text-xs font-medium text-[#4a3c30] shadow-sm backdrop-blur transition hover:shadow-md md:right-8 md:top-[7.7rem]"
    >
      <span className="text-sm leading-none">{enabled ? "☎️" : "📴"}</span>
      來電
      <span className="text-[10px] text-[#a08b74]">{enabled ? "開" : "關"}</span>
    </button>
  );
}
