# 分批 commit 教學指南（143 個路徑 → 8 個規格化 commit）

> **2026-09-10 補記**：這份是 08-06 寫的分批方案。實際上後來改成 7 條堆疊分支（`stage-1-tooling` … `stage-7-entry-polish`）各開一個 PR、在 PR 層審核合併，下面每一批的 `git add` 清單已經不需要再貼。留著是因為「為什麼這樣分、每批的學習重點」還是有用；之後新的變動照 PR 流程走即可。

> 目的：把 baseline（`1a5665e`）之後累積的所有變動，依「功能演進的故事線」分批存檔。
> 每批 = 一個學習主題。建議一批一批來：先讀「為什麼」→ 貼 `git add` 指令 → `git diff --cached --stat` 掃一眼 → `pnpm run commit` 依精靈回答。

## 新增：規格化 commit 工具鏈（參考 temp-dev 專案裝的）

跟 `temp-dev` 專案一樣的三件套，裝在 workspace 根目錄：

| 工具 | 角色 |
|---|---|
| **commitizen** + **cz-conventional-changelog** | `pnpm run commit` 取代 `git commit`，跳出精靈一步步問你 type/scope/描述，自動組成符合規格的訊息 |
| **commitlint** | git 的 `commit-msg` hook，擋掉不符合 [Conventional Commits](https://www.conventionalcommits.org/) 格式的訊息（規則來自 `@commitlint/config-conventional`） |
| **husky** | 掛 git hooks 的機制；`pre-commit` 跑 `pnpm check-types && pnpm lint`，`commit-msg` 跑 commitlint |

**跟 temp-dev 的兩個差異，順手記錄原因**：
1. commitizen adapter 的路徑（這裡放在根 `package.json` 的 `config.commitizen.path`，不另開 `.czrc`），temp-dev 用 `"node_modules/cz-conventional-changelog"`（npm/yarn 的扁平 hoisting 下才穩定成立）；這裡改用**裸套件名** `"cz-conventional-changelog"`，讓 Node 用正常模組解析去找 —— pnpm 的 node_modules 是嚴格連結、不整棵拉平，相對路徑寫死容易在別的機器/pnpm 版本上解析失敗。
2. `pre-commit` hook 內容，temp-dev 是 `npx vitest run`（它有測試）；這個專案還沒有測試框架，所以換成這裡本來就在用的品質關卡：`pnpm check-types && pnpm lint`。之後如果加了測試，可以把 `pnpm test` 接進來。

**運作起來是什麼感覺**：`git add` 一批檔案（照舊，複製指令貼上）→ 執行 `pnpm run commit` → 終端機跳出互動精靈依序問幾個問題 → 你選 type、填 scope 與描述 → **commit-msg hook 自動驗證格式**、**pre-commit hook 自動跑 typecheck+lint** → 兩關都過訊息才真的寫入。下面每一批都附上「精靈這樣回答」的小抄，照著填就是一個格式一致、審得出重點的 commit history。

已驗證：commitlint 能分辨合格/不合格訊息（`echo "..." | pnpm exec commitlint`）、pre-commit hook 手動跑過（`bash .husky/pre-commit`）typecheck+lint 全綠。

## 開始前，三個誠實的註記

1. **檔案級分批的極限**:git 以檔案為單位分批；同一個檔案若跨了多個階段（例如 `photo-scene.tsx` 同時有場景系統與今天的載入優化），它的所有改動會一起進「主要歸屬」的那批。想拆到 hunk 級要用 `git add -p`，成本高，對補存檔不划算 —— 各批的「跨階段註記」會標出這些檔案。
2. **中間 commit 不保證單獨可 build**：這是「事後補存檔」的取捨（例如第 3 批的程式碼 import 了第 8 批才 commit 的 .webp）。最終狀態（第 8 批之後）是驗證過 typecheck/lint/瀏覽器全綠的。
3. **`.claude/launch.json` 與 `.claude/settings.local.json` 不進版控**：前者寫死了這台機器的絕對路徑（使用者名稱、nvm node 版本），換機器就壞、公開也沒必要洩漏本機路徑；後者依 Claude Code 官方慣例本來就是本機專屬設定。兩者已加進 `.gitignore`。

---

## 第 1 批：開發工具鏈與 CI 基建（12 個路徑）

**故事**:monorepo 的地基。Turborepo 管任務編排（`turbo.json`）、pnpm workspace 管依賴（兩份 `package.json` + `pnpm-lock.yaml`）、Prettier/ESLint 統一風格、CI workflow 先寫好等 GitHub remote 建立後第一次推送就會跑。這批也把 `.gitignore` 的更新一併帶上（見上方註記 3）。

**學習重點**
- `pnpm-lock.yaml` 一定進版控：它鎖住整棵依賴樹，沒有它每次 install 都可能拿到不同版本。
- dev server 的啟動設定（`.claude/launch.json`，用 `zsh -c` + node 絕對路徑，因為預覽沙箱的 PATH 沒有 pnpm）留在本機，不進 repo —— 這是「專案設定」與「本機工具設定」的分界線，判斷標準是：內容換一台機器還成立嗎？成立才進版控。
- CI 只做 types/lint/build 三件事：個人專案的最小可信防線。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `chore` |
| What is the scope of this change | `tooling` |
| Write a short description | 開發工具鏈、CI 基建與規格化 commit 流程 |
| Provide a longer description（可選，直接貼） | Turborepo 任務編排、pnpm workspace 依賴鎖定、Prettier/ESLint 風格、CI workflow;<br>並參考 temp-dev 專案裝上 commitizen+commitlint+husky,`pnpm run commit` 起就有精靈引導、<br>訊息格式與 typecheck/lint 兩道關卡自動擋。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  ".github/workflows/ci.yml" \
  ".prettierrc" \
  "apps/web/eslint.config.mjs" \
  "apps/web/package.json" \
  "package.json" \
  "pnpm-lock.yaml" \
  "turbo.json" \
  "docs/visual-and-interaction-roadmap.md" \
  ".gitignore" \
  "commitlint.config.js" \
  ".husky/pre-commit" \
  ".husky/commit-msg"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 12 個路徑)
