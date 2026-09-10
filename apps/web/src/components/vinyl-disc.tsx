interface VinylDiscProps {
  /** 目前歌曲的封面色;沒選歌時傳 null,顯示預設的粉藍漸層 + 🎧。 */
  coverColor: string | null;
  /** 對應 Tailwind size-11 / size-12 —— header 用 11,mini 用 12。 */
  size: 11 | 12;
}

/**
 * 黑膠唱片圖示 —— music-player.tsx 的 header 與 mini 面板共用,
 * 展開/收合切換時外觀維持一致(iframe 之外唯一「看起來一樣」的裝飾元件)。
 */
export function VinylDisc({ coverColor, size }: VinylDiscProps) {
  const sizeClass = size === 11 ? "size-11 text-xl" : "size-12 text-lg shadow-inner";

  return (
    <span
      className={`grid ${sizeClass} shrink-0 animate-spin-slow place-items-center rounded-full ${
        coverColor ? "" : "bg-gradient-to-br from-accent-soft to-accent"
      }`}
      style={
        coverColor
          ? { background: `radial-gradient(circle, ${coverColor} 28%, #20242f 30%)` }
          : undefined
      }
    >
      {coverColor ? <span className="size-2.5 rounded-full bg-[#20242f]" /> : "🎧"}
    </span>
  );
}
