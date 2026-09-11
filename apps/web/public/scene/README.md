# 場景底圖

`photo-scene.tsx` 用 Next.js 靜態 import 直接把底圖打進場景(SSR 直出、無 client-side 探測):

| 檔名              | 用途                           | 必要性                                     |
| ----------------- | ------------------------------ | ------------------------------------------ |
| `room-empty.jpg`  | 空景(椅子沒人)— 場景底圖       | **必要**,`photo-scene.tsx` 直接 import,檔名/副檔名要對得上 |

- 換圖請直接覆蓋這個檔名(維持 `.jpg`),或改 `photo-scene.tsx` 裡的 import 路徑/副檔名。
- 目前熱區以 **1920 × 1080**(清空版海景房,桌面淨空)校準,
  不同尺寸請改 `src/components/scene/hotspots.ts` 的 `IMAGE_W / IMAGE_H`。
- 「在座/離開」的人物呈現已改由元素層(`girl-<state>.png`)負責(見 `elements/README.md`),
  不再需要有人版底圖淡變。
- 熱區位置微調也在 `hotspots.ts`(座標 = 圖片像素)。
- 存成優化過的 JPG 即可(目前 3840 寬約 530KB);靜態 import 會自動產生 blur placeholder,
  next/image 再依裝置切小尺寸送出(3840 的 WebP 約 115KB),所以源檔大一點沒關係。
- 這個檔案是 build 期的靜態依賴 —— 拿掉或改名會讓 `pnpm build` / `pnpm dev` 直接噴錯,不是「退回」到別的畫面。

## 觸發點圖層插槽

想讓桌上的物件(耳機、筆電、背包…)有自己的手繪替換圖,不用重畫整張底圖 —
見 [`elements/README.md`](./elements/README.md)。
