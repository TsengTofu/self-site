"use client";

import { useState } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { useSceneStore } from "@/stores/scene-store";
import { ContactApp } from "./contact-app";

/**
 * 來電畫面:接聽 → 一句「歡迎找我聊聊」+ 下方聯絡方式;掛斷 → 關閉手機。
 * 由場景裡響鈴中的電話點擊進入(phoneApp === "incoming")。
 */
export function IncomingCallApp() {
  const [answered, setAnswered] = useState(false);
  const closeOverlay = useSceneStore((s) => s.closeOverlay);

  if (answered) {
    return (
      <ContactApp
        headline="歡迎找我聊聊 👋"
        tagline="很高興你接起這通電話。工作機會、專案合作,或只是想交換歌單,都可以找我。"
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-between p-6 pb-10 pt-12 text-white">
      {/* 來電者 */}
      <div className="flex flex-col items-center gap-4">
        <span className="call-avatar grid size-24 place-items-center rounded-full bg-gradient-to-br from-[#e9b44c] to-accent-soft text-4xl shadow-lg">
          🧋
        </span>
        <div className="text-center">
          <p className="text-2xl font-bold">두부 Tofu</p>
          <p className="mt-1.5 text-xs tracking-widest text-white/50">來電中⋯</p>
        </div>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-white/35">
        桌上的電話響了
        <br />
        接起來看看是誰
      </p>

      {/* 接聽 / 掛斷 */}
      <div className="flex w-full items-end justify-around">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={closeOverlay}
            aria-label="掛斷"
            className="grid size-16 place-items-center rounded-full bg-[#e5484d] shadow-lg transition hover:brightness-110 active:scale-95"
          >
            <PhoneOff className="size-6 text-white" />
          </button>
          <span className="text-[10px] text-white/50">掛斷</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setAnswered(true)}
            aria-label="接聽"
            className="call-answer grid size-16 place-items-center rounded-full bg-[#30a46c] shadow-lg transition hover:brightness-110 active:scale-95"
          >
            <Phone className="size-6 text-white" />
          </button>
          <span className="text-[10px] text-white/50">接聽</span>
        </div>
      </div>
    </div>
  );
}
