"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";
import { SKATE_BASE } from "@/lib/skate-theme";

const EVENT = "spray:go";

/** 播噴漆轉場再換頁(場景裡點滑板時用) */
export function startSprayTransition(href: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: href }));
}

/** 噴漆的顏色,一列換一色;最後的空隙用底色補滿,跟滑板頁的底色一樣才接得上 */
const PAINTS = ["#ff4f8b", "#ffd23f", "#39d0ff", "#b6f24a"];
const DURATION_MS = 1400;
/** 換頁太久(網路卡住)就先收掉轉場,不要把畫面蓋死 */
const GIVE_UP_MS = 5000;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** 噴一下:中間一團柔邊的顏色,外圍飛散小點,偶爾往下流一道漆 */
function burst(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const core = r * 0.75;
  const g = ctx.createRadialGradient(x, y, 0, x, y, core);
  g.addColorStop(0, color);
  g.addColorStop(0.6, `${color}e6`);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, core, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = r * (0.55 + Math.random() * 0.6);
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 0.4 + Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  if (Math.random() < 0.04) {
    ctx.globalAlpha = 0.9;
    ctx.fillRect(x + (Math.random() - 0.5) * core, y, 3, 20 + Math.random() * 50);
  }
  ctx.globalAlpha = 1;
}

/**
 * 在 canvas 上由上往下之字形噴滿整個畫面,噴完呼叫 done
 * 回傳取消函式(元件卸載時停掉動畫)
 */
function paint(canvas: HTMLCanvasElement, done: () => void) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    done();
    return () => {};
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);

  // 噴嘴範圍跟著畫面大小走,一列一列往下,列距比噴嘴小一點才不會留縫
  const r = Math.max(70, Math.min(w, h) * 0.16);
  const gap = r * 1.1;
  const rows = Math.ceil(h / gap) + 1;
  const span = w + r;
  const total = rows * span;
  const pointAt = (dist: number) => {
    const row = Math.min(rows - 1, Math.floor(dist / span));
    const along = dist - row * span;
    const ltr = row % 2 === 0;
    return {
      x: ltr ? along - r / 2 : w + r / 2 - along,
      y: row * gap + r * 0.3 + Math.sin(along / 90) * 8,
      color: PAINTS[row % PAINTS.length]!,
    };
  };

  const stepLen = r * 0.12;
  const start = performance.now();
  let drawn = 0;
  let raf = 0;
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION_MS);
    const target = easeInOut(t) * total;
    while (drawn < target) {
      drawn += stepLen;
      const p = pointAt(drawn);
      burst(ctx, p.x, p.y, r, p.color);
    }
    if (t < 1) {
      raf = requestAnimationFrame(frame);
      return;
    }
    // 只補還沒噴到的透明空隙,已經噴上去的顏色不蓋掉
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = SKATE_BASE;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    done();
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/**
 * 噴漆轉場:掛在 root layout,換頁時不會被卸載,才能噴完 → 換頁 → 在新頁面上淡出
 * 系統開了減少動態就直接換頁
 */
export function SprayTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [run, setRun] = useState<{ href: string; painted: boolean } | null>(null);
  // 噴完、新頁面也出來了,就淡出
  const revealing = Boolean(run?.painted && pathname === run.href);

  useEffect(() => {
    const onGo = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      setRun({ href, painted: false });
    };
    window.addEventListener(EVENT, onGo);
    return () => window.removeEventListener(EVENT, onGo);
  }, [router]);

  useEffect(() => {
    if (!run || run.painted || !canvasRef.current) return;
    return paint(canvasRef.current, () => {
      router.push(run.href);
      setRun({ href: run.href, painted: true });
    });
  }, [run, router]);

  useEffect(() => {
    if (!run?.painted) return;
    const t = window.setTimeout(() => setRun(null), GIVE_UP_MS);
    return () => window.clearTimeout(t);
  }, [run]);

  if (!run) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[100] h-full w-full"
      style={revealing ? { animation: "cover-out 0.5s ease-in both" } : undefined}
      onAnimationEnd={() => revealing && setRun(null)}
    />
  );
}
