import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Mail, MapPin } from "lucide-react";
import {
  RESUME_LANGS,
  RESUME_UI,
  periodOf,
  type Bullet,
  type Experience,
  type Metric,
  type Profile,
  type Resume,
  type ResumeCopy,
  type ResumeLang,
  type Skill,
  type SkillGroup,
} from "@/data/resume";
import { gmailComposeUrl } from "@/lib/links";
import { MetricIconView, SkillLogo } from "./resume-icons";
import { RoleBlock } from "./role-block";

/** 按鈕滑過時微微浮起,按下回彈 */
const LIFT = "transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";
const ARROW = "size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5";
const CARD = "rounded-2xl border border-ink-soft/10 bg-white/60";
const CHIP = "rounded-full bg-ink-soft/[0.07] px-2.5 py-1 text-[11px] font-medium text-ink-soft";

/** 技能標籤:有官方 Logo 的放在文字前面 */
function SkillChip({ skill }: { skill: Skill }) {
  return (
    <span className={`group/chip inline-flex items-center gap-1.5 ${CHIP}`}>
      <SkillLogo slug={skill.logo} />
      {skill.name}
    </span>
  );
}

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
function TopBar({ profile, lang, t }: { profile: Profile; lang: ResumeLang; t: ResumeCopy }) {
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
        <a href={profile.contacts.medium.url} target="_blank" rel="noreferrer" className={link}>
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

/** 右上角的語言切換:中文 /resume、英文 /resume/en、韓文 /resume/ko */
function LangSwitch({ lang, label }: { lang: ResumeLang; label: string }) {
  return (
    <nav aria-label={label} className="flex rounded-full border border-ink-soft/20 bg-white/60 p-0.5 text-xs font-medium">
      {(Object.keys(RESUME_LANGS) as ResumeLang[]).map((key) => (
        <Link
          key={key}
          href={RESUME_LANGS[key].href}
          hrefLang={RESUME_LANGS[key].htmlLang}
          aria-current={key === lang ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 transition ${key === lang ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"}`}
        >
          {RESUME_LANGS[key].text}
        </Link>
      ))}
    </nav>
  );
}

function ContactCard({ profile, t }: { profile: Profile; t: ResumeCopy }) {
  const { email, github, medium } = profile.contacts;
  const rows = [
    { label: "Email", value: email, href: `mailto:${email}`, icon: <Mail className="size-4" /> },
    { label: "GitHub", value: github.label, href: github.url, icon: <GitHubMark /> },
    { label: "Medium", value: medium.label, href: medium.url, icon: <MediumMark /> },
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
        {profile.location}
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

function Section({
  en,
  title,
  stacked = false,
  children,
}: {
  en: string;
  title: string;
  /** 標題放在上面整排(左欄要留給內容用的時候) */
  stacked?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`grid gap-5 border-t border-ink-soft/15 py-12 md:gap-10 md:py-16 ${
        stacked ? "" : "md:grid-cols-[150px_minmax(0,1fr)]"
      }`}
    >
      {/* 桌機版標題貼在左欄,捲動時跟著走 */}
      <div className={stacked ? "" : "md:sticky md:top-8 md:self-start"}>
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
      {items.map(({ label, text }) => {
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

/** 數字卡片:左上角一個圖示(或插圖),下面是數字與說明 */
function MetricCards({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`${CARD} flex flex-col px-3.5 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
        >
          {m.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- 插圖網址由資料決定,可能是外部圖床
            <img src={m.image} alt="" className="mb-2 h-12 w-auto self-start object-contain" />
          ) : (
            <span
              aria-hidden
              className="mb-2.5 grid size-9 place-items-center rounded-xl bg-accent/10 text-accent"
            >
              <MetricIconView name={m.icon} className="size-[18px]" />
            </span>
          )}
          <dd className="text-lg font-bold text-ink md:text-xl">{m.value}</dd>
          <dt className="mt-0.5 text-[11px] leading-snug text-ink-dim">{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function StackChips({ stack }: { stack: readonly string[] }) {
  return (
    <ul className="mt-2.5 flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <li key={s} className={CHIP}>
          {s}
        </li>
      ))}
    </ul>
  );
}

/** 期間、職稱、公司;收合時整塊變灰 */
function RoleHeader({ exp, t }: { exp: Experience; t: ResumeCopy }) {
  const current = !exp.end;
  const dim = "group-data-[open=false]/role:text-ink-dim/70";
  return (
    <>
      <span className={`flex flex-wrap items-center gap-2 text-xs font-semibold tabular-nums text-ink-dim ${dim}`}>
        {periodOf(exp, t.present)}
        {current && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
            NOW
          </span>
        )}
      </span>
      <span
        className={`mt-1.5 block text-lg font-bold text-ink transition-colors group-hover/btn:text-ink md:text-xl ${dim}`}
      >
        {exp.role}
      </span>
      <span className={`block text-sm font-normal text-ink-soft ${dim}`}>{exp.org}</span>
    </>
  );
}

/** 展開後的內容:數字卡片、亮點,再往下是「看完整經歷」 */
function RoleBody({ exp, t, colon }: { exp: Experience; t: ResumeCopy; colon: string }) {
  const hasMore = Boolean(exp.intro || exp.bullets?.length || exp.groups?.length || exp.link);
  return (
    <>
      {exp.metrics && <MetricCards metrics={exp.metrics} />}
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
    </>
  );
}

/** 時間軸上的圓點:現職實心,其他空心;收合時更淡 */
function RoleDot({ current }: { current: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute left-0 top-0.5 size-[15px] rounded-full border-2 transition-colors ${
        current
          ? "border-accent bg-accent ring-4 ring-accent/20"
          : "border-ink-soft/45 bg-cream group-data-[open=false]/role:border-ink-soft/20 group-data-[open=false]/role:bg-cream-dim"
      }`}
    />
  );
}

/** 版型一:直式時間軸,技能標籤跟內容都在職稱下面 */
function TimelineItem({ exp, last, t, colon }: { exp: Experience; last: boolean; t: ResumeCopy; colon: string }) {
  return (
    <li className="relative pb-10 pl-8 last:pb-0 md:pl-10">
      {/* 時間軸的線,最後一段不往下畫 */}
      {!last && <span aria-hidden className="absolute -bottom-1 left-[7px] top-6 w-px bg-ink-soft/20" />}
      <RoleBlock
        collapsible={!exp.featured}
        dot={<RoleDot current={!exp.end} />}
        header={<RoleHeader exp={exp} t={t} />}
      >
        {/* 技術標籤緊跟在職稱下面,一眼看出這份工作用什麼 */}
        <StackChips stack={exp.stack} />
        <RoleBody exp={exp} t={t} colon={colon} />
      </RoleBlock>
    </li>
  );
}

/** 版型二:左欄放期間、職稱與重點技能,右欄只放描述跟數字卡片 */
function SplitItem({ exp, last, t, colon }: { exp: Experience; last: boolean; t: ResumeCopy; colon: string }) {
  return (
    <li className="relative pb-10 last:pb-0">
      {!last && <span aria-hidden className="absolute -bottom-1 left-[7px] top-6 w-px bg-ink-soft/20" />}
      <RoleBlock
        collapsible={!exp.featured}
        className="grid gap-x-10 md:grid-cols-[240px_minmax(0,1fr)]"
        // 左欄捲動時貼著,圓點會沿著線往下走;右欄第一個區塊跟職稱對齊
        leftClassName="relative pl-8 md:sticky md:top-8 md:self-start"
        bodyClassName="pl-8 md:pl-0 md:[&>*:first-child]:mt-0"
        dot={<RoleDot current={!exp.end} />}
        header={<RoleHeader exp={exp} t={t} />}
        aside={<StackChips stack={exp.stack} />}
      >
        <RoleBody exp={exp} t={t} colon={colon} />
      </RoleBlock>
    </li>
  );
}

/** 技能:規格表 —— 左邊類別、右邊標籤(有官方 Logo 的放在前面),一行一類,像產品規格 */
function SkillsSpec({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <dl className="divide-y divide-ink-soft/10 border-y border-ink-soft/10">
      {groups.map((g) => (
        <div key={g.id} className="grid gap-2 py-3.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
          <dt className="text-sm font-bold text-ink sm:pt-1">{g.label}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {g.items.map((skill) => (
              <SkillChip key={skill.name} skill={skill} />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** 經歷的排版:timeline = 直式時間軸(預設);split = 左欄職稱與技能、右欄描述與卡片 */
export type ExperienceLayout = "timeline" | "split";

/**
 * 正式履歷:聯絡資訊放最上面,接著經歷、技能、教學與學歷
 * 畫面只吃傳進來的資料(來源見 data/resume/index.ts 的 getResume),不寫死任何內容
 * 重點經歷(featured)一直展開,其他的先收合成灰色,點了才打開
 */
export function ResumeView({
  data,
  lang,
  layout = "timeline",
}: {
  data: Resume;
  lang: ResumeLang;
  layout?: ExperienceLayout;
}) {
  const t = RESUME_UI[lang];
  const colon = lang === "zh" ? "：" : ": ";
  const { profile, experiences, education } = data;
  const Item = layout === "split" ? SplitItem : TimelineItem;

  return (
    <main lang={RESUME_LANGS[lang].htmlLang} className="min-h-dvh bg-cream text-ink print:bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <TopBar profile={profile} lang={lang} t={t} />

        {/* Hero:名字、職稱、摘要 + 聯絡卡 */}
        <section className="grid gap-8 pb-12 pt-6 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12 md:pb-16 md:pt-10">
          <div className="rise-in">
            {/* 中英文名字同樣大小 */}
            <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-4xl font-bold tracking-tight text-ink md:text-6xl">
              <span>{profile.nameEn}</span>
              <span>{profile.nameZh}</span>
            </h1>
            <p className="mt-4 text-base font-medium text-ink md:text-lg">{profile.headline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft md:text-[15px]">{profile.summary}</p>
          </div>
          <ContactCard profile={profile} t={t} />
        </section>

        <Section en="EXPERIENCE" title={t.experience} stacked={layout === "split"}>
          <ol>
            {experiences.map((exp, i) => (
              <Item key={exp.id} exp={exp} last={i === experiences.length - 1} t={t} colon={colon} />
            ))}
          </ol>
        </Section>

        <Section en="SKILLS" title={t.skills}>
          <SkillsSpec groups={data.skills} />
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
