"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal 的焦點管理:開啟時把焦點移進 panel、Tab 在裡面循環(focus trap)、
 * Esc 呼叫 onClose,關閉時把焦點還給開啟前的觸發元素。
 *
 * `onClose` 不放進 effect 的依賴陣列 —— 用 ref 存最新版本,避免呼叫端每次
 * render 都產生新的 onClose 導致 effect 重跑、把使用者正在操作的焦點搶走
 * (例如在 panel 內的輸入框打字時,父層重新渲染)。
 */
export function useModalFocus<T extends HTMLElement>(
  active: boolean,
  panelRef: RefObject<T | null>,
  onClose: () => void,
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 觸發元素的祖先常在同一次 commit 被設成 inert,瀏覽器繪製前就會把焦點清掉,
  // passive effect 才抓 activeElement 有機會只拿到 body;layout effect 在繪製前先記下來
  useLayoutEffect(() => {
    if (active) previouslyFocused.current = document.activeElement as HTMLElement | null;
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const panel = panelRef.current;
    if (panel) {
      const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (first) {
        first.focus();
      } else {
        // panel 裡沒有可聚焦元素時,讓 panel 本身當焦點容器
        panel.setAttribute("tabindex", "-1");
        panel.focus();
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const container = panelRef.current;
      if (!container) return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onClose 用 ref 讀最新值,故意不放進依賴
  }, [active]);
}
