"use client";

import { useState } from "react";
import { Mail, Copy, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";
import { gmailComposeUrl } from "@/lib/links";

const GMAIL_COMPOSE = gmailComposeUrl("嗨 Tseng,從你的桌上看到你 👋");

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
      <Mail className="size-12" strokeWidth={1.5} />
      <div>
        <h2 className="text-lg font-bold">{headline}</h2>
        <p className="mt-1 text-sm text-white/60">{tagline}</p>
      </div>

      <a
        href={GMAIL_COMPOSE}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-soft py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
      >
        <ExternalLink className="size-4" />
        用 Gmail 寫信給我
      </a>

      <button
        type="button"
        onClick={copyEmail}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-medium transition hover:bg-white/20"
      >
        <Copy className="size-4" />
        {copied ? "已複製" : `複製 ${profile.email}`}
      </button>

      <a href={`mailto:${profile.email}`} className="text-xs text-white/60 underline">
        或用預設郵件 App 開啟
      </a>
    </div>
  );
}
