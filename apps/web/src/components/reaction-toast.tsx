"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ITEMS } from "@/lib/items";
import { useSceneStore } from "@/stores/scene-store";

/** 點到還沒想好要放什麼的物件時,底部冒出的小反應。 */
export function ReactionToast() {
  const reaction = useSceneStore((s) => s.reaction);
  const clearReaction = useSceneStore((s) => s.clearReaction);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!reaction) return;
    setVisible(true);
    const el = ref.current;
    if (el) {
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
      className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-[#1c1d26]/95 px-5 py-2.5 text-sm text-white shadow-2xl backdrop-blur md:bottom-8"
    >
      <span className="mr-1.5">{meta.emoji}</span>
      {meta.label}:{meta.hint} ✨
    </div>
  );
}
