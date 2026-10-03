/**
 * `/making-of` 的內容來源 —— 照 Claude Design「視覺探索流程 v2」的定稿規格全文照搬。
 * 版型 = 12 個面板上下捲動（making-of-view.tsx，面板在 making-of-panels.tsx），這裡只決定「呈現什麼」。
 *
 * 敘事以設計稿為準（兩週、兩次放棄、一次翻轉；工具 = Gemini / ChatGPT / Illustrator），
 * 舊結合版的「並行開發／進行中」章節不在這份敘事裡，檔案與舊文案都留在 git 歷史。
 *
 * 過程圖放 `apps/web/public/making-of/`；實驗台、對照滑桿、圖層陳列不用設計稿的
 * 複製素材，直接吃場景系統的真分層檔（/scene/…，座標同一套）。
 */

/** 面板順序與頁籤文字（計數、鍵盤與深連結都以這份為準） */
export const RAIL = [
  "序幕",
  "流程",
  "01 起點",
  "02 發散",
  "03 撞牆",
  "04 手工",
  "對照",
  "05 規格",
  "架構",
  "實驗台",
  "圖層",
  "心得",
] as const;

/* ── 序幕 ─────────────────────────────────────────────── */

export const HERO = {
  eyebrow: "Visual Exploration · Process Walkthrough",
  titleLines: ["從一張好看的圖", "到一套拆解後的圖層"],
  sub: "作品集首頁互動 lofi 房間插畫的視覺探索紀錄——Gemini ✕ ChatGPT ✕ Illustrator，兩週、兩次放棄、一次翻轉。",
  stats: [
    { n: "2", unit: "Week", label: "來回的探索" },
    { n: "5", unit: "Step", label: "其中 2 個以放棄收場" },
    { n: "5", unit: "Layer", label: "可獨立替換的圖層" },
    { n: "3", unit: "Tool", label: "Gemini / ChatGPT / Illustrator" },
  ],
  videoCaption: "可點擊物件的入口頁，右上角切換四個時段、貓咪會走動，點筆電可查看個人資料",
  hint: "用 → ← 方向鍵、或下方的頁籤橫向瀏覽",
};

/* ── 00 流程（決策總覽）────────────────────────────────── */

export interface OverviewCard {
  no: string;
  heading: string;
  body: string;
  outcome: string;
  /** stop = 放棄收場（鏽紅）；go = 往下走（藍） */
  tone: "go" | "stop";
  /** 點卡片跳到的面板 hash */
  target: string;
}

export const OVERVIEW = {
  eyebrow: "00 · Overview",
  title: "整段探索，一次看完",
  sub: "五個階段的決策點：每一步為什麼往下走，以及在哪裡被迫回頭。",
  cards: [
    {
      no: "01 起點",
      heading: "不能只是一張圖",
      body: "互動需求決定了交付物：必須是可拆解的圖層系統。",
      outcome: "→ 定義規格",
      tone: "go",
      target: "challenge",
    },
    {
      no: "02 發散",
      heading: "兩個模型互為對照",
      body: "視角、風格、版面、時段四條線同時試，再收斂成一版。",
      outcome: "→ 方向定案",
      tone: "go",
      target: "divergence",
    },
    {
      no: "03 撞牆",
      heading: "拆圖層，風格跑掉",
      body: "物件單獨看還行，放回場景就對不齊。",
      outcome: "✕ 放棄一次性生成整套",
      tone: "stop",
      target: "wall",
    },
    {
      no: "04 撞牆",
      heading: "進 Illustrator 手工修",
      body: "向量化後還原度出問題，調整比重畫還久。",
      outcome: "✕ 放棄純手工修到底",
      tone: "stop",
      target: "handwork",
    },
    {
      no: "05 翻轉",
      heading: "帶著規格書回去重製",
      body: "修正稿當規格，請 AI 逐件高解析重繪。",
      outcome: "✓ 圖層系統成立",
      tone: "go",
      target: "spec",
    },
  ] satisfies OverviewCard[],
  footnote:
    "兩次「放棄」不是白做工：它們把不可行的路先淘汰掉，才換來第五階段那份夠精確的規格書。",
};

