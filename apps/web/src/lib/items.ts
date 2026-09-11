/** 桌面場景所有可互動物件的註冊表。 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 只用來推導下面的 ItemId 型別
const ITEM_IDS = [
  "phone",
  "laptop",
  "headphones",
  "musicPlayer",
  "backpack",
  "notebook",
  "album",
  "skateboard",
  "doll",
  "bubbleTea",
  "bookStack",
  "poster",
  "window",
] as const;

export type ItemId = (typeof ITEM_IDS)[number];

export interface ItemMeta {
  id: ItemId;
  label: string;
  emoji: string;
  /** hover 時顯示的提示 */
  hint: string;
  /** 連續點擊到第 3 次 / 第 10 次的特別台詞(見 reaction-toast.tsx) */
  snark?: [string, string];
}

export const ITEMS: Record<ItemId, ItemMeta> = {
  phone: { id: "phone", label: "手機", emoji: "📱", hint: "點一下看 Profile,點兩下設鬧鐘" },
  laptop: { id: "laptop", label: "電腦", emoji: "💻", hint: "看看我的專案" },
  headphones: { id: "headphones", label: "耳機", emoji: "🎧", hint: "打開我的播放器" },
  musicPlayer: { id: "musicPlayer", label: "音響", emoji: "🔊", hint: "打開我的播放器" },
  backpack: { id: "backpack", label: "背包", emoji: "🎒", hint: "最近讀的書" },
  // 📓 這版構圖沒畫筆記本,熱區目前是關的(見 scene/hotspots.ts 底部的待補清單)。
  // 之後補上筆記本元素圖、把熱區開回來時,可考慮讓它改導向 /making-of(視覺製作歷程),
  // 比「喜歡的句子」更貼近筆記本的語意;現階段 /making-of 的入口只在 /resume 頁尾。
  notebook: { id: "notebook", label: "筆記本", emoji: "📓", hint: "喜歡的句子" },
  album: {
    id: "album",
    label: "唱片櫃",
    emoji: "💿",
    hint: "整櫃黑膠,想聽的話去點耳機",
    snark: ["翻過一輪了,還是那幾張最順耳", "再翻下去要幫你辦借閱證了"],
  },
  skateboard: { id: "skateboard", label: "滑板", emoji: "🛹", hint: "???" },
  doll: {
    id: "doll",
    label: "帽子",
    emoji: "🧢",
    hint: "出門才戴,在家就掛著",
    snark: ["就……一頂帽子", "好啦其實它是鎮宅之寶"],
  },
  bubbleTea: {
    id: "bubbleTea",
    label: "馬克杯",
    emoji: "☕",
    hint: "還是熱的",
    snark: ["再點也不會續杯", "好,續杯,心靈上的"],
  },
  bookStack: {
    id: "bookStack",
    label: "書架",
    emoji: "📚",
    hint: "桌上這疊是最近的心頭好",
    snark: ["別催,下一本在讀了", "你這麼有興趣,不如去點背包看書單"],
  },
  poster: {
    id: "poster",
    label: "海報",
    emoji: "🖼️",
    hint: "牆上貼的都是本命",
    snark: ["盯著看也不會播 MV", "想看的話,耳機在床上 🎧"],
  },
  window: { id: "window", label: "海景", emoji: "🌊", hint: "看向大海" },
};

/** 點擊後開啟的 overlay 種類;null 表示只做小反應(還沒想到要放什麼)。 */
export type OverlayKind = "phone" | "computer" | "books" | "notebook" | "skateboard" | "ocean";

export const ITEM_OVERLAY: Record<ItemId, OverlayKind | "player" | null> = {
  phone: "phone",
  laptop: "computer",
  headphones: "player",
  musicPlayer: "player",
  backpack: "books",
  notebook: "notebook",
  album: null,
  skateboard: "skateboard",
  doll: null,
  bubbleTea: null,
  bookStack: null,
  poster: null,
  window: "ocean",
};
