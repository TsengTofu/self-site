import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { MakingOfAsset } from "@/data/making-of";

/**
 * 過程圖版位。素材（`asset.src`）還沒補的時候顯示虛線灰卡 +「素材待補」+ 圖說，
 * 補了圖就自動換成真圖 —— 補檔時元件零改動。
 *
 * 比例 class 寫死成對照表（而不是動態拼字串），Tailwind 掃描得到才不會被 purge。
 */
const RATIO_CLASS: Record<MakingOfAsset["ratio"], string> = {
  wide: "aspect-[16/10]",
  square: "aspect-square",
  tall: "aspect-[3/4]",
};

interface AssetSlotProps {
  asset: MakingOfAsset;
  /** figure 的圖號（「圖 N — 圖說」） */
  figureNo?: number;
}

export function AssetSlot({ asset, figureNo }: AssetSlotProps) {
  const ratio = RATIO_CLASS[asset.ratio];

  const media =
    asset.src === null ? (
      <div
        className={`flex ${ratio} w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-soft/25 bg-cream-dim/70 px-4 text-center`}
      >
        <ImageOff className="size-6 text-ink-dim/60" strokeWidth={1.6} />
        <span className="text-[11px] font-semibold tracking-wider text-ink-dim">素材待補</span>
        <span className="text-[11px] leading-snug text-ink-dim/80">{asset.caption}</span>
      </div>
    ) : (
      <div className={`relative ${ratio} w-full overflow-hidden rounded-lg bg-cream-dim/70`}>
        <Image
          src={asset.src}
          alt={asset.caption}
          fill
          sizes="(min-width:768px) 560px, 100vw"
          className="object-cover"
        />
      </div>
    );

  return (
    <figure className="mt-5 w-full">
      {media}
      <figcaption className="mt-2 text-xs text-ink-dim">
        {figureNo !== undefined ? `圖 ${figureNo} — ` : ""}
        {asset.caption}
      </figcaption>
    </figure>
  );
}
