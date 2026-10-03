"use client";

import { useEffect } from "react";
import { useSceneStore } from "@/stores/scene-store";
import { ITEM_ROUTES, routeForScene, routeFromPath, type ItemRoute } from "@/lib/item-routes";
import type { ItemId } from "@/lib/items";

/**
 * 物件與網址同步:打開專案時網址變成 /projects,關掉回到 /
 * 直接從 /projects 進來會自動打開;按瀏覽器的上一頁會關掉、下一頁會再打開
 * 用 history.pushState 換網址(Next 會跟著同步,不會重新載入頁面)
 */
export function useItemRoute() {
  useEffect(() => {
    // 這筆歷史紀錄是不是我們 push 的;是的話關掉時用上一頁退回去,歷史才不會越疊越多
    let pushed = false;

    const open = (route: ItemRoute) => {
      const id: ItemId = ITEM_ROUTES[route].item;
      window.dispatchEvent(new CustomEvent<ItemId>("scene:item-open", { detail: id }));
      useSceneStore.getState().openItem(id);
    };

    const closeAll = () => {
      const s = useSceneStore.getState();
      if (s.overlay) {
        // 跟按關閉鈕一樣,先讓鏡頭瞬間歸位,不會看到糊掉的縮回
        window.dispatchEvent(new Event("scene:camera-reset"));
        s.closeOverlay();
      }
      if (s.playerMode === "expanded") {
        if (s.currentSongId) s.minimizePlayer();
        else s.closePlayer();
      }
    };

    // 直接從物件網址進來
    const initial = routeFromPath(window.location.pathname);
    if (initial) open(initial);

    const unsubscribe = useSceneStore.subscribe((state, prev) => {
      const next = routeForScene(state.overlay, state.playerMode);
      if (next === routeForScene(prev.overlay, prev.playerMode)) return;
      const inUrl = routeFromPath(window.location.pathname);

      if (next) {
        if (inUrl === next) return;
        if (inUrl) {
          window.history.replaceState(null, "", `/${next}`);
        } else {
          window.history.pushState(null, "", `/${next}`);
          pushed = true;
        }
      } else if (inUrl) {
        if (pushed) {
          pushed = false;
          window.history.back();
        } else {
          window.history.replaceState(null, "", "/");
        }
      }
    });

    const onPopState = () => {
      // 上一頁/下一頁之後,現在這筆已經不是我們剛 push 的了
      pushed = false;
      const route = routeFromPath(window.location.pathname);
      const s = useSceneStore.getState();
      if (route === routeForScene(s.overlay, s.playerMode)) return;
      if (route) open(route);
      else closeAll();
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
