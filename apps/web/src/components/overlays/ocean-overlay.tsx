"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useSceneStore } from "@/stores/scene-store";
import { useEffectivePhase, type DayPhase } from "@/hooks/use-time-of-day";
import { useModalFocus } from "@self-site/ui/use-modal-focus";

/**
 * 窗外那片海 —— 底圖是從使用者的窗景原圖把玻璃那塊裁下來、反透視拉正的
 * (scripts/extract-ocean.py 產出 public/scene/ocean/ocean-<phase>.webp),
 * 所以進來看到的海跟房間窗戶裡是同一支畫筆
 *
 * 畫面上會動的東西都疊在圖上:整張極慢的推鏡、水面反光閃爍、海鷗、點擊漣漪
 */

/** 底圖尺寸 —— SVG 疊層用同一組座標,兩層才會一起被 cover 裁掉同樣的邊 */
const IMG_W = 2450;
const IMG_H = 1660;
/** 海平面位置(佔全圖高度的比例):漣漪只落在這條線以下 */
const HORIZON_Y = IMG_H * 0.655;

const PHASES: DayPhase[] = ["dawn", "day", "sunset", "night"];
/** 走字串路徑而不是 static import:Turbopack 對 public/ 下新增的 webp 靜態匯入會鬧脾氣 */
const oceanSrc = (phase: DayPhase) => `/scene/ocean/ocean-${phase}.webp`;
/** 圖還沒解完之前墊在後面的底色(各時段的平均色),避免開場閃一下黑 */
const BASE_COLOR: Record<DayPhase, string> = {
  dawn: "#65d2e7",
  day: "#c1d4cc",
  sunset: "#d68561",
  night: "#1c3c68",
};

/** 水面反光:太陽/月亮的倒影帶在左邊,那一區點密一點 */
const GLINTS: { x: number; y: number; rx: number; delay: number }[] = [
  { x: 150, y: 1170, rx: 34, delay: 0 },
  { x: 265, y: 1245, rx: 46, delay: 0.7 },
  { x: 120, y: 1330, rx: 40, delay: 1.4 },
  { x: 300, y: 1425, rx: 58, delay: 0.35 },
  { x: 180, y: 1520, rx: 50, delay: 1.9 },
  { x: 400, y: 1200, rx: 30, delay: 2.3 },
  { x: 470, y: 1340, rx: 42, delay: 1.1 },
  { x: 620, y: 1480, rx: 36, delay: 2.6 },
  { x: 830, y: 1215, rx: 28, delay: 0.9 },
  { x: 1010, y: 1390, rx: 44, delay: 1.7 },
  { x: 1290, y: 1560, rx: 38, delay: 0.5 },
  { x: 1560, y: 1275, rx: 26, delay: 2.1 },
  { x: 1880, y: 1450, rx: 34, delay: 1.3 },
  { x: 2180, y: 1590, rx: 30, delay: 2.8 },
];

/** 海鷗:出發點與飛行高度(夜晚不放) */
const GULLS = [
  { y: 330, scale: 1, delay: 0 },
  { y: 470, scale: 0.7, delay: 11 },
  { y: 250, scale: 0.55, delay: 21 },
];

/** 夜晚多補幾顆閃爍的星星(原圖已經有畫,這幾顆負責眨眼) */
const STARS = [
  { x: 520, y: 210 },
  { x: 760, y: 130 },
  { x: 1180, y: 300 },
  { x: 1620, y: 170 },
  { x: 2020, y: 260 },
  { x: 2280, y: 120 },
];

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function OceanOverlay() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);
  const phase = useEffectivePhase();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useModalFocus(true, rootRef, closeOverlay);

  // 點擊位置換算回圖片座標:圖是 cover 鋪滿,所以要照「被裁掉的邊」補回來
  const addRipple = (e: MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const scale = Math.max(r.width / IMG_W, r.height / IMG_H);
    const x = (e.clientX - r.left - (r.width - IMG_W * scale) / 2) / scale;
    const y = (e.clientY - r.top - (r.height - IMG_H * scale) / 2) / scale;
    if (y < HORIZON_Y) return; // 天空不起漣漪
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((rp) => rp.id !== id)), 1500);
  };

  const isNight = phase === "night";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="海景"
      className="rise-in fixed inset-0 z-50 overflow-hidden"
      style={{ animationDelay: "0.5s", backgroundColor: BASE_COLOR[phase] }}
    >
      {/* 推鏡層:底圖與活元素一起緩慢漂移,畫面才不會像定格照片 */}
      <div ref={stageRef} className="ov-drift absolute inset-0 cursor-pointer" onClick={addRipple}>
        {/* 四個時段的海(同一組構圖),跟著時段淡變
            unoptimized:源檔已是 2450 寬的 webp,optimizer 不會放大
            直式手機 cover 後實際要 2450 寬,給 sizes 反而只挑到 1200w 變糊 */}
        {PHASES.map((p) => (
          <Image
            key={p}
            src={oceanSrc(p)}
            alt={p === phase ? "窗外的海" : ""}
            fill
            unoptimized
            fetchPriority={p === phase ? "high" : "low"}
            draggable={false}
            className="object-cover transition-opacity duration-1000"
            style={{ opacity: phase === p ? 1 : 0 }}
          />
        ))}

        {/* 活元素:座標系跟底圖同一組,slice 之後永遠對得上 */}
        <svg
          viewBox={`0 0 ${IMG_W} ${IMG_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {/* 水面反光 */}
          {GLINTS.map((g) => (
            <ellipse
              key={`${g.x}-${g.y}`}
              className="ov-glint"
              cx={g.x}
              cy={g.y}
              rx={g.rx}
              ry={g.rx * 0.13}
              fill="#ffffff"
              style={{ animationDelay: `${g.delay}s` }}
            />
          ))}

          {/* 海鷗(夜晚不放)/ 星星(只有夜晚) */}
          {!isNight &&
            GULLS.map((gull) => (
              <g
                key={gull.y}
                className="ov-gull"
                style={{ animationDelay: `${gull.delay}s` }}
              >
                <g transform={`translate(0 ${gull.y}) scale(${gull.scale})`}>
                  <path
                    className="ov-seagull-bob"
                    d="M0 0 q 14 -13 28 0 q 14 -13 28 0"
                    fill="none"
                    stroke="#5d5347"
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={0.5}
                  />
                </g>
              </g>
            ))}
          {isNight &&
            STARS.map((s, i) => (
              <circle
                key={`${s.x}-${s.y}`}
                className="twinkle"
                cx={s.x}
                cy={s.y}
                r={4}
                fill="#fdfbf3"
                style={{ animationDelay: `${i * 0.45}s` }}
              />
            ))}

          {/* 點擊漣漪 */}
          {ripples.map((rp) => (
            <g key={rp.id}>
              <ellipse className="ov-ripple-e" cx={rp.x} cy={rp.y} rx={14} ry={4} />
              <ellipse
                className="ov-ripple-e"
                cx={rp.x}
                cy={rp.y}
                rx={14}
                ry={4}
                style={{ animationDelay: "0.18s" }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* 邊緣壓暗:把視線收到海中央 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(20,26,40,0.32) 100%)",
        }}
      />

      {/* 提示 + 關閉 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-white/90 drop-shadow">點點海面 · 看著浪發呆一下</p>
        <p className="text-xs text-white/70 drop-shadow">按 ESC 回到房間</p>
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
