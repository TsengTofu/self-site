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
    { label: "GitHub", url: "https://github.com/tsengtofu" },
    { label: "Medium", url: "https://medium.com/" }, // TODO: 換成你的 Medium 個人頁網址
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
  experiences: [
    {
      company: "現職",
      role: "前端工程師(重構)",
      period: "2025/11 — 現在",
      highlights: [
        "將 AI 導入團隊開發流程,把分散的上版步驟整合為 Claude Code 驅動的單一入口,每日上版 60 分鐘 → 10 分鐘",
        "建立 AI Code Review 品質把關機制,單一開發項目約 2 天可交付 QA",
        "1.5 個月完成牽涉複雜變數系統的合約簽署流程,持續與 PM、後端對齊規格",
        "主導前端重構:Semi Design → Shadcn/ui 漸進遷移,並透過 MCP 整合 AI 工作流",
        "從零建立團隊 Sprint 流程、Git 分支策略與 PR 審核制度",
      ],
    },
    {
      company: "COMMEET 擁樂數據服務",
      role: "Frontend Engineer",
      period: "約 6 年",
      highlights: [
        "參與 6 個 B2B 差旅與費用管理平台,從 UI 切版成長到主導協作流程與架構規劃",
        "COMMEET:導入 React Query、建立 PR 審核流程與 Custom Hook 模式",
        "TRP:從零定義前端協作流程、Coding Style 與 Code Review",
        "TSMC SPA:D3 資料視覺化,四個月每週兩次客戶會議直面需求",
      ],
    },
    {
      company: "設計師時期(Maxidea 等)",
      role: "Visual / Web Designer",
      period: "約 3 年",
      highlights: [
        "3M 多產品線 EDM 與 SEO 導向官網切版、三星廣編特輯互動頁",
        "設計背景成為與設計師協作、落地 Design System 的優勢",
      ],
    },
    {
      company: "AppWorks School",
      role: "Front-End Trainee",
      period: "6 個月",
      highlights: ["Pure JS 電商 STYLiSH 從零實作,協作串接 REST API(web + app)"],
    },
  ],
} as const;

export type Profile = typeof profile;
