import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Camera } from "lucide-react";
import type { SkateContent } from "@/data/skate";
import { gmailComposeUrl } from "@/lib/links";
import { SKATE_BASE } from "@/lib/skate-theme";
import { HeaderSwitch } from "@/components/site-header";

/** 噴漆字型(頁面用 next/font 載入,變數叫 --font-spray) */
const SPRAY = "font-[family-name:var(--font-spray)]";
/** 拍立得、便利貼各自歪一點,看起來像隨手貼上去的 */
const TILTS = ["-rotate-3", "rotate-2", "-rotate-1"];
const NOTE_COLORS = ["bg-[#ffd23f]", "bg-[#39d0ff]", "bg-[#b6f24a]"];

function SectionTitle({ en, title, color }: { en: string; title: string; color: string }) {
  return (
    <div>
      <p className={`${SPRAY} text-3xl leading-none md:text-4xl ${color}`}>{en}</p>
      <h2 className="mt-2 text-xl font-bold md:text-2xl">{title}</h2>
    </div>
  );
}

/**
 * 滑板頁:跟房間的奶油色完全不同,走柏油地、噴漆、貼紙的街頭感
 * 從房間點滑板會先噴滿漆再進來(components/spray-transition.tsx),底色跟噴漆的底色一樣
 * 內容都從 data/skate.ts 傳進來
 */
export function SkateView({ data }: { data: SkateContent }) {
  return (
    <main
      style={{ backgroundColor: SKATE_BASE }}
      className="min-h-dvh overflow-hidden text-[#f5f1ea] [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:4px_4px]"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <HeaderSwitch current="skateboard" tone="dark">
          <header className="flex items-center justify-between py-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
            >
              <ArrowLeft className="size-4" aria-hidden />
              回到房間
            </Link>
            <span aria-hidden className={`${SPRAY} text-xl text-[#b6f24a]`}>
              SKATE
            </span>
          </header>
        </HeaderSwitch>

        <section className="relative py-14 md:py-24">
          {/* 背後兩團噴漆的光暈 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-0 size-80 rounded-full bg-[#ff4f8b]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-28 size-64 rounded-full bg-[#39d0ff]/20 blur-3xl"
          />
          <p
            className={`${SPRAY} relative -rotate-2 text-7xl leading-none text-[#ff4f8b] md:text-9xl`}
          >
            {data.eyebrow}
          </p>
          <h1 className="relative mt-5 inline-block text-4xl font-bold md:text-6xl">
            {data.title}
            {/* 噴漆畫的底線 */}
            <svg
              aria-hidden
              viewBox="0 0 300 24"
              preserveAspectRatio="none"
              className="absolute -bottom-4 left-0 h-5 w-full"
            >
              <path
                d="M4 14 C 70 6, 150 22, 296 9"
                stroke="#ffd23f"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              <path d="M210 15 L 211 24" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </h1>
          <p className="relative mt-8 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            {data.intro}
          </p>
        </section>

        <section className="border-t border-dashed border-white/15 py-12 md:py-16">
          <SectionTitle en={data.photos.en} title={data.photos.title} color="text-[#ffd23f]" />
          <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {data.photos.items.map((photo, i) => (
              <li
                key={i}
                className={`${TILTS[i % TILTS.length]} bg-[#f5f1ea] p-3 pb-4 text-[#161514] shadow-[0_14px_30px_rgba(0,0,0,0.5)] transition duration-300 hover:rotate-0 hover:scale-[1.02]`}
              >
                {photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- 照片網址由資料決定,可能是外部圖床
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-square place-items-center border-2 border-dashed border-[#161514]/25 text-[#161514]/40">
                    <Camera className="size-9" strokeWidth={1.6} aria-hidden />
                  </div>
                )}
                <p className="mt-3 text-center text-sm font-medium">{photo.caption}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-dashed border-white/15 py-12 md:py-16">
          <SectionTitle en={data.quests.en} title={data.quests.title} color="text-[#39d0ff]" />
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {data.quests.items.map((quest, i) => (
              <li
                key={i}
                className={`relative ${NOTE_COLORS[i % NOTE_COLORS.length]} ${TILTS[(i + 1) % TILTS.length]} p-5 pt-7 text-[#161514] shadow-[0_10px_24px_rgba(0,0,0,0.45)]`}
              >
                {/* 黏在上緣的膠帶 */}
                <span
                  aria-hidden
                  className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-3 bg-white/55"
                />
                <span aria-hidden className={`${SPRAY} text-3xl`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-bold">{quest}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col items-start gap-5 border-t border-dashed border-white/15 py-14 sm:flex-row sm:items-center">
          <a
            href={gmailComposeUrl(data.cta.subject)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex -rotate-1 items-center gap-1.5 bg-[#ff4f8b] px-6 py-3 text-base font-bold text-[#161514] shadow-[4px_4px_0_#f5f1ea] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#f5f1ea] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#f5f1ea]"
          >
            {data.cta.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <Link
            href="/"
            className="text-sm text-white/60 underline decoration-white/30 underline-offset-4 transition hover:text-white"
          >
            {data.cta.back}
          </Link>
        </section>
      </div>
    </main>
  );
}
