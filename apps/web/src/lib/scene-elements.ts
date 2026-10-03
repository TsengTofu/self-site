import fs from "node:fs";
import path from "node:path";

/**
 * 讀 public/scene/elements/ 底下實際存在的 webp 檔名清單（不含副檔名）——
 * 看的是網站真正會載的 .webp(源檔 PNG 在 assets/,轉檔沒跑圖層就不會出現,錯誤提早到 build 期)
 * 互動元素（ItemId）與裝飾元素（element-layers.tsx 的 DECOR）都在裡面，
 * production build 時就決定好（加新圖要重 build），dev 模式重新整理即可看到新圖。
 * 只能在 server 端用（首頁與物件網址的 page.tsx）
 */
export function readAvailableElements(): string[] {
  const dir = path.join(process.cwd(), "public/scene/elements");

  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }

  return files.filter((file) => file.endsWith(".webp")).map((file) => file.slice(0, -".webp".length));
}
