interface MusicDiscProps {
  /** 目前歌曲的代表色,畫在光碟的標籤圈;沒選歌時用預設的粉紅 */
  coverColor: string | null;
  /** 對應 Tailwind size-11 / size-12 —— 全頁頂部列用 11,mini 用 12 */
  size: 11 | 12;
  /** 播放中才轉 */
  spinning?: boolean;
}

/** 光碟的彩虹反光:跟著轉的時候會流動 */
const SHINE = "conic-gradient(from 20deg, #e4e7ef, #c9d5f2, #f1d2e2, #d4eedf, #f3e9cf, #e4e7ef)";

/**
 * 播放器用的光碟圖示:彩虹反光的碟面、中間一圈歌曲代表色、正中心一個小孔
 * 全頁頂部列、mini 卡片、桌機左下角的小膠囊共用
 */
export function MusicDisc({ coverColor, size, spinning = false }: MusicDiscProps) {
  const ring = coverColor ?? "#e8a0bf";
  return (
    <span
      aria-hidden
      className={`block shrink-0 rounded-full shadow-inner ring-1 ring-black/10 ${size === 11 ? "size-11" : "size-12"} ${
        spinning ? "animate-spin-slow" : ""
      }`}
      style={{
        background: `radial-gradient(circle, #1c1d26 0 11%, transparent 12%), radial-gradient(circle, transparent 0 19%, ${ring} 20% 33%, transparent 34%), ${SHINE}`,
      }}
    />
  );
}
