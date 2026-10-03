import { Mail } from "lucide-react";
import type { MouseEvent } from "react";

/** 對話框本體的大小(底圖像素),只放一個信封,做成圓角小方塊 */
const W = 44;
const H = 36;
/** 信封和文字同一個深咖啡色 */
const INK = "#4a3c30";
/** 尾巴的高度 */
const TAIL = 10;

/** 白底與描邊直接寫在 SVG 屬性上:SVG 沒給顏色時預設是黑色,
 *  寫在 CSS class 裡的話,樣式沒載到就會變成黑底 */
const BODY = { fill: "#fffaf1", stroke: "rgba(107, 86, 71, 0.35)", strokeWidth: 1.5 } as const;

interface LetterBadgeProps {
  /** 尾巴尖端指到的位置(手機上方) */
  x: number;
  y: number;
  /** 滑過手機時放大一點 */
  active: boolean;
  onClick: (e: MouseEvent<SVGGElement>) => void;
}

/**
 * 手機上方的「來信」對話框:信封 + 未讀紅點,輕輕上下浮動
 * 一眼就知道點手機是看履歷;畫在打光層上面,夜晚也看得清楚
 * 鍵盤使用者走手機本身的熱區,這裡只給滑鼠和觸控點
 */
export function LetterBadge({ x, y, active, onClick }: LetterBadgeProps) {
  // 尾巴在對話框正中間
  const left = x - W / 2;
  const top = y - TAIL - H;
  const tail = `M ${x - 7} ${top + H - 1} L ${x} ${y} L ${x + 7} ${top + H - 1} Z`;

  return (
    <g aria-hidden className="letter-float cursor-pointer" onClick={onClick}>
      <g className={`letter-badge ${active ? "letter-badge-active" : ""}`} style={{ transformOrigin: `${x}px ${y}px` }}>
        <rect x={left} y={top} width={W} height={H} rx={12} {...BODY} />
        <path d={tail} {...BODY} />
        {/* 蓋掉尾巴和本體接縫的那段描邊 */}
        <rect x={x - 6} y={top + H - 3} width={12} height={3} fill={BODY.fill} />
        <Mail x={left + (W - 20) / 2} y={top + (H - 20) / 2} width={20} height={20} strokeWidth={2} color={INK} />
        {/* 未讀紅點 */}
        <circle cx={left + W - 6} cy={top + 5} r={5.5} fill="#e5604d" stroke="#fffaf1" strokeWidth={2} />
      </g>
    </g>
  );
}
