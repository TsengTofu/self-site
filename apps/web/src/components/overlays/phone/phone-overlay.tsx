"use client";

import { useEffect, useState } from "react";
import { User, Mail, AlarmClock, type LucideIcon } from "lucide-react";
import { useSceneStore, type PhoneApp } from "@/stores/scene-store";
import { OverlayShell } from "@/components/overlays/overlay-shell";
import { ProfileApp } from "./profile-app";
import { ContactApp } from "./contact-app";
import { AlarmApp } from "./alarm-app";
import { IncomingCallApp } from "./incoming-call-app";

const APPS: { id: PhoneApp; label: string; Icon: LucideIcon; bg: string }[] = [
  { id: "profile", label: "Profile", Icon: User, bg: "from-accent to-[#5b7ea8]" },
  { id: "contact", label: "Mail", Icon: Mail, bg: "from-accent-soft to-[#b06a92]" },
  { id: "alarm", label: "Alarm", Icon: AlarmClock, bg: "from-[#e9b44c] to-[#c98a2e]" },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** 點手機後飛到畫面中央的手機。點兩下場景中的手機會直接進鬧鐘。 */
export function PhoneOverlay() {
  // 只訂閱用到的三個欄位,不讓響鈴/在座狀態變動整支重繪
  const phoneApp = useSceneStore((s) => s.phoneApp);
  const setPhoneApp = useSceneStore((s) => s.setPhoneApp);
  const closeOverlay = useSceneStore((s) => s.closeOverlay);
  const clock = useClock();

  return (
    <OverlayShell label="手機" onClose={closeOverlay}>
      <div className="flex h-[min(78vh,660px)] w-[min(88vw,330px)] flex-col overflow-hidden rounded-[44px] border-[6px] border-[#0d1017] bg-[#141824] shadow-[0_24px_80px_rgba(0,0,0,.6)]">
        {/* 狀態列 */}
        <div className="relative flex items-center justify-between px-7 pb-1 pt-3 text-[11px] font-bold text-white/80">
          <span className="tabular-nums">{clock}</span>
          <span className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0d1017]" />
          <span>📶 🔋</span>
        </div>

        {/* 內容 */}
        <div className="min-h-0 flex-1 overflow-auto">
          {phoneApp === "home" && (
            <div className="flex h-full flex-col p-6">
              <p className="font-hand mb-1 mt-4 text-3xl text-white/90">안녕 👋</p>
              <p className="mb-8 text-xs text-white/50">點個 App 認識我</p>
              <div className="grid grid-cols-3 gap-4">
                {APPS.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setPhoneApp(app.id)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={`grid size-16 place-items-center rounded-2xl bg-gradient-to-br shadow-lg transition hover:scale-105 active:scale-95 ${app.bg}`}
                    >
                      <app.Icon className="size-7 text-white" />
                    </span>
                    <span className="text-[10px] text-white/70">{app.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-auto text-center text-[10px] text-white/25">
                小秘密:在桌面上點手機兩下,會直接打開鬧鐘
              </p>
            </div>
          )}
          {phoneApp === "profile" && <ProfileApp />}
          {phoneApp === "contact" && <ContactApp />}
          {phoneApp === "alarm" && <AlarmApp />}
          {phoneApp === "incoming" && <IncomingCallApp />}
        </div>

        {/* Home indicator:在 app 裡點回主畫面,在主畫面點關閉 */}
        <button
          type="button"
          aria-label={phoneApp === "home" ? "關閉手機" : "回到主畫面"}
          onClick={() => (phoneApp === "home" ? closeOverlay() : setPhoneApp("home"))}
          className="group grid place-items-center pb-2.5 pt-1.5"
        >
          <span className="h-1.5 w-28 rounded-full bg-white/30 transition group-hover:bg-white/60" />
        </button>
      </div>
    </OverlayShell>
  );
}
