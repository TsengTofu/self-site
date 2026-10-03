import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { shareMeta } from "@/lib/site";

const TITLE = "履歷 — Tseng Fu Chun 曾輔君";
const DESCRIPTION = "前端工程師｜AI 導入・流程建立・團隊賦能。約 7 年經驗，React、TypeScript、Next.js 與 B2B SaaS 平台。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resume" },
  ...shareMeta(TITLE, DESCRIPTION, "profile"),
};

/** 正式履歷：聯絡資訊、直式時間軸、技能、教學與學歷 */
export default function ResumePage() {
  return <ResumeView />;
}
