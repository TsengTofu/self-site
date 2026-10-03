"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Permanent_Marker } from "next/font/google";
import { prefersReducedMotion } from "@/lib/motion";

/** 手寫麥克筆字,只有轉場用到,不預先載入 */
const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], preload: false });

const EVENT = "skate:go";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 播滑板轉場再換頁;from = 滑板在畫面上的位置,板子會從那裡彈起來 */
export function startSkateTransition(href: string, from?: DOMRect) {
  const box = from && { x: from.left, y: from.top, w: from.width, h: from.height };
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { href, from: box } }));
}

/**
 * 分鏡的時間軸(毫秒)
 * 0 彈起 → LIFT 往左掃過、後面刷成紙 → CARD 紙上寫字畫塗鴉 → NAVIGATE 換頁 → READY 之後才淡出
 */
const LIFT = 560;
const CARD = LIFT + 720;
const NAVIGATE = 1750;
const READY = 2300;
/** 換頁卡住(網路很慢)就先收掉,不要把畫面蓋死 */
const GIVE_UP = 6000;

const PAPER = "#f5ead9";
const STREAKS = ["#fffaf0", "#fffaf0", "#f2c14e", "#e8834a"];
const BOARD_SRC = "/scene/elements/skateboard.webp";
const BOARD_RATIO = 390 / 939;

type Stage = "lift" | "sweep" | "card";
interface Run {
  id: number;
  href: string;
  from?: Box;
  /** 卡片上寫的時間,例如 04:32 PM */
  time: string;
  stage: Stage;
  navigated: boolean;
  ready: boolean;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** 乾筆刷:沿著一條斜線畫出粗細不一、有缺口的刷痕 */
function streak(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, color: string) {
  const angle = -0.35;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 + Math.random() * 12;
  ctx.globalAlpha = 0.55 + Math.random() * 0.45;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** 板子往左掃的同時,把它右邊刷成紙;回傳取消函式 */
function wipe(canvas: HTMLCanvasElement, duration: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);
  ctx.lineCap = "round";
  const slant = h * 0.22;
  const boardW = h * 0.78 * BOARD_RATIO;

  const start = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // 刷痕前緣先從右邊外面追上板子,之後貼著板子的後緣一起往左(像板子拖著刷子)
    // 前緣是斜的(上面偏左),跟板子斜的方向一致;板子的路線要跟 globals.css 的 skate-sweep 對上
    const e = easeInOut(t);
    const trail = w * 0.6 - w * 1.05 * e + boardW * (1 + 0.5 * e) * 0.55 + 40;
    const catchUp = Math.min(1, t / 0.3);
    const edge =
      w + 150 + slant + (trail - (w + 150 + slant)) * catchUp * catchUp * (3 - 2 * catchUp);
    const edgeAt = (y: number) => edge + (y / h - 0.5) * slant * 2;
    ctx.fillStyle = PAPER;
    ctx.beginPath();
    ctx.moveTo(edgeAt(0) + 90, 0);
    ctx.lineTo(w + 10, 0);
    ctx.lineTo(w + 10, h);
    ctx.lineTo(edgeAt(h) + 90, h);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 40; i++) {
      const color =
        Math.random() < 0.7 ? PAPER : STREAKS[Math.floor(Math.random() * STREAKS.length)]!;
      const y = Math.random() * (h + 120);
      streak(ctx, edgeAt(y) - 20 + Math.random() * 110, y, 60 + Math.random() * 160, color);
    }
    if (t < 1) {
      raf = requestAnimationFrame(frame);
      return;
    }
    // 刷滿之後鋪平,再留幾道淡淡的刷痕當紙的紋理
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 24; i++) {
      streak(
        ctx,
        Math.random() * w,
        Math.random() * (h + 120),
        80 + Math.random() * 220,
        i % 3 ? "#fffaf0" : "#f2c14e",
      );
    }
    ctx.globalAlpha = 1;
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/**
 * 滑板轉場(照分鏡):板子從場景上彈起、放大 → 往左掃過畫面、後面刷成紙 →
 * 紙上手寫 OUTSIDE MODE 與現在時間、畫塗鴉、貼一張海景拍立得 → 換頁 → 紙淡出
 * 掛在 root layout,換頁時不會被卸載;系統開了減少動態就直接換頁
 */
