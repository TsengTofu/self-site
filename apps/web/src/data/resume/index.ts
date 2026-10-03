import type { Experience, Resume, ResumeLang } from "./types";
import zh from "./zh.json";
import en from "./en.json";
import ko from "./ko.json";

export type * from "./types";
export { RESUME_LANGS, RESUME_UI, type ResumeCopy } from "./ui";

// 型別標註讓 JSON 一改錯格式,tsc 就會擋下來
const LOCAL: Record<ResumeLang, Resume> = { zh, en, ko };

/**
 * 讀履歷資料的唯一入口,頁面都從這裡拿
 * 現在讀專案裡的 JSON;之後串 API 或 CMS,只要改這個函式,畫面不用動
 */
export async function getResume(lang: ResumeLang): Promise<Resume> {
  return LOCAL[lang];
}

/** 「2025/11 – 現在」這種期間字串 */
export const periodOf = (exp: Pick<Experience, "start" | "end">, present: string) =>
  `${exp.start} – ${exp.end ?? present}`;
