# 場景底圖

把插畫圖檔放進這個資料夾,網站會自動改用「圖片場景模式」(沒有圖檔時退回手繪 SVG 場景):

| 檔名 | 用途 | 必要性 |
|------|------|--------|
| `room-empty.png` | 空景(椅子沒人)— 場景底圖 | 放了就啟用圖片模式 |
| `room-present.png` | 同構圖、但有人坐在椅子上的版本 | 可選 — 提供後「在座/離開」會在兩張圖之間交叉淡變 |

- 兩張圖尺寸要一致;目前熱區以 **2752 × 1536** 校準,
  不同尺寸請改 `src/components/scene/hotspots.ts` 的 `IMAGE_W / IMAGE_H`。
- 熱區位置微調也在 `hotspots.ts`(座標 = 圖片像素)。
- 探測順序是 `.jpg` → `.png` → `.webp`(見 `photo-scene.tsx` 的
  `SCENE_EMPTY_CANDIDATES` / `SCENE_PRESENT_CANDIDATES`),放其中一種副檔名就好。
- 建議壓成 WebP/優化過的 PNG(< 500KB)再放。

## 觸發點圖層插槽

想讓桌上的物件(耳機、筆電、背包…)有自己的手繪替換圖,不用重畫整張底圖 —
見 [`elements/README.md`](./elements/README.md)。
