import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { shareMeta } from "@/lib/site";

const TITLE = "職涯時間軸 — Tofu Tseng";
const DESCRIPTION = "與其自我介紹，不如帶你走一遍我的職涯時間軸。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resume" },
  ...shareMeta(TITLE, DESCRIPTION, "profile"),
};

/** 互動式履歷：獨立頁面，用時間軸切換帶你認識我（代替自我介紹）。 */
export default function ResumePage() {
  return <ResumeView />;
}
