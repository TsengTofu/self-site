/**
 * 來電鈴聲:WebAudio 合成的柔和雙音「叮鈴—叮鈴」。
 * AudioContext 必須在使用者手勢中建立(瀏覽器限制),
 * 所以由開關按鈕點擊時呼叫 initRingAudio()。
 */

let ctx: AudioContext | null = null;

export function initRingAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  void ctx.resume();
}

/** 播一小段「叮鈴」:兩個短音,柔和淡出 */
function chime(at: number) {
  if (!ctx) return;
  const notes: [number, number][] = [
    [987.77, 0], // B5
    [783.99, 0.16], // G5
  ];
  for (const [freq, offset] of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, at + offset);
    gain.gain.linearRampToValueAtTime(0.055, at + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + offset + 0.42);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at + offset);
    osc.stop(at + offset + 0.5);
  }
}

/** 開始響鈴(每 2.4 秒兩聲),回傳停止函式 */
export function startRingTone(): () => void {
  if (!ctx || ctx.state !== "running") return () => {};
  const play = () => {
    if (!ctx) return;
    const now = ctx.currentTime;
    chime(now);
    chime(now + 0.75);
  };
  play();
  const timer = setInterval(play, 2400);
  return () => clearInterval(timer);
}
