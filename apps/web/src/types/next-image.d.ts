// 靜態 import 圖片(room-empty.jpg、light-*.png)的模組型別
// 平常由 next dev / next build 產生的 next-env.d.ts 提供,但那個檔不進版控
// CI 與 fresh clone 先跑 tsc 時它還不存在,這裡固定引用同一份宣告
/// <reference types="next/image-types/global" />
