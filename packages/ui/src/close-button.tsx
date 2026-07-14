"use client";

export interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseButton({ onClick, className }: CloseButtonProps) {
  return (
    <button
      type="button"
      aria-label="關閉"
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full bg-white/10 text-lg text-white/80 transition hover:rotate-90 hover:bg-white/20 hover:text-white ${className ?? ""}`}
    >
      ✕
    </button>
  );
}
