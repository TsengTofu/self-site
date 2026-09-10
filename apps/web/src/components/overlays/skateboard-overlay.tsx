"use client";

import { profile } from "@/data/profile";
import { useSceneStore } from "@/stores/scene-store";
import { OverlayShell } from "./overlay-shell";

const IDEA_MAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${encodeURIComponent(
  "滑板那格我有個點子!",
)}`;

/** 滑板:還沒想到要放什麼,先做成一個徵求點子的彩蛋。 */
export function SkateboardOverlay() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);

  return (
    <OverlayShell label="滑板" onClose={closeOverlay} className="w-full max-w-md">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-panel p-8 text-center shadow-2xl">
        <span className="inline-block text-6xl transition hover:rotate-[-16deg]">🛹</span>
        <h2 className="text-lg font-bold text-white">這格還空著</h2>
        <p className="text-sm leading-relaxed text-white/60">
          滑板要放什麼,我還沒想好。
          <br />
          也許是學滑板的摔倒集錦,也許是人生的 side quest 清單。
        </p>
        <div className="flex gap-2">
          <a
            href={IDEA_MAIL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gradient-to-r from-accent to-accent-soft px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            跟我說你的點子
          </a>
          <button
            type="button"
            onClick={closeOverlay}
            className="rounded-full bg-white/10 px-5 py-2 text-sm text-white/70 transition hover:bg-white/20"
          >
            先滑走
          </button>
        </div>
      </div>
    </OverlayShell>
  );
}
