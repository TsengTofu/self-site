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

/** 文字排版用的區域大小,再用仿射矩陣貼到螢幕上 */
const BOX_W = 100;
const BOX_H = 70;

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

/**
 * 筆電螢幕的預設畫面:像鎖定畫面一樣顯示現在的日期和時間
 * 時間跟著訪客自己的時區;伺服器端不輸出文字,避免 hydration 對不上
 */
export function LaptopClock({ rect }: { rect: Rect }) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);

  const toScene = ([x, y]: readonly [number, number]) =>
    [rect.x + (x * rect.w) / IMG_W, rect.y + (y * rect.h) / IMG_H] as const;
  const tl = toScene(SCREEN_CORNERS[0]);
  const tr = toScene(SCREEN_CORNERS[1]);
  const br = toScene(SCREEN_CORNERS[2]);
  const bl = toScene(SCREEN_CORNERS[3]);
  const points = [tl, tr, br, bl].map((p) => p.join(",")).join(" ");
  // 用左上、右上、左下三個角算矩陣,右下角的透視誤差只有一兩個像素
  const matrix = [
    (tr[0] - tl[0]) / BOX_W,
    (tr[1] - tl[1]) / BOX_W,
    (bl[0] - tl[0]) / BOX_H,
    (bl[1] - tl[1]) / BOX_H,
    tl[0],
    tl[1],
  ].join(" ");

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
      {now && (
        <g transform={`matrix(${matrix})`} className="font-sans" fill="#fff">
          <text x={BOX_W / 2} y={20} textAnchor="middle" fontSize={5.4} opacity={0.85} letterSpacing={0.2}>
            {date}
          </text>
          <text x={BOX_W / 2} y={47} textAnchor="middle" fontSize={27} fontWeight={600}>
            {time}
          </text>
        </g>
      )}
    </g>
  );
}
