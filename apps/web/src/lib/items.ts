/** 桌面場景所有可互動物件的註冊表。 */
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
}

export const ITEMS: Record<ItemId, ItemMeta> = {
  phone: { id: "phone", label: "手機", emoji: "📱", hint: "點一下看 Profile,點兩下設鬧鐘" },
  laptop: { id: "laptop", label: "電腦", emoji: "💻", hint: "看看我的專案" },
  headphones: { id: "headphones", label: "耳機", emoji: "🎧", hint: "打開我的播放器" },
  musicPlayer: { id: "musicPlayer", label: "音響", emoji: "🔊", hint: "打開我的播放器" },
  backpack: { id: "backpack", label: "背包", emoji: "🎒", hint: "最近讀的書" },
  notebook: { id: "notebook", label: "筆記本", emoji: "📓", hint: "喜歡的句子" },
  album: { id: "album", label: "唱片櫃", emoji: "💿", hint: "整櫃黑膠,想聽的話去點耳機" },
  skateboard: { id: "skateboard", label: "滑板", emoji: "🛹", hint: "???" },
  doll: { id: "doll", label: "帽子", emoji: "🧢", hint: "還在想要放什麼" },
  bubbleTea: { id: "bubbleTea", label: "馬克杯", emoji: "☕", hint: "還是熱的" },
  bookStack: { id: "bookStack", label: "書架", emoji: "📚", hint: "還在想要放什麼" },
  poster: { id: "poster", label: "海報", emoji: "🖼️", hint: "還在想要放什麼" },
  window: { id: "window", label: "海景", emoji: "🌊", hint: "看向大海" },
};

/** 點擊後開啟的 overlay 種類;null 表示只做小反應(還沒想到要放什麼)。 */
export type OverlayKind =
  | "phone"
  | "computer"
  | "books"
  | "notebook"
  | "skateboard"
  | "ocean";

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
