"use client";

import { useEffect, useRef, type ReactNode } from "react";

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Extra classes applied to the centered panel wrapper */
  className?: string;
  /** aria-label for the dialog */
  label: string;
}

/**
 * Fullscreen overlay shell: backdrop + centered panel.
 * Closes on backdrop click and Escape. Animation is left to callers
 * (GSAP targets the panel via data-overlay-panel).
 */
export function Overlay({ open, onClose, children, className, label }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div
        data-overlay-backdrop
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        data-overlay-panel
        className={`relative z-10 max-h-full overflow-auto ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
