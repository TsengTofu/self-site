"use client";

import { profile } from "@/data/profile";

/** 手機裡的 Profile App — 簡易履歷。內容來源:src/data/profile.ts */
export function ProfileApp() {
  return (
    <div className="flex flex-col gap-5 p-5 text-white">
      <header className="flex items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#7c9ef8] to-[#e8a0bf] text-2xl font-bold">
          {profile.name.slice(0, 1)}
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {profile.name}
            <span className="font-hand ml-2 text-lg text-white/60">{profile.koreanName}</span>
          </h2>
          <p className="text-sm text-[#7c9ef8]">{profile.title}</p>
          <p className="text-xs text-white/50">{profile.location}</p>
        </div>
      </header>

      <p className="rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-white/80">
        {profile.tagline}
      </p>

      <section>
        <h3 className="mb-2 text-xs font-bold tracking-widest text-white/40">SKILLS</h3>
        <ul className="flex flex-wrap gap-1.5">
          {profile.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/85"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-white/40">EXPERIENCE</h3>
        <ol className="flex flex-col gap-4 border-l border-white/15 pl-4">
          {profile.experiences.map((exp) => (
            <li key={exp.company} className="relative">
              <span className="absolute -left-[21.5px] top-1.5 size-2.5 rounded-full bg-[#e8a0bf]" />
              <p className="text-sm font-bold">
                {exp.company}
                <span className="ml-2 font-normal text-white/60">{exp.role}</span>
              </p>
              <p className="mb-1 text-xs text-white/40">{exp.period}</p>
              <ul className="flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed text-white/75">
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

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
