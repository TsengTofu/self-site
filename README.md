# self-site 🛋️

互動式「桌面場景」個人網站 — 桌上的每樣東西都藏著一部分的我。

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **App**: Next.js 15(App Router, Turbopack)
- **State**: Zustand
- **Animation**: GSAP(@gsap/react、TextPlugin)
- **Style**: Tailwind CSS v4

## 快速開始

```bash
pnpm install
pnpm dev        # turbo run dev → http://localhost:3000
pnpm build      # production build
pnpm check-types
```

## 專案結構

```
self-site/
├── apps/
│   └── web/                      # Next.js 主站
│       └── src/
│           ├── app/              # App Router 入口
│           ├── components/
│           │   ├── scene/        # SVG 桌面場景(desk-scene.tsx)
│           │   ├── overlays/     # 各物件觸發的視窗(手機/電腦/書/筆記本/滑板/海景)
│           │   ├── desk-experience.tsx  # 總指揮:鏡頭、點擊路由、進場動畫
│           │   ├── music-player.tsx     # 整合式音樂 Player(展開選歌 / 左下 mini)
│           │   ├── mobile-dock.tsx      # 手機版底部 dock(RWD)
│           │   └── reaction-toast.tsx
│           ├── data/             # ✏️ 內容都在這裡改(履歷/專案/書單/歌單/句子)
│           ├── hooks/use-alarm.ts # ⏰ 鬧鐘邏輯預留區(你來實作)
│           ├── lib/items.ts      # 物件註冊表:id → overlay 對應
│           └── stores/scene-store.ts  # Zustand 場景狀態
└── packages/
    ├── ui/                       # 共用 UI(Overlay / WindowFrame / CloseButton)
    └── typescript-config/        # 共用 tsconfig
```

## 互動地圖

| 物件 | 行為 |
|------|------|
| 📱 手機 | 單擊 → 飛到中央,App:Profile(履歷)/ Mail(Gmail 寄信)/ Alarm;雙擊 → 直接開鬧鐘 |
| 💻 電腦 | 鏡頭拉近螢幕 → 專案視窗;有 `demoUrl` 的專案可直接內嵌操作(LIVE ▶) |
| 🎧 耳機 / 🔊 音響 | 音樂 Player:展開選歌 → YouTube 播放,可縮左下角迷你播放器不中斷 |
| 🎒 背包 | 近期讀過想推薦的書 |
| 📓 筆記本 | GSAP 動態手寫喜歡的句子(含韓文) |
| 🛹 滑板 | 還沒想好 → 徵求點子彩蛋 |
| 🧸 娃娃 / 🧋 手搖 / 📚 書堆 / 🖼️ 海報 / 💿 唱片櫃 | 保留觸發(搖晃 + toast) |

## 要換成自己的內容

1. `apps/web/src/data/profile.ts` — 履歷(姓名、技能、經歷、連結)
2. `apps/web/src/data/projects.ts` — 電腦裡的專案
3. `apps/web/src/data/books.ts` — 背包書單
4. `apps/web/src/data/quotes.ts` — 筆記本句子
5. `apps/web/src/data/music.ts` — 播放器歌曲清單(每首歌的 YouTube videoId)
6. `apps/web/src/hooks/use-alarm.ts` — 鬧鐘邏輯(已挖好洞)
7. `apps/web/public/scene/elements/` — 觸發點的手繪去背圖(插槽規格見資料夾內 README)
