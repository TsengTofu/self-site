"use client";

import { useSyncExternalStore } from "react";
import type { Rect } from "./hotspots";

/** laptop.png 的原始尺寸,螢幕四角用這個座標系量的 */
const IMG_W = 500;
const IMG_H = 351;
/** 螢幕四個角(左上、右上、右下、左下),有一點透視所以不是矩形 */
const SCREEN_CORNERS = [
  [17, 21],
  [329, 16],
  [347, 219],
  [34, 246],
] as const;

/** 深色底往外多畫一點,邊緣藏在挖空版筆電圖(laptop-frame)的黑框底下,不會透白 */
const BLEED = 5;

/** 日期與時間各自放在螢幕的哪個高度(0 = 上緣、1 = 下緣,指文字底線)與字級(底圖像素) */
const DATE_LINE = { at: 0.31, size: 12 };
const TIME_LINE = { at: 0.7, size: 40 };

// 每 15 秒看一次時間,快照是「第幾分鐘」
// 同一分鐘內值不變,所以只有換分鐘時才會重繪
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

/** 日期用英文:Saturday, October 3 */
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

interface LaptopClockProps {
  rect: Rect;
  /** 螢幕挖空的筆電圖;順序是 深色底 → 筆電 → 時間 */
  frameSrc: string;
}

/**
 * 筆電螢幕的預設畫面:像鎖定畫面一樣顯示現在的日期和時間
 * 時間跟著訪客自己的時區;伺服器端不輸出文字,避免 hydration 對不上
 */
export function LaptopClock({ rect, frameSrc }: LaptopClockProps) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);

  const toScene = ([x, y]: readonly [number, number]) =>
    [rect.x + (x * rect.w) / IMG_W, rect.y + (y * rect.h) / IMG_H] as const;
  const tl = toScene(SCREEN_CORNERS[0]);
  const tr = toScene(SCREEN_CORNERS[1]);
  const br = toScene(SCREEN_CORNERS[2]);
  const bl = toScene(SCREEN_CORNERS[3]);
  // 四個角各自往外推 BLEED(以螢幕中心為準),深色底比螢幕大一圈
  const cx = (tl[0] + tr[0] + br[0] + bl[0]) / 4;
  const cy = (tl[1] + tr[1] + br[1] + bl[1]) / 4;
  const points = [tl, tr, br, bl]
    .map(([x, y]) => {
      const len = Math.hypot(x - cx, y - cy);
      return `${x + ((x - cx) / len) * BLEED},${y + ((y - cy) / len) * BLEED}`;
    })
    .join(" ");
  // 螢幕有一點透視,每一行各自算「這個高度上螢幕的左右兩端」,文字放在正中間
  // 只跟著上緣轉一點角度,不做傾斜變形,日期和時間的中心才會對齊
  const angle = (Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * 180) / Math.PI;
  const lineAt = (v: number) => {
    const lx = tl[0] + (bl[0] - tl[0]) * v;
    const ly = tl[1] + (bl[1] - tl[1]) * v;
    const rx = tr[0] + (br[0] - tr[0]) * v;
    const ry = tr[1] + (br[1] - tr[1]) * v;
    return `translate(${(lx + rx) / 2} ${(ly + ry) / 2}) rotate(${angle})`;
  };

  const now = minute === null ? null : new Date(minute * 60_000);
  const time = now
    ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "";
  const date = now ? DATE_FORMAT.format(now) : "";

  return (
    <g aria-hidden>
      <defs>
        {/* 深藍底,上亮下暗一點,像真的螢幕 */}
        <linearGradient id="laptop-wallpaper" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#2c3b5e" />
          <stop offset="1" stopColor="#18213a" />
        </linearGradient>
      </defs>
      <polygon points={points} fill="url(#laptop-wallpaper)" />
      <image href={frameSrc} x={rect.x} y={rect.y} width={rect.w} height={rect.h} preserveAspectRatio="none" />
      {now && (
        <g className="font-sans" fill="#fff" textAnchor="middle">
          <text transform={lineAt(DATE_LINE.at)} fontSize={DATE_LINE.size} fontWeight={500} opacity={0.88}>
            {date}
          </text>
          <text transform={lineAt(TIME_LINE.at)} fontSize={TIME_LINE.size} fontWeight={600}>
            {time}
          </text>
        </g>
      )}
    </g>
  );
}
