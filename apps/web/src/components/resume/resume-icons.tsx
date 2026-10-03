import type { CSSProperties } from "react";
import {
  Files,
  GitMerge,
  Layers,
  ListTree,
  Rocket,
  Signature,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  siApacheecharts,
  siClaude,
  siCommitlint,
  siD3,
  siGitlab,
  siGnuprivacyguard,
  siJavascript,
  siJest,
  siModelcontextprotocol,
  siNextdotjs,
  siReact,
  siReacthookform,
  siSass,
  siShadcnui,
  siStorybook,
  siTailwindcss,
  siTanstack,
  siTestinglibrary,
  siTurborepo,
  siTypescript,
  siVuedotjs,
  siZod,
  type SimpleIcon,
} from "simple-icons";

/**
 * 資料裡只寫圖示的名字,這裡負責把名字換成真的圖示
 * 只引入用得到的,不會把整包圖示打包進來
 */

/** 數字卡片的圖示(資料欄位 metrics[].icon) */
const METRIC_ICONS: Record<string, LucideIcon> = {
  timer: Timer,
  rocket: Rocket,
  signature: Signature,
  files: Files,
  layers: Layers,
  merge: GitMerge,
  tree: ListTree,
  meetings: Users,
};

export function MetricIconView({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? METRIC_ICONS[name] : undefined;
  return Icon ? <Icon className={className} strokeWidth={1.9} aria-hidden /> : null;
}

/** 技能的官方 Logo(資料欄位 skills[].items[].logo,值是 Simple Icons 的 slug) */
const SKILL_LOGOS: Record<string, SimpleIcon> = Object.fromEntries(
  [
    siApacheecharts,
    siClaude,
    siCommitlint,
    siD3,
    siGitlab,
    siGnuprivacyguard,
    siJavascript,
    siJest,
    siModelcontextprotocol,
    siNextdotjs,
    siReact,
    siReacthookform,
    siSass,
    siShadcnui,
    siStorybook,
    siTailwindcss,
    siTanstack,
    siTestinglibrary,
    siTurborepo,
    siTypescript,
    siVuedotjs,
    siZod,
  ].map((icon) => [icon.slug, icon]),
);

/** 單色 Logo,平常跟文字同色,滑過才換品牌色(外層要有 group/chip) */
export function SkillLogo({ slug }: { slug?: string }) {
  const logo = slug ? SKILL_LOGOS[slug] : undefined;
  if (!logo) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-3.5 shrink-0 fill-current transition-colors group-hover/chip:[color:var(--brand)]"
      style={{ "--brand": `#${logo.hex}` } as CSSProperties}
    >
      <path d={logo.path} />
    </svg>
  );
}
