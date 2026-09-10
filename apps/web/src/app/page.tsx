import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { DeskExperience } from "@/components/desk-experience";
import { SITE_TITLE, shareMeta } from "@/lib/site";

const DESCRIPTION =
  "互動式桌面場景個人網站：一間手繪的海景房，床、書桌、貓咪都點得動 —— 點點看，認識前端工程師 Tofu Tseng。";

// description 覆寫了就把 openGraph / twitter 一起重列,不然分享卡片會拿到 layout 的短版
export const metadata: Metadata = {
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  ...shareMeta(SITE_TITLE, DESCRIPTION, "website"),
};

/**
 * 讀 public/scene/elements/ 底下實際存在的 webp 檔名清單（不含副檔名）——
 * 看的是網站真正會載的 .webp(源檔 PNG 在 assets/,轉檔沒跑圖層就不會出現,錯誤提早到 build 期)
 * 互動元素（ItemId）與裝飾元素（element-layers.tsx 的 DECOR）都在裡面，
 * production build 時就決定好（加新圖要重 build），dev 模式重新整理即可看到新圖。
 */
function readAvailableElements(): string[] {
  const dir = path.join(process.cwd(), "public/scene/elements");

  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }

  return files.filter((file) => file.endsWith(".webp")).map((file) => file.slice(0, -".webp".length));
}

export default function HomePage() {
  const availableElements = readAvailableElements();
  return <DeskExperience availableElements={availableElements} />;
}
