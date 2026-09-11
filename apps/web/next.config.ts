import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@self-site/ui"],
  // lint 已經是獨立關卡(pre-commit 與 CI 都跑 pnpm lint)
  // next build 內建那次是重複的,關掉省時間;tsc 留著,單獨 build 時仍有保護
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
