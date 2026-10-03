import type { ResumeLang } from "./types";

/** 履歷頁介面上的固定文字(按鈕、區塊標題);履歷內容在同資料夾的 <lang>.json */
export const RESUME_UI = {
  zh: {
    home: "回到空間",
    makingOf: "製作歷程",
    chat: "一起聊聊",
    mail: "寫信給我",
    contact: "聯絡方式",
    pages: "其他頁面",
    language: "切換語言",
    experience: "經歷",
    skills: "技能",
    teaching: "教學與社群",
    education: "學歷與證照",
    present: "現在",
    more: "看完整經歷",
    less: "收起",
    updated: "最後更新 2026/10",
    subject: "嗨 Tseng，看完你的履歷，想找你聊聊",
  },
  en: {
    home: "Back to my space",
    makingOf: "Making of",
    chat: "Let's talk",
    mail: "Email me",
    contact: "Contact",
    pages: "Other pages",
    language: "Switch language",
    experience: "Experience",
    skills: "Skills",
    teaching: "Teaching & community",
    education: "Education & certificates",
    present: "Present",
    more: "Show full details",
    less: "Show less",
    updated: "Last updated Oct 2026",
    subject: "Hi Tseng, I read your resume and would love to chat",
  },
  ko: {
    home: "내 공간으로",
    makingOf: "제작 과정",
    chat: "이야기 나눠요",
    mail: "메일 보내기",
    contact: "연락처",
    pages: "다른 페이지",
    language: "언어 바꾸기",
    experience: "경력",
    skills: "기술",
    teaching: "교육·커뮤니티",
    education: "학력·자격",
    present: "현재",
    more: "전체 경력 보기",
    less: "접기",
    updated: "최종 업데이트 2026/10",
    subject: "Tseng 님, 이력서를 보고 연락드려요",
  },
} as const;

/** 每種語言的網址、切換鈕上的字、html lang */
export const RESUME_LANGS: Record<ResumeLang, { href: string; text: string; htmlLang: string }> = {
  zh: { href: "/resume", text: "中文", htmlLang: "zh-Hant" },
  en: { href: "/resume/en", text: "EN", htmlLang: "en" },
  ko: { href: "/resume/ko", text: "한국어", htmlLang: "ko" },
};

export type ResumeCopy = (typeof RESUME_UI)[ResumeLang];
