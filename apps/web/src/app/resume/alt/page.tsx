import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { getResume } from "@/data/resume";

/**
 * 🧪 經歷的另一種排版,給站主跟 /resume 比較用:左欄職稱、期間與重點技能,右欄只放描述跟數字卡片
 * 選定後把 ResumeView 的 layout 預設值改掉,刪掉這一頁(或刪掉 split 版型)
 */
export const metadata: Metadata = {
  title: "履歷(另一種排版)— Tseng Fu Chun 曾輔君",
  // 比較用的草稿頁,不給搜尋引擎收錄
  robots: { index: false, follow: false },
};

export default async function ResumeAltPage() {
  return <ResumeView data={await getResume("zh")} lang="zh" layout="split" />;
}
