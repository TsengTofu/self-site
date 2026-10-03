import { create } from "zustand";
import { ITEM_OVERLAY, type ItemId, type OverlayKind } from "@/lib/items";
import { songs } from "@/data/music";

/** 右上角狀態:auto = 跟著場景裡的女生;online / away = 手動固定 */
export type PresenceMode = "auto" | "online" | "away";

/** 場景時段:auto = 跟著使用者時區,其餘為手動固定 */
export type DayPhase = "dawn" | "day" | "sunset" | "night";
export type PhaseMode = "auto" | DayPhase;

interface Reaction {
  itemId: ItemId;
  nonce: number; // 每次點擊遞增,讓同一個物件能重複觸發 toast
}

/** 音樂播放器面板狀態:hidden = 關閉、expanded = 全螢幕播放、mini = 左下角的小卡片 */
export type PlayerMode = "hidden" | "expanded" | "mini";

interface SceneState {
  /** 目前開啟的 overlay */
  overlay: OverlayKind | null;
  /** 觸發 overlay 的物件在視窗中的位置(動畫起點) */
  origin: DOMRect | null;
  /** 音樂播放器面板狀態 */
  playerMode: PlayerMode;
  /** 正在播的歌 */
  currentSongId: string | null;
  /** 展開播放器的動畫起點 */
  playerOrigin: DOMRect | null;
  /** 尚未實作功能的物件被點擊時的小反應 */
  reaction: Reaction | null;
  /** 在線狀態:模式 + 自動循環的當前值 */
  presenceMode: PresenceMode;
  autoPresent: boolean;
  /** 時段:auto 或手動固定某個時段 */
  phaseMode: PhaseMode;

  openItem: (id: ItemId, rect?: DOMRect) => void;
  openOverlay: (kind: OverlayKind, rect?: DOMRect) => void;
  closeOverlay: () => void;
  /** 展開播放器;不重置 currentSongId(mini 播放中重新展開要繼續播) */
  expandPlayer: (rect?: DOMRect) => void;
  /** 收合成左下角的 mini 小卡片 */
  minimizePlayer: () => void;
  /** 完全關閉播放器(= 停止播放) */
  closePlayer: () => void;
  /** 播放指定歌曲 */
  playSong: (id: string) => void;
  clearReaction: () => void;
  setPresenceMode: (mode: PresenceMode) => void;
  setAutoPresent: (present: boolean) => void;
  setPhaseMode: (mode: PhaseMode) => void;
}

/** 目前是否「在座/上線」:手動模式優先,auto 跟著場景循環 */
export const selectIsOnline = (s: SceneState) =>
  s.presenceMode === "auto" ? s.autoPresent : s.presenceMode === "online";

export const useSceneStore = create<SceneState>((set, get) => ({
  overlay: null,
  origin: null,
  playerMode: "hidden",
  currentSongId: null,
  playerOrigin: null,
  reaction: null,
  presenceMode: "auto",
  autoPresent: true,
  phaseMode: "auto",

  openItem: (id, rect) => {
    const target = ITEM_OVERLAY[id];
    if (target === null) {
      const prev = get().reaction;
      set({ reaction: { itemId: id, nonce: (prev?.nonce ?? 0) + 1 } });
      return;
    }
    if (target === "player") {
      // 全螢幕播放器沒有「還沒選歌」的空畫面,沒在播就直接從第一首開始
      if (!get().currentSongId) set({ currentSongId: songs[0]?.id ?? null });
      get().expandPlayer(rect);
      return;
    }
    set({ overlay: target, origin: rect ?? null });
  },

  openOverlay: (kind, rect) => set({ overlay: kind, origin: rect ?? null }),
  closeOverlay: () => set({ overlay: null, origin: null }),
  expandPlayer: (rect) => set({ playerMode: "expanded", playerOrigin: rect ?? null }),
  minimizePlayer: () => set({ playerMode: "mini" }),
  closePlayer: () => set({ playerMode: "hidden", currentSongId: null, playerOrigin: null }),
  playSong: (id) => set({ currentSongId: id }),
  clearReaction: () => set({ reaction: null }),
  setPresenceMode: (mode) => set({ presenceMode: mode }),
  setAutoPresent: (present) => set({ autoPresent: present }),
  setPhaseMode: (mode) => set({ phaseMode: mode }),
}));
