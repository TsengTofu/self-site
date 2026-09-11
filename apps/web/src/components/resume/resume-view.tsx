"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Mail, ExternalLink, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { prefersReducedMotion } from "@/lib/motion";
import { gmailComposeUrl } from "@/lib/links";
import { elementSrc } from "@/components/scene/element-layers";

/** 履歷可用的人物姿勢(跟場景同一批 girl-<pose> 元素圖,路徑由 elementSrc 統一) */
type GirlPose = "stretch" | "music" | "cat";
type ExperienceId = (typeof profile.experiences)[number]["id"];

const GMAIL_COMPOSE = gmailComposeUrl("嗨 Tseng,看完你的履歷,想找你聊聊 👋");

/**
 * 每個職涯階段的展演設定,用 profile.experiences 的 id 當 key
 * (不靠陣列位置對齊,之後插入一段經歷不會靜默錯位;少寫一個 tsc 會擋)
 * accent 決定該階段的重點色,decor 是 1-2 個現有場景素材當裝飾,pose 是主視覺人物姿勢
 */
const STAGE_EXTRAS: Record<
  ExperienceId,
  { tag: string; accent: string; pose: GirlPose; decor: string[] }
> = {
  appworks: { tag: "起點", accent: "#e8a0bf", pose: "stretch", decor: ["backpack", "laptop"] },
  design: { tag: "設計魂", accent: "#e9b44c", pose: "music", decor: ["musicPlayer", "lamp"] },
  commeet: { tag: "深耕", accent: "#7c9ef8", pose: "cat", decor: ["laptop", "phone"] },
  current: { tag: "現在", accent: "#5fae74", pose: "music", decor: ["headphones", "laptop"] },
};

/** 時間由舊到新的階段清單(profile.experiences 是現職在前,這裡反轉),時間軸左→右 = 過去→現在 */
const STAGES = [...profile.experiences].reverse().map((exp) => ({ ...exp, ...STAGE_EXTRAS[exp.id] }));

const LAST = STAGES.length - 1;

function readHashStage(): number | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/^#stage-(\d+)$/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 0 && n <= LAST ? n : null;
}

