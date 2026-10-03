"use client";

import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useModalFocus } from "@self-site/ui/use-modal-focus";
import { useCoverExit } from "@/hooks/use-cover-exit";

/** 頂部列的按鈕:滑過微微浮起、按下回彈 */
export const BAR_BUTTON =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-soft/20 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0 active:scale-95";

interface FullPageProps {
  /** 英文小標,例如 BOOKS */
  eyebrow: string;
  title: string;
  /** 標題下面的一句話 */
  subtitle?: string;
  /** 鏡頭會先推近的物件(電腦)晚一點淡入,推到一半才蓋住;其他直接淡入 */
  afterZoom?: boolean;
  /** 頂部列左邊整塊換掉(電腦開 demo 時換成返回鍵與網址) */
  bar?: ReactNode;
  /** 按 Esc 時要做的事,沒給就是離開 */
  onEscape?: () => void;
  /** 內容區要不要自己捲動;放 iframe 這類要撐滿的內容時關掉 */
  scroll?: boolean;
  /** 內容裡也有「離開」按鈕的話,傳函式進來拿到 leave,跟頂部的回到房間走同一套淡出 */
  children: ReactNode | ((leave: () => void) => ReactNode);
}

/**
 * 物件打開後的全頁畫面:不透明蓋住整個房間,頂部固定一條標題列和「回到房間」
 * 取代以前浮在場景上的小視窗(視窗裡又有一層視窗,不太自然)
 * 關閉時先讓鏡頭歸位再淡出,看不到糊掉的縮回
 */
export function FullPage({
  eyebrow,
  title,
  subtitle,
  afterZoom = false,
  bar,
  onEscape,
  scroll = true,
  children,
}: FullPageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { leaving, leave } = useCoverExit();
  useModalFocus(true, ref, onEscape ?? leave);

  const enter = afterZoom ? "cover-in" : "cover-in-now";

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`${leaving ? "cover-out" : enter} fixed inset-0 z-50 flex flex-col bg-cream text-ink`}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-ink-soft/10 bg-cream/95 px-4 py-3 md:px-10">
        {bar ?? (
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.35em] text-ink-dim">{eyebrow}</p>
            <h2 className="text-lg font-bold md:text-xl">{title}</h2>
            {subtitle && <p className="hidden text-xs text-ink-soft sm:block">{subtitle}</p>}
          </div>
        )}
        <span className="hidden text-xs text-ink-dim lg:inline">按 Esc 也能關閉</span>
        <button type="button" onClick={leave} className={BAR_BUTTON}>
          <X className="size-4" aria-hidden />
          回到房間
        </button>
      </header>
      <main className={`min-h-0 flex-1 ${scroll ? "overflow-y-auto" : "flex flex-col"}`}>
        {typeof children === "function" ? children(leave) : children}
      </main>
    </div>
  );
}
