"use client";

import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";

/** Profile app 只放精選幾顆技能,完整清單留給履歷頁 */
const FEATURED_SKILLS = profile.skills.slice(0, 6);

/**
 * 手機裡的 Profile App — 摘要版:頭像/名字/title/tagline/精選技能 + 「完整履歷 →」。
 * 完整職涯時間軸搬去獨立頁面 /resume 發揚光大。內容來源:src/data/profile.ts
 */
export function ProfileApp() {
  return (
    <div className="flex flex-col gap-5 p-5 text-white">
      <header className="flex items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-2xl font-bold">
          {profile.name.slice(0, 1)}
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {profile.name}
            <span className="font-hand ml-2 text-lg text-white/60">{profile.koreanName}</span>
          </h2>
          <p className="text-sm text-accent">{profile.title}</p>
          <p className="text-xs text-white/50">{profile.location}</p>
        </div>
      </header>

      <p className="rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-white/80">
        {profile.tagline}
      </p>

      <section>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-white/60">SKILLS</h3>
        <ul className="flex flex-wrap gap-1.5">
          {FEATURED_SKILLS.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/85"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* 完整履歷:導去獨立的互動式時間軸頁面 */}
      <a
        href="/resume"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-soft py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
      >
        完整履歷
        <ArrowRight className="size-4" />
      </a>

      <section className="flex gap-2">
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl bg-white/10 py-2 text-center text-sm font-medium transition hover:bg-white/20"
          >
            {link.label}
          </a>
        ))}
      </section>
    </div>
  );
}
