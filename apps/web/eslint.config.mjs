import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16 起 eslint-config-next 直接匯出 flat config,不用再經過 FlatCompat 轉
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // react-hooks v7 新規則:專案裡的 effect 內 setState 都是「掛載後才讀瀏覽器值」
      // (網址 hash、query、prefers-reduced-motion),刻意避開 SSR hydration 不一致
      // 先降為警告,之後改寫成 useSyncExternalStore 再調回 error
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
