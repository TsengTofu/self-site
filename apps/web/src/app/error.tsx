"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** 頁面層的錯誤邊界(layout 底下的 segment;root layout 掛掉走 global-error):同樣走奶油卡風格,盡量不嚇到人 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink-soft/15 bg-cream p-8 shadow-2xl">
        <span className="text-6xl">🫠</span>
        <h1 className="text-lg font-bold text-ink">桌上出了點狀況</h1>
        <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
          有個東西沒接好,重新整理應該就會恢復。
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-accent to-accent-soft px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            再試一次
          </button>
          <Link
            href="/"
            className="rounded-full bg-ink-soft/10 px-5 py-2 text-sm text-ink-soft transition hover:bg-ink-soft/20"
          >
            回到書桌
          </Link>
        </div>
      </div>
    </div>
  );
}
