import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { resume, periodOf, type Bullet, type Experience } from "@/data/resume";
import { gmailComposeUrl } from "@/lib/links";

const GMAIL_COMPOSE = gmailComposeUrl("嗨 Tseng，看完你的履歷，想找你聊聊 👋");

/** 按鈕滑過時微微浮起,按下回彈 */
const LIFT = "transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";
const ARROW = "size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5";
const CARD = "rounded-2xl border border-ink-soft/10 bg-white/60";
const CHIP = "rounded-full bg-ink-soft/[0.07] px-2.5 py-1 text-[11px] font-medium text-ink-soft";

/** lucide 1.x 拿掉了品牌圖示,GitHub 與 Medium 自己畫 */
function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.62-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3" />
    </svg>
  );
}

function MediumMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12m7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12" />
    </svg>
  );
}

function TopBar() {
  const link = "transition hover:text-ink";
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 print:hidden">
      <span className="text-sm font-bold tracking-[0.28em] text-ink">{resume.nameEn}</span>
      <nav
        aria-label="其他頁面"
        className="order-last flex w-full items-center gap-5 text-sm text-ink-soft sm:order-none sm:ml-auto sm:w-auto"
      >
        <Link href="/" className={link}>
          回到空間
        </Link>
        <Link href="/making-of" className={link}>
          製作歷程
        </Link>
        <a href={resume.medium.url} target="_blank" rel="noreferrer" className={link}>
          Medium
        </a>
      </nav>
      <a
        href={GMAIL_COMPOSE}
        target="_blank"
        rel="noreferrer"
        className={`group inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream shadow-sm hover:shadow-md ${LIFT}`}
      >
        一起聊聊
        <ArrowUpRight className={ARROW} />
      </a>
    </header>
  );
}

