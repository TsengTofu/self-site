# self-site 🛋️

互動式「桌面場景」個人網站 — 桌上的每樣東西都藏著一部分的我。

三個頁面：

- `/` — 手繪海景房場景：分層元素、四時段光影、人物三態、找貓咪彩蛋、來電與鬧鐘
- `/resume` — 互動履歷（職涯時間軸，同頁切換）
- `/making-of` — 視覺風格製作歷程（總覽 + 可點擊時間軸，兩畫面左右切換）

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **App**: Next.js 15(App Router, Turbopack)
- **State**: Zustand
- **Animation**: GSAP(@gsap/react、TextPlugin)+ CSS keyframes
- **Style**: Tailwind CSS v4(CSS-first,@theme tokens)

## 快速開始

```bash
pnpm install
pnpm dev        # turbo run dev → http://localhost:3000
pnpm build      # production build（先停 dev server：兩者共用 .next 會互撞）
pnpm check-types
pnpm lint
pnpm commit     # commitizen 精靈：type / scope / 描述一步步問，commitlint 擋格式
```

## 專案結構

```
self-site/
├── apps/
│   └── web/
│       ├── scripts/convert-elements.py   # 元素 PNG → WebP 轉檔（補圖後重跑）
│       └── src/
│           ├── app/                  # /、/resume、/making-of + sitemap/robots/manifest
│           ├── components/
│           │   ├── scene/            # 場景系統：photo-scene / element-layers /
│           │   │                     #   hotspots（座標）/ cat-peekaboo / scene-overlays
│           │   ├── overlays/         # 各物件的視窗（手機/電腦/書/筆記本/滑板/海景）
│           │   ├── resume/           # /resume 頁
│           │   ├── making-of/        # /making-of 頁
│           │   ├── nav/              # 🧪 導覽提案（?navv=list|sheet，選版後固化）
│           │   ├── desk-experience.tsx   # 首頁總指揮：鏡頭、點擊路由、overlay
│           │   ├── music-player.tsx      # 音樂 Player（展開選歌 / 左下 mini）
│           │   ├── mobile-dock.tsx       # 手機版底部 dock
│           │   └── scene-header.tsx      # 左上標題（hover/觸控展開子頁連結）
│           ├── data/                 # ✏️ 內容（履歷/專案/書/句子/歌/製作歷程）
│           ├── hooks/                # 在座循環、來電、鬧鐘（含排程）、鏡頭、時段…
│           ├── lib/                  # items 註冊表、site（網域）、motion、gsap-setup
│           └── stores/scene-store.ts # Zustand 場景狀態
└── packages/
    ├── ui/                           # Overlay（焦點陷阱）/ WindowFrame / CloseButton
    └── typescript-config/
```

## 互動地圖

| 物件 | 行為 |
| --- | --- |
| 📱 手機 | 飛到中央，App:Profile 摘要（→ /resume）/ 聯絡 / 鬧鐘；點兩下直接進鬧鐘；來電響鈴時點它接聽 |
| 💻 電腦 | 鏡頭拉近螢幕 → 專案視窗；有 `demoUrl` 的專案可內嵌實機操作（LIVE ▶） |
| 🎧 耳機 / 🔊 音響 | 音樂 Player：展開選歌 → YouTube 播放，可縮左下角 mini 不中斷 |
| 🎒 背包 | 近期讀過想推薦的書 |
| 🪟 窗戶 | 拉近海景（時段連動、點海面起漣漪） |
| 🛹 滑板 | 徵求點子彩蛋 |
| 🐈 豆漿（三花貓） | 每次載入隨機躲一個藏點，找到累計次數（鍵盤也點得到） |
| 📓 筆記本 / 📚 書堆 | 目前只在手機 dock 可開（桌面熱區等元素圖補上後開回） |
| 🖼️ 海報 / 🧢 帽子 | 保留觸發（搖晃 + toast） |
| ☕ 馬克杯 / 💿 唱片櫃 | 熱區停用中（這版構圖沒有這些物件） |

## 使用者待辦（內容/部署時要補的）

1. **網域**：部署時設定環境變數 `NEXT_PUBLIC_SITE_URL`（lib/site.ts 會讀）
2. `data/music.ts` — 三首歌的 `youtubeVideoId` 還是空的（播放器目前是示範模式）
3. `data/profile.ts` — Medium 連結是佔位網址
4. `data/projects.ts` — self-site 的 `demoUrl` 部署後換成正式網址
5. `public/making-of/` — /making-of 的過程圖還有幾格沒補（`asset.src` 為 null 的那些；規格見 data/making-of.ts 檔頭）
6. **og.jpg / app/icon.png 素材過時**：分別是舊版房間圖與橘貓（現在的豆漿是三花），想換再提供新圖
7. 導覽選版：`?navv=list|sheet` 兩案 vs 原始版，選定後固化並刪 mock-variant.ts

## 要換成自己的內容

- `apps/web/src/data/*.ts` — 履歷/專案/書單/句子/歌單/製作歷程（規劃中：改由自有資料庫供應）
- `apps/web/public/scene/elements/` — 場景元素去背圖；**新增/覆蓋 PNG 後跑
  `python3 apps/web/scripts/convert-elements.py` 產出 WebP**（前端一律讀 .webp）
