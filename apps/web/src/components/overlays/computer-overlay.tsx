"use client";

import { useEffect, useRef, useState } from "react";
import { WindowFrame } from "@self-site/ui/window-frame";
import { projects, type Project } from "@/data/projects";
import { useSceneStore } from "@/stores/scene-store";

/**
 * 點電腦後,鏡頭拉近螢幕(縮放由 DeskExperience 控制),
 * 這層是「進到螢幕裡」之後看到的專案視窗。
 * 有 demoUrl 的專案可以直接在內嵌瀏覽器裡實際操作。
 */
export function ComputerOverlay() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);
  const ref = useRef<HTMLDivElement>(null);
  const [demo, setDemo] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // 在 demo 裡 ESC 先回專案列表,再按一次才離開螢幕
      setDemo((current) => {
        if (current) return null;
        closeOverlay();
        return current;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOverlay]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="我的專案"
      className="rise-in fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e16]/85 p-4 md:p-10"
      style={{ animationDelay: "0.55s" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeOverlay();
      }}
    >
      <WindowFrame
        title={demo ? `${demo.name} — live` : "tseng@self-site: ~/projects"}
        onClose={closeOverlay}
        className={`max-h-full w-full ${demo ? "max-w-5xl" : "max-w-3xl"}`}
      >
        {demo?.demoUrl ? (
          <div className="flex h-[72vh] flex-col">
            {/* 內嵌瀏覽器工具列 */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#20222e] px-3 py-2">
              <button
                type="button"
                onClick={() => setDemo(null)}
                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white/80 transition hover:bg-white/20"
              >
                ← 專案列表
              </button>
              <p className="flex-1 truncate rounded-full bg-black/40 px-3 py-1 font-mono text-[11px] text-white/50">
                {demo.demoUrl}
              </p>
              <a
                href={demo.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white/80 transition hover:bg-white/20"
              >
                新分頁開啟 ↗
              </a>
            </div>
            <iframe
              src={demo.demoUrl}
              title={`${demo.name} live demo`}
              className="min-h-0 w-full flex-1 border-0 bg-[#141824]"
            />
          </div>
        ) : (
          <>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {projects.map((project, i) => {
                const card = (
                  <>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: project.accent }}
                      />
                      <h3 className="font-mono text-sm font-bold text-white">{project.name}</h3>
                      {project.demoUrl && (
                        <span className="ml-auto rounded bg-[#28c840]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#28c840]">
                          LIVE ▶
                        </span>
                      )}
                    </div>
                    <p className="mb-3 text-left text-xs leading-relaxed text-white/65">
                      {project.description}
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/60"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </>
                );
                const className =
                  "rise-in group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/25 hover:bg-white/[0.07]";
                const style = { animationDelay: `${0.7 + i * 0.08}s` };

                return project.demoUrl ? (
                  <button
                    key={project.name}
                    type="button"
                    data-project-card
                    onClick={() => setDemo(project)}
                    className={`${className} cursor-pointer text-left`}
                    style={style}
                  >
                    {card}
                  </button>
                ) : (
                  <article key={project.name} data-project-card className={className} style={style}>
                    {card}
                  </article>
                );
              })}
            </div>
            <p className="px-5 pb-4 text-center text-[11px] text-white/30">
              有 LIVE ▶ 標籤的專案點下去可以直接操作 — 內容在 src/data/projects.ts
            </p>
          </>
        )}
      </WindowFrame>
    </div>
  );
}