/* ── 01 起點（Challenge）──────────────────────────────── */

export const CHALLENGE = {
  eyebrow: "01 · Challenge",
  title: "需求一開始就決定了：不能只做一張完稿圖",
  sub: "只要畫面需要「切換、移動、點擊」，它就不再只是插畫問題，而是資產架構問題。",
  cards: [
    {
      tag: "TIME",
      heading: "四個時間狀態",
      body: "清晨、中午、黃昏、夜晚需要切換窗景與整體光線。",
    },
    {
      tag: "INTERACTION",
      heading: "物件可互動",
      body: "桌面、筆電與場景物件需要獨立熱區，而不是被烘焙進背景。",
    },
    {
      tag: "CHARACTER",
      heading: "角色可換狀態",
      body: "人物與貓咪有不同姿勢，並且需要獨立於房間本體。",
    },
  ],
  before: "Single flattened image",
  after: "Layered scene system",
};

/* ── 02 發散（四條線互為對照）────────────────────────── */

export interface ExploreShot {
  file: string;
  label: string;
  cap: string;
}

export interface ExploreLine {
  key: string;
  tab: string;
  hint: string;
  title: string;
  body: string;
  decision: string;
  shots: ExploreShot[];
}

export const DIVERGENCE = {
  eyebrow: "02 · 約 2026/7/12 – 7/18",
  title: "發散——Gemini ✕ ChatGPT 互為對照",
  intro:
    "把一邊生成的圖丟給另一邊參考、修正，再拿修正後的結果回頭比較——四條線同時發散、逐步收斂。",
  decisionLabel: "這條線的結論",
};

export const EXPLORE: ExploreLine[] = [
  {
    key: "view",
    tab: "01　視角",
    hint: "用哪個角度看這個房間",
    title: "視角探索——用哪個角度看這個房間",
    body: "房間要放進網站裡，得先決定「用哪個角度看」。試過從窗戶往內看的反向視角，也試過廣角俯瞰，最後在多視角比較中挑出最適合放版面的構圖。",
    decision: "反向視角與廣角俯瞰都淘汰：熱點太少、版面留白不夠。留下正面偏側的視角。",
    shots: [
      {
        file: "/making-of/p_views_reverse.webp",
        label: "反向／俯瞰視角比較",
        cap: "視角 1 從窗戶往內看、視角 2 廣角俯瞰——兩者皆淘汰。",
      },
      {
        file: "/making-of/p_views_four.webp",
        label: "四視角探索",
        cap: "「COZY STUDY/BEDROOM」四視角探索，逐一比較哪個角度最適合放進版面。",
      },
    ],
  },
  {
    key: "style",
    tab: "02　風格",
    hint: "線條粗細、彩度、光影調性",
    title: "風格方向——線條、彩度、光影調性",
    body: "線條粗細、彩度、光影調性都還沒定案之前，先讓 AI 發散出幾種不同的風格路線，再挑一個順眼、又符合作品集氣質的方向繼續往下走。",
    decision: "往 A 的方向走，再借 C 的光影邏輯。B 彩度太高，之後疊時段光線會沒有空間。",
    shots: [
      {
        file: "/making-of/p_style_a.webp",
        label: "A 暖木調",
        cap: "A · 暖木調：線條偏細、彩度低，最接近作品集原本的氣質。",
      },
      {
        file: "/making-of/p_style_b.webp",
        label: "B 橘粉調",
        cap: "B · 橘粉調：氣氛討喜，但彩度一高，之後疊時段光線就沒有空間了。",
      },
      {
        file: "/making-of/p_style_c.webp",
        label: "C 正午光",
        cap: "C · 正午光：光影對比最強，但明暗畫得太死，不利於之後拆圖層。",
      },
      {
        file: "/making-of/p_style_collage.webp",
        label: "全部攤開比較",
        cap: "把所有變體拼在同一張裡並排比較，決定最終要往哪個方向收。",
      },
    ],
  },
  {
    key: "layout",
    tab: "03　版面",
    hint: "插畫怎麼跟網站版面共存",
    title: "版面與互動構想——插畫怎麼跟網站共存",
    body: "風格大致抓到方向後，開始把插畫直接套進實際的網站版面，順便構思導覽列跟互動熱點要長什麼樣子、放在哪裡。",
    decision: "確認插畫要當成整頁背景，導覽列與熱點疊在上層——這也回頭決定了圖層必須可拆。",
    shots: [
      {
        file: "/making-of/p_layout_mockups.webp",
        label: "版面 mockup",
        cap: "把房間插畫直接當成作品集首頁背景的 mockup 嘗試。",
      },
      {
        file: "/making-of/p_ui_overlay.webp",
        label: "互動熱點構想",
        cap: "在插畫上疊導覽列與物件熱點的位置草稿。",
      },
    ],
  },
  {
    key: "time",
    tab: "04　時段",
    hint: "四個時段的光線與收斂",
    title: "四時段與收斂——氣氛與定案雛形",
    body: "時段切換是功能需求，也順勢變成視覺亮點——清晨、中午、黃昏、夜晚各有各的光線與氣氛。方向逐漸收斂之後，落定在女孩坐在桌前、貓在窗台的這個版本。",
    decision: "定案雛形：女孩在桌前、貓在窗台，四時段以「窗景＋光線」兩層變化來達成。",
    shots: [
      {
        file: "/making-of/p_times_concept.webp",
        label: "四時段概念",
        cap: "四時段概念探索（清晨 / 中午 / 黃昏 / 夜晚）。",
      },
      {
        file: "/making-of/p_converged.webp",
        label: "收斂定案",
        cap: "✓ 定案雛形：女孩在桌前、貓在窗台，氛圍已經很接近最終成品。",
      },
    ],
  },
];

