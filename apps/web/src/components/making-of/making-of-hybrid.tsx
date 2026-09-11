"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  GitBranch,
  House,
  Image as ImageIcon,
  Layers,
  LoaderCircle,
  Paintbrush,
  Search,
  Sparkles,
  TriangleAlert,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import {
  MAKING_OF_MILESTONES,
  MAKING_OF_PHASES,
  MAKING_OF_STATS,
  MAKING_OF_STEPS,
  type MakingOfPhase,
  type MakingOfTool,
  type MakingOfStat,
} from "@/data/making-of";
import { prefersReducedMotion } from "@/lib/motion";
import { elementSrc } from "@/components/scene/element-layers";
import { AssetSlot } from "./asset-slot";
import { ToolBadgeRow } from "./tool-badge";

/** 2026-05-24 → 05.24 */
const shortDate = (date: string) => date.slice(5).replace("-", ".");

/** 步驟號/圖號渲染時算，不寫進資料 */
const STEP_NO = new Map<string, number>();
const FIGURE_NO = new Map<string, number>();
{
  let step = 0;
  let figure = 0;
  for (const s of MAKING_OF_STEPS) {
    if (s.kind === "step") STEP_NO.set(s.id, ++step);
    if (s.asset) FIGURE_NO.set(s.id, ++figure);
  }
}

const ALL_TOOLS: MakingOfTool[] = [...new Set(MAKING_OF_STEPS.flatMap((s) => s.tools))];
const LAST = MAKING_OF_PHASES.length - 1;

/** 各階段的真實日期，壓成時間軸節點下那行小字：「05.24」「07.12–14」 */
const PHASE_DATES = new Map<string, string>();
{
  for (const p of MAKING_OF_PHASES) {
    const dates = MAKING_OF_MILESTONES.filter((m) => m.phase === p.id).map((m) =>
      shortDate(m.date),
    );
    const first = dates[0];
    const last = dates[dates.length - 1];
    if (!first || !last) continue;
    if (first === last) PHASE_DATES.set(p.id, first);
    else if (first.slice(0, 2) === last.slice(0, 2))
      PHASE_DATES.set(p.id, `${first}–${last.slice(3)}`);
    else PHASE_DATES.set(p.id, `${first}–${last}`);
  }
}

/** 時間軸節點 icon（展演設定，跟 tool-badge 一樣放元件端） */
const PHASE_ICONS: Record<MakingOfPhase["id"], LucideIcon> = {
  spark: Search,
  wall: ImageIcon,
  parallel: GitBranch,
  redraw: Paintbrush,
  assemble: Layers,
  next: LoaderCircle,
};

/** 總覽卡四格數據的 icon 與色票，用 stat id 對齊（少一個 tsc 會擋，不靠陣列順序） */
const STAT_META: Record<MakingOfStat["id"], { icon: LucideIcon; tint: string }> = {
  duration: { icon: Clock, tint: "#e8a0bf" },
  tools: { icon: Sparkles, tint: "#e9b44c" },
  layers: { icon: Layers, tint: "#7c9ef8" },
  subscription: { icon: CalendarDays, tint: "#5fae74" },
};

/** #phase-<id> 或 #<stepId> 都能深連結到對應章節 */
function phaseIndexFromHash(): number | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  const byPhase = MAKING_OF_PHASES.findIndex((p) => `phase-${p.id}` === hash);
  if (byPhase >= 0) return byPhase;
  const step = MAKING_OF_STEPS.find((s) => s.id === hash);
  if (step) return MAKING_OF_PHASES.findIndex((p) => p.id === step.phase);
  return null;
}

/** 總覽卡：數據 + 工具 */
function OverviewCard() {
  return (
    <aside
      data-hero
      className="mt-6 rounded-2xl border border-ink-soft/15 bg-cream-soft/60 p-4 lg:mt-0 lg:w-[420px] lg:p-5"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
        {MAKING_OF_STATS.map((stat) => {
          const meta = STAT_META[stat.id];
          const StatIcon = meta.icon;
          return (
            <div key={stat.label} className="text-center">
              <span
                className="mx-auto flex size-9 items-center justify-center rounded-full"
                style={{ backgroundColor: `${meta.tint}22`, color: meta.tint }}
              >
                <StatIcon className="size-4.5" strokeWidth={2} />
              </span>
              <p className="mt-1.5 text-sm font-bold tabular-nums text-ink lg:text-base">
                {stat.value}
              </p>
              <p className="text-[10px] text-ink-dim">{stat.label}</p>
            </div>
          );
        })}
      </div>
      <div className="my-3 border-t border-dashed border-ink-soft/20" />
      <ToolBadgeRow tools={ALL_TOOLS} className="justify-center lg:justify-start" />
    </aside>
  );
}

