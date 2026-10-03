"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { House } from "lucide-react";
import { ITEMS, type ItemId } from "@/lib/items";
import { ItemIcon } from "@/components/item-icons";
import { useMockVariant } from "@/lib/mock-variant";
import { useSceneStore } from "@/stores/scene-store";

/** 左邊一組是「關於我」,右邊一組是生活小物,pop / pill 模式中間用細線隔開 */
const DOCK_GROUPS: ItemId[][] = [
  ["phone", "laptop"],
  ["headphones", "backpack", "notebook", "skateboard", "window", "bookStack", "poster"],
];
const DOCK_ORDER = DOCK_GROUPS.flat();

/** pop 模式按下時,泡泡裡的英文小標和一句話 */
const DOCK_LABEL: Partial<Record<ItemId, { en: string; text: string }>> = {
  phone: { en: "PROFILE", text: "手機・關於我" },
  laptop: { en: "PROJECTS", text: "電腦・我的專案" },
  headphones: { en: "MUSIC", text: "耳機・上班歌單" },
  backpack: { en: "BOOKS", text: "背包・最近讀的書" },
  notebook: { en: "NOTES", text: "筆記本・喜歡的句子" },
  skateboard: { en: "???", text: "滑板・？？？" },
  window: { en: "OCEAN", text: "海景・看向大海" },
  bookStack: { en: "SHELF", text: "書架・最近的心頭好" },
  poster: { en: "POSTER", text: "海報・牆上的本命" },
};

/** 放開手指後,按下的樣子再停留一下,點一下也看得到回饋 */
const PRESS_LINGER_MS = 380;

type DockMode = "classic" | "pop" | "pill";

interface MobileDockProps {
  onItemClick: (id: ItemId, rect: DOMRect) => void;
}

/**
 * 手機版底部 dock:小螢幕上場景會被裁切,保證所有物件都點得到
 * 🧪 MOCK `?dockv=pop|pill` 試兩種活動狀態,沒帶參數 = 原本的平均排列
 * - pop:按下的那顆浮起變大,上面冒出名稱泡泡;看過的物件底下有小點
 * - pill:最左邊固定一顆「首頁」,目前所在的位置會展開成帶文字的膠囊
 */
