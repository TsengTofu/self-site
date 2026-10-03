import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { getResume } from "@/data/resume";
import { shareMeta } from "@/lib/site";

const TITLE = "Resume — Tseng Fu Chun";
const DESCRIPTION =
  "Frontend engineer | AI adoption, process building and team enablement. ~7 years with React, TypeScript, Next.js and B2B SaaS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resume/en", languages: { "zh-Hant": "/resume", en: "/resume/en", ko: "/resume/ko" } },
  ...shareMeta(TITLE, DESCRIPTION, "profile"),
};

/** 正式履歷(英文):版型跟中文版共用,內容在 data/resume/en.json */
export default async function ResumeEnPage() {
  return <ResumeView data={await getResume("en")} lang="en" />;
}
