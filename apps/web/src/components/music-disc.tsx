interface MusicDiscProps {
  /** 歌曲封面(YouTube 縮圖);沒有的話畫成彩虹反光的空白光碟 */
  image?: string | null;
  /** 沒有封面時,標籤圈用的代表色 */
  coverColor?: string | null;
  /** 對應 Tailwind size-11 / size-12 —— 全頁頂部列用 11,mini 用 12 */
  size: 11 | 12;
  /** 播放中才轉 */
  spinning?: boolean;
}

/** 正中心的小孔,外面一圈淡淡的白邊 */
const HOLE = "radial-gradient(circle, #1c1d26 0 10%, rgba(250, 244, 234, 0.85) 11% 15%, transparent 16%)";
/** 光碟表面的反光,轉起來會流動 */
const GLOSS =
  "conic-gradient(from 20deg, rgba(255,255,255,.22), transparent 22%, rgba(255,255,255,.14) 50%, transparent 72%, rgba(255,255,255,.22))";
/** 沒有封面時的彩虹碟面 */
const SHINE = "conic-gradient(from 20deg, #e4e7ef, #c9d5f2, #f1d2e2, #d4eedf, #f3e9cf, #e4e7ef)";

/**
 * 播放器用的光碟:有封面就印在碟面上(圖案光碟),沒有就是彩虹反光的空白光碟
 * 全螢幕播放器的底部控制列用
 */
export function MusicDisc({ image, coverColor, size, spinning = false }: MusicDiscProps) {
  const face = image
    ? `${GLOSS}, url("${image}") center / cover`
    : `radial-gradient(circle, transparent 0 19%, ${coverColor ?? "#e8a0bf"} 20% 33%, transparent 34%), ${SHINE}`;
  return (
    <span
      aria-hidden
      className={`block shrink-0 rounded-full shadow-inner ring-1 ring-black/15 ${size === 11 ? "size-11" : "size-12"} ${
        spinning ? "animate-spin-slow" : ""
      }`}
      style={{ background: `${HOLE}, ${face}` }}
    />
  );
}
