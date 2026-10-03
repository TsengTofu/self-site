/**
 * 正式履歷頁(/resume)的內容
 * 內容整理自履歷母版
 * 起訖年月以 104 匯出為準,現職不寫公司名
 */

/** 條目可以帶粗體小標:[小標, 內文] */
export type Bullet = string | readonly [label: string, text: string];

export interface Metric {
  value: string;
  label: string;
}

/** 一段經歷底下的子專案 */
export interface ProjectGroup {
  title: string;
  stack?: readonly string[];
  intro?: string;
  bullets?: readonly Bullet[];
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  start: string;
  /** 沒填就是現職 */
  end?: string;
  stack: readonly string[];
  /** 職稱底下的一句話說明 */
  intro?: string;
  metrics?: readonly Metric[];
  bullets?: readonly Bullet[];
  /** 底下的子專案(例如 COMMEET 的四個平台) */
  groups?: readonly ProjectGroup[];
  link?: { label: string; url: string };
}

export interface SkillGroup {
  label: string;
  items: readonly string[];
}

export interface TeachingStat {
  value: string;
  title: string;
  desc: string;
}

export interface Certificate {
  title: string;
  desc?: string;
  date?: string;
}

export interface Resume {
  nameEn: string;
  nameZh: string;
  headline: string;
  location: string;
  email: string;
  github: { label: string; url: string };
  medium: { label: string; url: string };
  summary: string;
  skills: readonly SkillGroup[];
  experiences: readonly Experience[];
  teaching: readonly TeachingStat[];
  education: { school: string; dept: string; start: string; end: string };
  /** 證照與活動 */
  certificates: readonly Certificate[];
}

