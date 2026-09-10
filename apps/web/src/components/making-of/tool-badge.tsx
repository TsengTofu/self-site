import { Sparkles, MessageSquare, Bot, PenTool, Code, Zap, type LucideIcon } from "lucide-react";
import type { MakingOfTool } from "@/data/making-of";

/**
 * 工具標籤 chip。icon 與配色的對照表放在這裡（而不是 data/making-of.ts），
 * 資料檔才能維持純可序列化的值 —— 那邊只寫工具名字。
 */
const TOOL_META: Record<MakingOfTool, { icon: LucideIcon; color: string }> = {
  Gemini: { icon: Sparkles, color: "#7c9ef8" },
  ChatGPT: { icon: MessageSquare, color: "#5fae74" },
  Claude: { icon: Bot, color: "#d9a066" },
  Illustrator: { icon: PenTool, color: "#e9b44c" },
  "Next.js": { icon: Code, color: "#4a3c30" },
  GSAP: { icon: Zap, color: "#e8a0bf" },
};

export function ToolBadge({ tool }: { tool: MakingOfTool }) {
  const meta = TOOL_META[tool];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-ink-soft/20 bg-cream-soft/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
      <Icon className="size-3.5" strokeWidth={1.8} style={{ color: meta.color }} />
      {tool}
    </span>
  );
}

/** 一整排工具 chip */
export function ToolBadgeRow({
  tools,
  className = "",
}: {
  tools: MakingOfTool[];
  className?: string;
}) {
  if (tools.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {tools.map((tool) => (
        <ToolBadge key={tool} tool={tool} />
      ))}
    </div>
  );
}
