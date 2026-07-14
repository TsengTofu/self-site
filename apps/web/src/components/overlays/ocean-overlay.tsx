"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useSceneStore } from "@/stores/scene-store";
import { useEffectivePhase, type DayPhase } from "@/hooks/use-time-of-day";

/** 各時段的海與天配色(沿用場景的色票) */
const SEA_PALETTE: Record<
  DayPhase,
  { skyTop: string; skyBot: string; seaTop: string; seaBot: string; hills: string }
> = {
  dawn: { skyTop: "#e9c3d6", skyBot: "#f7dcc4", seaTop: "#7f9ec4", seaBot: "#a8c3d8", hills: "#8a93b5" },
  day: { skyTop: "#aad6ea", skyBot: "#e2f2f7", seaTop: "#63aec7", seaBot: "#8fd0da", hills: "#6f9e86" },
  sunset: { skyTop: "#f7b267", skyBot: "#f28f5f", seaTop: "#e08a63", seaBot: "#a06f86", hills: "#8a5f6f" },
  night: { skyTop: "#23304f", skyBot: "#151d33", seaTop: "#24405a", seaBot: "#16283a", hills: "#1c2a3f" },
};

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * 點海景窗後,鏡頭拉近窗戶(縮放由 DeskExperience 控制),
 * 這層是「望向大海」的沉浸畫面:雲飄、船行、依時段換色,點海面起漣漪。
 */
export function OceanOverlay() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);
  const phase = useEffectivePhase();
  const c = SEA_PALETTE[phase];
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOverlay]);

  const addRipple = (e: MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 1600;
    const y = ((e.clientY - r.top) / r.height) * 900;
    if (y < 430) return; // 只在海面(地平線以下)起漣漪
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((rp) => rp.id !== id)), 1500);
  };

  const isNight = phase === "night";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="海景"
      className="rise-in fixed inset-0 z-50"
      style={{ animationDelay: "0.5s" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full cursor-pointer"
        onClick={addRipple}
      >
        <defs>
          <linearGradient id="ov-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.skyTop} />
            <stop offset="100%" stopColor={c.skyBot} />
          </linearGradient>
          <linearGradient id="ov-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.seaTop} />
            <stop offset="100%" stopColor={c.seaBot} />
          </linearGradient>
        </defs>

        {/* 天空 */}
        <rect x="0" y="0" width="1600" height="440" fill="url(#ov-sky)" />
        {/* 太陽 / 月亮 */}
        {isNight ? (
          <>
            <circle cx="1230" cy="150" r="52" fill="#f7ecc9" />
            <circle cx="1205" cy="135" r="44" fill={c.skyTop} opacity="0.8" />
            {(
              [
                [180, 110], [320, 200], [520, 90], [760, 160], [980, 120], [1420, 240], [1500, 90],
              ] as const
            ).map(([x, y], i) => (
              <circle key={`${x}-${y}`} className="twinkle" cx={x} cy={y} r="2.6" fill="#fff" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </>
        ) : (
          <circle
            cx={phase === "sunset" ? 800 : 1180}
            cy={phase === "sunset" ? 400 : 150}
            r={phase === "sunset" ? 66 : 54}
            fill={phase === "sunset" ? "#ff9d5c" : "#ffe9a8"}
          />
        )}
        {/* 雲(白天/清晨/黃昏) */}
        {!isNight &&
          [
            { x: 300, y: 120, s: 1, d: "0s" },
            { x: 820, y: 90, s: 1.3, d: "-18s" },
            { x: 1250, y: 200, s: 0.8, d: "-32s" },
          ].map((cl) => (
            <g key={cl.x} className="ov-cloud" style={{ animationDelay: cl.d }}>
              <g transform={`translate(${cl.x} ${cl.y}) scale(${cl.s})`} opacity="0.9">
                <ellipse cx="0" cy="0" rx="70" ry="26" fill="#fff" />
                <ellipse cx="48" cy="8" rx="48" ry="20" fill="#fff" />
                <ellipse cx="-46" cy="10" rx="42" ry="18" fill="#fff" />
              </g>
            </g>
          ))}

        {/* 遠山 */}
        <path d="M0 430 Q260 350 520 410 Q760 460 1040 400 Q1320 350 1600 420 L1600 460 L0 460 Z" fill={c.hills} opacity="0.85" />

        {/* 海 */}
        <rect x="0" y="430" width="1600" height="470" fill="url(#ov-sea)" />

        {/* 波紋橫線(緩慢左右) */}
        {[480, 540, 610, 690, 780].map((y, i) => (
          <path
            key={y}
            className="ov-wave"
            d={`M-40 ${y} q 40 -10 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={isNight ? 0.12 : 0.28}
            style={{ animationDelay: `${i * -1.3}s`, animationDuration: `${6 + i}s` }}
          />
        ))}

        {/* 帆船緩緩航行 */}
        <g className="ov-boat">
          <g transform="translate(0 470)">
            <path d="M-26 0 L26 0 L18 20 L-18 20 Z" fill="#f3ead8" stroke="#6b5647" strokeWidth="2.5" />
            <path d="M0 -46 L0 -2 L-22 -6 Z" fill="#faf4ea" stroke="#6b5647" strokeWidth="2" />
            <path d="M2 -44 L20 -6 L2 -4 Z" fill="#e0e6ea" stroke="#6b5647" strokeWidth="2" />
            <line x1="0" y1="-48" x2="0" y2="2" stroke="#6b5647" strokeWidth="2.5" />
          </g>
        </g>

        {/* 點擊漣漪 */}
        {ripples.map((rp) => (
          <g key={rp.id}>
            <circle className="ov-ripple" cx={rp.x} cy={rp.y} r="8" fill="none" stroke="#fff" strokeWidth="3" />
            <circle className="ov-ripple" cx={rp.x} cy={rp.y} r="8" fill="none" stroke="#fff" strokeWidth="2" style={{ animationDelay: "0.18s" }} />
          </g>
        ))}
      </svg>

      {/* 提示 + 關閉 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-white/90 drop-shadow">點點海面 · 看著浪發呆一下</p>
        <p className="text-xs text-white/60 drop-shadow">按 ESC 回到房間</p>
      </div>
      <button
        type="button"
        aria-label="回到房間"
        onClick={closeOverlay}
        className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-black/25 text-lg text-white/90 backdrop-blur transition hover:bg-black/40"
      >
        ✕
      </button>
    </div>
  );
}
