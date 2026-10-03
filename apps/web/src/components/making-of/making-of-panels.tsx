"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, House, Play, RotateCcw, X } from "lucide-react";
import {
  ARCH,
  CHALLENGE,
  COMPARE,
  DIVERGENCE,
  EXPLORE,
  GALLERY,
  HANDWORK,
  HERO,
  LAB,
  OVERVIEW,
  SPEC,
  TAKEAWAYS,
  WALL,
} from "@/data/making-of-v2";
import { prefersReducedMotion } from "@/lib/motion";
import { elementSrc } from "@/components/scene/element-layers";

/**
 * /making-of 定稿版型：照 Claude Design「視覺探索流程 v2」規格的 12 面板橫向 deck。
 * 文案在 data/making-of-v2.ts；實驗台／對照滑桿／圖層陳列直接吃場景系統的真分層檔。
 *
 * 換頁 = CSS transform 位移（家規：原生 smooth scroll 在背景／被遮擋分頁會整個停擺，
 * 且 re-render 的 DOM 變動會讓 scroll-snap 容器取消捲動）。鍵盤 ← →、觸控左右滑、
 * 觸控板橫滑、底部頁籤皆可換頁；#hash 深連結含舊版錨點別名。
 */

/* ── v2 色彩規格（只在這頁用，不進全站 token）────────── */
export const C = {
  cream: "#f6f0e4",
  cream2: "#efe6d3",
  head: "#6b4f37",
  body: "#6b5c4c",
  mute: "#8a7a66",
  blue: "#2f6f93",
  blueBright: "#4a90b8",
  rust: "#a9553a",
  rustSoft: "#b0684c",
  line: "rgba(62,50,38,0.14)",
  amber: "#e8b96a",
  darkHead: "#f3e6cf",
  darkBody: "#e0d2bb",
  darkSub: "#cbb99f",
  darkMute: "#a89b83",
  darkText: "#e9dfca",
};
/** 標題字型跟首頁、履歷一樣用全站的字型(原本是襯線字) */
const HEADING_FONT = "var(--font-sans), system-ui, sans-serif";

/* ── 面板與深連結 ─────────────────────────────────────── */
export const PANELS: { key: string; hash: string | null }[] = [
  { key: "hero", hash: null },
  { key: "flow", hash: "flow" },
  { key: "challenge", hash: "challenge" },
  { key: "divergence", hash: "divergence" },
  { key: "wall", hash: "wall" },
  { key: "handwork", hash: "handwork" },
  { key: "compare", hash: "compare" },
  { key: "spec", hash: "spec" },
  { key: "arch", hash: "architecture" },
  { key: "lab", hash: "layer-lab" },
  { key: "gallery", hash: "layers" },
  { key: "takeaways", hash: "takeaways" },
];

/** 結合版時代的錨點別名（#phase-spark 等老連結不斷鏈） */
export const LEGACY_HASH: Record<string, string> = {
  "phase-spark": "divergence",
  "gemini-brief": "divergence",
  "chatgpt-tugofwar": "divergence",
  "phase-wall": "wall",
  "three-walls": "wall",
  "phase-parallel": "flow",
  "claude-demo": "flow",
  "phase-redraw": "handwork",
  "illustrator-redraw": "handwork",
  "perspective-pingpong": "handwork",
  "why-i-did-this": "takeaways",
  "phase-assemble": "spec",
  "slice-and-import": "spec",
  "phase-next": "takeaways",
  "whats-next": "takeaways",
};


/* ── 場景座標系（1920×1080，與 element-layers / hotspots 同一組 rect）── */
interface Frac {
  x: number;
  y: number;
  w: number;
  h: number;
}
const fr = (x: number, y: number, w: number, h: number): Frac => ({
  x: x / 1920,
  y: y / 1080,
  w: w / 1920,
  h: h / 1080,
});
const WINDOW_RECT = fr(659, 203, 470, 410);
const FURNITURE: { name: string; rect: Frac }[] = [
  { name: "backpack", rect: fr(355, 205, 166, 315) },
  { name: "cabinet", rect: fr(-60, 740, 504, 300) },
  { name: "plant", rect: fr(378, 552, 277, 410) },
  { name: "musicPlayer", rect: fr(760, 592, 140, 89) },
  { name: "laptop", rect: fr(925, 512, 250, 176) },
  { name: "lamp", rect: fr(1105, 420, 149, 225) },
  { name: "phone", rect: fr(872, 672, 92, 50) },
  { name: "chair", rect: fr(1008, 622, 320, 432) },
  { name: "skateboard", rect: fr(1505, 500, 191, 460) },
  { name: "bed", rect: fr(890, 600, 1258, 892) },
  { name: "headphones", rect: fr(1318, 852, 185, 125) },
];
const GIRL_RECT = fr(525, 620, 430, 425);
const rectStyle = (r: Frac, s = 1): React.CSSProperties => ({
  left: `${r.x * 100}%`,
  top: `${r.y * 100}%`,
  width: `${r.w * s * 100}%`,
  height: `${r.h * s * 100}%`,
});

type Phase = "dawn" | "day" | "sunset" | "night";
const winSrc = (p: Phase) => elementSrc(`window-${p}`);
const lightSrc = (p: Phase) => `/scene/light-${p}.png`;

/* ── 共用小元件 ───────────────────────────────────────── */

function Eyebrow({ text, dark }: { text: string; dark?: boolean }) {
  return (
    <p
      className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em]"
      style={{ color: dark ? C.amber : C.blue }}
    >
      {text}
    </p>
  );
}

function PanelTitle({
  text,
  dark,
  size = "md",
}: {
  text: string;
  dark?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <h2
      className={`font-bold ${size === "lg" ? "text-2xl md:text-[2rem]" : "text-xl md:text-[1.7rem]"} leading-snug`}
      style={{ fontFamily: HEADING_FONT, color: dark ? C.darkHead : C.head }}
    >
      {text}
    </h2>
  );
}