/* ── 03 撞牆（第一次）─────────────────────────────────── */

export const WALL = {
  eyebrow: "03 · 第一次撞牆",
  title: "拆圖層，然後撞牆",
  sub: "視覺方向底定之後，下一步是把整張畫拆成可以獨立使用的物件圖層——這裡才真正開始卡關。",
  body: "問題不是「圖不好看」，是圖沒辦法被拆開用：物件重畫之後風格跑掉、線條粗細跟原圖對不齊，細節放大就糊掉，甚至連透視角度都對不回最初收斂的那個版本。",
  bullets: [
    { tone: "stop", text: "貼紙式拆件——線條粗細、彩度跟原圖不一致" },
    { tone: "stop", text: "Sprite sheet——細節在小尺寸下糊掉" },
    { tone: "stop", text: "角色元素表——單獨看還行，放回場景就對不齊" },
    { tone: "go", text: "灰階檢查稿——拿掉色彩只看明度，比較看得出問題在哪" },
  ] as { tone: "go" | "stop"; text: string }[],
  figures: [
    { file: "/making-of/p_sticker_sheet.webp", label: "貼紙式拆件" },
    { file: "/making-of/p_sprite_sheet.webp", label: "Sprite sheet" },
    { file: "/making-of/p_elements.webp", label: "角色與道具元素表" },
    { file: "/making-of/p_grayscale.webp", label: "灰階檢查稿" },
  ],
};

/* ── 04 手工（第二次撞牆）────────────────────────────── */

export const HANDWORK = {
  eyebrow: "04 · 第二次撞牆",
  title: "進 Illustrator，又撞一次牆",
  sub: "圖層兜不起來，於是把整張畫搬進 Illustrator，打算用向量工具救回一致性。",
  paragraphs: [
    "手動修局部、把窗景換成向量檔（.ai / .eps）試著保留可縮放性，理論上這樣就能兼顧畫質與可編輯性。但實際輸出成 SVG 之後，線條與填色的還原度都出了問題，花在調整上的時間比重畫還久。最後判斷「純手工修到底」這條路的 CP 值太低，決定放棄。",
    "這不是白做工——至少確認了「靠手工硬修救不回一致性」，讓下一步的方向變得更清楚：與其人工修圖，不如把修正過的版本當成規格，重新交給 AI 逐件重繪。",
  ],
  bg: "/making-of/p_night.webp",
};

