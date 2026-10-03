"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ITEMS, type ItemId } from "@/lib/items";
import { ItemIcon } from "@/components/item-icons";
import { useSceneStore } from "@/stores/scene-store";

/** 左邊一組是「關於我」,右邊一組是生活小物,中間用細線隔開 */
const DOCK_GROUPS: ItemId[][] = [
  ["phone", "laptop"],
  ["headphones", "backpack", "notebook", "skateboard", "window", "bookStack", "poster"],
];

/** 按下時泡泡裡的說明 */
const DOCK_LABEL: Partial<Record<ItemId, string>> = {
  phone: "手機・我的履歷",
  laptop: "電腦・我的專案",
  headphones: "耳機・我在聽什麼",
  backpack: "背包・人生指南",
  notebook: "筆記本・喜歡的句子",
  skateboard: "滑板・自由的味道",
  window: "海景・看向大海",
  bookStack: "書架・最近的心頭好",
  poster: "海報・WHO'S THERE?BOYNEXTDOOR",
};

/** 按住超過這個時間才浮起,手指只是滑過去找 icon 時不會一直跳 */
const PRESS_DELAY_MS = 90;
/** 放開後浮起的樣子再停一下,點一下也看得到說明 */
const PRESS_LINGER_MS = 700;

interface Pressed {
  id: ItemId;
  /** 按鈕在畫面上的位置,泡泡用它定位 */
  rect: DOMRect;
}

interface MobileDockProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
}

/**
 * 手機版底部 dock:小螢幕上場景會被裁切,保證所有物件都點得到
 * 按下的 icon 浮起變大,上方冒出說明泡泡;寬度不夠時不壓縮,可以左右滑
 */
export function MobileDock({ onItemClick }: MobileDockProps) {
  const overlay = useSceneStore((s) => s.overlay);
  const playerMode = useSceneStore((s) => s.playerMode);
  const [opened, setOpened] = useState<ItemId | null>(null);
  const [pressed, setPressed] = useState<Pressed | null>(null);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lingerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 場景或 dock 打開任何物件都會發 scene:item-open,記下現在開的是哪個
  useEffect(() => {
    const onOpen = (e: Event) => setOpened((e as CustomEvent<ItemId>).detail);
    window.addEventListener("scene:item-open", onOpen);
    return () => {
      window.removeEventListener("scene:item-open", onOpen);
      if (delayTimer.current) clearTimeout(delayTimer.current);
      if (lingerTimer.current) clearTimeout(lingerTimer.current);
    };
  }, []);

  // overlay 或展開的播放器關掉之後,就沒有「目前開著」的物件了
  const current = overlay !== null || playerMode === "expanded" ? opened : null;

  const show = (id: ItemId, el: HTMLElement) => {
    if (lingerTimer.current) clearTimeout(lingerTimer.current);
    setPressed({ id, rect: el.getBoundingClientRect() });
  };
  const hideLater = () => {
    if (delayTimer.current) clearTimeout(delayTimer.current);
    if (lingerTimer.current) clearTimeout(lingerTimer.current);
    lingerTimer.current = setTimeout(() => setPressed(null), PRESS_LINGER_MS);
  };
  const cancel = () => {
    // 瀏覽器開始捲動 dock 時會發 pointercancel,這時直接收起來
    if (delayTimer.current) clearTimeout(delayTimer.current);
    setPressed(null);
  };

  return (
    <nav
      aria-label="桌上的物件"
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="relative">
        {/* 底板固定不動,上面那層 icon 才會左右滑 */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-14 rounded-[22px] bg-cream/55 shadow-[0_4px_18px_rgba(60,40,20,.12)] ring-1 ring-white/50 backdrop-blur-md"
        />
        {/* 上方留 20px 透明空間,浮起來的 icon 才不會被捲動容器切掉 */}
        <div className="relative overflow-x-auto overscroll-x-contain pt-5 [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden">
          <ul className="flex h-14 w-max min-w-full items-center px-1.5">
            {DOCK_GROUPS.map((group, gi) => (
              <DockGroup key={gi} divider={gi > 0}>
                {group.map((id) => {
                  const up = pressed?.id === id;
                  return (
                    <li key={id} className="min-w-11 flex-1">
                      <button
                        type="button"
                        aria-label={ITEMS[id].label}
                        aria-current={current === id ? "true" : undefined}
                        onPointerDown={(e) => {
                          const el = e.currentTarget;
                          if (delayTimer.current) clearTimeout(delayTimer.current);
                          delayTimer.current = setTimeout(() => show(id, el), PRESS_DELAY_MS);
                        }}
                        onPointerUp={hideLater}
                        onPointerCancel={cancel}
                        onClick={(e) => {
                          // 很快的點一下來不及等延遲,點擊時補上浮起與泡泡
                          show(id, e.currentTarget);
                          hideLater();
                          onItemClick(id, e.currentTarget.getBoundingClientRect());
                        }}
                        className="relative grid h-11 w-full place-items-center"
                      >
                        <span
                          className={`grid place-items-center rounded-2xl transition-all duration-200 ease-out ${
                            up
                              ? "size-14 -translate-y-4 bg-white/70 text-ink shadow-[0_10px_24px_rgba(60,40,20,.18)] ring-1 ring-white/70 backdrop-blur-md"
                              : current === id
                                ? "size-10 bg-ink-soft/10 text-ink"
                                : "size-10 text-ink-soft/85"
                          }`}
                        >
                          <ItemIcon id={id} className={up ? "size-7" : "size-[22px]"} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </DockGroup>
            ))}
          </ul>
        </div>
      </div>

      {pressed && DOCK_LABEL[pressed.id] && <DockBubble text={DOCK_LABEL[pressed.id]!} anchor={pressed.rect} />}
    </nav>
  );
}

/** 一組 icon;不是第一組的話,前面加一條細直線 */
function DockGroup({ divider, children }: { divider: boolean; children: ReactNode }) {
  return (
    <>
      {divider && <li aria-hidden className="mx-1 h-7 w-px shrink-0 bg-ink-soft/20" />}
      {children}
    </>
  );
}

/**
 * 說明泡泡:放在捲動容器外面(不然會被裁掉),用按鈕的位置定位
 * 左右夾在畫面內,靠邊的 icon 泡泡也不會超出去
 */
function DockBubble({ text, anchor }: { text: string; anchor: DOMRect }) {
  // 粗估寬度:text-sm 中文一字約 14px,加左右 padding
  const width = text.length * 14 + 32;
  const viewport = typeof window === "undefined" ? 375 : window.innerWidth;
  const center = Math.min(
    Math.max(anchor.left + anchor.width / 2, width / 2 + 8),
    viewport - width / 2 - 8,
  );
  const bottom = (typeof window === "undefined" ? 812 : window.innerHeight) - anchor.top + 26;
  return (
    <div
      className="pointer-events-none fixed whitespace-nowrap rounded-2xl bg-[#3a2e24]/95 px-4 py-2 text-sm font-bold text-cream shadow-lg"
      style={{ left: center, bottom, transform: "translateX(-50%)" }}
    >
      {text}
    </div>
  );
}
