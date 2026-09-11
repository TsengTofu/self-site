import Link from "next/link";

/** 亂打路徑時看到的空狀態小卡,風格比照 skateboard-overlay 的「還沒想到要放什麼」空格卡 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink-soft/15 bg-cream p-8 shadow-2xl">
        <span className="text-6xl">🧭</span>
        <h1 className="text-lg font-bold text-ink">這裡什麼都沒有</h1>
        <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
          你點的這個地方,桌上找不到對應的東西。
          <br />
          回書桌看看有什麼可以點的吧。
        </p>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-accent to-accent-soft px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
        >
          回到書桌
        </Link>
      </div>
    </div>
  );
}
