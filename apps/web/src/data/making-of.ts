/**
 * `/making-of` 視覺風格製作歷程的內容來源。版型已定稿為結合版（making-of-hybrid.tsx）：
 * 總覽頁 + 可點擊時間軸，內容與呈現分離 —— 這裡只決定「呈現什麼」。
 *
 * ── 素材補檔流程（過程圖之後才會補）──────────────────────────────
 * 1. 把圖丟進 `apps/web/public/making-of/`（路徑慣例：`/making-of/<檔名>`）。
 * 2. 把下面對應那筆 step 的 `asset.src` 從 `null` 改成該路徑字串。
 * 3. 存檔即可 —— AssetSlot 會自動從「素材待補」灰卡換成圖片，元件一行都不用動。
 *    ratio 決定版位比例，補圖時建議照該比例裁切以免變形。
 *
 * ── 為什麼展演設定（accent / decor）寫在資料裡 ──────────────────
 * 這些值和步驟是一對一綁定的，寫成平行陣列再用 index 對齊很容易在增刪步驟時錯位，
 * 所以直接掛在該筆資料上。它們都是可序列化的純值（hex 字串、檔名），
 * 不放 React 元件或函式，資料檔維持能被 server component 直接讀取。
 */

/** 這趟歷程用到的工具 —— icon 與配色對照表在 `components/making-of/tool-badge.tsx` */
export type MakingOfTool = "Gemini" | "ChatGPT" | "Claude" | "Illustrator" | "Next.js" | "GSAP";

/** 階段（章節）：把 9 個步驟收攏成 6 個敘事段落 */
export interface MakingOfPhase {
  id: "spark" | "wall" | "parallel" | "redraw" | "assemble" | "next";
  title: string;
  subtitle: string;
  /** 該階段重點色（hex）：時間軸節點、章節色條與 STEP 標籤都吃這個 */
  accent: string;
}

/** 過程圖版位；`src` 為 null 時顯示「素材待補」佔位灰卡（caption 照樣顯示） */
export interface MakingOfAsset {
  /** null = 尚未補圖；有值時是 public 底下的絕對路徑，例：`/making-of/gemini-brief.webp` */
  src: string | null;
  /** 圖說；佔位狀態下也會顯示，說明這格之後要放什麼 */
  caption: string;
  ratio: "wide" | "square" | "tall";
}

export interface MakingOfStep {
  /** 也是 hash anchor（例：`/making-of#gemini-brief`） */
  id: string;
  /** aside = 動機自白，不編步驟號，用引言語彙呈現 */
  kind: "step" | "aside";
  phase: MakingOfPhase["id"];
  title: string;
  /** 體感時間，例：「約兩天」 */
  period?: string;
  /** 真實日期錨點，例：「2026-05-24」 */
  dateAnchor?: string;
  /** 2-4 句的第一人稱敘述 */
  body: string;
  tools: MakingOfTool[];
  /** 這步撞到的牆 */
  problems?: string[];
  asset?: MakingOfAsset;
  /** 章節裝飾貼紙（element = public/scene/elements 的檔名，不含副檔名）；
      目前版型只取該章第一筆、釘在面板右下 */
  decor?: { element: string }[];
}

/** 真實時間錨點（對照現實行事曆用，不是體感時間） */
export interface MakingOfMilestone {
  /** YYYY-MM-DD；shortDate 依位置切月日，格式錯 tsc 會擋 */
  date: `${number}-${number}-${number}`;
  label: string;
  /** 所屬階段 —— 日期壓在時間軸節點下、label 顯示在該章面板內 */
  phase: MakingOfPhase["id"];
}

export interface MakingOfStat {
  /** 總覽卡 icon / 色票對照表（making-of-hybrid.tsx 的 STAT_META）用這個對齊 */
  id: "duration" | "tools" | "layers" | "subscription";
  value: string;
  label: string;
}

export const MAKING_OF_PHASES: MakingOfPhase[] = [
  {
    id: "spark",
    title: "風格探索",
    subtitle: "把腦中模糊的房間，換成看得見的參考圖",
    accent: "#e8a0bf",
  },
  {
    id: "wall",
    title: "產圖撞牆",
    subtitle: "圖是好看的，但它搬不進網站",
    accent: "#e9b44c",
  },
  {
    id: "parallel",
    title: "並行開發",
    subtitle: "視覺卡住，那就先讓程式跑起來",
    accent: "#7c9ef8",
  },
  {
    id: "redraw",
    title: "打掉重畫",
    subtitle: "訂一個月 Illustrator，一件家具一件家具重新描",
    accent: "#d9a066",
  },
  {
    id: "assemble",
    title: "拆層整合",
    subtitle: "把畫稿拆成程式拿得動的素材",
    accent: "#5fae74",
  },
  {
    id: "next",
    title: "進行中",
    subtitle: "房間還在長，清單也還沒清完",
    accent: "#4a3c30",
  },
];

