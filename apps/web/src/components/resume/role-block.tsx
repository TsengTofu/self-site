"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface RoleBlockProps {
  /** false = 重點經歷,一直展開、標題不能點 */
  collapsible: boolean;
  /** 職稱那一塊(期間、職稱、公司),只能放行內元素,可收合時會包在按鈕裡 */
  header: ReactNode;
  /** 標題底下、展開才出現的東西(另一種排版放重點技能) */
  aside?: ReactNode;
  /** 展開後的內容 */
  children: ReactNode;
  /** 時間軸上的圓點,放在這裡才能跟著展開狀態換色 */
  dot?: ReactNode;
  className?: string;
  leftClassName?: string;
  bodyClassName?: string;
}

/**
 * 一段經歷:重點經歷一直展開;其他的先收合,只剩灰色的期間與職稱,點了才打開
 * 按鈕的文字就是期間與職稱,展開與否交給 aria-expanded 告訴讀屏
 * 外層帶 data-open,裡面可以用 group-data-[open=false]/role: 換成收合時的灰色
 * 列印時全部展開
 */
export function RoleBlock({
  collapsible,
  header,
  aside,
  children,
  dot,
  className = "",
  leftClassName = "",
  bodyClassName = "",
}: RoleBlockProps) {
  const [opened, setOpened] = useState(false);
  const open = !collapsible || opened;
  const bodyId = useId();
  const hide = open ? "" : "hidden print:block";

  return (
    <div data-open={open} className={`group/role ${className}`}>
      <div className={leftClassName}>
        {dot}
        <h3>
          {collapsible ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setOpened((v) => !v)}
              className="group/btn flex w-full items-start gap-3 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span className="min-w-0 flex-1">{header}</span>
              <ChevronDown
                aria-hidden
                className="mt-6 size-4 shrink-0 text-ink-dim transition group-hover/btn:text-ink group-data-[open=true]/role:rotate-180 print:hidden"
              />
            </button>
          ) : (
            <span className="block">{header}</span>
          )}
        </h3>
        {aside && <div className={hide}>{aside}</div>}
      </div>
      <div id={bodyId} className={`${hide} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
