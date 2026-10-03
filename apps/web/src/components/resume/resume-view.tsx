import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Code2,
  Database,
  FlaskConical,
  Languages,
  Mail,
  MapPin,
  Palette,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { periodOf, type Bullet, type Experience, type Resume, type SkillGroup } from "@/data/resume";
import { gmailComposeUrl } from "@/lib/links";

export type ResumeLang = "zh" | "en";

/** 介面上的固定文字(履歷內容在 data/resume*.ts) */
const UI = {
  zh: {
    home: "回到空間",
    makingOf: "製作歷程",
    chat: "一起聊聊",
    mail: "寫信給我",
    contact: "聯絡方式",
    pages: "其他頁面",
    language: "切換語言",
    experience: "經歷",
    skills: "技能",
    teaching: "教學與社群",
    education: "學歷與證照",
    present: "現在",
    more: "看完整經歷",
    less: "收起",
    skillsA: "試用版本 A：規格表",
    skillsB: "試用版本 B：Bento 卡片",
    updated: "最後更新 2026/10",
    subject: "嗨 Tseng，看完你的履歷，想找你聊聊",
  },
  en: {
    home: "Back to my space",
    makingOf: "Making of",
    chat: "Let's talk",
    mail: "Email me",
    contact: "Contact",
    pages: "Other pages",
    language: "Switch language",
    experience: "Experience",
    skills: "Skills",
    teaching: "Teaching & community",
    education: "Education & certificates",
    present: "Present",
    more: "Show full details",
    less: "Show less",
    skillsA: "Draft A: spec sheet",
    skillsB: "Draft B: bento cards",
    updated: "Last updated Oct 2026",
    subject: "Hi Tseng, I read your resume and would love to chat",
  },
} as const;

type Copy = (typeof UI)[ResumeLang];

/** 按鈕滑過時微微浮起,按下回彈 */
const LIFT = "transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";
const ARROW = "size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5";
const CARD = "rounded-2xl border border-ink-soft/10 bg-white/60";
const CHIP = "rounded-full bg-ink-soft/[0.07] px-2.5 py-1 text-[11px] font-medium text-ink-soft";

/** 技能分組的圖示(Bento 版用) */
const SKILL_ICON: Record<SkillGroup["id"], LucideIcon> = {
  framework: Code2,
  data: Database,
  style: Palette,
  test: FlaskConical,
  tooling: Wrench,
  ai: Sparkles,
  collab: Users,
  viz: BarChart3,
  lang: Languages,
};

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

/** 頂部列:左邊是其他頁面,右邊是聯絡與語言切換;名字不放這裡,hero 已經有了 */
function TopBar({ data, lang, t }: { data: Resume; lang: ResumeLang; t: Copy }) {
  const link = "transition hover:text-ink";
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 print:hidden">
      <nav aria-label={t.pages} className="flex items-center gap-5 text-sm text-ink-soft">
        <Link href="/" className={link}>
          {t.home}
        </Link>
        <Link href="/making-of" className={link}>
          {t.makingOf}
        </Link>
        <a href={data.medium.url} target="_blank" rel="noreferrer" className={link}>
          Medium
        </a>
      </nav>
      <div className="flex items-center gap-2.5">
        <a
          href={gmailComposeUrl(t.subject)}
          target="_blank"
          rel="noreferrer"
          className={`group inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream shadow-sm hover:shadow-md ${LIFT}`}
        >
          {t.chat}
          <ArrowUpRight className={ARROW} />
        </a>
        <LangSwitch lang={lang} label={t.language} />
      </div>
    </header>
  );
}

