import gsap from "gsap";

/**
 * GSAP 用 requestAnimationFrame 驅動;分頁在背景(或內嵌預覽窗格)時
 * rAF 會被節流甚至完全停擺,所有 tween 凍結在起始狀態。
 *
 * 策略(GSAP 3 沒有 useRAF,改用官方的 gsap.updateRoot 手動驅動):
 * - document.hidden:關掉 lagSmoothing,並用 setInterval 呼叫
 *   gsap.updateRoot(now) 讓時間軸持續前進(背景 timer 被壓到 1Hz 也沒關係,
 *   每次 tick 都會直接跳到正確進度)。
 * - 回到前景:清掉 interval、恢復預設 lagSmoothing,回到順暢的 rAF。
 */
let initialized = false;
let tickWorker: Worker | null = null;

function timerMode() {
  gsap.ticker.lagSmoothing(0);
  if (!tickWorker) {
    // 主執行緒的 timer 在背景分頁會被節流(最嚴重時 1 次/分鐘),
    // Web Worker 的 timer 不受此限,用它來驅動 GSAP 時間軸。
    try {
      const blob = new Blob(["setInterval(function(){postMessage(0)},250)"], {
        type: "text/javascript",
      });
      tickWorker = new Worker(URL.createObjectURL(blob));
      tickWorker.onmessage = () => gsap.updateRoot(performance.now() / 1000);
    } catch {
      // Worker 不可用就退回主執行緒 interval(至少前 5 分鐘有 1Hz)
      window.setInterval(() => gsap.updateRoot(performance.now() / 1000), 250);
    }
  }
}

function rafMode() {
  if (tickWorker) {
    tickWorker.terminate();
    tickWorker = null;
  }
  gsap.ticker.lagSmoothing(500, 33);
}

export function setupGsapTickerFallback() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const applyMode = () => (document.hidden ? timerMode() : rafMode());
  applyMode();
  document.addEventListener("visibilitychange", applyMode);

  // 保險:600ms 內 rAF tick 少於 10 次(正常 30+)也切手動驅動
  // (某些內嵌 WebView hidden=false 但 rAF 停擺/節流)
  let ticks = 0;
  const count = () => {
    ticks += 1;
    requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
  window.setTimeout(() => {
    if (ticks < 10) timerMode();
  }, 600);
}
