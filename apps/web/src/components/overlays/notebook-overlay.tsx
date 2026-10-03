"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { PenLine } from "lucide-react";
import { quotes } from "@/data/quotes";
import { prefersReducedMotion } from "@/lib/motion";
import { FullPage } from "./full-page";

gsap.registerPlugin(TextPlugin);

/** 點筆記本 → 一句一句「手寫」出喜歡的句子(中/韓文混排),整頁攤開一本筆記本 */
export function NotebookOverlay() {
  const lineRef = useRef<HTMLParagraphElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const tl = gsap.timeline({ repeat: -1, delay: 0.7 });
      quotes.forEach((quote) => {
        // 減少動態:直接顯示全文,不逐字打出來
        if (reduced) {
          tl.set(lineRef.current, { text: quote });
        } else {
          tl.to(lineRef.current, {
            text: quote,
            duration: Math.max(1.6, quote.length * 0.09),
            ease: "none",
          });
        }
        tl.to({}, { duration: 2.2 }) // 停留閱讀
          .to(lineRef.current, { opacity: 0, duration: 0.4 })
          .set(lineRef.current, { text: "" })
          .set(lineRef.current, { opacity: 1 });
      });
    },
    { scope: scopeRef },
  );

  return (
    <FullPage eyebrow="NOTES" title="喜歡的句子" subtitle="抄在筆記本裡的句子，一句一句寫給你看">
      <div ref={scopeRef} className="mx-auto max-w-3xl px-4 py-8 md:px-10 md:py-12">
        <div className="relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(74,60,48,.15)]">
          {/* 紙 */}
          <div
            className="min-h-[60dvh] bg-[#f3ead8] p-8 pb-12 pl-12 md:p-12 md:pl-16"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 35px, #d8c9ae 35px, #d8c9ae 36px)",
            }}
          >
            <p className="font-hand mb-6 text-2xl text-[#8a5a3b]">노트 · 我的筆記本</p>
            <p
              ref={lineRef}
              className="font-hand min-h-[144px] text-3xl leading-[36px] text-[#3a3226] md:text-4xl md:leading-[36px]"
            />
            <PenLine className="size-7 animate-pulse text-[#8a5a3b]" strokeWidth={2} aria-hidden />
          </div>
          {/* 側邊裝訂 */}
          <div className="absolute inset-y-0 left-0 flex w-6 flex-col justify-evenly bg-[#c9885a]">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="mx-auto size-2 rounded-full bg-panel/60" />
            ))}
          </div>
        </div>
      </div>
    </FullPage>
  );
}