```

---

## 第 2 批：手繪場景素材（33 個路徑）

**故事**：視覺的「原料庫」。底圖換成清空版海景房（`room-empty.jpg`），畫面上所有東西 —— 12 件家具、四時段窗景、四張打光漸層、人物三態、三花貓五姿勢 —— 全部拆成獨立去背 PNG。同時刪掉三個舊架構檔案：`cat.png`/`girl.png`（舊橘貓與舊人物，已被新素材取代）、`room-present.jpg`（「有人版底圖」雙圖淡變的舊方案，被元素層系統取代）。

**學習重點**
- **檔名即介面**:`elements/` 的檔名就是程式的鍵（`elementSrc("bed")`），新增素材=丟檔案，不用改程式。
- PNG 是「源檔」：網站實際讀的是 WebP（第 8 批），PNG 留著當無損原稿，之後要重轉、重裁都從它來。
- 兩份 README 記錄了所有元素的像素座標表（rect）—— 文件在這個專案裡不是說明書，是座標的單一事實來源之一。

**跨階段註記**:`elements/README.md` 最後一段（WebP 流程）是第 8 批時代補的，一起進這批無妨。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `feat` |
| What is the scope of this change | `scene` |
| Write a short description | 手繪場景素材：清空底圖、家具、四時段窗景與打光、人物、三花貓 |
| Provide a longer description（可選，直接貼） | 12 件家具、四時段窗景、四張打光漸層、人物三態、三花貓五姿勢，全部拆成獨立去背 PNG;<br>同時刪除舊架構的 cat.png/girl.png/room-present.jpg，已被新素材與元素層系統取代。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/public/scene/elements/backpack.png" \
  "apps/web/public/scene/elements/bed.png" \
  "apps/web/public/scene/elements/cabinet.png" \
  "apps/web/public/scene/elements/cat-back.png" \
  "apps/web/public/scene/elements/cat-sleep.png" \
  "apps/web/public/scene/elements/cat-stretch.png" \
  "apps/web/public/scene/elements/cat-walk.png" \
  "apps/web/public/scene/elements/chair.png" \
  "apps/web/public/scene/elements/girl-cat.png" \
  "apps/web/public/scene/elements/girl-music.png" \
  "apps/web/public/scene/elements/girl-stretch.png" \
  "apps/web/public/scene/elements/headphones.png" \
  "apps/web/public/scene/elements/lamp-on.png" \
  "apps/web/public/scene/elements/lamp.png" \
  "apps/web/public/scene/elements/laptop.png" \
  "apps/web/public/scene/elements/musicPlayer.png" \
  "apps/web/public/scene/elements/phone.png" \
  "apps/web/public/scene/elements/plant.png" \
  "apps/web/public/scene/elements/skateboard.png" \
  "apps/web/public/scene/elements/window-dawn.png" \
  "apps/web/public/scene/elements/window-day.png" \
  "apps/web/public/scene/elements/window-night.png" \
  "apps/web/public/scene/elements/window-sunset.png" \
  "apps/web/public/scene/elements/cat.png" \
  "apps/web/public/scene/elements/girl.png" \
  "apps/web/public/scene/room-present.jpg" \
  "apps/web/public/scene/room-empty.jpg" \
  "apps/web/public/scene/light-dawn.png" \
  "apps/web/public/scene/light-day.png" \
  "apps/web/public/scene/light-night.png" \
  "apps/web/public/scene/light-sunset.png" \
  "apps/web/public/scene/README.md" \
  "apps/web/public/scene/elements/README.md"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 33 個路徑)
```

