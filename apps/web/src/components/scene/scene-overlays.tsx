/**
 * 分層動態圖層(approach B 的渲染架構)。
 *
 * 這一層鋪在窗景之上、家具/人物之下 —— 由 element-layers.tsx 的 <svg> 引入渲染
 * (窗景 <image> 之後、LAYERS loop 之前),所以海鷗/浮塵在打光層之下:
 * 海鷗會從站著的人物身後飛過,夜晚也會被夜色罩住。
 *
 * 目前放的是「加法式」活元素 —— 只出現在畫面空白處(天空、空氣),
 * 不與原圖既有內容衝突,所以不需要去背素材。
 *
 * 座標系與 hotspots 相同(原圖像素);因為只是一段 <g> 片段,不再自帶 <svg> 外殼。
 * 未來要做完整深度視差,就在這裡疊上真正的透明去背圖層(<image>)。
 */

/** 目前底圖(清空版海景房,1920×1080)的關鍵區域,原圖像素座標 */
const WINDOW = { skyY: 300, left: 660, right: 1140 };

/** 海鷗:兩道翅膀弧線,週期性飛過窗外天空 */
function Seagull() {
  return (
    <g className="ov-seagull">
      <g className="ov-seagull-bob">
        <path
          d="M-11 0 Q-5.5 -6.5 0 -0.6 Q5.5 -6.5 11 0"
          fill="none"
          stroke="#5a5148"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/**
 * 天空活元素片段(海鷗 + 陽光浮塵)。回傳純 <g> 片段,由 element-layers 的 <svg> 承載,
 * 因此自然疊在窗景之上、家具/人物與打光層之下。
 */
export function SkyOverlays() {
  // 陽光下的浮塵:在窗前空氣中緩緩上飄
  // (這張底圖窗外只有天空、看不到海面,海面波光 glints 先拿掉;
  //  換回看得到海的底圖時,從 git 歷史把 glints 區塊撿回來即可)
  const motes = [
    { x: 730, y: 340, r: 1.9, d: 0 },
    { x: 820, y: 280, r: 1.5, d: 1.8 },
    { x: 780, y: 420, r: 2.1, d: 3.2 },
    { x: 900, y: 330, r: 1.7, d: 2.4 },
    { x: 1000, y: 380, r: 1.6, d: 1.2 },
  ];

  return (
    <g aria-hidden>
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
    </g>
  );
}
