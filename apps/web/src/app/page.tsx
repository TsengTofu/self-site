import type { Metadata } from "next";
import { DeskExperience } from "@/components/desk-experience";
import { readAvailableElements } from "@/lib/scene-elements";
import { SITE_TITLE, shareMeta } from "@/lib/site";

const DESCRIPTION =
  "互動式桌面場景個人網站：一間手繪的海景房，床、書桌、貓咪都點得動 —— 點點看，認識前端工程師 Tofu Tseng。";

// description 覆寫了就把 openGraph / twitter 一起重列,不然分享卡片會拿到 layout 的短版
export const metadata: Metadata = {
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  ...shareMeta(SITE_TITLE, DESCRIPTION, "website"),
};

export default function HomePage() {
  const availableElements = readAvailableElements();
  return <DeskExperience availableElements={availableElements} />;
}
