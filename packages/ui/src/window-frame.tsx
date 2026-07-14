"use client";

import type { ReactNode } from "react";

export interface WindowFrameProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

/** macOS-style window chrome used inside the computer screen & overlays. */
export function WindowFrame({ title, children, onClose, className }: WindowFrameProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1c1d26] shadow-2xl ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#26273a] px-4 py-2.5">
        <span className="flex gap-1.5">
          <button
            type="button"
            aria-label="關閉視窗"
            onClick={onClose}
            className="size-3 rounded-full bg-[#ff5f57] transition hover:brightness-110"
          />
          <i className="size-3 rounded-full bg-[#febc2e]" />
          <i className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <p className="flex-1 text-center font-mono text-xs text-white/50">{title}</p>
        <span className="w-[52px]" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
