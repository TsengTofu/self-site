"use client";

import { Phone, PhoneOff } from "lucide-react";
import { useSceneStore } from "@/stores/scene-store";
import { initRingAudio } from "@/lib/ring-tone";
import { usePersistedMode } from "@/hooks/use-persisted-mode";

const STORAGE_KEY = "self-site:phone-ring";

/**
 * 來電彩蛋開關 —— 收進圓形選單裡的版本(舊版是右上角第三顆藥丸)。
 * 打開後場景裡的電話會不定時響起,點響鈴中的電話可以接聽。
 */
export function RingToggle() {
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

  const Icon = enabled ? Phone : PhoneOff;

  return (
    <button
      type="button"
      onClick={toggle}
      title="來電彩蛋 — 打開後,桌上的電話會不定時響起"
      aria-pressed={enabled}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-xs text-ink transition hover:bg-ink-soft/10"
    >
      <span className="flex items-center gap-2">
        <Icon className="size-4" strokeWidth={1.8} />
        來電彩蛋
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] ${
          enabled ? "bg-accent/20 text-accent" : "bg-ink-soft/15 text-ink-dim"
        }`}
      >
        {enabled ? "開" : "關"}
      </span>
    </button>
  );
}