---

## 第 3 批：分層場景系統（16 個路徑）

**故事**：把第 2 批的原料組裝成活的場景。這是整個網站的核心架構：

```
room-empty.jpg(底圖,next/image 搶 LCP)
  → SVG 元素層(窗景 4 時段 → 海鷗浮塵 → 家具按 LAYERS 順序 → 人物三態)
  → 貓咪彩蛋層(隨機藏點)
  → 打光層(4 張 alpha 漸層跟著時段淡變)
  → 隱形熱區 SVG(role=button + beacon 提示圈)
```

**學習重點**
- **單一座標來源**：所有層共用 1920×1080 像素座標系（`hotspots.ts`）；互動元素的貼圖位置直接吃熱區的外接框 —— 座標只維護一份，永不對不齊。
- **真遮擋不用 z-index**：「貓躲盆栽後」是把盆栽+人物在貓上面再疊繪一次（SVG 後畫的蓋前畫的），比 clip-path 自然。
- `LAYERS` 陣列就是空間深度：想調前後關係，搬陣列順序即可。
- `scene-store.ts`（zustand）只管「狀態」，行為全在 hooks（鏡頭 zoom、點擊路由、首訪提示、標題彩蛋）—— 狀態與行為分離。
- `lib/motion.ts` 的 `prefersReducedMotion()`：所有 GSAP 動畫的統一節流閘門。

**跨階段註記**：這批檔案含今天的優化 —— `element-layers`/`photo-scene` 的 warm 預熱（非當前時段/人物延後 2.5s 掛載）、`desk-experience` 的 overlay 背景 inert、`cat-peekaboo` 的鍵盤支援、`scene-header` 的真實子頁連結與觸控展開。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `feat` |
| What is the scope of this change | `scene` |
| Write a short description | 分層場景系統：座標熱區、元素圖層、時段光影、鏡頭與找貓彩蛋 |
| Provide a longer description（可選，直接貼） | 底圖 → SVG 元素層（窗景/家具/人物）→ 貓咪彩蛋層 → 打光層 → 隱形熱區，全部共用<br>1920×1080 像素座標系；含今天的 warm 預熱、overlay inert、貓的鍵盤支援等優化。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/src/components/scene/cat-peekaboo.tsx" \
  "apps/web/src/components/scene/element-layers.tsx" \
  "apps/web/src/components/scene/hotspots.ts" \
  "apps/web/src/components/scene/photo-scene.tsx" \
  "apps/web/src/components/scene/scene-overlays.tsx" \
  "apps/web/src/components/scene-header.tsx" \
  "apps/web/src/components/desk-experience.tsx" \
  "apps/web/src/app/page.tsx" \
  "apps/web/src/app/globals.css" \
  "apps/web/src/lib/items.ts" \
  "apps/web/src/lib/motion.ts" \
  "apps/web/src/stores/scene-store.ts" \
  "apps/web/src/hooks/use-scene-camera.ts" \
  "apps/web/src/hooks/use-item-click-router.ts" \
  "apps/web/src/hooks/use-hotspot-hint.ts" \
  "apps/web/src/hooks/use-title-egg.ts"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 16 個路徑)