export const resume: Resume = {
  nameEn: "TSENG FU CHUN",
  nameZh: "曾輔君",
  headline: "前端工程師｜AI 導入・流程建立・團隊賦能",
  location: "桃園，台灣",
  email: "tsengbatty@gmail.com",
  github: { label: "github.com/TsengTofu", url: "https://github.com/TsengTofu" },
  medium: { label: "tsengbatty.medium.com", url: "https://tsengbatty.medium.com/" },

  summary:
    "設計轉前端、約 7 年經驗的前端工程師，專精 React、TypeScript、Next.js 與 B2B SaaS 平台。擅長在有技術債的產品裡做結構性的事：五層巢狀階層式表格（虛擬化）、config-driven 側邊欄與權限架構、簽署合約多步驟流程與 PDF 管線，並以架構思維推動重構（Semi Design → Shadcn/ui、全站上傳元件改寫、Turborepo service 抽象）。深入排查並修復團隊長期的 Git 上版衝突問題；自 2024/07 起將 AI 導入日常工程流程，把上版作業自動化。",

  skills: [
    { label: "框架與語言", items: ["React", "TypeScript", "Next.js（SPA／SSR）", "Vue", "JavaScript"] },
    {
      label: "狀態、表單與資料",
      items: ["Zustand", "React Hook Form", "TanStack Query", "TanStack Table", "Zod", "REST API 串接"],
    },
    {
      label: "樣式與設計系統",
      items: ["Shadcn/ui", "Tailwind CSS", "Semi Design", "SCSS Module", "設計 Token", "Storybook（探索中）"],
    },
    { label: "測試", items: ["Jest", "React Testing Library"] },
    {
      label: "架構與工具",
      items: ["Turborepo（Monorepo）", "Git／GitLab CI", "release-it", "Commitizen", "commitlint", "Husky", "GPG 簽章", "i18n"],
    },
    {
      label: "AI 工程",
      items: ["Claude Code（skills、sandbox）", "MCP（Notion／Figma／Shadcn UI）", "AI Agent 輔助開發與重構", "AI Code Review"],
    },
    {
      label: "協作",
      items: ["跨職能協作（PM／設計／後端／QA）", "規格對齊", "Code Review 制度", "Agile／Scrum", "團隊流程從零建立"],
    },
    { label: "視覺化", items: ["D3", "Vis", "ECharts", "Shadcn Chart"] },
    { label: "語言", items: ["中文（母語）", "英文", "韓文（TOPIK Level 2）"] },
  ],

  // 新到舊,現職在最上面
  experiences: [
    {
      id: "current",
      role: "重構前端工程師",
      org: "B2B SaaS",
      start: "2025/11",
      stack: ["React", "Next.js", "TypeScript", "Shadcn/ui", "Turborepo", "Claude Code", "MCP"],
      intro:
        "以重構為核心職責加入，首週即投入開發；前期完成複雜功能，中後期主導架構重構與工程流程建立，並在團隊人力調整後承接前端全部職責。",
      metrics: [
        { value: "60 → 10 分鐘", label: "每日上版作業" },
        { value: "1.5–2 天", label: "單一 Task 交付 QA" },
        { value: "1.5 個月", label: "完成簽署合約多步驟流程" },
        { value: "近 100 檔", label: "全站上傳元件改寫" },
      ],
      bullets: [
        [
          "簽署合約流程",
          "於 1.5 個月內完成牽涉複雜變數系統邏輯的簽署合約多步驟流程（電子簽章、印章上傳裁切、附件上傳、PDF 產生與預覽），期間導入 AI Agent 輔助開發，並反覆與 PM、設計、後端開規格會議釐清需求邊界，依需求提出多種解決方案供取捨。",
        ],
        [
          "AI 導入",
          "自 2024/07 起將 AI 導入日常開發（跨兩份工作）；以 Claude Code 整合 release skill、release-it、GPG 簽章與 Commitizen 規範為單一上版流程，每日上版作業由約 60 分鐘壓縮至 10 分鐘；建立「AI 產出程式碼必經架構審查」機制，單一 Task 含架構檢查約 1.5–2 天交付雛形至 QA。",
        ],
        [
          "Skill 團隊化",
          "把 Skill 從個人工具推成團隊資產：移除 Skill 內敏感設定改以環境變數管理（可跨專案共用）、以命名前綴解決本地端與專案端 Skill 的優先權衝突、協助其他前端成員上手 release 流程；設定 Claude Code 自動 Review PR、排障 Notion MCP（local vs cloud）授權，並以 Claude 串接 Notion 批次同步 Task 狀態。",
        ],
        [
          "上版衝突排查",
          "排查並修復團隊長期的正式站上版衝突問題：定位根因為 Merge Request 全面採用 Squash commit，使 test → prod 的歷史 commit 被壓縮、merge base 長期停滯而衝突逐版累積；提出「先對特定版本 rebase 整理、後續回歸一般 merge」的解法並訂出 hotfix／release 分支對應規則，正式站自此穩定迭代（v1.0.27 → v1.0.48）。",
        ],
        [
          "元件庫遷移",
          "主導 UI 元件由 Semi Design 漸進遷移至 Shadcn/ui，統一設計 Token 與元件介面；主導全站上傳檔案元件改寫為 Shadcn 基底，含圖章上傳裁切（1:1 鎖定、旋轉／翻轉、自訂工具列）與簽署合約端流程，最終合併涉及近 100 個檔案，並與設計師多輪會議收斂規格；另建立統一月曆元件與 config-driven 權限 Button 系列。",
        ],
        [
          "時區規範",
          "設計 timezone-agnostic 月曆元件並推動全站時區規範落地：僅於系統邊界轉換時區，依語意區分「偏好時區」與「純日期字串」（如生日 vs 跨日時間）；與 QA、設計、PM 確認規格，並與後端定案合約時間一律以 +0 儲存、後台一律以後台時區呈現，分批替換至全站日期相關頁面。",
        ],
        [
          "Monorepo 架構",
          "Turborepo Monorepo 下的 service 抽象設計（帳號 service 改用 Zustand Provider 全局控制 + useQuery cache），推動 Monorepo 架構前置作業；規劃 PDF Service 架構（Next.js App Router + Turborepo + react-pdf／Puppeteer），評估 SSRF 網域白名單、timeout、memory leak 與 MQ + Worker 非同步方案的取捨（規劃階段）。",
        ],
        ["推動重構", "與 PM、設計反覆溝通後說服啟動前端重構；面對上版流程爭議，主張漸進式調整而非一次性大改，取得跨團隊共識。"],
        [
          "Sprint 與流程",
          "協助團隊從零導入 Sprint，建立 Git 分支策略（以 release 作為 Sprint 起點、解決 Test／Prod 長期分歧）、PR 審核制度與「Code Review 完成標記 readyForTest、由 PM 決定上版時機」的交接規則；導入 GitLab MR Label 管理狀態、於 pre-commit 加入建置檢查確保可部署才能提交；推動部署完成通知分流至專屬 Slack 頻道，讓前後端與 QA 同步得知上版狀態。",
        ],
        [
          "Code Review",
          "持續審核前端成員 PR（單日最多 6 支），累計逾百支；依成員特質安排討論時段並保留專注開發時間。2026/07 起團隊人力調整後承接前端全部維護與開發職責，審閱並補齊交接文件，確保功能與重構進度不中斷。",
        ],
        [
          "業務功能",
          "租賃總表與查看合約（RWD、樹狀下拉）、點交／點退空間、營運與帳務總覽 Dashboard（收款進度、租金收入，Shadcn Chart、多 API、權限與各狀態 UI）、會員列表篩選列、銀行虛擬匯款帳號整合、承租意願通知憑證開立、承租作業列表空間圖；於開發與重構過程中維護並擴充既有 i18n 架構。",
        ],
        [
          "對外分享",
          "於公司內部主辦 AI 工具分享會 6 場（持續中，每場約 5 人）、主動申請 AI Agent 預算；撰寫 Medium 技術文章（Jest 測試實戰、Git 工作流、資料視覺化）。",
        ],
      ],
    },
    {
      id: "commeet",
      role: "前端工程師",
      org: "COMMEET（擁樂數據服務）",
      start: "2019/10",
      end: "2025/10",
      stack: ["Next.js", "TypeScript", "Zustand", "TanStack", "Vue", "D3"],
      intro:
        "橫跨 6 個 B2B 平台，從 UI 切版成長到主導協作流程與架構規劃，並從零建立 TRP 與 COMMEET 兩個平台的前端協作機制。",
      metrics: [
        { value: "6 個", label: "參與的 B2B 平台" },
        { value: "6 檔 → 1", label: "側邊欄改動收斂為單一設定檔" },
        { value: "5 層", label: "無限巢狀的階層式表格" },
        { value: "4 個月", label: "每週兩次客戶會議" },
      ],
      groups: [
        {
          title: "COMMEET 差旅報銷平台",
          stack: ["Next.js", "TypeScript", "Zustand", "TanStack Query／Table", "Tailwind CSS", "Koa", "SCSS Module"],
          intro:
            "透過虛擬信用卡讓員工使用、協助財務管理報銷資料的平台，涵蓋表單申請與簽核、發卡流程、預算管理與報表管理。",
          bullets: [
            [
              "階層式資料表格",
              "五層無限巢狀、依父層 ID 動態載入子資料；將渲染層與儲存層拆開，以虛擬化控制 DOM 解決大量資料的記憶體問題；支援 column pinning、欄寬調整與群組邊界判斷。",
            ],
            [
              "側邊欄重構",
              "主導側邊欄 config-driven 重構（2025/09–11）：以策略模式將各類選單的設定、資料 hook 與渲染封裝為統一介面，支援兩層展開；處理策略模式與 React Hooks 呼叫順序規則的衝突；選單調整的改動範圍由 6 支檔案收斂為單一設定檔。",
            ],
            ["表單欄位工廠", "將欄位設定與排版邏輯分離，新增欄位不需改動元件本身。"],
            "開發各類型複雜表單、表單簽核流程與發卡流程；導入 Zustand 與 TanStack Query／Table 管理狀態與資料（首次主導技術選型並推動團隊採用）。",
            "開發可複用元件與 Custom Hook 封裝商業邏輯；以 TypeScript 強化型別安全，持續整理平台架構以利長期維護。",
            "以 Jest + React Testing Library 為元件撰寫單元測試。",
            "建立團隊 Git Pull Request 審核流程，與前端團隊收斂共同的解決方案。",
          ],
        },
        {
          title: "TRP 差旅數據平台",
          stack: ["Next.js", "ECharts", "Koa", "SCSS Module"],
          intro: "以出差旅遊為主的數據平台，從無到有參與建立。",
          bullets: [
            "與團隊從零定義協作流程、Coding Style 與 Code Review 機制。",
            "與 UI 設計師討論最佳解決方案（如顏色 Guideline），開發平台元件並串接後端 API。",
            "撰寫開發文件與 Git／上版部署流程圖，制定樣式管理規則與通用樣式變數。",
          ],
        },
        {
          title: "TSMC 台積電視覺化 SPA",
          stack: ["Vue", "D3", "Vis", "JavaScript"],
          intro:
            "前後端分離協作，透過 API 文件與 Postman 與後端溝通；每週兩次電話會議、持續四個月，從需求、Prototype 到反覆校準。",
          bullets: ["開發文章瀏覽、搜尋、評論與私密留言（CRUD）功能。", "以 D3／Vis 呈現商業資訊，支援季度報表上傳與管理。"],
        },
        {
          title: "其他維護專案",
          intro:
            "Acer 旅遊服務平台（與專案企劃協作需求與流程）、Tripsaas、Tripresso 官網（Vue／Backbone）：切版、功能開發、效能優化與既有架構維護。",
        },
      ],
    },
    {
      id: "appworks",
      role: "Web Class Trainee",
      org: "AppWorks School",
      start: "2019/02",
      end: "2019/06",
      stack: ["JavaScript", "React", "REST API"],
      bullets: [
        "從零實作電商網站 STYLiSH，協作串接 RESTful API，並在網頁版與 App 版開發相同功能。",
        "與同學共同鑽研 JavaScript 核心基礎，包含 Prototype、this、closure。",
        "從無到有，以 React 實作一個網站。",
      ],
      link: { label: "STYLiSH", url: "https://tsengtofu.github.io/stylish_test/" },
    },
    {
      id: "ashlie",
      role: "網頁設計師",
      org: "艾璽數位媒體",
      start: "2015/07",
      end: "2018/09",
      stack: ["HTML", "CSS", "JavaScript", "AJAX", "Photoshop", "Illustrator"],
      intro: "負責品牌客戶 3M、Samsung 的視覺設計、EDM 與網頁切版，橫跨設計與前端實作。",
      bullets: [
        "為 3M 多個產品線設計 EDM 並切版嵌入官方網站，以可選取文字為主的切版方式優化 SEO。",
        "將艾璽官方網站改版為 Responsive Web Design。",
        "以 JavaScript 實作 Samsung 平板特輯的 Tab 切換互動，並重新編排客戶提供的視覺。",
        "與客戶來回過稿，單一專案約 1～2 週，依回饋收斂設計方向；這段經歷奠定了對 UI 細節的敏銳度，以及日後與設計師協作、落地設計系統的優勢。",
      ],
      link: { label: "艾璽官方網站", url: "https://www.ashlieworks.com/" },
    },
    {
      id: "maxidea",
      role: "視覺規劃師",
      org: "麥瑟創意策略",
      start: "2014/07",
      end: "2015/03",
      stack: ["Photoshop", "Illustrator"],
      bullets: ["運用 Adobe 系列軟體設計 POSM 陳列、動態 Banner 與網頁版型。", "負責專案時程掌控與客戶溝通。"],
    },
  ],

  teaching: [
    {
      value: "18 人",
      title: "前端專題教練",
      desc: "於六角學院擔任前端專案教練半年，同時帶領 3 組、每組約 6 位學員完成前端專案（專案規劃與技術實作指導）。",
    },
    {
      value: "6 場",
      title: "內部 AI 分享會",
      desc: "於公司內部主辦 AI 工具分享會，持續中，每場約 5 人。",
    },
    {
      value: "1 堂",
      title: "線上課程試教",
      desc: "受邀試教前端工程線上課程一堂，獲得學生正面回饋。",
    },
    {
      value: "社群",
      title: "AIPost Future Circle",
      desc: "參與社群 Cohort 01，設計兩層 AI 審核 pipeline，並分享 AI 工具相關經驗。",
    },
  ],

  education: { school: "淡江大學", dept: "資訊傳播學系", start: "2010/09", end: "2014/06" },

  certificates: [
    { title: "Adobe Certified Associate", desc: "Visual Communication using Adobe Photoshop CS3", date: "2012/02" },
    { title: "韓文檢定 TOPIK Level 2" },
    {
      title: "2024 WebConf 會場志工",
      desc: "以志工身份參與台灣前端技術年會，負責會場的現場支援與流程協助。",
      date: "2024/12",
    },
  ],
};

/** 「2025/11 – 現在」這種期間字串 */
export const periodOf = (exp: Pick<Experience, "start" | "end">) => `${exp.start} – ${exp.end ?? "現在"}`;
