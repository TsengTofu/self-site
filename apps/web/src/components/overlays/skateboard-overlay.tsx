"use client";

import { ItemIcon } from "@/components/item-icons";
import { gmailComposeUrl } from "@/lib/links";
import { FullPage } from "./full-page";

const IDEA_MAIL = gmailComposeUrl("滑板那格我有個點子！");

/** 滑板:還沒想到要放什麼,先做成一個徵求點子的彩蛋 */
export function SkateboardOverlay() {
  return (
    <FullPage eyebrow="SKATEBOARD" title="自由的味道">
      {(leave) => (
        <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-5 px-6 py-12 text-center">
          <ItemIcon id="skateboard" className="size-20 text-ink-soft transition duration-300 hover:-rotate-12" />
          <h3 className="text-xl font-bold">這格還空著</h3>
          <p className="text-sm leading-relaxed text-ink-soft">
            滑板要放什麼，我還沒想好。
            <br />
            也許是學滑板的摔倒集錦，也許是人生的 side quest 清單。
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <a
              href={IDEA_MAIL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              跟我說你的點子
            </a>
            <button
              type="button"
              onClick={leave}
              className="rounded-full border border-ink-soft/25 px-5 py-2.5 text-sm font-medium text-ink-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-ink-soft/5 active:translate-y-0"
            >
              先滑走
            </button>
          </div>
        </div>
      )}
    </FullPage>
  );
}
