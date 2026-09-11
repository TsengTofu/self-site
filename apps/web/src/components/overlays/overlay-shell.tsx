"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Overlay } from "@self-site/ui/overlay";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

interface OverlayShellProps {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * 帶「從被點擊物件飛出來」動畫的 overlay 外殼。
 * 動畫起點來自 scene store 的 origin(點擊物件的 DOMRect)。
 */
export function OverlayShell({ label, onClose, children, className }: OverlayShellProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const origin = useSceneStore((s) => s.origin);

  useGSAP(
    () => {
      const panel = wrapRef.current?.querySelector("[data-overlay-panel]");
      const backdrop = wrapRef.current?.querySelector("[data-overlay-backdrop]");
      if (!panel) return;
      // 減少動態:直接出現,不做進場動畫
      if (prefersReducedMotion()) return;

      if (backdrop) {
        gsap.from(backdrop, { opacity: 0, duration: 0.35, ease: "power2.out" });
      }

      if (origin) {
        const rect = (panel as HTMLElement).getBoundingClientRect();
        const dx = origin.left + origin.width / 2 - (rect.left + rect.width / 2);
        const dy = origin.top + origin.height / 2 - (rect.top + rect.height / 2);
        gsap.from(panel, {
          x: dx,
          y: dy,
          scale: 0.2,
          opacity: 0,
          duration: 0.65,
          ease: "back.out(1.3)",
        });
      } else {
        gsap.from(panel, { scale: 0.9, opacity: 0, y: 24, duration: 0.45, ease: "power3.out" });
      }
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef}>
      <Overlay open onClose={onClose} label={label} className={className}>
        {children}
      </Overlay>
    </div>
  );
}