```

---

## 第 4 批：物件視窗與手機系統（34 個路徑）

**故事**：點擊場景物件之後的世界。每個物件開一種 overlay（手機/電腦/書/筆記本/滑板/海景），手機裡又有一套 app（Profile/聯絡/鬧鐘/來電）。共用的 Overlay 殼抽到 `packages/ui`。

**學習重點**
- **焦點陷阱**(`use-modal-focus.tsx`):dialog 開啟時 Tab 只在面板內循環、ESC 關閉、關閉後焦點還給觸發元素 —— 無障礙 dialog 的三件套。
- **幽靈點擊防護**（`overlay.tsx` 的 450ms 規則）：手機 touch 開 overlay 後，瀏覽器會在同座標補發合成 click 打在剛掛載的背景上，造成「開了馬上關」。這是真機才會出現的 bug。
- `use-persisted-mode.ts`：三顆右上角 badge（上線/時段/來電）共用同一套 localStorage 持久化抽象 —— 重複三次的邏輯就抽 hook。
- `ring-tone.ts`(WebAudio):AudioContext 必須在使用者手勢中初始化，所以在開關點擊時 init，不能在載入時。
- `data/books|quotes|music.ts`：內容與元件分離 —— 這三個檔案就是之後資料庫化的 seed 來源。

**跨階段註記**:`reaction-toast` 含今天的 reduced-motion + aria-live;`use-alarm` 含今天的 SSR 安全早退；`data/*` 檔頭註解是今天清理的。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `feat` |
| What is the scope of this change | `overlays` |
| Write a short description | 物件視窗與手機系統：焦點陷阱、鬧鐘來電、音樂播放器 |
| Provide a longer description（可選，直接貼） | 每個場景物件開一種 overlay，手機裡有 Profile/聯絡/鬧鐘/來電四個 app;<br>共用 Overlay 殼含焦點陷阱與幽靈點擊防護，音樂/鈴聲相關檔案一併入列。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/src/components/overlays/books-overlay.tsx" \
  "apps/web/src/components/overlays/computer-overlay.tsx" \
  "apps/web/src/components/overlays/notebook-overlay.tsx" \
  "apps/web/src/components/overlays/ocean-overlay.tsx" \
  "apps/web/src/components/overlays/overlay-shell.tsx" \
  "apps/web/src/components/overlays/phone/alarm-app.tsx" \
  "apps/web/src/components/overlays/phone/contact-app.tsx" \
  "apps/web/src/components/overlays/phone/incoming-call-app.tsx" \
  "apps/web/src/components/overlays/phone/phone-overlay.tsx" \
  "apps/web/src/components/overlays/phone/profile-app.tsx" \
  "apps/web/src/components/overlays/skateboard-overlay.tsx" \
  "packages/ui/src/overlay.tsx" \
  "packages/ui/src/use-modal-focus.tsx" \
  "packages/ui/src/window-frame.tsx" \
  "apps/web/src/hooks/use-alarm.ts" \
  "apps/web/src/hooks/use-alarm-scheduler.ts" \
  "apps/web/src/hooks/use-persisted-mode.ts" \
  "apps/web/src/lib/ring-tone.ts" \
  "apps/web/src/components/status-badge.tsx" \
  "apps/web/src/components/phase-badge.tsx" \
  "apps/web/src/components/ring-badge.tsx" \
  "apps/web/src/components/mobile-dock.tsx" \
  "apps/web/src/components/item-icons.tsx" \
  "apps/web/src/components/night-owl-toast.tsx" \
  "apps/web/src/components/reaction-toast.tsx" \
  "apps/web/src/components/badge-pill.tsx" \
  "apps/web/src/components/music-player.tsx" \
  "apps/web/src/components/eq-bars.tsx" \
  "apps/web/src/components/vinyl-disc.tsx" \
  "apps/web/src/data/books.ts" \
  "apps/web/src/data/quotes.ts" \
  "apps/web/src/data/music.ts" \
  "apps/web/src/app/error.tsx" \
  "apps/web/src/app/not-found.tsx"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 34 個路徑)
```

---

## 第 5 批：互動履歷頁（2 個路徑）

**故事**：第二個 route。用「時間軸同頁切換」代替一頁式自我介紹。

**學習重點**
- **薄 server 殼 + client view** 的 route 模式：`page.tsx` 只出 metadata，互動全在 `resume-view.tsx` —— 這個模式後來被 /making-of 沿用，也是之後資料庫化「server 取數、props 下傳」的接縫。
- GSAP `useGSAP` 的 `dependencies: [active]`：切換階段時內容面板動畫重播的關鍵。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `feat` |
| What is the scope of this change | `resume` |
| Write a short description | 互動履歷頁 |
| Provide a longer description（可選） | 直接 Enter 跳過 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/src/app/resume/page.tsx" \
  "apps/web/src/components/resume/resume-view.tsx"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 2 個路徑)
```

---

## 第 6 批：視覺製作歷程頁（6 個路徑）

**故事**：第三個 route，講「這個網站的視覺是怎麼被做出來的」。定稿版型是兩個同頁畫面左右滑切換：總覽（標題+數據卡+CTA）→ 時間軸（可點擊章節+內部捲動面板）。

**學習重點**
- **內容與呈現徹底分離**:`data/making-of.ts` 只有可序列化的純值（連 accent 色票都是），icon 對照表放元件端 —— server component 可直接讀資料檔。
- **佔位補檔機制**:`asset.src: null` 顯示灰卡，補圖後填路徑即生效，元件零改動。
- 畫面切換用 CSS transition 而非 GSAP：背景分頁的 rAF 會停擺，CSS transform 不吃 rAF，凍住也會自己到終點。
- 全形標點是這頁定下的文案規範（工程眉角：AI 輸出的全形會被正規化，要用 chr 碼位寫入）。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `feat` |
| What is the scope of this change | `making-of` |
| Write a short description | 視覺製作歷程頁：總覽與時間軸雙畫面 |
| Provide a longer description（可選，直接貼） | 定稿版型是兩個同頁畫面左右滑切換：總覽（標題+數據卡+CTA）→ 時間軸（可點擊章節+內部捲動）。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/src/app/making-of/page.tsx" \
  "apps/web/src/data/making-of.ts" \
  "apps/web/src/components/making-of/asset-slot.tsx" \
  "apps/web/src/components/making-of/making-of-hybrid.tsx" \
  "apps/web/src/components/making-of/making-of-view.tsx" \
  "apps/web/src/components/making-of/tool-badge.tsx"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 6 個路徑)
```

---

## 第 7 批：導覽提案 mock（5 個路徑）

**故事**：還在評估中的導覽改版 —— 圓形按鈕展開的 list/sheet 兩種造型，用 `?navv=` 網址參數切換試用，選定後固化、未選的刪除。

**學習重點**
- **mock-variant 工作流**：設計決策不在對話裡空談，做成可切換的網址開個分頁比較 —— 這個模式已經用它選定了標題、/making-of 版型。
- 帶著「選定即刪」的紀律：mock 基礎設施（`mock-variant.ts`）標了 🧪，不讓實驗代碼變成永久債。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `feat` |
| What is the scope of this change | `nav` |
| Write a short description | 導覽提案 mock(?navv=list|sheet) |
| Provide a longer description（可選，直接貼） | 圓形按鈕展開的 list/sheet 兩種導覽造型，網址參數切換試用，選版後會固化並刪除 mock 分支。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/src/components/nav/orbit-nav.tsx" \
  "apps/web/src/components/nav/phase-slider.tsx" \
  "apps/web/src/components/nav/presence-chip.tsx" \
  "apps/web/src/components/nav/ring-toggle.tsx" \
  "apps/web/src/lib/mock-variant.ts"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 5 個路徑)
```

---

## 第 8 批：全站打磨（35 個路徑）

**故事**：今天的體檢修復。四個面向：效能（23 張 WebP，7.7MB→814KB）、SEO（env 化網域、各頁 OG/canonical、真實日期 sitemap、manifest）、分享資產（og 921KB→138KB、favicon 瘦身、apple-icon）、文件（README 重寫）。

**學習重點**
- SVG `<image>` 繞過 next/image，所以圖片優化要自己來：轉檔腳本（`scripts/convert-elements.py`）+ 檔名慣例（.png 源檔/.webp 上場）。
- Next metadata 的 `openGraph` **不會與 layout 深合併**：子頁覆寫時整個物件要重列（含 images）。
- `robots.ts`/`sitemap.ts`/`manifest.ts` 都是檔案慣例 route —— 放對位置就自動生效。
- `global-error.tsx` 拿不到 app 的 CSS（layout 沒渲染成功），樣式必須 inline。

**`pnpm run commit` 精靈這樣回答**

| 精靈問題 | 回答 |
|---|---|
| Select the type of change | `perf` |
| What is the scope of this change | `site` |
| Write a short description | 全站打磨：WebP 與預熱載入、SEO/OG、無障礙、行動端、README |
| Provide a longer description（可選，直接貼） | 23 張場景素材轉 WebP（7.7MB→814KB）、env 化網域與各頁 OG/canonical、<br>og/favicon 瘦身、無障礙四項、行動端安全區與觸控、README 重寫。 |
| Are there any breaking changes / 是否關聯 issue | 皆 `N` / Enter 跳過 |

```bash
git add -A -- \
  "apps/web/public/scene/elements/backpack.webp" \
  "apps/web/public/scene/elements/bed.webp" \
  "apps/web/public/scene/elements/cabinet.webp" \
  "apps/web/public/scene/elements/cat-back.webp" \
  "apps/web/public/scene/elements/cat-sleep.webp" \
  "apps/web/public/scene/elements/cat-stretch.webp" \
  "apps/web/public/scene/elements/cat-walk.webp" \
  "apps/web/public/scene/elements/chair.webp" \
  "apps/web/public/scene/elements/girl-cat.webp" \
  "apps/web/public/scene/elements/girl-music.webp" \
  "apps/web/public/scene/elements/girl-stretch.webp" \
  "apps/web/public/scene/elements/headphones.webp" \
  "apps/web/public/scene/elements/lamp-on.webp" \
  "apps/web/public/scene/elements/lamp.webp" \
  "apps/web/public/scene/elements/laptop.webp" \
  "apps/web/public/scene/elements/musicPlayer.webp" \
  "apps/web/public/scene/elements/phone.webp" \
  "apps/web/public/scene/elements/plant.webp" \
  "apps/web/public/scene/elements/skateboard.webp" \
  "apps/web/public/scene/elements/window-dawn.webp" \
  "apps/web/public/scene/elements/window-day.webp" \
  "apps/web/public/scene/elements/window-night.webp" \
  "apps/web/public/scene/elements/window-sunset.webp" \
  "apps/web/src/lib/site.ts" \
  "apps/web/src/app/robots.ts" \
  "apps/web/src/app/sitemap.ts" \
  "apps/web/src/app/manifest.ts" \
  "apps/web/src/app/global-error.tsx" \
  "apps/web/src/app/layout.tsx" \
  "apps/web/src/app/apple-icon.png" \
  "apps/web/src/app/icon.png" \
  "apps/web/public/og.jpg" \
  "apps/web/public/icon-192.png" \
  "apps/web/scripts/convert-elements.py" \
  "README.md"

pnpm run commit

# 驗收:add 完可先看 git diff --cached --stat(應為 35 個路徑)
```

---

## 收尾

全部做完後 `git status --short` 應該只剩這份指南自己。最後：

```bash
git add docs/commit-guide.md
pnpm run commit
```

**精靈回答**：type `docs`、scope `commit-guide`（或直接留白）、描述「分批 commit 教學紀錄」。

然後跟 Claude 說一聲 —— Phase A（資料庫化）開工。
