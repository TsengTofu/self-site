const BAR_DELAYS = [0, 0.25, 0.5];

/** 播放中的等化器動畫條 —— music-player.tsx 的歌曲清單與 mini 面板共用。 */
export function EqBars() {
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          className="eq-bar w-1 rounded-full bg-accent-soft"
          style={{ height: 14, animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}