export function SkateTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 要去的頁面另外記在 ref,換頁的計時器才不用把副作用寫進 setState
  const hrefRef = useRef("");
  const [run, setRun] = useState<Run | null>(null);
  const runId = run?.id;
  const revealing = Boolean(run?.navigated && run.ready && pathname === run.href);

  // 接到開始的訊號
  useEffect(() => {
    const onGo = (e: Event) => {
      const { href, from } = (e as CustomEvent<{ href: string; from?: Box }>).detail;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      hrefRef.current = href;
      const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setRun({ id: Date.now(), href, from, time, stage: "lift", navigated: false, ready: false });
    };
    window.addEventListener(EVENT, onGo);
    return () => window.removeEventListener(EVENT, onGo);
  }, [router]);

  // 依時間軸切換階段、換頁
  useEffect(() => {
    if (runId === undefined) return;
    const patch = (next: Partial<Run>) =>
      setRun((prev) => (prev?.id === runId ? { ...prev, ...next } : prev));
    const timers = [
      window.setTimeout(() => patch({ stage: "sweep" }), LIFT),
      window.setTimeout(() => patch({ stage: "card" }), CARD),
      window.setTimeout(() => {
        router.push(hrefRef.current);
        patch({ navigated: true });
      }, NAVIGATE),
      window.setTimeout(() => patch({ ready: true }), READY),
      window.setTimeout(() => setRun((prev) => (prev?.id === runId ? null : prev)), GIVE_UP),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [runId, router]);

  // 掃過的那段時間在 canvas 上刷紙
  const sweeping = run?.stage === "sweep";
  useEffect(() => {
    if (!sweeping || !canvasRef.current) return;
    return wipe(canvasRef.current, CARD - LIFT);
  }, [sweeping]);

  if (!run) return null;

  // 板子停在畫面中間偏右、高度 78vh;起點換算成相對終點的位移與縮放
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const H = vh * 0.78;
  const W = H * BOARD_RATIO;
  const cx = vw * 0.6;
  const cy = vh * 0.5;
  const from = run.from;
  const boardVars = {
    "--dx": `${from ? from.x + from.w / 2 - cx : 0}px`,
    "--dy": `${from ? from.y + from.h / 2 - cy : vh * 0.6}px`,
    "--s": `${from ? Math.max(0.05, from.h / H) : 0.3}`,
  } as CSSProperties;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden"
      style={revealing ? { animation: "cover-out 0.45s ease-in both" } : undefined}
      onAnimationEnd={(e) => revealing && e.target === e.currentTarget && setRun(null)}
    >
      {/* 02 房間糊掉,板子跳出來 */}
      <div
        className="absolute inset-0 backdrop-blur-[6px]"
        style={{
          backgroundColor: "rgba(245,234,217,0.18)",
          animation: "skate-fade-in 0.3s ease-out both",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {run.stage === "lift" && (
        <p
          className={`${marker.className} absolute text-[clamp(36px,6vw,72px)] text-white [text-shadow:0_2px_10px_rgba(60,40,20,0.35)]`}
          style={{
            left: cx + W * 0.45,
            top: cy - H * 0.38,
            animation: "skate-pop 0.4s ease-out 0.2s both",
          }}
        >
          POP!
        </p>
      )}

      <div
        className="absolute"
        style={{
          left: cx - W / 2,
          top: cy - H / 2,
          width: W,
          height: H,
          ...boardVars,
          animation:
            run.stage === "lift"
              ? `skate-lift ${LIFT}ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both`
              : `skate-sweep ${CARD - LIFT}ms cubic-bezier(0.55, 0, 0.35, 1) both`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 場景裡同一張去背圖,已經在快取裡 */}
        <img
          src={BOARD_SRC}
          alt=""
          className="h-full w-full drop-shadow-[0_20px_30px_rgba(40,25,10,0.35)]"
        />
        {/* 01 → 02 板子旁邊的動態線 */}
        {run.stage === "lift" && (
          <svg
            viewBox="0 0 100 240"
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
          >
            {[
              "M-14 30 Q-24 48 -20 70",
              "M-30 52 Q-36 64 -34 80",
              "M114 40 Q124 60 118 84",
              "M128 64 Q134 78 130 94",
              "M-10 170 Q-22 186 -16 206",
            ].map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="skate-draw"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                style={{ animationDelay: `${0.12 + i * 0.05}s` }}
              />
            ))}
          </svg>
        )}
      </div>

      {/* 03 紙上的手寫卡片 */}
      {run.stage === "card" && <OutsideCard time={run.time} />}
    </div>
  );
}

/** 刷成紙之後寫上 OUTSIDE MODE、時間,畫塗鴉,貼一張海景拍立得 */
function OutsideCard({ time }: { time: string }) {
  const ink = "#2b2118";
  const draw = (delay: number) => ({ animationDelay: `${delay}s` });
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative aspect-[4/3] w-[min(90vw,780px)]">
        {/* 塗鴉:太陽、笑臉、椰子樹、雲、鳥 */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 h-full w-full"
          fill="none"
          strokeLinecap="round"
        >
          <g stroke="#f2c14e" strokeWidth={3}>
            <circle
              cx={330}
              cy={46}
              r={13}
              pathLength={1}
              className="skate-draw"
              style={draw(0.5)}
            />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <path
                  key={i}
                  d={`M${330 + Math.cos(a) * 20} ${46 + Math.sin(a) * 20} L${330 + Math.cos(a) * 28} ${46 + Math.sin(a) * 28}`}
                  pathLength={1}
                  className="skate-draw"
                  style={draw(0.6 + i * 0.03)}
                />
              );
            })}
            <circle
              cx={58}
              cy={232}
              r={17}
              pathLength={1}
              className="skate-draw"
              style={draw(0.75)}
            />
            <path
              d="M51 227 v2 M65 227 v2 M49 238 Q58 247 67 238"
              pathLength={1}
              className="skate-draw"
              style={draw(0.85)}
            />
          </g>
          <g stroke={ink} strokeWidth={2.4}>
            <path
              d="M152 292 Q150 262 160 236"
              pathLength={1}
              className="skate-draw"
              style={draw(0.8)}
            />
            <path
              d="M160 236 Q144 228 132 236 M160 236 Q176 226 190 232 M160 236 Q150 220 140 214 M160 236 Q168 218 182 212"
              pathLength={1}
              className="skate-draw"
              style={draw(0.95)}
            />
            <path
              d="M206 290 Q206 272 222 272 Q226 258 242 262 Q252 250 266 262 Q282 262 280 280 Q290 286 286 292"
              pathLength={1}
              className="skate-draw"
              style={draw(1.0)}
            />
            <path
              d="M262 222 q6 -6 10 0 q4 -6 10 0"
              pathLength={1}
              className="skate-draw"
              style={draw(1.1)}
            />
          </g>
          {/* SKATE / 時間 底下的橘色底線 */}
          <path
            d="M70 214 Q150 196 236 188"
            stroke="#e8834a"
            strokeWidth={4}
            pathLength={1}
            className="skate-draw"
            style={draw(0.9)}
          />
        </svg>

        <p
          className={`${marker.className} absolute left-[8%] top-[16%] -rotate-[8deg] text-[clamp(44px,11vw,112px)] leading-[0.92]`}
          style={{ color: ink, animation: "skate-write 0.55s ease-out both" }}
        >
          OUTSIDE
          <br />
          MODE
        </p>
        <p
          className={`${marker.className} absolute left-[17%] top-[56%] -rotate-[8deg] text-[clamp(15px,2.8vw,26px)]`}
          style={{ color: ink, animation: "skate-write 0.4s ease-out 0.45s both" }}
        >
          SKATE / {time}
        </p>

        {/* 拍立得:用窗外海景那張圖 */}
        <div
          className="absolute bottom-[2%] right-[3%] w-[26%] rotate-6 bg-white p-[2%] pb-[6%] shadow-[0_10px_24px_rgba(60,40,20,0.25)]"
          style={{ animation: "skate-fade-in 0.35s ease-out 0.8s both" }}
        >
          <span className="absolute -top-3 left-1/2 h-5 w-1/2 -translate-x-1/2 -rotate-3 bg-[#e9d8bd]/90" />
          {/* eslint-disable-next-line @next/next/no-img-element -- 場景裡同一張窗景圖 */}
          <img
            src="/scene/elements/window-day.webp"
            alt=""
            className="aspect-square w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
