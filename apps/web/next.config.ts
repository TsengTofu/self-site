import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@self-site/ui"],
  // 製作歷程的捲動版轉正成 /making-of,試用期間的網址轉回去
  async redirects() {
    return [{ source: "/making-of/scroll", destination: "/making-of", permanent: true }];
  },
};

export default nextConfig;
