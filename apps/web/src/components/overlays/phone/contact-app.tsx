"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${encodeURIComponent(
  "嗨 Tseng,從你的桌上看到你 👋",
)}`;

interface ContactAppProps {
  headline?: string;
  tagline?: string;
}

/** 手機裡的聯絡 App — 直接開 Gmail 撰寫視窗寄信給我。來電接聽後也用這頁(換標題)。 */
export function ContactApp({
  headline = "聊聊吧",
  tagline = "不管是工作機會、專案合作,還是想交換歌單。",
}: ContactAppProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard 權限被拒時退回 mailto
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center text-white">
      <span className="text-5xl">💌</span>
      <div>
        <h2 className="text-lg font-bold">{headline}</h2>
        <p className="mt-1 text-sm text-white/60">{tagline}</p>
      </div>

      <a
        href={GMAIL_COMPOSE}
        target="_blank"
        rel="noreferrer"
        className="w-full rounded-2xl bg-gradient-to-r from-[#7c9ef8] to-[#e8a0bf] py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
      >
        用 Gmail 寫信給我
      </a>

      <button
        type="button"
        onClick={copyEmail}
        className="w-full rounded-2xl bg-white/10 py-3 text-sm font-medium transition hover:bg-white/20"
      >
        {copied ? "已複製 ✓" : `複製 ${profile.email}`}
      </button>

      <a href={`mailto:${profile.email}`} className="text-xs text-white/40 underline">
        或用預設郵件 App 開啟
      </a>
    </div>
  );
}