interface TimelineProps {
  active: number;
  onSelect: (i: number) => void;
  trackRef: RefObject<HTMLOListElement | null>;
}

/** 可點擊時間軸：編號圓徽 + icon + 虛線軌道節點 + 真實日期，active 欄整塊 tint */
function TimelineTrack({ active, onSelect, trackRef }: TimelineProps) {
  return (
    <nav
      aria-label="製作階段時間軸"
      className="rounded-2xl border border-ink-soft/15 bg-cream-soft/40 p-1"
    >
      <ol ref={trackRef} className="flex overflow-x-auto [scrollbar-width:none]">
        {MAKING_OF_PHASES.map((p, i) => {
          const on = i === active;
          const PhaseIcon = PHASE_ICONS[p.id];
          return (
            <li key={p.id} className="min-w-[110px] flex-1 shrink-0">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={on ? "step" : undefined}
                className="group w-full rounded-lg px-2 py-1.5 text-center transition hover:bg-cream-soft/80"
                style={on ? { backgroundColor: `${p.accent}16` } : undefined}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <PhaseIcon
                    aria-hidden
                    className="size-4"
                    style={{ color: p.accent }}
                    strokeWidth={1.8}
                  />
                  <span
                    className={`whitespace-nowrap text-[13px] ${
                      on ? "font-bold text-ink" : "text-ink-soft"
                    }`}
                  >
                    {p.title}
                  </span>
                </span>
                <span aria-hidden className="relative -mx-2 mt-1.5 block h-3">
                  <span
                    className={`absolute top-1/2 h-0 -translate-y-1/2 border-t border-dashed border-ink-soft/30 ${
                      i === 0 ? "left-1/2 right-0" : i === LAST ? "left-0 right-1/2" : "inset-x-0"
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all ${
                      on ? "size-3" : "size-2 group-hover:size-2.5"
                    }`}
                    style={{
                      borderColor: p.accent,
                      backgroundColor: on ? p.accent : "var(--color-cream)",
                    }}
                  />
                </span>
                <span className="mt-0.5 block h-3.5 text-[10px] tabular-nums text-ink-dim">
                  {PHASE_DATES.get(p.id) ?? ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * 定稿版型：兩個同頁畫面，左右滑動切換（不換頁）——
 * 「總覽」= 標題 + 說明 + 數據卡 + CTA；「時間軸」= 可點擊時間軸 + 章節面板（內部捲動）。
 * 整頁固定一屏高，只有章節面板有捲軸。
 */
export function MakingOfHybrid() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"intro" | "timeline">("intro");
  const [active, setActive] = useState(0);
  const phase = MAKING_OF_PHASES[active]!;
  const steps = MAKING_OF_STEPS.filter((s) => s.phase === phase.id);
  const milestones = MAKING_OF_MILESTONES.filter((m) => m.phase === phase.id);
  // 章節裝飾貼紙：取該章第一個帶 decor 的步驟
  const decor = steps.find((s) => s.decor?.length)?.decor?.[0];

  // hash 深連結（#phase-redraw 或 #illustrator-redraw）直接落在時間軸畫面；
  // 命中步驟 id 時記下來：hash 維持原樣、面板捲到該步驟，換到別章才恢復成 #phase-…
  const stepHashRef = useRef<string | null>(null);
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const fromHash = phaseIndexFromHash();
    if (fromHash !== null) {
      if (MAKING_OF_STEPS.some((s) => s.id === hash)) stepHashRef.current = hash;
      setActive(fromHash);
      setView("timeline");
    }
  }, []);
  // 時間軸畫面才掛 hash；回總覽就拿掉，分享網址不會帶到錯的畫面
  useEffect(() => {
    const { pathname, search } = window.location;
    const stepHash = stepHashRef.current;
    if (stepHash && MAKING_OF_STEPS.find((s) => s.id === stepHash)?.phase !== phase.id) {
      stepHashRef.current = null;
    }
    const anchor = stepHashRef.current ?? `phase-${phase.id}`;
    window.history.replaceState(
      null,
      "",
      view === "timeline" ? `${pathname}${search}#${anchor}` : `${pathname}${search}`,
    );
    if (view === "timeline" && stepHashRef.current) {
      document.getElementById(stepHashRef.current)?.scrollIntoView({ block: "start" });
    }
  }, [view, phase.id]);

  // 手機上時間軸是橫向捲動的：換章時把該節點捲到置中（桌機軌道整條可見，等於 no-op）。
  // 刻意不用 smooth / rAF：背景分頁的 rAF 會停擺，smooth 捲動會卡在半路，
  // 而且 deep link 落地本來就該直接就定位。轉向 / 改寬時也重算，不用等下次切章。
  const trackRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const center = () => {
      const track = trackRef.current;
      const node = track?.querySelector('[aria-current="step"]')?.closest<HTMLElement>("li");
      if (!track || !node) return;
      track.scrollLeft = node.offsetLeft - (track.clientWidth - node.clientWidth) / 2;
    };
    center();
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, [active]);

  // 鍵盤 ← →：總覽按 → 進時間軸；時間軸上切章，第一章再按 ← 回總覽
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (view === "intro") setView("timeline");
        else setActive(Math.min(LAST, active + 1));
      }
      if (e.key === "ArrowLeft" && view === "timeline") {
        if (active === 0) setView("intro");
        else setActive(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, active]);

  // 總覽進場一次；章節面板每次切章重播（照 resume-view 的 dependencies 模式）
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(rootRef);
      gsap.from(q("[data-panel]"), {
        opacity: 0,
        y: 18,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { dependencies: [active], scope: rootRef },
  );
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(rootRef);
      gsap.from(q("[data-hero]"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      });
    },
    { scope: rootRef },
  );

  // 兩張畫面併排各佔 100%，一起位移做左右滑；CSS transition 不吃 rAF，背景分頁也不會卡住
  const slide = { transform: view === "timeline" ? "translateX(-100%)" : "translateX(0)" };
  const slideClass =
    "h-full w-full shrink-0 transition-transform duration-500 ease-out motion-reduce:transition-none";

  // main 用 overflow-clip 不用 hidden:hidden 仍是 scroll container
  // 帶 #phase-xxx 深連結落地時瀏覽器的錨點捲動會把它往右捲,整頁跟著偏移
  return (
    <main className="h-dvh min-h-[560px] overflow-clip bg-cream text-ink">
      <div ref={rootRef} className="flex h-full w-full">
        {/* ── 畫面一：總覽（標題 + 說明 + 數據卡 + CTA）──────────── */}
        <section aria-label="總覽" inert={view !== "intro"} className={`${slideClass} overflow-y-auto`} style={slide}>
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-5 py-10 md:px-8">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
              <div>
                <p data-hero className="text-[11px] font-bold tracking-[0.35em] text-ink-dim">
                  CASE STUDY · 視覺風格製作歷程
                </p>
                <h1
                  data-hero
                  className="mt-3 text-3xl font-bold leading-tight text-ink md:text-4xl lg:text-5xl"
                >
                  <span className="block">把一個房間，</span>
                  <span className="block">做成可以被程式操作的場景</span>
                </h1>
                <span
                  aria-hidden
                  data-hero
                  className="mt-4 block h-1 w-14 rounded-full bg-accent-soft"
                />
                <p data-hero className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
                  這個網站的插畫視覺不是一次生成出來的。從 AI 風格探索、生成圖撞牆、
                  佔位符先行開發，到訂閱 Illustrator 手工重畫與拆層整合 ——
                  進入時間軸，一段一段看。
                </p>
                <div data-hero className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setView("timeline")}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-soft px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
                  >
                    看製作時間軸
                    <ArrowRight className="size-4" />
                  </button>
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 rounded-full border border-ink-soft/25 px-5 py-3 text-sm font-medium text-ink-soft transition hover:bg-ink-soft/5"
                  >
                    看互動履歷
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-ink-dim transition hover:text-ink"
                  >
                    <House className="size-4" />
                    回到場景
                  </Link>
                </div>
                <p data-hero className="mt-4 text-[11px] text-ink-dim/80">
                  也可以直接按 → 進入
                </p>
              </div>
              <OverviewCard />
            </div>
          </div>
        </section>

        {/* ── 畫面二：時間軸 + 章節面板（只有面板會捲動）──────────── */}
        <section aria-label="製作時間軸" inert={view !== "timeline"} className={slideClass} style={slide}>
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 py-5 md:px-8 md:py-6">
            <TimelineTrack active={active} onSelect={setActive} trackRef={trackRef} />
            {/* 讀屏的換章回饋：下面的章節面板每次換章都重新掛載，掛在它身上的 live region 不會播報 */}
            <p className="sr-only" role="status">
              第 {active + 1} 章：{phase.title}
            </p>
            <p className="mb-2 mt-1 text-right text-[10px] text-ink-dim/70">
              * 節點下方是真實日期錨點，間距不等比。
            </p>

            <section
              key={phase.id}
              id={`phase-${phase.id}`}
              className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-ink-soft/15 bg-cream-soft/40"
            >
              {/* accent 色條 + 浮水印章節號釘在外框上，面板內捲時不跟著跑 */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 top-0 w-1"
                style={{ backgroundColor: phase.accent }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-3 text-5xl font-bold tabular-nums text-ink-soft/15 md:text-6xl"
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              {/* 章節裝飾貼紙 */}
              {decor && (
                <Image
                  src={elementSrc(decor.element)}
                  alt=""
                  aria-hidden
                  width={72}
                  height={72}
                  className="pointer-events-none absolute bottom-4 right-5 hidden h-16 w-16 rotate-3 object-contain opacity-90 md:block"
                />
              )}

              <div className="relative h-full overflow-y-auto p-6 md:p-8">
                <div data-panel>
                  <h2 className="text-xl font-bold text-ink md:text-2xl">{phase.title}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{phase.subtitle}</p>
                </div>

                {/* 這一章對應的真實日期 */}
                {milestones.length > 0 && (
                  <ul data-panel className="mt-4 flex flex-wrap gap-2" aria-label="真實日期錨點">
                    {milestones.map((m) => (
                      <li
                        key={m.date}
                        className="rounded-full border border-ink-soft/15 bg-cream/70 px-3 py-1 text-[11px] leading-relaxed text-ink-soft"
                      >
                        <span className="font-bold tabular-nums text-ink">{shortDate(m.date)}</span>
                        <span className="ms-1.5">{m.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex flex-col gap-8 md:gap-10">
                  {steps.map((step) => {
                    if (step.kind === "aside") {
                      return (
                        <blockquote
                          key={step.id}
                          id={step.id}
                          data-panel
                          className="border-l-4 border-accent bg-cream/60 py-4 pl-5 pr-4"
                        >
                          <p className="text-sm leading-relaxed text-ink md:text-base">
                            {step.body}
                          </p>
                          <footer className="mt-3 text-xs text-ink-dim">— 為什麼要做這件事</footer>
                        </blockquote>
                      );
                    }
                    return (
                      <article key={step.id} id={step.id} data-panel>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span
                            className="text-[11px] font-bold tracking-[0.2em] tabular-nums"
                            style={{ color: phase.accent }}
                          >
                            STEP {String(STEP_NO.get(step.id)).padStart(2, "0")}
                          </span>
                          <span className="text-[11px] text-ink-dim">
                            {step.period}
                            {step.dateAnchor ? ` · ${step.dateAnchor}` : ""}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-lg font-bold text-ink md:text-xl">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                          {step.body}
                        </p>

                        {step.problems && (
                          <div className="mt-4 max-w-2xl rounded-lg border border-ink-soft/15 bg-cream/70 p-4">
                            <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-ink-dim">
                              <TriangleAlert className="size-3.5" strokeWidth={2} />
                              卡關
                            </p>
                            <ul className="mt-2 flex flex-col gap-1.5">
                              {step.problems.map((p) => (
                                <li
                                  key={p}
                                  className="flex gap-2 text-xs leading-relaxed text-ink-soft"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-dim"
                                  />
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <ToolBadgeRow tools={step.tools} className="mt-4" />

                        {step.asset && (
                          <div className="max-w-2xl">
                            <AssetSlot asset={step.asset} figureNo={FIGURE_NO.get(step.id)} />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 頁尾：回總覽 + 上一章 / 下一章 */}
            <div className="mt-4 flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => setView("intro")}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-soft/25 px-4 py-2 text-xs font-medium text-ink-soft transition hover:bg-ink-soft/5"
              >
                <Undo2 className="size-3.5" />
                回總覽
              </button>
              <button
                type="button"
                onClick={() => setActive((i) => Math.max(0, i - 1))}
                disabled={active === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-soft/25 px-4 py-2 text-xs font-medium text-ink-soft transition enabled:hover:bg-ink-soft/5 disabled:opacity-35"
              >
                <ArrowLeft className="size-3.5" />
                上一章
              </button>
              <p className="mx-auto text-[11px] tabular-nums text-ink-dim" aria-hidden>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(MAKING_OF_PHASES.length).padStart(2, "0")}
                <span className="ml-2 hidden text-ink-dim/70 md:inline">← → 也可以切換</span>
              </p>
              <button
                type="button"
                onClick={() => setActive((i) => Math.min(LAST, i + 1))}
                disabled={active === LAST}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-soft/25 px-4 py-2 text-xs font-medium text-ink-soft transition enabled:hover:bg-ink-soft/5 disabled:opacity-35"
              >
                下一章
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
