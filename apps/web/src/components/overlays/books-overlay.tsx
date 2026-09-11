"use client";

import { books } from "@/data/books";
import { useSceneStore } from "@/stores/scene-store";
import { OverlayShell } from "./overlay-shell";
import { CloseButton } from "@self-site/ui/close-button";

/** 點背包 → 近期讀過、喜歡到想推薦的書。 */
export function BooksOverlay() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);

  return (
    <OverlayShell label="書單" onClose={closeOverlay} className="w-full max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl">
        <header className="flex items-center gap-3 border-b border-white/10 p-4">
          <span className="text-2xl">🎒</span>
          <div className="flex-1">
            <h2 className="font-bold text-white">背包裡的書</h2>
            <p className="text-xs text-white/50">最近讀過、喜歡到想塞給別人的</p>
          </div>
          <CloseButton onClick={closeOverlay} />
        </header>

        <ul className="grid gap-4 p-5 sm:grid-cols-2">
          {books.map((book, i) => (
            <li key={book.title} className="flex gap-3.5">
              <div
                className="flex h-28 w-20 shrink-0 rotate-[-2deg] items-end rounded-r-md rounded-l-sm p-2 shadow-lg transition hover:rotate-0"
                style={{ background: book.cover, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
              >
                <p className="text-[11px] font-bold leading-tight text-black/70">{book.title}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white">{book.title}</h3>
                <p className="mb-1.5 text-xs text-white/60">{book.author}</p>
                <p className="text-xs leading-relaxed text-white/70">{book.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="px-5 pb-4 text-center text-[11px] text-white/60">看完會再補上來,慢慢讀</p>
      </div>
    </OverlayShell>
  );
}