function ContactCard() {
  const rows = [
    { label: "Email", value: resume.email, href: `mailto:${resume.email}`, icon: <Mail className="size-4" /> },
    { label: "GitHub", value: resume.github.label, href: resume.github.url, icon: <GitHubMark /> },
    { label: "Medium", value: resume.medium.label, href: resume.medium.url, icon: <MediumMark /> },
  ];
  return (
    <aside
      aria-label="聯絡方式"
      className="rise-in self-start rounded-3xl border border-ink-soft/15 bg-white/60 p-4 shadow-sm md:p-5"
      style={{ animationDelay: "0.08s" }}
    >
      <p className="px-2 text-[11px] font-bold tracking-[0.3em] text-ink-dim">CONTACT</p>
      <ul className="mt-2 flex flex-col">
        {rows.map((r) => (
          <li key={r.label}>
            <a
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-ink-soft/5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-soft text-ink-soft transition group-hover:bg-cream-dim group-hover:text-ink">
                {r.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-ink-dim">{r.label}</span>
                <span className="block truncate text-sm font-medium text-ink">{r.value}</span>
              </span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-ink-dim opacity-0 transition group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-center gap-1.5 px-2 text-xs text-ink-dim">
        <MapPin className="size-3.5" />
        {resume.location}
      </p>
      <a
        href={GMAIL_COMPOSE}
        target="_blank"
        rel="noreferrer"
        className={`group mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-ink py-2.5 text-sm font-medium text-cream shadow-sm hover:shadow-md print:hidden ${LIFT}`}
      >
        寫信給我
        <ArrowUpRight className={ARROW} />
      </a>
    </aside>
  );
}

function Section({ en, zh, children }: { en: string; zh: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-ink-soft/15 py-12 md:grid-cols-[150px_minmax(0,1fr)] md:gap-10 md:py-16">
      {/* 桌機版標題貼在左欄,捲動時跟著走 */}
      <div className="md:sticky md:top-8 md:self-start">
        <p className="text-[11px] font-bold tracking-[0.3em] text-ink-dim">{en}</p>
        <h2 className="mt-1 text-xl font-bold text-ink md:text-2xl">{zh}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: readonly Bullet[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {items.map((b) => {
        const [label, text] = typeof b === "string" ? [null, b] : b;
        return (
          <li key={text} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
            <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
            <span>
              {label && <strong className="font-bold text-ink">{label}：</strong>}
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function TimelineItem({ exp, last }: { exp: Experience; last: boolean }) {
  const current = !exp.end;
  return (
    <li className="relative pb-12 pl-8 last:pb-0 md:pl-10">
      {/* 時間軸的線,最後一段不往下畫 */}
      {!last && <span aria-hidden className="absolute -bottom-1 left-[7px] top-6 w-px bg-ink-soft/20" />}
      <span
        aria-hidden
        className={`absolute left-0 top-0.5 size-[15px] rounded-full border-2 ${
          current ? "border-accent bg-accent ring-4 ring-accent/20" : "border-ink-soft/35 bg-cream"
        }`}
      />

      <p className="flex flex-wrap items-center gap-2 text-xs font-semibold tabular-nums text-ink-dim">
        {periodOf(exp)}
        {current && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">NOW</span>
        )}
      </p>
      <h3 className="mt-1.5 text-lg font-bold text-ink md:text-xl">{exp.role}</h3>
      <p className="text-sm text-ink-soft">{exp.org}</p>

      {exp.intro && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{exp.intro}</p>}

      {exp.metrics && (
        <dl className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {exp.metrics.map((m) => (
            <div
              key={m.label}
              className={`${CARD} flex flex-col-reverse px-3.5 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
            >
              <dt className="mt-0.5 text-[11px] leading-snug text-ink-dim">{m.label}</dt>
              <dd className="text-lg font-bold text-ink md:text-xl">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {exp.bullets && <BulletList items={exp.bullets} />}

      {exp.groups && (
        <div className="mt-5 flex flex-col gap-3">
          {exp.groups.map((g) => (
            <div key={g.title} className={`${CARD} p-4 md:p-5`}>
              <h4 className="text-sm font-bold text-ink">{g.title}</h4>
              {g.stack && <p className="mt-1 text-[11px] text-ink-dim">{g.stack.join("・")}</p>}
              {g.intro && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{g.intro}</p>}
              {g.bullets && <BulletList items={g.bullets} />}
            </div>
          ))}
        </div>
      )}

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {exp.stack.map((s) => (
          <li key={s} className={CHIP}>
            {s}
          </li>
        ))}
      </ul>

      {exp.link && (
        <a
          href={exp.link.url}
          target="_blank"
          rel="noreferrer"
          className="group mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft underline decoration-ink-soft/30 underline-offset-4 transition hover:text-ink hover:decoration-ink"
        >
          {exp.link.label}
          <ArrowUpRight className={ARROW} />
        </a>
      )}
    </li>
  );
}

/**
 * 正式履歷:聯絡資訊放最上面,經歷用直式時間軸
 * 內容都在 data/resume.ts
 */
export function ResumeView() {
  const { experiences, education } = resume;

  return (
    <main className="min-h-dvh bg-cream text-ink print:bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <TopBar />

        {/* Hero:名字、職稱、摘要 + 聯絡卡 */}
        <section className="grid gap-8 pb-12 pt-6 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12 md:pb-16 md:pt-12">
          <div className="rise-in">
            <p className="text-[11px] font-bold tracking-[0.35em] text-ink-dim">RESUME</p>
            <h1 className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-4xl font-bold tracking-tight text-ink md:text-6xl">{resume.nameEn}</span>
              <span className="text-2xl font-medium text-ink-soft md:text-3xl">{resume.nameZh}</span>
            </h1>
            <p className="mt-4 text-base font-medium text-ink md:text-lg">{resume.headline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft md:text-[15px]">{resume.summary}</p>
          </div>
          <ContactCard />
        </section>

        <Section en="EXPERIENCE" zh="經歷">
          <ol>
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.id} exp={exp} last={i === experiences.length - 1} />
            ))}
          </ol>
        </Section>

        <Section en="SKILLS" zh="技能">
          <div className="grid gap-3 sm:grid-cols-2">
            {resume.skills.map((g) => (
              <div key={g.label} className={`${CARD} p-4`}>
                <h3 className="text-xs font-bold text-ink">{g.label}</h3>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <li key={item} className={CHIP}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section en="TEACHING" zh="教學與社群">
          <ul className="grid gap-3 sm:grid-cols-2">
            {resume.teaching.map((t) => (
              <li key={t.title} className={`${CARD} p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm md:p-5`}>
                <p className="text-2xl font-bold text-ink">{t.value}</p>
                <h3 className="mt-1 text-sm font-bold text-ink">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.desc}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section en="EDUCATION" zh="學歷與證照">
          <p className="text-xs font-semibold tabular-nums text-ink-dim">{periodOf(education)}</p>
          <p className="mt-1 text-base font-bold text-ink">
            {education.school}
            <span className="ml-2 font-normal text-ink-soft">{education.dept}</span>
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {resume.certificates.map((c) => (
              <li key={c.title}>
                {c.date && <p className="text-xs font-semibold tabular-nums text-ink-dim">{c.date}</p>}
                <p className="mt-1 text-sm font-bold text-ink">{c.title}</p>
                {c.desc && <p className="mt-0.5 text-sm text-ink-soft">{c.desc}</p>}
              </li>
            ))}
          </ul>
        </Section>

        {/* 收尾 CTA */}
        <section
          className={`${CARD} flex flex-col gap-5 rounded-3xl p-6 md:flex-row md:items-center md:justify-between md:p-8 print:hidden`}
        >
          <div>
            <h2 className="text-xl font-bold text-ink md:text-2xl">看到這裡，不如聊聊？</h2>
            <p className="mt-1.5 text-sm text-ink-soft">工作機會、專案合作，或只是想交換歌單，都歡迎寫信給我。</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={GMAIL_COMPOSE}
              target="_blank"
              rel="noreferrer"
              className={`group inline-flex items-center gap-1 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream shadow-sm hover:shadow-md ${LIFT}`}
            >
              寫信給我
              <ArrowUpRight className={ARROW} />
            </a>
            <Link
              href="/"
              className={`inline-flex items-center rounded-full border border-ink-soft/25 px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink-soft/5 hover:text-ink ${LIFT}`}
            >
              回到空間
            </Link>
          </div>
        </section>

        <footer className="flex flex-wrap justify-between gap-2 py-8 text-xs text-ink-dim">
          <span>© 2026 Tseng Fu Chun</span>
          <span>最後更新 2026/10</span>
        </footer>
      </div>
    </main>
  );
}
