/**
 * 個人 Profile 資料 — 手機「Profile」App 的內容來源。
 * 內容整理自 Notion「職涯總整理 2026」。
 */
export const profile = {
  name: "Tofu Tseng",
  koreanName: "두부", // tofu 的韓文,當個小彩蛋
  title: "Frontend Engineer",
  tagline:
    "把 AI 變成團隊真正的生產力 — 設計背景出身的前端工程師,擅長從旁讓團隊變得更好:工具、流程、知識三路賦能。",
  location: "Taipei, Taiwan",
  email: "tsengbatty@gmail.com",
  links: [
    { label: "GitHub", url: "https://github.com/TsengTofu" },
    { label: "Medium", url: "https://tsengbatty.medium.com/" },
  ],
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "Zustand",
    "React Query",
    "React Hook Form",
    "Tailwind CSS",
    "Shadcn/ui",
    "Turborepo",
    "i18n",
    "Claude Code",
    "MCP",
  ],
} as const;

export type Profile = typeof profile;
