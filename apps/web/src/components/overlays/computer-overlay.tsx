"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import { useModalFocus } from "@self-site/ui/use-modal-focus";
import { projects, type Project } from "@/data/projects";
import { useCoverExit } from "@/hooks/use-cover-exit";

/** 頂部列的按鈕:跟場景左上角的頁面按鈕同一套外觀與懸停動態 */
const BAR_BUTTON =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-soft/20 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0 active:scale-95";

/**
 * 點電腦後鏡頭拉近螢幕(縮放由 use-scene-camera 控制),推到一半這層就淡入蓋住整個畫面
 * 不再是一個框起來的視窗:不透明全頁,放大中的模糊場景只會出現在推近那一瞬間
 * 有 demoUrl 的專案可以直接在頁面裡內嵌操作
 */
export function ComputerOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [demo, setDemo] = useState<Project | null>(null);
  const { leaving, leave } = useCoverExit();

  // 在 demo 裡 Esc 先回專案列表,再按一次才離開
  const dismiss = () => {
    if (demo) setDemo(null);
    else leave();
  };

  useModalFocus(true, ref, dismiss);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="我的專案"
      className={`${leaving ? "cover-out" : "cover-in"} fixed inset-0 z-50 flex flex-col bg-cream text-ink`}
    >
      {/* 頂部列:左邊標題(demo 時是返回鍵與網址),右邊永遠有「回到房間」 */}
      <header className="flex shrink-0 items-center gap-3 border-b border-ink-soft/10 bg-cream/95 px-4 py-3 md:px-10">
        {demo?.demoUrl ? (
          <>
            <button type="button" onClick={() => setDemo(null)} className={BAR_BUTTON}>
              <ArrowLeft className="size-4" aria-hidden />
              專案列表
            </button>
            <p className="hidden min-w-0 flex-1 truncate rounded-full bg-ink-soft/8 px-3 py-1.5 font-mono text-xs text-ink-dim sm:block">
              {demo.demoUrl}
            </p>
            <a href={demo.demoUrl} target="_blank" rel="noreferrer" className={`${BAR_BUTTON} ml-auto sm:ml-0`}>
              新分頁開啟
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.35em] text-ink-dim">PROJECTS</p>
            <h2 className="text-lg font-bold md:text-xl">我的專案</h2>
          </div>
        )}
        <span className="hidden text-xs text-ink-dim lg:inline">按 Esc 也能關閉</span>
        <button type="button" onClick={leave} className={BAR_BUTTON}>
          <X className="size-4" aria-hidden />
          回到房間
        </button>
      </header>

      {demo?.demoUrl ? (
        <iframe
          src={demo.demoUrl}
          title={`${demo.name} live demo`}
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      ) : (
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 md:px-10 md:py-10">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => {
                const card = (
                  <>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ background: project.accent }} />
                      <h3 className="text-base font-bold">{project.name}</h3>
                      {project.demoUrl && (
                        <span className="ml-auto rounded-full bg-[#28c840]/12 px-2 py-0.5 text-[11px] font-medium text-[#1f8f36]">
                          可試玩 ▶
                        </span>
                      )}
                    </div>
                    <p className="mb-4 text-left text-sm leading-relaxed text-ink-soft">{project.description}</p>
                    <ul className="mt-auto flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <li key={tech} className="rounded-full bg-ink-soft/8 px-2 py-0.5 font-mono text-[11px] text-ink-dim">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </>
                );
                const className =
                  "rise-in flex h-full w-full flex-col rounded-2xl border border-ink-soft/15 bg-white/60 p-5 text-left transition duration-200 ease-out hover:-translate-y-1 hover:border-ink-soft/30 hover:bg-white hover:shadow-[0_10px_30px_rgba(74,60,48,.12)]";
                const style = { animationDelay: `${0.45 + i * 0.06}s` };

                return (
                  <li key={project.name}>
                    {project.demoUrl ? (
                      <button
                        type="button"
                        onClick={() => setDemo(project)}
                        className={`${className} active:translate-y-0`}
                        style={style}
                      >
                        {card}
                      </button>
                    ) : (
                      <article className={className} style={style}>
                        {card}
                      </article>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-8 text-center text-xs text-ink-dim">這台電腦還會繼續長出新東西 ⌨️</p>
          </div>
        </main>
      )}
    </div>
  );
}
