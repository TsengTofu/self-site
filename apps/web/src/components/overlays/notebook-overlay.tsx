"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { quotes } from "@/data/quotes";
import { useSceneStore } from "@/stores/scene-store";
import { OverlayShell } from "./overlay-shell";
import { CloseButton } from "@self-site/ui/close-button";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(TextPlugin);

/** 點筆記本 → 一句一句「手寫」出喜歡的句子(中/韓文混排)。 */
export function NotebookOverlay() {
  const closeOverlay = useSceneStore((s) => s.closeOverlay);
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
    <OverlayShell label="筆記本" onClose={closeOverlay} className="w-full max-w-xl">
      <div ref={scopeRef} className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* 紙 */}
        <div
          className="min-h-[320px] bg-[#f3ead8] p-8 pb-12"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 35px, #d8c9ae 35px, #d8c9ae 36px)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="font-hand text-2xl text-[#8a5a3b]">노트 · 我的筆記本</p>
            <CloseButton
              onClick={closeOverlay}
              className="!bg-black/10 !text-black/50 hover:!bg-black/20"
            />
          </div>
          <p
            ref={lineRef}
            className="font-hand min-h-[120px] text-3xl leading-[36px] text-[#3a3226] md:text-4xl md:leading-[36px]"
          />
          <span className="font-hand inline-block animate-pulse text-3xl text-[#8a5a3b]">✎</span>
        </div>
        {/* 側邊裝訂 */}
        <div className="absolute inset-y-0 left-0 flex w-5 flex-col justify-evenly bg-[#c9885a]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-auto size-2 rounded-full bg-panel/60" />
          ))}
        </div>
      </div>
    </OverlayShell>
  );
}