/* ── 對照（Before / After 滑桿）──────────────────────── */

export const COMPARE = {
  eyebrow: "Before / After",
  title: "同一組圖層，換掉兩層就是另一個時段",
  baseLabel: "中午 midday ↔",
  cycleHint: "點一下切換",
  footnote:
    "光線層用 multiply 疊加統一色溫，窗景整張替換——四個時段共用同一份底圖與同一組物件。",
  /** 滑桿右側輪替的時段（左側固定中午 day）；id 對齊場景系統的 DayPhase */
  phases: [
    { id: "dawn", label: "清晨 dawn" },
    { id: "sunset", label: "黃昏 dusk" },
    { id: "night", label: "夜晚 night" },
  ] as { id: "dawn" | "sunset" | "night"; label: string }[],
};

/* ── 05 規格（翻轉）──────────────────────────────────── */

export const SPEC = {
  eyebrow: "05 · 翻轉",
  title: "帶著修正稿回到 ChatGPT",
  paragraphs: [
    "流程在這裡整個翻轉過來：從一開始的「請 AI 畫一張圖」，變成「拿著規格書請 AI 重製」。",
    "把 Illustrator 裡調整過的版本、比例、色彩都當成「規格書」，回頭請 ChatGPT 逐件重新繪製。",
  ],
  chips: [
    "規格 01 · 單一圖層、去背輸出",
    "規格 02 · 統一線條與色彩風格",
    "規格 03 · 人物 4000px、窗景 3000px",
    "規格 04 · 窗景與光線整組替換",
  ],
  figures: [
    {
      file: "/making-of/f_layout_ref.webp",
      cap: "重繪的構圖基準：每一件產出都得放回這張底圖驗證對位。",
    },
    {
      file: "/making-of/elements-overview.webp",
      cap: "依規格逐件重繪的產出一覽——全部去背、共用同一套線條與色彩。",
    },
  ],
};

/* ── 架構（資產 → 介面）──────────────────────────────── */

export const ARCH = {
  eyebrow: "From assets to interface",
  title: "資產交到前端之後，怎麼變成介面",
  sub: "資產準備好之後，前端並不是把它們「貼上去」，而是讓每一類圖層只負責一件事，狀態與互動再由介面層控制。",
  stateLine: "timeState = dawn | noon | dusk | night",
  chips: [
    "room shell",
    "window[state]",
    "objects",
    "characters",
    "overlay[state]",
    "interaction hotspots",
  ],
  points: [
    {
      heading: "State-driven scene",
      body: "同一個 time state 同步控制窗景與光線，不需要維護四張完整場景。",
    },
    {
      heading: "Independent hit areas",
      body: "互動區域與插圖資產分離，之後替換圖片不會重做事件邏輯。",
    },
    {
      heading: "Fixed visual coordinate system",
      body: "所有資產都回到同一個構圖基準驗證，避免「每張圖都合理、合起來卻不合理」。",
    },
  ],
};

/* ── 實驗台 ───────────────────────────────────────────── */

export const LAB = {
  eyebrow: "06 · 成果",
  title: "圖層實驗台",
  sub: "拆開、疊回去、換角度，也可以自己往上加圖層",
  stackHint: "拖曳 ⣿ 換順序・眼睛顯示隱藏・點層名可調位置",
  /** 觸控裝置沒有 HTML5 拖曳，提示只留點按操作 */
  stackHintTouch: "眼睛顯示隱藏・點層名可調位置",
};

/* ── 圖層陳列 ─────────────────────────────────────────── */

export interface GalleryItem {
  /** /scene/elements 檔名（不含副檔名）——陳列用的是場景真素材 */
  element: string;
  label: string;
}

