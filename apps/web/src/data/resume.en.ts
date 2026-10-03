import type { Resume } from "./resume";

/**
 * 英文版履歷(/resume/en),結構跟 resume.ts 一樣
 * 內容整理自英文履歷母版;現職一樣不寫公司名
 */
export const resumeEn: Resume = {
  nameEn: "TSENG FU CHUN",
  nameZh: "曾輔君",
  headline: "Frontend Engineer | AI adoption · Process building · Team enablement",
  location: "Taoyuan, Taiwan",
  email: "tsengbatty@gmail.com",
  github: { label: "github.com/TsengTofu", url: "https://github.com/TsengTofu" },
  medium: { label: "tsengbatty.medium.com", url: "https://tsengbatty.medium.com/" },

  summary:
    "Frontend engineer with ~7 years of experience (plus 3 years in graphic and web design), specialising in React, TypeScript and Next.js for B2B SaaS. I do structural work in products with technical debt: a five-level nested hierarchical table with virtualisation, config-driven sidebar and permission architectures, contract-signing flows and PDF pipelines, and architecture-driven refactoring (Semi Design → Shadcn/ui, an app-wide upload component rewrite, Turborepo service abstraction). I diagnosed and fixed a long-standing release conflict problem, and have been bringing AI into the daily engineering workflow since July 2024.",

  skills: [
    { id: "framework", label: "Frameworks & languages", items: ["React", "TypeScript", "Next.js (SPA / SSR)", "Vue", "JavaScript"] },
    {
      id: "data",
      label: "State, forms & data",
      items: ["Zustand", "React Hook Form", "TanStack Query", "TanStack Table", "Zod", "REST API integration"],
    },
    {
      id: "style",
      label: "Styling & design systems",
      items: ["Shadcn/ui", "Tailwind CSS", "Semi Design", "SCSS Modules", "Design tokens", "Storybook (exploring)"],
    },
    { id: "test", label: "Testing", items: ["Jest", "React Testing Library"] },
    {
      id: "tooling",
      label: "Architecture & tooling",
      items: ["Turborepo (monorepo)", "Git / GitLab CI", "release-it", "Commitizen", "commitlint", "Husky", "GPG signing", "i18n"],
    },
    {
      id: "ai",
      label: "AI engineering",
      items: ["Claude Code (skills, sandbox)", "MCP (Notion / Figma / Shadcn UI)", "AI-agent-assisted development", "AI code review"],
    },
    {
      id: "collab",
      label: "Collaboration",
      items: ["Cross-functional work (PM / design / backend / QA)", "Spec alignment", "Code review culture", "Agile / Scrum", "Building team processes from zero"],
    },
    { id: "viz", label: "Visualisation", items: ["D3", "Vis", "ECharts", "Shadcn Chart"] },
    { id: "lang", label: "Languages", items: ["Mandarin (native)", "English", "Korean (TOPIK Level 2)"] },
  ],

  experiences: [
    {
      id: "current",
      role: "Frontend Engineer (Refactoring)",
      org: "B2B SaaS",
      start: "2025/11",
      stack: ["React", "Next.js", "TypeScript", "Shadcn/ui", "Turborepo", "Claude Code", "MCP"],
      highlights: [
        ["AI adoption", "Unified the release flow into a single command — daily release from 60 to 10 minutes; an architecture review gate for AI-generated code brings each task to QA in ~1.5–2 days."],
        ["Governance & spread", "Moved sensitive config out of skills, set permission rules and onboarded teammates; ran 6 internal AI sessions; secured AI-agent budget."],
        ["Process from zero", "Introduced Sprint, Git strategy and PR reviews; won cross-team agreement with an incremental plan; found the root cause of production conflicts — 20 smooth releases since."],
        ["Requirements & delivery", "Clarified scope with PM, design and backend, offering multiple options; shipped the contract-signing flow in 1.5 months; led the component-library migration and the app-wide upload component rewrite (~100 files)."],
        ["Ownership", "Took over the entire frontend from July 2026 and completed the handover docs without slowing delivery."],
      ],
      intro:
        "Joined with refactoring as the core mandate and shipped code in week one. Delivered complex features early, then led architecture refactoring and process buildout, and took over full frontend ownership after a team restructure.",
      metrics: [
        { value: "60 → 10 min", label: "Daily release" },
        { value: "1.5–2 days", label: "Per task to QA" },
        { value: "1.5 months", label: "Contract-signing flow" },
        { value: "~100 files", label: "Upload component rewrite" },
      ],
      bullets: [
        ["Contract signing", "Delivered a multi-step contract-signing flow with complex variable-system logic (e-signature, stamp upload and crop, attachments, PDF generation and preview) in 1.5 months, using AI-agent-assisted development and repeated spec sessions with PM, design and backend, proposing multiple solution options for trade-off."],
        ["AI adoption", "Using AI in daily development since July 2024 (across two employers). Unified a release skill, release-it, GPG signing and Commitizen under Claude Code, cutting the daily release from ~60 to 10 minutes; established an architecture review gate for all AI-generated code, bringing a task to QA in ~1.5–2 days."],
        ["Skills as team assets", "Moved sensitive skill configuration into environment variables for cross-project reuse, resolved local-vs-project skill precedence with a naming convention and onboarded other engineers onto the release flow; set up Claude Code auto-review on PRs, debugged Notion MCP (local vs cloud) auth, and used Claude with Notion to batch-sync task states."],
        ["Release conflicts", "Diagnosed a long-standing production release conflict: blanket squash merges collapsed history on test → prod, freezing the merge base and compounding conflicts. Introduced a targeted rebase-then-merge remedy plus hotfix and release branch conventions; production then shipped smoothly from v1.0.27 to v1.0.48."],
        ["Component library", "Led the progressive migration from Semi Design to Shadcn/ui, unifying design tokens and component interfaces; led an app-wide rewrite of the file upload component on a Shadcn base, including stamp upload and cropping (1:1 lock, rotate and flip, custom toolbar) — a merge touching close to 100 files, converged over multiple design reviews; also built a shared calendar and config-driven permission buttons."],
        ["Timezones", "Designed a timezone-agnostic calendar component and drove an app-wide convention: convert only at system boundaries and distinguish preferred-timezone values from pure date strings; aligned with QA, design and PM, and agreed with backend to store contract times at +0 while the admin UI renders in the admin timezone."],
        ["Monorepo architecture", "Service abstraction in a Turborepo monorepo (account service via Zustand Provider plus useQuery cache); designed a PDF service (Next.js App Router, Turborepo, react-pdf / Puppeteer), weighing SSRF allow-listing, timeouts, memory leaks and an async MQ + worker option (design phase)."],
        ["Driving refactoring", "Persuaded PM and design to launch the frontend refactoring programme; in a release-process dispute, argued for incremental change over a big-bang rewrite and secured cross-team agreement."],
        ["Sprint & process", "Helped the team adopt Sprint from zero; defined Git branching (release as sprint start, resolving Test/Prod divergence), a PR review system and a handoff rule where reviewed work is marked ready-for-test and the PM decides release timing; added GitLab MR labels, a pre-commit build check and dedicated Slack channels for deployment notifications."],
        ["Code review", "Reviewed frontend PRs continuously (up to 6 a day, 100+ in total), adapting to each teammate's working style while protecting focus time; from July 2026 took over all frontend development and maintenance and completed the handover documentation."],
        ["Feature breadth", "Lease overview and contract viewer (RWD, tree select), space handover and return, operations and billing dashboards (Shadcn Chart, multiple APIs, permission and state UIs), member list filters, bank virtual-account integration, lease-intent notifications with invoicing options and floor-plan attachments; maintained and extended the existing i18n setup."],
        ["Sharing", "Ran 6 internal AI-tooling sessions (ongoing, ~5 attendees each) and secured company AI-agent budget; writes on Medium about Jest testing, Git workflows and data visualisation."],
      ],
    },
    {
      id: "commeet",
      role: "Frontend Engineer",
      org: "COMMEET",
      start: "2019/10",
      end: "2025/10",
      stack: ["Next.js", "TypeScript", "Zustand", "TanStack", "Vue", "D3"],
      highlights: [
        ["Expense platform", "Aligned approval and reporting needs with finance and PM; built a five-level nested hierarchical table; refactored the sidebar to be config-driven (6 files → 1 config); established PR reviews."],
        ["TRP data platform", "Defined collaboration process, coding style and code review from zero; wrote developer and release docs."],
        ["TSMC visualisation SPA", "Worked directly with the client — two calls a week for four months, from requirements to delivery."],
      ],
      intro:
        "Six B2B platforms, growing from UI implementation to leading collaboration process and architecture, and setting up the frontend collaboration practices for both TRP and COMMEET from scratch.",
      metrics: [
        { value: "6", label: "B2B platforms" },
        { value: "6 files → 1", label: "Sidebar change surface" },
        { value: "5 levels", label: "Nested hierarchical table" },
        { value: "4 months", label: "Twice-weekly client calls" },
      ],
      groups: [
        {
          title: "COMMEET expense platform",
          stack: ["Next.js", "TypeScript", "Zustand", "TanStack Query / Table", "Tailwind CSS", "Koa", "SCSS Modules"],
          intro: "A virtual-card expense platform covering form submission and approval, card issuance, budgets and reporting.",
          bullets: [
            ["Hierarchical table", "Five levels of unbounded nesting with child rows loaded on demand by parent ID; split rendering from storage and virtualised the DOM to solve memory pressure on large datasets; supported column pinning, resizing and group boundaries."],
            ["Sidebar refactor", "Led a config-driven sidebar refactor (Sep–Nov 2025): a strategy pattern wrapping each menu type's settings, data hook and rendering behind one interface; resolved conflicts with React's Rules of Hooks by re-assigning hook ownership; menu changes went from 6 files to a single config."],
            ["Form field factory", "Separated field configuration from layout logic so new fields need no component changes."],
            "Built complex forms, approval and card-issuance flows; introduced Zustand and TanStack Query / Table (the first technology selection I drove to team-wide adoption).",
            "Built reusable components and custom hooks for business logic; strengthened type safety with TypeScript.",
            "Wrote component unit tests with Jest and React Testing Library.",
            "Established the team's pull-request review process.",
          ],
        },
        {
          title: "TRP travel data platform",
          stack: ["Next.js", "ECharts", "Koa", "SCSS Modules"],
          intro: "A travel data platform, built from scratch.",
          bullets: [
            "Defined collaboration process, coding style and code review with the team from zero.",
            "Worked with UI designers on guidelines such as the colour system; built platform components and integrated backend APIs.",
            "Wrote developer docs, Git and deployment flow diagrams, style rules and shared style variables.",
          ],
        },
        {
          title: "TSMC visualisation SPA",
          stack: ["Vue", "D3", "Vis", "JavaScript"],
          intro: "Decoupled frontend and backend collaboration via API docs and Postman; two calls a week for four months, from requirements and prototype to final calibration.",
          bullets: ["Built article browsing, search, comments and private messages (CRUD).", "Visualised business data with D3 / Vis; quarterly report upload and management."],
        },
        {
          title: "Maintenance projects",
          intro: "Acer travel service platform, Tripsaas and the Tripresso website (Vue / Backbone): layout, features, performance and legacy architecture.",
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
      highlights: ["Full-stack bootcamp: built the STYLiSH e-commerce site from scratch and studied JavaScript fundamentals."],
      bullets: [
        "Built STYLiSH from scratch, integrating RESTful APIs and shipping the same features on web and app.",
        "Studied JavaScript fundamentals with classmates, including prototypes, this and closures.",
        "Built a website with React from scratch.",
      ],
      link: { label: "STYLiSH", url: "https://tsengtofu.github.io/stylish_test/" },
    },
    {
      id: "ashlie",
      role: "Web Designer",
      org: "Ashlie Works",
      start: "2015/07",
      end: "2018/09",
      stack: ["HTML", "CSS", "JavaScript", "AJAX", "Photoshop", "Illustrator"],
      highlights: [
        "Visual design, EDM and responsive layouts for brands including 3M and Samsung, spanning design and frontend implementation.",
        "This background is why I can work directly from mockups and partner closely with designers.",
      ],
      intro: "Visual design, EDM and web layouts for 3M and Samsung, spanning design and frontend implementation.",
      bullets: [
        "Designed EDMs for several 3M product lines and embedded them in the official site, using selectable-text layouts for SEO.",
        "Rebuilt the company website as a responsive site.",
        "Built the tab interactions for a Samsung tablet feature in JavaScript and re-laid out the client's visuals.",
        "Iterated with clients over one to two weeks per project, converging the design through feedback.",
      ],
      link: { label: "Ashlie Works", url: "https://www.ashlieworks.com/" },
    },
    {
      id: "maxidea",
      role: "Visual Planner",
      org: "Maxidea Creative Strategy",
      start: "2014/07",
      end: "2015/03",
      stack: ["Photoshop", "Illustrator"],
      highlights: ["Designed POSM displays, animated banners and web layouts with Adobe tools, and managed timelines and client communication."],
      bullets: ["Designed POSM displays, animated banners and web layouts with Adobe tools.", "Managed project timelines and client communication."],
    },
  ],

  teaching: [
    {
      value: "18",
      title: "Frontend project mentor",
      desc: "Mentored at HexSchool for six months, coaching 3 groups of ~6 students concurrently through project planning and implementation.",
    },
    { value: "6", title: "Internal AI sessions", desc: "Ran AI-tooling sharing sessions at work — ongoing, ~5 attendees each." },
    { value: "1", title: "Guest lecture", desc: "Invited to teach one session of an online frontend course; positive student feedback." },
    {
      value: "Community",
      title: "AIPost Future Circle",
      desc: "Cohort 01 member; designed a two-stage AI review pipeline and shared AI-tooling experience.",
    },
  ],

  education: { school: "Tamkang University", dept: "Department of Information and Communication", start: "2010/09", end: "2014/06" },

  certificates: [
    { title: "Adobe Certified Associate", desc: "Visual Communication using Adobe Photoshop CS3", date: "2012/02" },
    { title: "TOPIK Level 2", desc: "Test of Proficiency in Korean" },
    { title: "2024 WebConf Taiwan volunteer", desc: "On-site support and run-of-show help at Taiwan's frontend conference.", date: "2024/12" },
  ],
};
