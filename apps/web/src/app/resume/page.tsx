import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { getResume } from "@/data/resume";
import { shareMeta } from "@/lib/site";

const TITLE = "履歷 — Tseng Fu Chun 曾輔君";
const DESCRIPTION = "前端工程師｜AI 導入・流程建立・團隊賦能。約 7 年經驗，React、TypeScript、Next.js 與 B2B SaaS 平台。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resume", languages: { "zh-Hant": "/resume", en: "/resume/en", ko: "/resume/ko" } },
  ...shareMeta(TITLE, DESCRIPTION, "profile"),
};

/** 正式履歷(中文):聯絡資訊、直式時間軸、技能、教學與學歷;右上角可切英文 */
export default async function ResumePage() {
  return <ResumeView data={await getResume("zh")} lang="zh" />;
}
