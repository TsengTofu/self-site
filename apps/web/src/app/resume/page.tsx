import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";

// openGraph / twitter 跟全站的 metadataBase 一起設(見 layout.tsx),這裡只放頁面自己的
export const metadata: Metadata = {
  title: "職涯時間軸 — Tofu Tseng",
  description: "與其自我介紹，不如帶你走一遍我的職涯時間軸。",
  alternates: { canonical: "/resume" },
};

/** 互動式履歷：獨立頁面，用時間軸切換帶你認識我（代替自我介紹）。 */
export default function ResumePage() {
  return <ResumeView />;
}