export function ResumeView() {
  // 預設停在最後一個(=現職),首訪就先看到最新的我;若 URL 帶 #stage-N 則直連
  const [active, setActive] = useState(LAST);
  const mainRef = useRef<HTMLDivElement>(null);

  // 掛載時讀 URL hash(#stage-2 直連)
  useEffect(() => {
    const fromHash = readHashStage();
    if (fromHash !== null) setActive(fromHash);
  }, []);

  // 切換時同步 hash(不寫入歷史,避免上一頁被塞滿)
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", `#stage-${active}`);
  }, [active]);

  // 鍵盤 ← → 切換階段
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd/Ctrl/Alt + 方向鍵是瀏覽器或系統的快捷鍵(例如 macOS Cmd+← 上一頁),不搶
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") setActive((i) => Math.min(LAST, i + 1));
      else if (e.key === "ArrowLeft") setActive((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 內容替換過場:卡片滑入 + highlights 逐條浮現 + 人物淡入(respect 減少動態)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(mainRef);
      gsap.from(q("[data-card]"), { opacity: 0, x: 28, duration: 0.45, ease: "power3.out" });
      gsap.from(q("[data-hl]"), {
        opacity: 0,
        y: 12,
        duration: 0.4,
        stagger: 0.07,
        delay: 0.12,
        ease: "power2.out",
      });
      gsap.from(q("[data-portrait]"), {
        opacity: 0,
        scale: 0.95,
        duration: 0.55,
        ease: "power2.out",
      });
      gsap.from(q("[data-decor]"), {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.15,
        ease: "power2.out",
      });
    },
    // 切階段時先把上一輪 tween 寫進去的 inline style 還原再重播
    // 不然快速連點會把半路的 opacity/x 錄成終點,卡片停在半透明
    { dependencies: [active], scope: mainRef, revertOnUpdate: true },
  );

  const stage = STAGES[active]!;

  return (
    <main className="min-h-dvh bg-cream text-ink">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-8 md:px-8 md:py-12">
        {/* 頁首:代替自我介紹的一句話 */}
        <header className="mb-8 shrink-0">
          <p className="text-[11px] font-bold tracking-[0.35em] text-ink-dim">TOFU TSENG · 職涯時間軸</p>
          <h1 className="font-hand mt-1 text-4xl text-ink md:text-5xl">
            與其自我介紹,不如帶你走一遍
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
            {profile.tagline}
          </p>
        </header>

        {/* 時間軸(由舊到新):點節點或用 ← → 切換 */}
        <nav aria-label="職涯階段" className="mb-8 shrink-0">
          <ol className="relative flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-0">
            {/* 連接線 */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-[13px] hidden h-px bg-ink-soft/25 md:block"
            />
            {STAGES.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.company} className="relative flex-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on ? "step" : undefined}
                    aria-label={`${s.company}・${s.period}`}
                    className="group flex w-full flex-col items-center gap-1.5 px-2 text-center"
                  >
                    <span
                      className="grid size-7 place-items-center rounded-full border-2 bg-cream transition"
                      style={{
                        borderColor: on ? s.accent : "rgba(107,86,71,.3)",
                        backgroundColor: on ? s.accent : undefined,
                      }}
                    >
                      <span
                        className={`size-2 rounded-full ${on ? "bg-white" : "bg-ink-soft/40 group-hover:bg-ink-soft/70"}`}
                      />
                    </span>
                    <span
                      className={`whitespace-nowrap text-[11px] font-semibold transition md:text-xs ${
                        on ? "text-ink" : "text-ink-dim group-hover:text-ink-soft"
                      }`}
                    >
                      {s.period}
                    </span>
                    <span
                      className={`whitespace-nowrap text-[10px] transition ${on ? "text-ink-soft" : "text-ink-dim/70"}`}
                    >
                      {s.tag}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* 主區:人物立繪 + 階段卡片 */}
        <div ref={mainRef} className="grid flex-1 items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
          {/* 人物立繪 + 裝飾小元素 */}
          <div className="relative mx-auto flex h-64 w-full max-w-[320px] items-end justify-center md:h-[420px]">
            {/* 背後暈染色塊(跟著 accent) */}
            <span
              aria-hidden
              className="absolute bottom-6 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-30 blur-3xl md:h-56 md:w-56"
              style={{ backgroundColor: stage.accent }}
            />
            <div key={stage.pose} data-portrait className="relative z-10 h-full w-full">
              <Image
                src={elementSrc(`girl-${stage.pose}`)}
                alt="短髮戴眼鏡的角色立繪"
                fill
                sizes="320px"
                className="object-contain object-bottom drop-shadow-xl"
                draggable={false}
              />
            </div>
            {/* 裝飾小元素(絕對定位,角落點綴) */}
            {stage.decor.map((name, di) => (
              <div
                key={name}
                data-decor
                aria-hidden
                className="absolute z-20 h-14 w-14 md:h-16 md:w-16"
                style={di === 0 ? { left: "-4%", bottom: "12%" } : { right: "-4%", top: "8%" }}
              >
                <Image
                  src={elementSrc(name)}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain drop-shadow-md"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* 階段卡片 */}
          <article
            data-card
            className="rounded-3xl border border-ink-soft/15 bg-cream-soft/70 p-6 shadow-sm md:p-8"
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold text-white"
              style={{ backgroundColor: stage.accent }}
            >
              {stage.tag} · {stage.period}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-ink md:text-3xl">{stage.company}</h2>
            <p className="mt-0.5 text-sm text-ink-soft md:text-base">{stage.role}</p>

            <ul className="mt-5 flex flex-col gap-3">
              {stage.highlights.map((h) => (
                <li key={h} data-hl className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: stage.accent }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* 上一階段 / 下一階段 */}
            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActive((i) => Math.max(0, i - 1))}
                aria-disabled={active === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-soft/20 px-3.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-ink-soft/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-30"
              >
                <ArrowLeft className="size-4" />
                更早
              </button>
              <span className="text-[11px] tabular-nums text-ink-dim">
                {active + 1} / {STAGES.length}
              </span>
              <button
                type="button"
                onClick={() => setActive((i) => Math.min(LAST, i + 1))}
                aria-disabled={active === LAST}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-soft/20 px-3.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-ink-soft/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-30"
              >
                更近
                <ArrowRight className="size-4" />
              </button>
            </div>
          </article>
        </div>

        {/* CTA:促成聯繫 */}
        <section className="mt-12 shrink-0 rounded-3xl border border-ink-soft/15 bg-gradient-to-br from-accent/10 to-accent-soft/10 p-6 text-center md:mt-16 md:p-8">
          <p className="text-xs font-semibold tracking-widest text-ink-dim">
            <MapPin className="mr-1 inline size-3.5 align-[-2px]" />
            {profile.location}
          </p>
          <h2 className="font-hand mt-1 text-3xl text-ink md:text-4xl">看到這裡,不如聊聊?</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-soft">
            工作機會、專案合作,或只是想交換歌單 — 都歡迎找我。
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={GMAIL_COMPOSE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-soft px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
            >
              <Mail className="size-4" />
              跟我聊聊
            </a>
            <a
              href={profile.links.find((l) => l.label === "GitHub")?.url ?? "https://github.com"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-soft/25 px-6 py-3 text-sm font-medium text-ink-soft transition hover:bg-ink-soft/5"
            >
              <ExternalLink className="size-4" />
              {profile.links[0]?.label ?? "GitHub"}
            </a>
            {/* 次要出口:想知道這個網站的視覺怎麼來的,去看製作歷程 */}
            <Link
              href="/making-of"
              className="inline-flex items-center gap-2 rounded-full border border-ink-soft/25 px-6 py-3 text-sm font-medium text-ink-soft transition hover:bg-ink-soft/5"
            >
              看看視覺是怎麼做出來的
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
