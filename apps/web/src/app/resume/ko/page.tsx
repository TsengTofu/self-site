import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { resumeKo } from "@/data/resume.ko";
import { shareMeta } from "@/lib/site";

const TITLE = "이력서 — Tseng Fu Chun";
const DESCRIPTION = "프론트엔드 엔지니어 | AI 도입 · 프로세스 구축 · 팀 역량 강화. React, TypeScript, Next.js, B2B SaaS 약 7년 경력.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resume/ko", languages: { "zh-Hant": "/resume", en: "/resume/en", ko: "/resume/ko" } },
  ...shareMeta(TITLE, DESCRIPTION, "profile"),
};

/** 正式履歷(韓文):版型跟中文版共用,內容在 data/resume.ko.ts */
export default function ResumeKoPage() {
  return <ResumeView data={resumeKo} lang="ko" />;
}