export function MobileDock({ onItemClick }: MobileDockProps) {
  const v = useMockVariant("dockv");
  const mode: DockMode = v === "pop" || v === "pill" ? v : "classic";

  const overlay = useSceneStore((s) => s.overlay);
  const playerMode = useSceneStore((s) => s.playerMode);
  const [visited, setVisited] = useState<ReadonlySet<ItemId>>(() => new Set());
  const [opened, setOpened] = useState<ItemId | null>(null);
  const [pressed, setPressed] = useState<ItemId | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 場景或 dock 打開任何物件都會發 scene:item-open,這裡記下看過哪些、現在開的是哪個
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<ItemId>).detail;
      setOpened(id);
      setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    };
    window.addEventListener("scene:item-open", onOpen);
    return () => {
      window.removeEventListener("scene:item-open", onOpen);
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  // overlay 或展開的播放器關掉之後,就算回到首頁了
  const busy = overlay !== null || playerMode === "expanded";
  const current = busy ? opened : null;
  const highlight = pressed ?? current;

  const press = (id: ItemId) => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setPressed(id);
  };
  const release = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(null), PRESS_LINGER_MS);
  };
  const pressHandlers = (id: ItemId) => ({
    onPointerDown: () => press(id),
    onPointerUp: release,
    onPointerCancel: release,
    onPointerLeave: release,
  });

  const nav = (children: ReactNode) => (
    <nav
      aria-label="桌上的物件"
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      {children}
    </nav>
  );

  if (mode === "pill") {
    const atHome = highlight === null;
    return nav(
      <ul className="flex items-center gap-0.5 rounded-full bg-cream/55 p-1.5 shadow-[0_4px_18px_rgba(60,40,20,.12)] ring-1 ring-white/50 backdrop-blur-md">
        <li className="shrink-0">
          <button
            type="button"
            aria-label="首頁"
            aria-current={atHome ? "page" : undefined}
            onClick={() => window.dispatchEvent(new Event("scene:home"))}
            className={`flex h-10 items-center justify-center gap-1.5 rounded-full transition-all duration-300 ease-out active:scale-95 ${
              atHome ? "bg-white px-3.5 text-ink shadow-[0_2px_10px_rgba(60,40,20,.14)]" : "w-10 text-ink-soft/85"
            }`}
          >
            <House className="size-5" strokeWidth={2} aria-hidden />
            {atHome && <span className="text-sm font-bold">首頁</span>}
          </button>
        </li>
        <li aria-hidden className="mx-1 h-6 w-px shrink-0 bg-ink-soft/20" />
        {DOCK_ORDER.map((id) => {
          const on = highlight === id;
          return (
            <li key={id} className={on ? "shrink-0" : "min-w-0 flex-1"}>
              <button
                type="button"
                aria-label={ITEMS[id].label}
                aria-current={on ? "true" : undefined}
                {...pressHandlers(id)}
                onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
                className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full transition-all duration-300 ease-out ${
                  on ? "bg-white px-3 text-ink shadow-[0_2px_10px_rgba(60,40,20,.14)]" : "text-ink-soft/85"
                }`}
              >
                <ItemIcon id={id} className="size-[22px] shrink-0" />
                {on && <span className="whitespace-nowrap text-sm font-bold">{ITEMS[id].label}</span>}
              </button>
            </li>
          );
        })}
      </ul>,
    );
  }

  if (mode === "pop") {
    return nav(
      <ul className="flex items-center gap-0.5 rounded-[22px] bg-cream/55 px-1.5 py-1.5 shadow-[0_4px_18px_rgba(60,40,20,.12)] ring-1 ring-white/50 backdrop-blur-md">
        {DOCK_GROUPS.map((group, gi) => (
          <DockGroup key={gi} divider={gi > 0}>
            {group.map((id) => {
              const index = DOCK_ORDER.indexOf(id);
              const up = pressed === id;
              const label = DOCK_LABEL[id];
              // 兩端的泡泡往內對齊,不然會超出螢幕
              const align =
                index < 2 ? "left-0" : index > DOCK_ORDER.length - 3 ? "right-0" : "left-1/2 -translate-x-1/2";
              return (
                <li key={id} className="relative min-w-0 flex-1">
                  {up && label && (
                    <div
                      className={`pointer-events-none absolute bottom-full mb-8 whitespace-nowrap rounded-2xl bg-[#3a2e24]/95 px-4 py-2 text-center text-cream shadow-lg ${align}`}
                    >
                      <p className="text-[10px] tracking-[0.3em] text-cream/60">{label.en}</p>
                      <p className="mt-0.5 text-sm font-bold">{label.text}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label={ITEMS[id].label}
                    aria-current={current === id ? "true" : undefined}
                    {...pressHandlers(id)}
                    onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
                    className="relative grid h-11 w-full place-items-center"
                  >
                    <span
                      className={`grid place-items-center rounded-2xl transition-all duration-200 ease-out ${
                        up
                          ? "size-14 -translate-y-4 bg-white text-ink shadow-[0_10px_24px_rgba(60,40,20,.2)]"
                          : current === id
                            ? "size-10 bg-ink-soft/10 text-ink"
                            : "size-10 text-ink-soft/85"
                      }`}
                    >
                      <ItemIcon id={id} className={up ? "size-7" : "size-[22px]"} />
                    </span>
                    {visited.has(id) && !up && (
                      <span aria-hidden className="absolute bottom-0 size-1 rounded-full bg-[#d98f4e]" />
                    )}
                  </button>
                </li>
              );
            })}
          </DockGroup>
        ))}
      </ul>,
    );
  }

  return nav(
    /* 浮在場景上的半透明膠囊:不再是一整條實心底,看得到後面的地板 */
    <ul className="flex items-center gap-0.5 rounded-2xl bg-cream/45 px-1.5 py-1 shadow-[0_4px_18px_rgba(60,40,20,.12)] ring-1 ring-white/50 backdrop-blur-md">
      {DOCK_ORDER.map((id) => (
        <li key={id} className="min-w-0 flex-1">
          <button
            type="button"
            aria-label={ITEMS[id].label}
            onClick={(e) => onItemClick(id, e.currentTarget.getBoundingClientRect())}
            className="grid h-11 w-full place-items-center rounded-xl text-ink-soft/85 transition active:scale-90 active:bg-ink-soft/10"
          >
            <ItemIcon id={id} className="size-6" />
          </button>
        </li>
      ))}
    </ul>,
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
