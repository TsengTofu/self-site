"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, House } from "lucide-react";
import { PAGES, ROOM_LINKS, type PageId } from "@/lib/site-map";
import { useMockVariant } from "@/lib/mock-variant";

/**
 * 🧪 MOCK:入口以外頁面的 header 提案,網址加 ?headerv= 切換,沒帶就是各頁原本的 header
 * - back:房間是中心,每頁只留「回房間」和頁名(輻射狀,從房間進出)
 * - nav:三個獨立頁面平行排開,彼此可以直接切換(扁平)
 * - crumb:麵包屑「나의 공간 / 履歷」,點開是整份網站地圖(階層)
 * 選定後:各頁改用選中的版本,刪掉其他版本與 HeaderSwitch
 */
type HeaderVariant = "back" | "nav" | "crumb";
const VARIANTS: HeaderVariant[] = ["back", "nav", "crumb"];

interface HeaderProps {
  current: Exclude<PageId, "home">;
  /** 頁面本身的底色:dark = 滑板頁 */
  tone?: "light" | "dark";
  /** 浮在內容上(製作歷程是整頁捲動的面板,header 要固定在畫面上) */
  floating?: boolean;
  /** 右邊放這頁自己的按鈕(例如履歷的語言切換) */
  actions?: ReactNode;
}

const TONES = {
  light: {
    bar: "border-ink-soft/15 bg-cream/85 text-ink",
    dim: "text-ink-soft hover:text-ink",
    chip: "hover:bg-ink-soft/10",
    active: "bg-ink text-cream",
    panel: "border-ink-soft/15 bg-cream text-ink",
  },
  dark: {
    bar: "border-white/15 bg-[#161514]/80 text-[#f5f1ea]",
    dim: "text-white/60 hover:text-white",
    chip: "hover:bg-white/10",
    active: "bg-[#f5f1ea] text-[#161514]",
    panel: "border-white/15 bg-[#1f1d1b] text-[#f5f1ea]",
  },
};

const pageOf = (id: PageId) => PAGES.find((p) => p.id === id)!;
const SUB_PAGES = PAGES.filter((p) => p.id !== "home");

/** 沒帶 ?headerv 就顯示各頁原本的 header(children) */
export function HeaderSwitch({ children, ...props }: HeaderProps & { children: ReactNode }) {
  const v = useMockVariant("headerv");
  return VARIANTS.includes(v as HeaderVariant) ? (
    <SiteHeader {...props} variant={v as HeaderVariant} />
  ) : (
    <>{children}</>
  );
}

function SiteHeader({
  current,
  tone = "light",
  floating = false,
  actions,
  variant,
}: HeaderProps & { variant: HeaderVariant }) {
  const c = TONES[tone];
  const page = pageOf(current);
  const position = floating ? "fixed inset-x-3 top-3 z-30 md:inset-x-6" : "sticky top-3 z-30 my-3";
  const link = `rounded-full px-3 py-1.5 text-sm font-medium transition ${c.chip}`;

  return (
    <header
      className={`${position} flex items-center gap-2 rounded-full border p-1.5 shadow-sm backdrop-blur print:hidden ${c.bar}`}
    >
      {variant === "back" && (
        <>
          <Link href="/" className={`inline-flex shrink-0 items-center gap-1.5 ${link}`}>
            <ArrowLeft className="size-4" aria-hidden />
            房間
          </Link>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-bold">{page.label}</p>
        </>
      )}

      {variant === "nav" && (
        <>
          <Link href="/" className={`inline-flex shrink-0 items-center gap-1.5 font-hand ${link}`}>
            <House className="size-4" aria-hidden />
            <span className="hidden sm:inline">나의 공간</span>
          </Link>
          {/* 三個獨立頁面平排,目前這頁反白;手機放不下就左右滑 */}
          <nav
            aria-label="網站頁面"
            className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]"
          >
            {SUB_PAGES.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                aria-current={p.id === current ? "page" : undefined}
                className={`shrink-0 ${link} ${p.id === current ? c.active : c.dim}`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      {variant === "crumb" && <Crumb current={current} tone={tone} />}

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

/** 麵包屑:나의 공간 / 目前頁面 ▾,點開是整份網站地圖 */
function Crumb({ current, tone }: { current: HeaderProps["current"]; tone: "light" | "dark" }) {
  const c = TONES[tone];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // 點外面或按 Esc 收起來
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = `block rounded-xl px-3 py-2 text-sm transition ${c.chip}`;
  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-1 items-center gap-1 text-sm">
      <Link
        href="/"
        className={`shrink-0 rounded-full px-3 py-1.5 font-hand transition ${c.chip} ${c.dim}`}
      >
        나의 공간
      </Link>
      <span aria-hidden className="opacity-40">
        /
      </span>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex min-w-0 items-center gap-1 rounded-full px-3 py-1.5 font-bold transition ${c.chip}`}
      >
        <span className="truncate">{pageOf(current).label}</span>
        <ChevronDown
          className={`size-4 shrink-0 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={`absolute left-0 top-full mt-3 w-64 rounded-2xl border p-2 shadow-xl ${c.panel}`}
      >
        <p className="px-3 pb-1 pt-2 text-[10px] font-bold tracking-[0.3em] opacity-50">ROOM</p>
        <Link href="/" className={item}>
          房間
        </Link>
        <ul className="ml-3 border-l border-current/15 pl-1">
          {ROOM_LINKS.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className={`${item} opacity-75`}>
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="px-3 pb-1 pt-3 text-[10px] font-bold tracking-[0.3em] opacity-50">PAGES</p>
        <ul>
          {SUB_PAGES.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                aria-current={p.id === current ? "page" : undefined}
                className={`${item} ${p.id === current ? "font-bold" : ""}`}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