/** 右上角的語言切換:中文 /resume、英文 /resume/en */
function LangSwitch({ lang, label }: { lang: ResumeLang; label: string }) {
  const options = [
    { lang: "zh", href: "/resume", text: "中文" },
    { lang: "en", href: "/resume/en", text: "EN" },
  ] as const;
  return (
    <nav aria-label={label} className="flex rounded-full border border-ink-soft/20 bg-white/60 p-0.5 text-xs font-medium">
      {options.map((o) => (
        <Link
          key={o.lang}
          href={o.href}
          hrefLang={o.lang === "zh" ? "zh-Hant" : "en"}
          aria-current={o.lang === lang ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 transition ${
            o.lang === lang ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
          }`}
        >
          {o.text}
        </Link>
      ))}
    </nav>
  );
}

function ContactCard({ data, t }: { data: Resume; t: Copy }) {
  const rows = [
    { label: "Email", value: data.email, href: `mailto:${data.email}`, icon: <Mail className="size-4" /> },
    { label: "GitHub", value: data.github.label, href: data.github.url, icon: <GitHubMark /> },
    { label: "Medium", value: data.medium.label, href: data.medium.url, icon: <MediumMark /> },
  ];
  return (
    <aside
      aria-label={t.contact}
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
        {data.location}
      </p>
      <a
        href={gmailComposeUrl(t.subject)}
        target="_blank"
        rel="noreferrer"
        className={`group mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-ink py-2.5 text-sm font-medium text-cream shadow-sm hover:shadow-md print:hidden ${LIFT}`}
      >
        {t.mail}
        <ArrowUpRight className={ARROW} />
      </a>
    </aside>
  );
}

function Section({ en, title, children }: { en: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-ink-soft/15 py-12 md:grid-cols-[150px_minmax(0,1fr)] md:gap-10 md:py-16">
      {/* 桌機版標題貼在左欄,捲動時跟著走 */}
      <div className="md:sticky md:top-8 md:self-start">
        <p className="text-[11px] font-bold tracking-[0.3em] text-ink-dim">{en}</p>
        <h2 className="mt-1 text-xl font-bold text-ink md:text-2xl">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function BulletList({ items, colon }: { items: readonly Bullet[]; colon: string }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {items.map((b) => {
        const [label, text] = typeof b === "string" ? [null, b] : b;
        return (
          <li key={text} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
            <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
            <span>
              {label && (
                <strong className="font-bold text-ink">
                  {label}
                  {colon}
                </strong>
              )}
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function TimelineItem({ exp, last, t, colon }: { exp: Experience; last: boolean; t: Copy; colon: string }) {
  const current = !exp.end;
  const hasMore = Boolean(exp.intro || exp.bullets?.length || exp.groups?.length || exp.link);
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
        {periodOf(exp, t.present)}
        {current && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">NOW</span>
        )}
      </p>
      <h3 className="mt-1.5 text-lg font-bold text-ink md:text-xl">{exp.role}</h3>
      <p className="text-sm text-ink-soft">{exp.org}</p>
      {/* 技術標籤緊跟在職稱下面,一眼看出這份工作用什麼 */}
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {exp.stack.map((s) => (
          <li key={s} className={CHIP}>
            {s}
          </li>
        ))}
      </ul>

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

      {/* 收合時只看最重要的亮點 */}
      <BulletList items={exp.highlights} colon={colon} />

      {hasMore && (
        <details className="group mt-4">
          <summary
            className={`inline-flex cursor-pointer list-none items-center gap-1 rounded-full border border-ink-soft/20 px-3.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-ink-soft/5 hover:text-ink [&::-webkit-details-marker]:hidden ${LIFT}`}
          >
            <span className="group-open:hidden">{t.more}</span>
            <span className="hidden group-open:inline">{t.less}</span>
            <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden />
          </summary>

          <div className="mt-2">
            {exp.intro && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{exp.intro}</p>}
            {exp.bullets && <BulletList items={exp.bullets} colon={colon} />}
            {exp.groups && (
              <div className="mt-5 flex flex-col gap-3">
                {exp.groups.map((g) => (
                  <div key={g.title} className={`${CARD} p-4 md:p-5`}>
                    <h4 className="text-sm font-bold text-ink">{g.title}</h4>
                    {g.stack && <p className="mt-1 text-[11px] text-ink-dim">{g.stack.join("・")}</p>}
                    {g.intro && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{g.intro}</p>}
                    {g.bullets && <BulletList items={g.bullets} colon={colon} />}
                  </div>
                ))}
              </div>
            )}
            {exp.link && (
              <a
                href={exp.link.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft underline decoration-ink-soft/30 underline-offset-4 transition hover:text-ink hover:decoration-ink"
              >
                {exp.link.label}
                <ArrowUpRight className={ARROW} />
              </a>
            )}
          </div>
        </details>
      )}
    </li>
  );
}

/** 🧪 技能版本 A:規格表 —— 左邊類別、右邊標籤,一行一類,像產品規格 */
function SkillsSpec({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <dl className="divide-y divide-ink-soft/10 border-y border-ink-soft/10">
      {groups.map((g) => (
        <div key={g.id} className="grid gap-2 py-3.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
          <dt className="text-sm font-bold text-ink">{g.label}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {g.items.map((item) => (
              <span key={item} className={CHIP}>
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Bento 的排法:重點類別佔兩格,三欄剛好排滿四列(AI 工程與協作是想強調的兩塊) */
const BENTO_ORDER: { id: SkillGroup["id"]; wide?: true }[] = [
  { id: "ai", wide: true },
  { id: "framework" },
  { id: "data" },
  { id: "style" },
  { id: "test" },
  { id: "tooling", wide: true },
  { id: "viz" },
  { id: "collab", wide: true },
  { id: "lang" },
];

/** 🧪 技能版本 B:Bento 卡片 —— 每類一張卡配圖示,重點類別放大 */
function SkillsBento({ groups }: { groups: readonly SkillGroup[] }) {
  const byId = new Map(groups.map((g) => [g.id, g]));
  return (
    <ul className="grid grid-flow-dense gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {BENTO_ORDER.map(({ id, wide }) => {
        const g = byId.get(id);
        if (!g) return null;
        const Icon = SKILL_ICON[g.id];
        const featured = g.id === "ai" || g.id === "collab";
        return (
          <li
            key={g.id}
            className={`${CARD} p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${wide ? "sm:col-span-2" : ""} ${
              featured ? "border-accent/30 bg-gradient-to-br from-white/80 to-accent/10" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`grid size-8 place-items-center rounded-xl ${featured ? "bg-accent/15 text-accent" : "bg-ink-soft/[0.07] text-ink-soft"}`}>
                <Icon className="size-4" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="text-sm font-bold text-ink">{g.label}</h3>
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <li key={item} className={CHIP}>
                  {item}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

/** 兩版技能並排給站主比較時的小標籤,選定後拿掉 */
function DraftLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 inline-flex rounded-full border border-dashed border-ink-soft/30 px-2.5 py-0.5 text-[11px] text-ink-dim">
      {children}
    </p>
  );
}

/**
 * 正式履歷:聯絡資訊放最上面,經歷用直式時間軸(收合時只看亮點)
 * 中文與英文共用這個版型,內容在 data/resume.ts 與 data/resume.en.ts
 */
export function ResumeView({ data, lang }: { data: Resume; lang: ResumeLang }) {
  const t = UI[lang];
  const colon = lang === "zh" ? "：" : ": ";
  const { experiences, education } = data;

  return (
    <main lang={lang === "zh" ? "zh-Hant" : "en"} className="min-h-dvh bg-cream text-ink print:bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <TopBar data={data} lang={lang} t={t} />

        {/* Hero:名字、職稱、摘要 + 聯絡卡 */}
        <section className="grid gap-8 pb-12 pt-6 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12 md:pb-16 md:pt-10">
          <div className="rise-in">
            {/* 中英文名字同樣大小 */}
            <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-4xl font-bold tracking-tight text-ink md:text-6xl">
              <span>{data.nameEn}</span>
              <span>{data.nameZh}</span>
            </h1>
            <p className="mt-4 text-base font-medium text-ink md:text-lg">{data.headline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft md:text-[15px]">{data.summary}</p>
          </div>
          <ContactCard data={data} t={t} />
        </section>

        <Section en="EXPERIENCE" title={t.experience}>
          <ol>
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.id} exp={exp} last={i === experiences.length - 1} t={t} colon={colon} />
            ))}
          </ol>
        </Section>

        <Section en="SKILLS" title={t.skills}>
          <DraftLabel>{t.skillsA}</DraftLabel>
          <SkillsSpec groups={data.skills} />
          <div className="mt-10">
            <DraftLabel>{t.skillsB}</DraftLabel>
            <SkillsBento groups={data.skills} />
          </div>
        </Section>

        <Section en="TEACHING" title={t.teaching}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.teaching.map((item) => (
              <li key={item.title} className={`${CARD} p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm md:p-5`}>
                <p className="text-2xl font-bold text-ink">{item.value}</p>
                <h3 className="mt-1 text-sm font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section en="EDUCATION" title={t.education}>
          <p className="text-xs font-semibold tabular-nums text-ink-dim">{periodOf(education, t.present)}</p>
          <p className="mt-1 text-base font-bold text-ink">
            {education.school}
            <span className="ml-2 font-normal text-ink-soft">{education.dept}</span>
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {data.certificates.map((c) => (
              <li key={c.title}>
                {c.date && <p className="text-xs font-semibold tabular-nums text-ink-dim">{c.date}</p>}
                <p className="mt-1 text-sm font-bold text-ink">{c.title}</p>
                {c.desc && <p className="mt-0.5 text-sm text-ink-soft">{c.desc}</p>}
              </li>
            ))}
          </ul>
        </Section>

        <footer className="flex flex-wrap justify-between gap-2 border-t border-ink-soft/15 py-8 text-xs text-ink-dim">
          <span>© 2026 Tseng Fu Chun</span>
          <span>{t.updated}</span>
        </footer>
      </div>
    </main>
  );
}
