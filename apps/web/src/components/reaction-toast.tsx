"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ITEMS, type ItemId } from "@/lib/items";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

/** 第幾次點擊會換成 snark[0] / snark[1](其餘次數顯示一般 hint) */
const SNARK_AT = [3, 10] as const;

/** 點到還沒想好要放什麼的物件時,底部冒出的小反應;連點久了台詞會升級。 */
export function ReactionToast() {
  const reaction = useSceneStore((s) => s.reaction);
  const clearReaction = useSceneStore((s) => s.clearReaction);
  const ref = useRef<HTMLDivElement>(null);
  const clickCounts = useRef<Map<ItemId, number>>(new Map());
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reaction) return;
    const meta = ITEMS[reaction.itemId];
    const count = (clickCounts.current.get(reaction.itemId) ?? 0) + 1;
    clickCounts.current.set(reaction.itemId, count);

    const text =
      meta.snark && count === SNARK_AT[0]
        ? meta.snark[0]
        : meta.snark && count === SNARK_AT[1]
          ? meta.snark[1]
          : meta.hint;
    setMessage(text);

    setVisible(true);
    const el = ref.current;
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" },
      );
    }
    const t = setTimeout(() => {
      setVisible(false);
      clearReaction();
    }, 2000);
    return () => clearTimeout(t);
  }, [reaction, clearReaction]);

  if (!reaction || !visible) return null;
  const meta = ITEMS[reaction.itemId];

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-panel/95 px-5 py-2.5 text-sm text-white shadow-2xl backdrop-blur md:bottom-8"
    >
      <span className="mr-1.5">{meta.emoji}</span>
      {meta.label}:{message} ✨
    </div>
  );
}
