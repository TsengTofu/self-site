const BAR_DELAYS = [0, 0.25, 0.5];

/** 播放中的等化器動畫條 —— 播放器的歌曲清單、mini 面板、右上選單的音樂開關共用 */
export function EqBars({ height = 14, className = "bg-accent-soft" }: { height?: number; className?: string }) {
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          className={`eq-bar w-1 rounded-full ${className}`}
          style={{ height, animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}
