import type { Metadata } from "next";
import { Rubik_Spray_Paint } from "next/font/google";
import { SkateView } from "@/components/skate/skate-view";
import { skate } from "@/data/skate";
import { shareMeta } from "@/lib/site";

/** 噴漆字型只有這一頁用,宣告在這裡就只有這頁會載 */
const sprayPaint = Rubik_Spray_Paint({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-spray",
  display: "swap",
});

const TITLE = "自由的味道 — My Space";
const DESCRIPTION = "靠在鏡子旁的長板：摔倒集錦與人生的 side quest 清單。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/skateboard" },
  ...shareMeta(TITLE, DESCRIPTION, "website"),
};

/** 滑板頁:從房間點滑板,噴漆噴滿畫面後進來 */
export default function SkateboardPage() {
  return (
    <div className={sprayPaint.variable}>
      <SkateView data={skate} />
    </div>
  );
}
