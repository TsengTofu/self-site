/**
 * 個人專案 — 點擊電腦後,螢幕視窗展示的內容。
 * 有 demoUrl 的專案可直接在螢幕裡內嵌操作(LIVE ▶)。
 */
export interface Project {
  name: string;
  description: string;
  stack: string[];
  url?: string;
  /** 有填的話,點卡片會直接在電腦螢幕裡內嵌操作這個網站(需可被 iframe 嵌入) */
  demoUrl?: string;
  accent: string; // 卡片強調色
}

export const projects: Project[] = [
  {
    name: "OneMeowDay",
    description:
      "進行中的 side project:貓咪日常記錄,web-first。Supabase(magic link + Postgres),完成前不開新坑。",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    accent: "#88c9a1",
  },
  {
    name: "平台前端重構(現職)",
    description:
      "Next.js App Router 後台:Semi Design → Shadcn/ui 漸進遷移、MonoRepo 化、AI 上版流程(每日 60 分鐘 → 10 分鐘)。",
    stack: ["Next.js", "TypeScript", "Turborepo", "Shadcn/ui", "Claude Code"],
    accent: "#7c9ef8",
  },
  {
    name: "CoffeePrint v2",
    description: "咖啡主題互動網站。v2 分支進行 AI 重構,完整記錄 before / after。",
    stack: ["Vite", "GSAP", "Tailwind CSS"],
    accent: "#d9a066",
  },
  {
    name: "STYLiSH",
    description: "AppWorks School 時期的 Pure JS 電商,從零手刻購物車與結帳流程。",
    stack: ["JavaScript", "REST API"],
    demoUrl: "https://tsengtofu.github.io/stylish_test/",
    accent: "#e9b44c",
  },
  {
    name: "self-site",
    description: "就是你現在看到的這個網站 — 互動式桌面場景個人入口。點進去有遞迴彩蛋。",
    stack: ["Next.js", "Zustand", "GSAP", "Turborepo"],
    demoUrl: "/", // TODO: 部署後換成正式網址
    accent: "#e8a0bf",
  },
];
