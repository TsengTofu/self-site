"use client";

import { useLayoutEffect, useRef } from "react";

/** 剛開啟後的這段時間內,落在背景的點擊視為幽靈點擊 */
const GHOST_CLICK_MS = 450;

/**
 * 行動裝置幽靈點擊防護:touch 開啟 overlay 後,瀏覽器會在同座標補發一個合成 click,
 * 落在剛掛載的背景上就變成「開了馬上關」(真手機才會發生)
 * 回傳判斷函式:open 轉 true 之後 450ms 內回 false,之後回 true
 */
export function useGhostClickGuard(open: boolean) {
  const openedAt = useRef(0);
  useLayoutEffect(() => {
    if (open) openedAt.current = Date.now();
  }, [open]);
  return () => Date.now() - openedAt.current > GHOST_CLICK_MS;
}
