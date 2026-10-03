"use client";

import { books } from "@/data/books";
import { FullPage } from "./full-page";

/** 點背包 → 人生指南:近期讀過、喜歡到想推薦的書 */
export function BooksOverlay() {
  return (
    <FullPage eyebrow="BOOKS" title="人生指南" subtitle="最近讀過、喜歡到想塞給別人的書">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-10 md:py-10">
        <ul className="grid gap-5 sm:grid-cols-2">
          {books.map((book, i) => (
            <li
              key={book.title}
              className="rise-in flex gap-4 rounded-2xl border border-ink-soft/15 bg-white/60 p-5 transition duration-200 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_10px_30px_rgba(74,60,48,.12)]"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              {/* 書封:一點點歪,滑過時擺正 */}
              <div
                className="flex h-32 w-24 shrink-0 items-end rounded-r-md rounded-l-sm p-2 shadow-md transition duration-300"
                style={{ background: book.cover, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
              >
                <p className="text-[11px] font-bold leading-tight text-black/70">{book.title}</p>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold">{book.title}</h3>
                <p className="mb-2 text-xs text-ink-dim">{book.author}</p>
                <p className="text-sm leading-relaxed text-ink-soft">{book.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-ink-dim">看完會再補上來，慢慢讀</p>
      </div>
    </FullPage>
  );
}