export const GALLERY = {
  eyebrow: "Layer library",
  title: "圖層陳列",
  sub: "拆成單一物件之後的樣子，全部去背、共用同一套線條與色彩。滑過去看看。",
  tabs: {
    objects: {
      label: "物件 7 件",
      note: "七件家具與道具，各自獨立去背，全部共用同一套線條粗細與色彩。",
      items: [
        { element: "bed", label: "床" },
        { element: "chair", label: "椅子" },
        { element: "backpack", label: "背包" },
        { element: "skateboard", label: "滑板" },
        { element: "plant", label: "植物" },
        { element: "laptop", label: "筆電" },
        { element: "lamp", label: "檯燈" },
      ] satisfies GalleryItem[],
    },
    chars: {
      label: "角色 4 件",
      note: "貓咪共 5 個姿勢、人物 3 個姿勢，皆為高解析重繪，這裡各展示其中幾款。",
      items: [
        { element: "cat-walk", label: "貓・散步" },
        { element: "girl-stretch", label: "伸懶腰" },
        { element: "girl-cat", label: "摸貓" },
        { element: "girl-music", label: "戴耳機聽歌" },
      ] satisfies GalleryItem[],
    },
  },
  /** 散落擺位（% 座標 + px 寬 + 旋轉角），照設計稿的 SCATTER */
  scatter: {
    objects: [
      { x: 10, y: 20, w: 165, r: -6 },
      { x: 16, y: 64, w: 135, r: 5 },
      { x: 8, y: 88, w: 115, r: -3 },
      { x: 31, y: 9, w: 115, r: 7 },
      { x: 68, y: 10, w: 135, r: -5 },
      { x: 88, y: 42, w: 165, r: 4 },
      { x: 80, y: 80, w: 140, r: -7 },
    ],
    chars: [
      { x: 11, y: 28, w: 180, r: -5 },
      { x: 23, y: 78, w: 150, r: 6 },
      { x: 80, y: 20, w: 165, r: 4 },
      { x: 87, y: 70, w: 180, r: -4 },
    ],
  },
};

/* ── 心得 ─────────────────────────────────────────────── */

export const TAKEAWAYS = {
  eyebrow: "07 · Takeaways",
  title: "AI 與人，各做了什麼",
  sub: "兩週、兩次放棄，換來的幾個心得。",
  division: [
    {
      ai: "大量發散：一次給出多種視角、風格、時段變體",
      mid: "探索",
      me: "訂規格：透視、線條、色彩、尺寸的一致性標準",
    },
    {
      ai: "單一物件的重繪與高解析度輸出",
      mid: "產出",
      me: "做品管：核對每件產出能不能放回同一個場景",
    },
    {
      ai: "依照規格書逐件產出去背圖層",
      mid: "收斂",
      me: "做決策：什麼時候該收斂、什麼時候該放棄",
    },
  ],
  divisionHeads: { ai: "AI 負責", mid: "分工", me: "我負責" },
  cards: [
    {
      no: "01",
      heading: "AI 擅長什麼",
      body: "單一物件的風格探索、單張重繪、放大到高解析度——這些一次只處理「一件事」的任務，AI 做得又快又好。",
    },
    {
      no: "02",
      heading: "AI 不擅長什麼",
      body: "讓好幾張圖維持同一套透視、同一種線條粗細、同一個光源方向。只要牽涉到「跨圖層的一致性」，就得靠人工反覆核對修正。",
    },
    {
      no: "03",
      heading: "人的角色是什麼",
      body: "與其說是「畫圖」，更像是訂規格、抓一致性、做品管——把一堆各自獨立的產出，收斂成一套真正能用的系統。",
    },
    {
      no: "04",
      heading: "「放棄」也是一種進度",
      body: "放棄純手繪、放棄一次性生成整張圖，看似繞了遠路，其實是把不可行的路先淘汰掉，才換來後面更準確的規格書。",
    },
  ],
  credit: "Tofu Tseng ・ 2026.07",
  tools: ["Gemini", "ChatGPT", "Adobe Illustrator"],
};
