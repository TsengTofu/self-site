import { Mail } from "lucide-react";
import type { MouseEvent } from "react";

/** 對話框本體的大小(底圖像素) */
const W = 78;
const H = 36;
/** 尾巴的高度 */
const TAIL = 10;

interface LetterBadgeProps {
  /** 尾巴尖端指到的位置(手機上方) */
  x: number;
  y: number;
  /** 滑過手機時放大一點 */
  active: boolean;
  onClick: (e: MouseEvent<SVGGElement>) => void;
}

/**
 * 手機上方的「來信」對話框:信封 + 履歷兩個字 + 未讀紅點,輕輕上下浮動
 * 一眼就知道點手機是看履歷;畫在打光層上面,夜晚也看得清楚
 * 鍵盤使用者走手機本身的熱區,這裡只給滑鼠和觸控點
 */
export function LetterBadge({ x, y, active, onClick }: LetterBadgeProps) {
  // 尾巴放在對話框左側三分之一,對話框往右上長,不會擋到手機
  const left = x - W * 0.32;
  const top = y - TAIL - H;
  const tail = `M ${x - 7} ${top + H - 1} L ${x} ${y} L ${x + 7} ${top + H - 1} Z`;

  return (
    <g aria-hidden className="letter-float cursor-pointer" onClick={onClick}>
      <g className={`letter-badge ${active ? "letter-badge-active" : ""}`} style={{ transformOrigin: `${x}px ${y}px` }}>
        <rect x={left} y={top} width={W} height={H} rx={H / 2} className="letter-body" />
        <path d={tail} className="letter-body" />
        {/* 蓋掉尾巴和本體接縫的那段描邊 */}
        <rect x={x - 6} y={top + H - 3} width={12} height={3} fill="#fffaf1" />
        <Mail x={left + 13} y={top + (H - 18) / 2} width={18} height={18} strokeWidth={2} className="text-[#b5677f]" />
        <text x={left + 38} y={top + H / 2 + 5.5} fontSize={15} fontWeight={700} fill="#4a3c30" className="font-sans">
          履歷
        </text>
        {/* 未讀紅點 */}
        <circle cx={left + W - 6} cy={top + 5} r={5.5} fill="#e5604d" stroke="#fffaf1" strokeWidth={2} />
      </g>
    </g>
  );
}