/**
 * 步驟主體（依時間順序）。「STEP NN」序號是渲染時由 kind === "step"
 * 逐筆遞增算出來的，刻意不寫進資料 —— 之後在中間插一步不用重編號。
 */
export const MAKING_OF_STEPS: MakingOfStep[] = [
  {
    id: "gemini-brief",
    kind: "step",
    phase: "spark",
    title: "先跟 Gemini 把「感覺」聊出來",
    period: "約兩天",
    dateAnchor: "2026-05-24",
    body: "一開始我沒有畫面，只有一個模糊的念頭：想用一個房間當作這個網站的入口。於是先找 Gemini 聊風格 —— 光線、色溫、視角、要溫暖還是要冷調，一輪一輪把形容詞換成參考圖。兩天後我的 Downloads 多了一疊房間，方向大致定了：插畫感、暖色、有一扇看得到海的窗。",
    tools: ["Gemini"],
    asset: { src: "/making-of/p_style_collage.webp", caption: "Gemini 給的房間風格方向", ratio: "wide" },
    decor: [{ element: "lamp" }],
  },
  {
    id: "chatgpt-tugofwar",
    kind: "step",
    phase: "spark",
    title: "和 ChatGPT 的拉鋸戰：要什麼、不要什麼",
    period: "約一週",
    body: "方向定了就換 ChatGPT 補細節，結果變成一場拉鋸戰：我說要滑板，它給我單車；我說不要地毯，下一張整片地都鋪滿了。那一週我幾乎都在寫「要與不要」的清單，再把生成結果一張張比對。畫面確實愈來愈靠近腦中的房間，但每次微調都是整張重畫，沒有一次是真的「只改那裡」。",
    tools: ["ChatGPT"],
    asset: { src: "/making-of/p_converged.webp", caption: "反覆生成：要與不要的元素拉鋸", ratio: "wide" },
    decor: [{ element: "skateboard" }],
  },
  {
    id: "three-walls",
    kind: "step",
    phase: "wall",
    title: "連撞三面牆",
    period: "約三天",
    body: "等我準備把圖搬進網站，連撞三面牆：放大就糊、想單獨移動一件家具卻拆不出圖層，退而求其次自己手刻 SVG，線條是乾淨了，味道卻整個不見。三天下來我才想通一件事 —— 生成圖給我的是「一張圖」，而我要的是「一個能被程式操作的場景」，這兩件事從頭就不是同一個東西。",
    tools: ["ChatGPT"],
    problems: ["畫素不夠，放大就糊", "整張圖無法拆成獨立圖層", "改手刻 SVG，線條乾淨但觀感不對"],
    asset: { src: "/making-of/p_sticker_sheet.webp", caption: "產圖問題對比", ratio: "square" },
    decor: [{ element: "laptop" }],
  },
  {
    id: "claude-demo",
    kind: "step",
    phase: "parallel",
    title: "視覺還沒好，先用佔位符把場景跑起來",
    period: "約兩天半",
    dateAnchor: "2026-07-12 → 07-14",
    body: "視覺卡住，那就換一條路走。我用 Claude Code 在兩天半內把 Next.js 專案、場景座標系統、熱區與互動全部搭起來，畫面上是清一色的灰色方塊佔位符，但點得動、切得了時段、該有的反應都在。這一步救了整個專案：視覺跟程式從此並行，誰也不用等誰。",
    tools: ["Claude", "Next.js"],
    asset: { src: null, caption: "佔位符時期的場景 demo", ratio: "wide" },
    decor: [{ element: "phone" }],
  },
  {
    id: "illustrator-redraw",
    kind: "step",
    phase: "redraw",
    title: "訂一個月 Illustrator，自己重畫",
    period: "訂閱一個月",
    body: "最後我決定打掉重畫。訂了一個月的 Illustrator，把生成圖墊在底下當草稿，一件家具一件家具重新描 —— 筆刷、線寬、上色方式都試過好幾輪才定下來。慢是真的慢，但畫完之後每個元素都是獨立圖層：要換位置、要加互動、要讓它在夜裡亮起來，程式都拿得動。",
    tools: ["Illustrator"],
    problems: ["生成圖的元素無法被 AI Agent 個別控制"],
    asset: { src: null, caption: "Illustrator 重畫：筆刷與圖層測試", ratio: "tall" },
    decor: [{ element: "plant" }],
  },
  {
    id: "why-i-did-this",
    kind: "aside",
    phase: "redraw",
    title: "為什麼要花兩個多月做這件事？",
    body: "常有人問我為什麼不直接投履歷就好。第一，我沒有作品集，履歷上寫再多「導入 AI 提升效率」，都不如一個能點開來玩的東西有說服力。第二，我想親手把 AI Agent 的開發工作流從頭跑一遍，而不是只在會議上引用別人的心得。第三，我是設計背景出身的前端 —— 與其做一頁條列式自介，不如把喜歡的東西全擺進房間裡，讓它自己說話。",
    tools: [],
  },
  {
    id: "perspective-pingpong",
    kind: "step",
    phase: "redraw",
    title: "透視校正的乒乓球",
    period: "反覆數回合",
    body: "重畫最難的不是線條，是透視。房間是有深度的，桌子、床、櫃子得落在同一組消失點上，只要有一件歪掉，整個空間就會怪得說不上來。我後來的做法是畫一版丟給 ChatGPT 幫我抓歪掉的地方，拿回 Illustrator 改，改完再丟一次 —— 這顆球來回打了好幾個回合才收斂。",
    tools: ["Illustrator", "ChatGPT"],
    problems: ["透視要反覆校正", "AI 指出問題 → 回頭改細節，來回多輪才收斂"],
    asset: { src: null, caption: "透視校正前後對比", ratio: "square" },
    decor: [{ element: "chair" }],
  },
  {
    id: "slice-and-import",
    kind: "step",
    phase: "assemble",
    title: "拆層、去背、量座標",
    period: "約三天",
    dateAnchor: "2026-07-24 → 07-26",
    body: "最後三天是把畫稿變成素材：底圖清空只留房間空殼，家具、四時段窗景、打光層、人物三態全部拆成獨立去背檔，再一件一件量出它在底圖上的像素座標。座標一對上，場景就活了 —— 貓的藏點、時段切換、互動熱區，全都是接在這套座標系統上長出來的。",
    tools: ["ChatGPT", "Claude"],
    asset: { src: "/making-of/elements-overview.webp", caption: "拆層後的 WebP 素材一覽", ratio: "wide" },
    decor: [{ element: "cat-walk" }],
  },
  {
    id: "whats-next",
    kind: "step",
    phase: "next",
    title: "房間還沒畫完",
    period: "進行中",
    body: "筆記本、書堆、馬克杯這幾個觸發點目前還缺元素圖，補上之後就能把熱區開回來；我也想讓貓多幾個藏身處，讓窗外的海再多發生一點事。這個網站大概會一直維持在「進行中」的狀態 —— 就像我的職涯一樣，永遠有下一版。",
    tools: ["Claude", "GSAP"],
    decor: [{ element: "cat-sleep" }],
  },
];

