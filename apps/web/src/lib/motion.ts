/**
 * 使用者在系統設定裡開了「減少動態」時,GSAP 進場動畫要瞬間到位而不是動畫過去。
 * 只能在 client 呼叫(SSR 沒有 window.matchMedia)。
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