/** 場景靜態合成（對照滑桿用）：底圖＋窗景＋全部家具＋人物＋打光 */
function SceneComposite({ phase, sizes }: { phase: Phase; sizes: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image src="/scene/room-empty.jpg" alt="" fill sizes={sizes} className="object-cover" />
      <div className="absolute" style={rectStyle(WINDOW_RECT)}>
        <Image src={winSrc(phase)} alt="" fill sizes="30vw" className="object-contain" />
      </div>
      {FURNITURE.map((f) => (
        <div key={f.name} className="absolute" style={rectStyle(f.rect)}>
          <Image src={elementSrc(f.name)} alt="" fill sizes="20vw" className="object-contain" />
        </div>
      ))}
      <div className="absolute" style={rectStyle(GIRL_RECT)}>
        <Image src={elementSrc("girl-cat")} alt="" fill sizes="20vw" className="object-contain" />
      </div>
      <Image src={lightSrc(phase)} alt="" fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/* ── 面板 0 序幕 ─────────────────────────────────────── */

function HeroPanel({ reduced }: { reduced: boolean }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-10 md:px-10">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
        <div>
          <p
            data-hero
            className="mb-3.5 text-xs font-bold uppercase tracking-[0.16em]"
            style={{ color: C.blue }}
          >
            {HERO.eyebrow}
          </p>
          <h1
            data-hero
            className="mb-4 text-3xl font-bold leading-[1.3] md:text-4xl lg:text-[2.7rem]"
            style={{ fontFamily: HEADING_FONT, color: C.head, textWrap: "balance" }}
          >
            {HERO.titleLines[0]}
            <br />
            {HERO.titleLines[1]}
          </h1>
          <p data-hero className="mb-6 max-w-[46ch] text-sm leading-relaxed md:text-base" style={{ color: C.body }}>
            {HERO.sub}
          </p>
          <div data-hero className="grid max-w-[440px] grid-cols-2 gap-3">
            {HERO.stats.map((s) => (
              <div key={s.unit + s.label} className="pt-2.5" style={{ borderTop: "2px solid rgba(62,50,38,0.16)" }}>
                <div className="mb-0.5 flex items-baseline gap-2">
                  <b className="text-4xl font-bold leading-none" style={{ fontFamily: HEADING_FONT, color: C.blue }}>
                    {s.n}
                  </b>
                  <span className="tabular-nums text-[11px] uppercase tracking-[0.16em]" style={{ color: "#a3937c" }}>
                    {s.unit}
                  </span>
                </div>
                <span className="block text-[13px]" style={{ color: C.body }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div data-hero className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/" className="inline-flex items-center gap-1.5 transition hover:opacity-70" style={{ color: C.body }}>
              <House className="size-4" />
              回到場景
            </Link>
            <Link href="/resume" className="transition hover:opacity-70" style={{ color: C.body }}>
              看履歷 →
            </Link>
          </div>
          <p data-hero className="mt-6 text-[13px] italic" style={{ color: "#b1aaa1" }}>
            {HERO.hint}
          </p>
        </div>
        <div data-hero className="mt-8 lg:mt-0">
          <div
            className="overflow-hidden rounded-[18px] bg-black"
            style={{ border: `1px solid ${C.line}`, boxShadow: "0 24px 60px rgba(62,50,38,0.22)" }}
          >
            <video
              src="/making-of/demo.mp4"
              poster="/making-of/demo_poster.webp"
              autoPlay={!reduced}
              controls={reduced}
              muted
              loop
              playsInline
              preload="metadata"
              className="block w-full"
            />
          </div>
          <p className="mt-2.5 text-[13px]" style={{ color: C.body }}>
            {HERO.videoCaption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 面板 1 流程（決策總覽）──────────────────────────── */

function FlowPanel({ onJump }: { onJump: (hash: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-10 md:px-10">
      <div data-panel>
        <Eyebrow text={OVERVIEW.eyebrow} />
        <PanelTitle text={OVERVIEW.title} />
        <p className="mt-2 max-w-[62ch] text-[15px]" style={{ color: C.body }}>
          {OVERVIEW.sub}
        </p>
      </div>
      <div data-panel className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {OVERVIEW.cards.map((card) => {
          const tone = card.tone === "stop" ? C.rust : C.blue;
          const topBar = card.tone === "stop" ? C.rustSoft : C.blueBright;
          return (
            <button
              key={card.no}
              type="button"
              onClick={() => onJump(card.target)}
              className="flex flex-col gap-2 rounded-xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: C.cream, border: `1px solid ${C.line}`, borderTop: `3px solid ${topBar}` }}
            >
              <span className="text-xs font-bold tracking-[0.08em]" style={{ fontFamily: HEADING_FONT, color: tone }}>
                {card.no}
              </span>
              <b className="text-[15px] leading-normal" style={{ fontFamily: HEADING_FONT, color: C.head }}>
                {card.heading}
              </b>
              <span className="text-[13px] leading-relaxed" style={{ color: C.body }}>
                {card.body}
              </span>
              <span className="mt-auto pt-2.5 text-xs font-bold" style={{ color: tone }}>
                {card.outcome}
              </span>
            </button>
          );
        })}
      </div>
      <p data-panel className="mt-5 text-[13px]" style={{ color: C.body }}>
        {OVERVIEW.footnote}
      </p>
    </div>
  );
}

/* ── 面板 2 起點（Challenge）─────────────────────────── */

function ChallengePanel() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-10 md:px-10">
      <div data-panel>
        <Eyebrow text={CHALLENGE.eyebrow} />
        <PanelTitle text={CHALLENGE.title} size="lg" />
        <p className="mt-3 max-w-[64ch] text-base" style={{ color: C.body }}>
          {CHALLENGE.sub}
        </p>
      </div>
      <div data-panel className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {CHALLENGE.cards.map((card) => (
          <div
            key={card.tag}
            className="rounded-[14px] px-6 py-5"
            style={{ backgroundColor: C.cream2, border: "1px solid rgba(62,50,38,0.12)" }}
          >
            <div className="mb-2 text-[11px] font-bold tracking-[0.12em]" style={{ color: C.blue }}>
              {card.tag}
            </div>
            <b className="mb-1.5 block text-[17px]" style={{ fontFamily: HEADING_FONT, color: C.head }}>
              {card.heading}
            </b>
            <span className="text-sm leading-relaxed" style={{ color: C.body }}>
              {card.body}
            </span>
          </div>
        ))}
      </div>
      <div data-panel className="mt-7 flex flex-wrap items-center gap-4">
        <span
          className="rounded-full px-5 py-2.5 tabular-nums text-sm line-through"
          style={{ color: C.mute, backgroundColor: C.cream2, border: "1px solid rgba(62,50,38,0.12)" }}
        >
          {CHALLENGE.before}
        </span>
        <span style={{ color: C.mute }}>→</span>
        <span
          className="rounded-full px-5 py-2.5 tabular-nums text-sm font-bold"
          style={{
            color: C.blue,
            backgroundColor: "rgba(74,144,184,0.14)",
            border: "1px solid rgba(74,144,184,0.3)",
          }}
        >
          {CHALLENGE.after}
        </span>
      </div>
    </div>
  );
}

/* ── 面板 3 發散（四條線互為對照）────────────────────── */

function DivergencePanel() {
  const [line, setLine] = useState(0);
  const [shot, setShot] = useState(0);
  const ex = EXPLORE[line]!;
  const cur = ex.shots[Math.min(shot, ex.shots.length - 1)]!;
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-8 md:px-10">
      <div data-panel className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Eyebrow text={DIVERGENCE.eyebrow} />
        <PanelTitle text={DIVERGENCE.title} />
      </div>
      <div data-panel className="grid items-start gap-6 lg:grid-cols-[minmax(230px,0.8fr)_minmax(0,1.9fr)] lg:gap-10">
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-sm leading-relaxed" style={{ color: C.body }}>
            {DIVERGENCE.intro}
          </p>
          {EXPLORE.map((l, i) => (
            <button
              key={l.key}
              type="button"
              onClick={() => {
                setLine(i);
                setShot(0);
              }}
              className="rounded-xl px-3.5 py-2.5 text-left leading-snug transition"
              style={
                i === line
                  ? { backgroundColor: C.head, border: `1px solid ${C.head}`, color: C.cream }
                  : { backgroundColor: C.cream, border: "1px solid rgba(62,50,38,0.12)", color: C.body }
              }
            >
              <b className="block text-[14px]">{l.tab}</b>
              <span className="text-xs opacity-80">{l.hint}</span>
            </button>
          ))}
          <div className="mt-2.5 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: C.mute }}>
              {DIVERGENCE.decisionLabel}
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: C.body }}>
              {ex.decision}
            </p>
          </div>
        </div>
        <div>
          <h3 className="mb-1 text-[17px] font-bold" style={{ fontFamily: HEADING_FONT, color: C.head }}>
            {ex.title}
          </h3>
          <p className="mb-3 max-w-[66ch] text-sm leading-relaxed" style={{ color: C.body }}>
            {ex.body}
          </p>
          <div
            className="relative aspect-video w-full overflow-hidden rounded-xl"
            style={{ border: `6px solid ${C.cream}`, boxShadow: "0 12px 30px rgba(62,50,38,0.18)", backgroundColor: C.cream }}
          >
            <Image
              key={cur.file}
              src={cur.file}
              alt={cur.label}
              fill
              sizes="(min-width:1024px) 760px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-[52ch] text-[13px] leading-relaxed" style={{ color: C.body }}>
              {cur.cap}
            </p>
            <div className="flex flex-wrap gap-2">
              {ex.shots.map((sh, i) => (
                <button
                  key={sh.file}
                  type="button"
                  title={sh.label}
                  onClick={() => setShot(i)}
                  className="relative h-14 w-[86px] overflow-hidden rounded-lg transition"
                  style={{
                    border: i === shot ? `2px solid ${C.blueBright}` : "2px solid rgba(62,50,38,0.16)",
                    opacity: i === shot ? 1 : 0.7,
                  }}
                >
                  <Image src={sh.file} alt={sh.label} fill sizes="86px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 面板 4 撞牆（深色）─────────────────────────────── */

function WallPanel() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-8 md:px-10">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-14">
        <div data-panel>
          <Eyebrow text={WALL.eyebrow} dark />
          <PanelTitle text={WALL.title} dark size="lg" />
          <p className="mt-2.5 text-base" style={{ color: C.darkSub }}>
            {WALL.sub}
          </p>
          <p className="mt-3.5 text-[15px] leading-relaxed" style={{ color: C.darkBody }}>
            {WALL.body}
          </p>
          <div className="mt-4.5 flex flex-col gap-2">
            {WALL.bullets.map((b) => (
              <span
                key={b.text}
                className="py-0.5 pl-3 text-sm"
                style={{
                  color: "#d9c9ab",
                  borderLeft: `2px solid ${b.tone === "stop" ? C.rustSoft : C.blueBright}`,
                }}
              >
                {b.text}
              </span>
            ))}
          </div>
        </div>
        <div data-panel className="grid grid-cols-2 gap-3.5">
          {WALL.figures.map((f) => (
            <figure key={f.file} className="m-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
                <Image src={f.file} alt={f.label} fill sizes="(min-width:1024px) 340px, 50vw" className="object-cover" />
              </div>
              <figcaption className="mt-1.5 text-xs" style={{ color: C.darkMute }}>
                {f.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 面板 5 手工（第二次撞牆，夜景底圖）──────────────── */

function HandworkPanel() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1100px] flex-col justify-center px-6 py-10 md:px-10">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <div data-panel>
          <Eyebrow text={HANDWORK.eyebrow} dark />
          <PanelTitle text={HANDWORK.title} dark size="lg" />
          <p className="mt-2.5 text-base" style={{ color: C.darkSub }}>
            {HANDWORK.sub}
          </p>
        </div>
        <div data-panel className="flex flex-col gap-4">
          {HANDWORK.paragraphs.map((p) => (
            <p key={p.slice(0, 12)} className="text-[15px] leading-relaxed" style={{ color: C.darkBody }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 面板 6 對照（Before / After 滑桿，真分層合成）───── */

function ComparePanel() {
  const [cmp, setCmp] = useState(1); // 預設夜晚前一格 = 黃昏？照 v2 預設 night → index 2
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const phase = COMPARE.phases[cmp]!;

  const update = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1000px] flex-col justify-center px-6 py-8 md:px-10">
      <div data-panel className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow text={COMPARE.eyebrow} />
          <PanelTitle text={COMPARE.title} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: C.mute }}>
            {COMPARE.baseLabel}
          </span>
          <button
            type="button"
            onClick={() => setCmp((i) => (i + 1) % COMPARE.phases.length)}
            className="inline-flex items-center gap-2.5 rounded-full px-4.5 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: C.blueBright }}
          >
            {phase.label}
            <span className="text-xs font-normal opacity-75">{COMPARE.cycleHint}</span>
          </button>
        </div>
      </div>
      <div
        data-panel
        ref={boxRef}
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) update(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
        className="relative aspect-video w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[14px] [&_img]:pointer-events-none"
        style={{ border: `1px solid ${C.line}`, boxShadow: "0 14px 34px rgba(62,50,38,0.18)" }}
      >
        <SceneComposite phase="day" sizes="(min-width:1024px) 940px, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <SceneComposite phase={phase.id} sizes="(min-width:1024px) 940px, 100vw" />
        </div>
        {/* 分隔線＋把手（可鍵盤操作） */}
        <div
          role="slider"
          aria-label="時段對照分隔線"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 2));
            if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 2));
          }}
          className="absolute bottom-0 top-0 w-0.5 outline-none"
          style={{ left: `${pos}%`, backgroundColor: C.cream }}
        >
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs"
            style={{ backgroundColor: C.cream, color: C.head, boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}
          >
            ↔
          </span>
        </div>
        {/* 兩側時段標籤 */}
        <span className="absolute left-3 top-3 rounded-md px-2 py-1 tabular-nums text-[11px]" style={{ backgroundColor: "rgba(246,240,228,0.85)", color: C.head }}>
          中午 midday
        </span>
        <span className="absolute right-3 top-3 rounded-md px-2 py-1 tabular-nums text-[11px]" style={{ backgroundColor: "rgba(20,16,12,0.65)", color: C.darkText }}>
          {phase.label}
        </span>
      </div>
      <p data-panel className="mt-3 text-[13px]" style={{ color: C.mute }}>
        {COMPARE.footnote}
      </p>
    </div>
  );
}

/* ── 面板 7 規格（翻轉）─────────────────────────────── */

function SpecPanel() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-8 md:px-10">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        <div data-panel>
          <Eyebrow text={SPEC.eyebrow} />
          <PanelTitle text={SPEC.title} size="lg" />
          {SPEC.paragraphs.map((p) => (
            <p key={p.slice(0, 12)} className="mt-3.5 text-[15px] leading-relaxed" style={{ color: C.body }}>
              {p}
            </p>
          ))}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SPEC.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-[10px] px-3.5 py-2.5 text-[13px]"
                style={{ color: C.body, backgroundColor: C.cream, border: `1px solid ${C.line}` }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div data-panel className="flex flex-col gap-4">
          {SPEC.figures.map((f) => (
            <figure key={f.file} className="m-0">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[14px]" style={{ border: `1px solid ${C.line}`, boxShadow: "0 12px 30px rgba(62,50,38,0.16)" }}>
                <Image src={f.file} alt={f.cap} fill sizes="(min-width:1024px) 620px, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[13px]" style={{ color: C.body }}>
                {f.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 面板 8 架構 ─────────────────────────────────────── */

function ArchPanel() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-8 md:px-10">
      <div data-panel>
        <Eyebrow text={ARCH.eyebrow} />
        <PanelTitle text={ARCH.title} />
        <p className="mt-2 max-w-[70ch] text-[15px]" style={{ color: C.body }}>
          {ARCH.sub}
        </p>
      </div>
      <div
        data-panel
        className="mt-6 grid items-center gap-6 rounded-[18px] p-6 md:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12"
        style={{ backgroundColor: C.cream2, border: "1px solid rgba(62,50,38,0.12)" }}
      >
        <div>
          <div
            className="rounded-xl px-4 py-3.5 text-center tabular-nums text-sm"
            style={{ color: C.blue, backgroundColor: "rgba(74,144,184,0.12)", border: "1px solid rgba(74,144,184,0.28)" }}
          >
            {ARCH.stateLine}
          </div>
          <div aria-hidden className="my-2 text-center" style={{ color: C.mute }}>
            ↓
          </div>
          <div
            className="grid grid-cols-2 gap-3 rounded-[14px] p-4"
            style={{ backgroundColor: C.cream, border: "1px solid rgba(62,50,38,0.1)" }}
          >
            {ARCH.chips.map((chip) => (
              <span key={chip} className="rounded-lg p-3 text-center tabular-nums text-[13px]" style={{ color: C.head, backgroundColor: C.cream2 }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4.5">
          {ARCH.points.map((pt, i) => (
            <div key={pt.heading} className={i > 0 ? "pt-4" : ""} style={i > 0 ? { borderTop: `1px solid ${C.line}` } : undefined}>
              <b className="mb-1 block text-[17px]" style={{ fontFamily: HEADING_FONT, color: C.head }}>
                {pt.heading}
              </b>
              <span className="text-sm leading-relaxed" style={{ color: C.body }}>
                {pt.body}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 面板 9 實驗台（完整版：滑桿＋拖曳排序＋加圖層）──── */

interface LabAddable {
  id: string;
  label: string;
  element: string;
  rect: Frac;
}
const LAB_ADDABLE: LabAddable[] = [
  { id: "chair", label: "椅子", element: "chair", rect: fr(1008, 622, 320, 432) },
  { id: "laptop", label: "筆電", element: "laptop", rect: fr(925, 512, 250, 176) },
  { id: "lamp", label: "檯燈", element: "lamp", rect: fr(1105, 420, 149, 225) },
  { id: "plant", label: "植物", element: "plant", rect: fr(378, 552, 277, 410) },
  { id: "backpack", label: "背包", element: "backpack", rect: fr(355, 205, 166, 315) },
  { id: "skateboard", label: "滑板", element: "skateboard", rect: fr(1505, 500, 191, 460) },
  { id: "bed", label: "床", element: "bed", rect: fr(890, 600, 1258, 892) },
  { id: "human", label: "人物", element: "girl-cat", rect: fr(525, 620, 430, 425) },
  { id: "cat", label: "貓咪", element: "cat-walk", rect: fr(700, 800, 220, 170) },
];
const ADEF = (id: string) => LAB_ADDABLE.find((a) => a.id === id)!;

interface LabExtra {
  key: string;
  id: string;
  x: number;
  y: number;
  s: number;
}

interface LabLayer {
  key: string;
  label: string;
  img: string;
  rect: Frac;
  cover?: boolean;
  extra?: boolean;
  on: boolean;
}

const LAB_PHASES: { id: Phase; label: string }[] = [
  { id: "dawn", label: "清晨" },
  { id: "day", label: "中午" },
  { id: "sunset", label: "黃昏" },
  { id: "night", label: "夜晚" },
];
const LAB_DEFAULT = { tilt: 46, spin: -22, gap: 74 };
const FULL: Frac = { x: 0, y: 0, w: 1, h: 1 };

/** 實驗室面板的拉桿;做成元件而不是 render 裡的函式,handler 裡讀 ref 才不會被當成 render 期間存取 */
function LabSlider({
  label,
  value,
  text,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  text: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs" style={{ color: C.darkMute }}>
        <span>{label}</span>
        <span className="tabular-nums tabular-nums">{text}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full"
        style={{ accentColor: C.blueBright }}
      />
    </label>
  );
}

function LabPanel({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<Phase>("sunset");
  const [explode, setExplode] = useState(1);
  const [tilt, setTilt] = useState(LAB_DEFAULT.tilt);
  const [spin, setSpin] = useState(LAB_DEFAULT.spin);
  const [gap, setGap] = useState(LAB_DEFAULT.gap);
  const [baseOn, setBaseOn] = useState({ bg: true, win: true, light: true });
  const [extras, setExtras] = useState<LabExtra[]>([]);
  const [order, setOrder] = useState<string[]>(["bg", "win", "light"]);
  const [off, setOff] = useState<Record<string, boolean>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const seqRef = useRef(0);
  const dragKeyRef = useRef<string | null>(null);
  const rafRef = useRef(0);
  const playedRef = useRef(false);

  const animateTo = (target: number, dur: number) => {
    cancelAnimationFrame(rafRef.current);
    if (prefersReducedMotion()) {
      setExplode(target);
      return;
    }
    const from = explode;
    const t0 = performance.now();
    const tick = (now: number) => {
      // p 夾在 0–1：時間源異常（例如 headless 虛擬時間）時 p 變負，
      // easing 外推會把 explode 噴出範圍
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      const e = 1 - Math.pow(1 - p, 3);
      setExplode(from + (target - from) * e);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  // 第一次滑到這面板：三層基底展開 → 疊回去，先演一次
  useEffect(() => {
    if (!active || playedRef.current) return;
    playedRef.current = true;
    if (prefersReducedMotion()) {
      setExplode(0.6);
      return;
    }
    const t = setTimeout(() => animateTo(0, 1500), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const byKey = new Map<string, LabLayer>([
    ["bg", { key: "bg", label: "底圖 room shell", img: "/scene/room-empty.jpg", rect: FULL, cover: true, on: baseOn.bg }],
    ["win", { key: "win", label: `窗景 window[${phase}]`, img: winSrc(phase), rect: WINDOW_RECT, on: baseOn.win }],
    ["light", { key: "light", label: `光線 light[${phase}]`, img: lightSrc(phase), rect: FULL, cover: true, on: baseOn.light }],
  ]);
  for (const x of extras) {
    const def = ADEF(x.id);
    byKey.set(x.key, {
      key: x.key,
      extra: true,
      label: def.label,
      img: elementSrc(def.element),
      rect: { x: x.x, y: x.y, w: def.rect.w * x.s, h: def.rect.h * x.s },
      on: !off[x.key],
    });
  }
  const layers = order
    .map((k) => byKey.get(k))
    .filter((l): l is LabLayer => Boolean(l))
    .map((l, i) => ({ ...l, label: `${String(i + 1).padStart(2, "0")} ${l.label}` }));

  const reorder = (fromKey: string | null, toKey: string) => {
    if (!fromKey || fromKey === toKey) return;
    setOrder((prev) => {
      const o = prev.filter((k) => k !== fromKey);
      const at = o.indexOf(toKey);
      if (at < 0) return prev;
      o.splice(at, 0, fromKey);
      return o;
    });
  };
  const toggle = (key: string) => {
    if (key === "bg" || key === "win" || key === "light")
      setBaseOn((p) => ({ ...p, [key]: !p[key as keyof typeof p] }));
    else setOff((p) => ({ ...p, [key]: !p[key] }));
  };
  const selExtra = extras.find((x) => x.key === sel) ?? null;
  const updateSel = (patch: Partial<LabExtra>) =>
    setExtras((prev) => prev.map((x) => (x.key === sel ? { ...x, ...patch } : x)));

  // 拖動「展開程度」時先停掉自動播放的動畫
  const onExplodeInput = (v: number) => {
    cancelAnimationFrame(rafRef.current);
    setExplode(v);
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1400px] flex-col justify-center px-5 py-6 md:px-8">
      <div data-panel className="mb-3.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Eyebrow text={LAB.eyebrow} dark />
        <PanelTitle text={LAB.title} dark />
        <span className="text-[13px]" style={{ color: C.darkMute }}>
          {LAB.sub}
        </span>
      </div>
      {/* 手機：舞台優先、控制面板跟著頁面自然捲動；桌機：左控制右舞台 */}
      <div data-panel className="flex flex-col gap-5 lg:grid lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
        {/* 控制面板 */}
        <div
          className="flex flex-col gap-4 rounded-2xl p-4 lg:max-h-[62vh] lg:overflow-y-auto"
          style={{ border: "1px solid rgba(255,255,255,0.14)", backgroundColor: "rgba(14,19,27,0.58)" }}
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7d7263" }}>
              時段
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LAB_PHASES.map((p) => {
                const on = phase === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPhase(p.id)}
                    className="rounded-full px-3.5 py-1.5 text-[13px]"
                    style={
                      on
                        ? { backgroundColor: C.blueBright, color: "#fff", fontWeight: 700, border: `1px solid ${C.blueBright}` }
                        : { backgroundColor: "rgba(255,255,255,0.06)", color: C.darkText, border: "1px solid rgba(255,255,255,0.16)" }
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <LabSlider label="展開程度" value={explode} text={`${Math.round(explode * 100)}%`} min={0} max={1} step={0.01} onChange={onExplodeInput} />
            <LabSlider label="俯視角度" value={tilt} text={`${tilt}°`} min={0} max={75} step={1} onChange={setTilt} />
            <LabSlider label="水平轉角" value={spin} text={`${spin}°`} min={-45} max={45} step={1} onChange={setSpin} />
            <LabSlider label="層距" value={gap} text={`${gap}px`} min={30} max={180} step={1} onChange={setGap} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  cancelAnimationFrame(rafRef.current);
                  setExplode(1);
                  setTimeout(() => animateTo(0, 1600), 260);
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-bold"
                style={{ backgroundColor: C.amber, color: "#0e131b" }}
              >
                <Play className="size-3.5" />
                疊起來
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelAnimationFrame(rafRef.current);
                  setTilt(LAB_DEFAULT.tilt);
                  setSpin(LAB_DEFAULT.spin);
                  setGap(LAB_DEFAULT.gap);
                  setExplode(1);
                  setExtras([]);
                  setOrder(["bg", "win", "light"]);
                  setOff({});
                  setSel(null);
                  setBaseOn({ bg: true, win: true, light: true });
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px]"
                style={{ color: C.darkText, backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)" }}
              >
                <RotateCcw className="size-3.5" />
                重設
              </button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7d7263" }}>
              堆疊順序
              <br />
              <span className="font-normal normal-case tracking-normal" style={{ color: "#6a6053" }}>
                <span className="hidden lg:inline">{LAB.stackHint}</span>
                <span className="lg:hidden">{LAB.stackHintTouch}</span>
              </span>
            </p>
            <div className="flex flex-col gap-1.5">
              {layers.map((L) => (
                <div
                  key={L.key}
                  draggable
                  onDragStart={(e) => {
                    dragKeyRef.current = L.key;
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverKey !== L.key) setDragOverKey(L.key);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    reorder(dragKeyRef.current, L.key);
                    dragKeyRef.current = null;
                    setDragOverKey(null);
                  }}
                  onDragEnd={() => {
                    dragKeyRef.current = null;
                    setDragOverKey(null);
                  }}
                  className="flex items-center gap-1.5 rounded-[10px]"
                  style={{
                    backgroundColor: dragOverKey === L.key ? "rgba(232,185,106,0.14)" : "transparent",
                    outline: dragOverKey === L.key ? "1px dashed rgba(232,185,106,0.6)" : "none",
                  }}
                >
                  <span
                    className="hidden cursor-grab select-none px-0.5 text-[13px] leading-none lg:block"
                    style={{ color: "#7d7263" }}
                  >
                    ⣿
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(L.key)}
                    title="顯示／隱藏"
                    className="flex h-[26px] w-7 flex-none items-center justify-center rounded-lg"
                    style={{
                      color: L.on ? C.darkText : "#5d564a",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.14)",
                    }}
                  >
                    {L.on ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5 opacity-60" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => L.extra && setSel((p) => (p === L.key ? null : L.key))}
                    className="flex-1 rounded-[9px] px-2.5 py-1.5 text-left tabular-nums text-xs"
                    style={{
                      cursor: L.extra ? "pointer" : "default",
                      color: L.on ? C.darkText : "#6f6656",
                      backgroundColor: sel === L.key ? "rgba(232,185,106,0.18)" : L.on ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${sel === L.key ? C.amber : L.on ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    {L.label}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      L.extra &&
                      (setExtras((p) => p.filter((x) => x.key !== L.key)),
                      setOrder((p) => p.filter((k) => k !== L.key)),
                      setSel((p) => (p === L.key ? null : p)))
                    }
                    aria-label={L.extra ? `移除${L.label}` : undefined}
                    className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg"
                    style={{
                      cursor: L.extra ? "pointer" : "default",
                      color: L.extra ? "#c9a37a" : "#3a3630",
                      border: `1px solid ${L.extra ? "rgba(255,255,255,0.16)" : "transparent"}`,
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            {selExtra && (
              <div
                className="mt-2.5 rounded-[10px] px-3 py-2.5"
                style={{ backgroundColor: "rgba(232,185,106,0.09)", border: "1px solid rgba(232,185,106,0.32)" }}
              >
                <div className="mb-1.5 text-xs font-bold" style={{ color: C.amber }}>
                  調整「{ADEF(selExtra.id).label}」
                </div>
                <LabSlider label="水平" value={Math.round(selExtra.x * 100)} text={`${Math.round(selExtra.x * 100)}%`} min={0} max={95} step={1} onChange={(v) => updateSel({ x: v / 100 })} />
                <LabSlider label="垂直" value={Math.round(selExtra.y * 100)} text={`${Math.round(selExtra.y * 100)}%`} min={0} max={95} step={1} onChange={(v) => updateSel({ y: v / 100 })} />
                <LabSlider label="大小" value={Math.round(selExtra.s * 100)} text={`${Math.round(selExtra.s * 100)}%`} min={30} max={220} step={1} onChange={(v) => updateSel({ s: v / 100 })} />
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7d7263" }}>
              加入圖層
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LAB_ADDABLE.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    const key = `x${seqRef.current++}${a.id}`;
                    setExtras((p) => [...p, { key, id: a.id, x: a.rect.x, y: a.rect.y, s: 1 }]);
                    setOrder((p) => [...p, key]);
                    setSel(key);
                  }}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs"
                  style={{ color: C.darkText, backgroundColor: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.22)" }}
                >
                  ＋ {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 3D 展開舞台（手機排最前面，一進面板先看到成果） */}
        <div className="order-first lg:order-none" style={{ perspective: "1500px", perspectiveOrigin: "50% 55%" }}>
          <div
            className="relative mx-auto aspect-video w-full max-w-[900px]"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateY(${explode * 10}%) scale(${1 - explode * 0.3}) rotateX(${explode * tilt}deg) rotateZ(${explode * spin}deg)`,
            }}
          >
            {layers.map((L, i) => (
              <div
                key={L.key}
                className="absolute inset-0 overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${i * explode * gap}px)`,
                  opacity: L.on ? 1 : 0.04,
                  boxShadow:
                    explode > 0.02 && i > 0 ? `0 ${14 * explode}px ${36 * explode}px rgba(0,0,0,${0.35 * explode})` : "none",
                  transition: "opacity .3s ease",
                }}
              >
                <div className="absolute" style={L.cover ? { inset: 0 } : rectStyle(L.rect)}>
                  <Image
                    src={L.img}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 900px, 100vw"
                    className={L.cover ? "object-cover" : "object-contain"}
                  />
                </div>
                <span
                  aria-hidden
                  className="absolute left-2 top-2 rounded-md px-2 py-1 tabular-nums text-[10.5px]"
                  style={{
                    backgroundColor: "rgba(14,19,27,0.82)",
                    color: C.darkText,
                    opacity: Math.max(0, (explode - 0.2) / 0.5),
                    pointerEvents: "none",
                  }}
                >
                  {L.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 面板 10 圖層陳列（散落＋hover 搖晃）────────────── */

function GalleryPanel() {
  const [tab, setTab] = useState<"objects" | "chars">("objects");
  const group = GALLERY.tabs[tab];
  const scatter = GALLERY.scatter[tab];

  // 文字區塊兩種版型共用（桌機置中疊在散落物件上、手機置頂）
  const headerContent = (
    <>
      <Eyebrow text={GALLERY.eyebrow} />
      <PanelTitle text={GALLERY.title} />
      <p className="mt-2.5 text-sm leading-relaxed" style={{ color: C.body }}>
        {GALLERY.sub}
      </p>
      <div className="mb-3 mt-4 flex justify-center gap-2">
        {(["objects", "chars"] as const).map((k) => {
          const on = tab === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className="rounded-full px-3.5 py-2 text-[13px]"
              style={
                on
                  ? { backgroundColor: C.blueBright, color: "#fff", fontWeight: 700, border: `1px solid ${C.blueBright}` }
                  : { backgroundColor: C.cream, color: C.body, border: "1px solid rgba(62,50,38,0.14)" }
              }
            >
              {GALLERY.tabs[k].label}
            </button>
          );
        })}
      </div>
      <p className="text-[13px]" style={{ color: C.mute }}>
        {group.note}
      </p>
    </>
  );

  return (
    <>
      {/* 手機／平板：置頂文字 + 格狀陳列（散落擺位在窄螢幕會疊到文字） */}
      <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col justify-center px-6 py-10 lg:hidden" data-panel>
        <div className="text-center">{headerContent}</div>
        <div
          className={`mt-7 grid gap-x-4 gap-y-6 ${
            tab === "objects" ? "grid-cols-3 md:grid-cols-4" : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {group.items.map((item) => (
            <figure key={item.element} className="m-0 flex flex-col items-center gap-1.5">
              <div
                className="relative aspect-square w-full"
                style={{ filter: "drop-shadow(0 10px 18px rgba(62,50,38,0.2))" }}
              >
                <Image src={elementSrc(item.element)} alt={item.label} fill sizes="180px" className="object-contain" />
              </div>
              <figcaption className="text-[11px]" style={{ color: C.body }}>
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* 桌機：散落擺位 + hover 搖晃 */}
      <div className="relative mx-auto hidden h-[min(74vh,660px)] w-full max-w-[1320px] px-6 lg:block" data-panel>
        {group.items.map((item, i) => {
          const p = scatter[i] ?? { x: 50, y: 50, w: 130, r: 0 };
          return (
            <div
              key={item.element}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}px`, transform: "translate(-50%,-50%)" }}
            >
              <div
                title={item.label}
                className="mo-wobble-host w-full"
                style={{ transform: `rotate(${p.r}deg)`, transition: "transform .28s cubic-bezier(.2,.8,.3,1)" }}
              >
                <div className="relative aspect-square w-full" style={{ filter: "drop-shadow(0 12px 22px rgba(62,50,38,0.22))" }}>
                  <Image src={elementSrc(item.element)} alt={item.label} fill sizes="180px" className="object-contain" />
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 z-[4] w-[min(400px,80%)] -translate-x-1/2 -translate-y-1/2 text-center">
          {headerContent}
        </div>
      </div>
    </>
  );
}

/* ── 面板 11 心得 ────────────────────────────────────── */

function TakeawaysPanel() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1320px] flex-col justify-center px-6 py-8 md:px-10">
      <div data-panel className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Eyebrow text={TAKEAWAYS.eyebrow} />
        <PanelTitle text={TAKEAWAYS.title} size="lg" />
      </div>
      <p data-panel className="mt-1.5 text-sm" style={{ color: C.body }}>
        {TAKEAWAYS.sub}
      </p>

      <div
        data-panel
        className="mt-6 grid grid-cols-[minmax(0,1fr)_84px_minmax(0,1fr)] overflow-hidden rounded-[14px] md:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)]"
        style={{ border: "1px solid rgba(62,50,38,0.12)" }}
      >
        <div className="px-4 py-3.5 text-right text-base font-bold md:px-5" style={{ fontFamily: HEADING_FONT, color: C.blue, backgroundColor: "rgba(74,144,184,0.09)" }}>
          {TAKEAWAYS.divisionHeads.ai}
        </div>
        <div className="flex items-center justify-center text-[13px]" style={{ color: C.mute, backgroundColor: "rgba(246,240,228,0.7)" }}>
          {TAKEAWAYS.divisionHeads.mid}
        </div>
        <div className="px-4 py-3.5 text-base font-bold md:px-5" style={{ fontFamily: HEADING_FONT, color: C.head, backgroundColor: "rgba(200,150,90,0.1)" }}>
          {TAKEAWAYS.divisionHeads.me}
        </div>
        {TAKEAWAYS.division.map((row) => (
          <div key={row.mid} className="contents">
            <div className="px-4 py-3 text-right text-sm md:px-5" style={{ color: C.body, backgroundColor: "rgba(74,144,184,0.055)", borderTop: "1px solid rgba(62,50,38,0.09)" }}>
              {row.ai}
            </div>
            <div className="flex items-center justify-center text-[13px]" style={{ color: "#a3937c", backgroundColor: "rgba(246,240,228,0.7)", borderTop: "1px solid rgba(62,50,38,0.09)" }}>
              {row.mid}
            </div>
            <div className="px-4 py-3 text-sm md:px-5" style={{ color: C.body, backgroundColor: "rgba(200,150,90,0.06)", borderTop: "1px solid rgba(62,50,38,0.09)" }}>
              {row.me}
            </div>
          </div>
        ))}
      </div>

      <div data-panel className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TAKEAWAYS.cards.map((card, i) => {
          const tint = [
            { bg: "rgba(74,144,184,0.07)", bd: "rgba(74,144,184,0.22)", no: "rgba(47,111,147,0.65)" },
            { bg: "rgba(122,146,120,0.09)", bd: "rgba(122,146,120,0.26)", no: "rgba(96,122,94,0.7)" },
            { bg: "rgba(200,150,90,0.1)", bd: "rgba(200,150,90,0.28)", no: "rgba(168,120,58,0.7)" },
            { bg: "rgba(212,140,70,0.1)", bd: "rgba(212,140,70,0.34)", no: "rgba(190,116,48,0.75)" },
          ][i]!;
          return (
            <div key={card.no} className="rounded-[14px] px-5 py-5" style={{ backgroundColor: tint.bg, border: `1px solid ${tint.bd}` }}>
              <div className="mb-2 text-[1.9rem] leading-none" style={{ fontFamily: HEADING_FONT, color: tint.no }}>
                {card.no}
              </div>
              <b className="mb-1.5 block text-base" style={{ fontFamily: HEADING_FONT, color: C.head }}>
                {card.heading}
              </b>
              <span className="text-[13px] leading-relaxed" style={{ color: C.body }}>
                {card.body}
              </span>
            </div>
          );
        })}
      </div>

      <div data-panel className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[13px]" style={{ color: C.mute }}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span>{TAKEAWAYS.credit}</span>
          <Link href="/" className="inline-flex items-center gap-1.5 transition hover:opacity-70" style={{ color: C.body }}>
            <House className="size-3.5" />
            回到場景
          </Link>
          <Link href="/resume" className="transition hover:opacity-70" style={{ color: C.body }}>
            看履歷 →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {TAKEAWAYS.tools.map((t) => (
            <span key={t} className="rounded-full px-4 py-1.5 text-xs" style={{ border: "1px solid rgba(62,50,38,0.16)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Deck 主體 ───────────────────────────────────────── */

/** 圖層陳列的 hover 搖晃(頁面私有樣式,不進 globals) */
export function DeckStyles() {
  return (
    <style>{`
      @keyframes mo-wobble {
        0%, 100% { transform: scale(1.14) rotate(-2.5deg); }
        50% { transform: scale(1.14) rotate(2.5deg); }
      }
      .mo-wobble-host:hover { animation: mo-wobble 1.2s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .mo-wobble-host:hover { animation: none; }
      }
    `}</style>
  );
}

interface DeckPanelProps {
  panelKey: string;
  reduced: boolean;
  /** 流程面板的節點點了要跳到哪一頁 */
  onJump: (hash: string) => void;
  /** 實驗台在畫面上時才開始播展開動畫 */
  labActive: boolean;
}

/** 依面板 key 渲染對應內容 */
export function DeckPanel({ panelKey, reduced, onJump, labActive }: DeckPanelProps) {
  switch (panelKey) {
    case "hero":
      return <HeroPanel reduced={reduced} />;
    case "flow":
      return <FlowPanel onJump={onJump} />;
    case "challenge":
      return <ChallengePanel />;
    case "divergence":
      return <DivergencePanel />;
    case "wall":
      return <WallPanel />;
    case "handwork":
      return <HandworkPanel />;
    case "compare":
      return <ComparePanel />;
    case "spec":
      return <SpecPanel />;
    case "arch":
      return <ArchPanel />;
    case "lab":
      return <LabPanel active={labActive} />;
    case "gallery":
      return <GalleryPanel />;
    case "takeaways":
      return <TakeawaysPanel />;
    default:
      return null;
  }
}

export const PANEL_BG: Record<string, string> = {
  hero: "radial-gradient(ellipse at 80% 10%, rgba(74,144,184,0.16), transparent 55%), linear-gradient(140deg, #f6f0e4, #efe6d3)",
  flow: C.cream2,
  challenge: C.cream,
  divergence: C.cream2,
  wall: "#2a231d",
  handwork:
    "linear-gradient(180deg, rgba(20,16,12,0.88), rgba(20,16,12,0.94)), url('/making-of/p_night.webp') center / cover no-repeat",
  compare: C.cream,
  spec: C.cream2,
  arch: C.cream,
  lab: "linear-gradient(180deg, #141922, #0e131b)",
  gallery: C.cream2,
  takeaways: C.cream,
};
