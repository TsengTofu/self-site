"use client";

import { IMAGE_W, IMAGE_H } from "./hotspots";

/**
 * 分層動態圖層(approach B 的渲染架構)。
 *
 * 這一層鋪在插畫底圖之上、互動熱區之下,pointer-events: none 不擋點擊。
 * 目前放的是「加法式」活元素 —— 只出現在畫面空白處(天空、空氣、海面波光),
 * 不與原圖既有內容衝突,所以不需要去背素材。
 *
 * 座標系與 hotspots 相同(原圖像素),換底圖時對照新圖微調 REGION 即可。
 * 未來要做完整深度視差,就在這裡疊上真正的透明去背圖層(<image>)。
 */

/** 目前底圖(明亮海景房 v2)的關鍵區域,原圖像素座標 */
const WINDOW = { skyY: 380, seaTop: 630, seaBottom: 820, left: 990, right: 1710 };

/** 海鷗:兩道翅膀弧線,週期性飛過窗外天空 */
function Seagull() {
  return (
    <g className="ov-seagull">
      <g className="ov-seagull-bob">
        <path
          d="M-16 0 Q-8 -9 0 -1 Q8 -9 16 0"
          fill="none"
          stroke="#5a5148"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

export function SceneOverlays() {
  // 海面波光(sun-glitter):散布在海面的小白點,加法式閃爍
  const glints = [
    { x: 1080, y: 680, d: 0 },
    { x: 1220, y: 730, d: 1.1 },
    { x: 1380, y: 690, d: 0.5 },
    { x: 1500, y: 760, d: 1.7 },
    { x: 1630, y: 700, d: 0.8 },
    { x: 1300, y: 650, d: 2.2 },
  ];
  // 陽光下的浮塵:在窗前空氣中緩緩上飄
  const motes = [
    { x: 1150, y: 780, r: 3, d: 0 },
    { x: 1450, y: 700, r: 2.4, d: 1.8 },
    { x: 1620, y: 760, r: 3.4, d: 3.2 },
    { x: 1300, y: 840, r: 2.6, d: 2.4 },
  ];

  return (
    <svg
      viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {/* 海面波光 */}
      {glints.map((g) => (
        <circle
          key={`${g.x}-${g.y}`}
          className="ov-glint"
          cx={g.x}
          cy={g.y}
          r="4"
          fill="#fdfcf5"
          style={{ animationDelay: `${g.d}s` }}
        />
      ))}

      {/* 陽光浮塵 */}
      {motes.map((m) => (
        <circle
          key={`${m.x}-${m.y}`}
          className="ov-mote"
          cx={m.x}
          cy={m.y}
          r={m.r}
          fill="#fff2cf"
          style={{ animationDelay: `${m.d}s` }}
        />
      ))}

      {/* 海鷗(飛過窗外天空) */}
      <g transform={`translate(0 ${WINDOW.skyY})`}>
        <Seagull />
      </g>
    </svg>
  );
}