/** 對照現實行事曆的時間錨點（注意：刻度間距不等比，只表示先後） */
export const MAKING_OF_MILESTONES: MakingOfMilestone[] = [
  { date: "2026-05-24", label: "Gemini 產圖檔出現在 Downloads", phase: "spark" },
  { date: "2026-07-12", label: "repo 建立、場景 v3 → v4", phase: "parallel" },
  { date: "2026-07-13", label: "底圖 v3 + 首批分層素材（PIL 去背）", phase: "parallel" },
  { date: "2026-07-14", label: "比例與藏點修正回合", phase: "parallel" },
  {
    date: "2026-07-24",
    label: "清空底圖：12 件家具 + 四時段窗景 + 打光層 + 人物三態",
    phase: "assemble",
  },
  { date: "2026-07-25", label: "三花貓五姿勢藏點系統", phase: "assemble" },
  { date: "2026-07-26", label: "/resume 互動履歷頁", phase: "assemble" },
];

export const MAKING_OF_STATS: MakingOfStat[] = [
  { id: "duration", value: "約 2.5 個月", label: "總歷時" },
  { id: "tools", value: "4", label: "AI 工具" },
  { id: "layers", value: "24", label: "分層素材 PNG" },
  { id: "subscription", value: "1 個月", label: "Illustrator 訂閱" },
];
