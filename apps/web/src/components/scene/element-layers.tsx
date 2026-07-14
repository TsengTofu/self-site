"use client";

import { useEffect, useState } from "react";
import type { ItemId } from "@/lib/items";
import { IMAGE_W, IMAGE_H } from "./hotspots";

/**
 * 觸發點的圖層插槽 —— 每個有功能的觸發點都對應一張座標固定的去背 PNG。
 * 畫好的圖丟進 `public/scene/elements/<itemId>.png` 就會自動貼上該位置,
 * 沒放檔案就維持底圖原樣(規格見 public/scene/elements/README.md)。
 */
export interface ElementSlot {
  id: ItemId;
  /** 底圖像素座標(與 hotspots.ts 同一套系統) */
  rect: { x: number; y: number; w: number; h: number };
}

export const ELEMENT_SLOTS: ElementSlot[] = [
  { id: "phone", rect: { x: 1258, y: 998, w: 110, h: 70 } },
  { id: "laptop", rect: { x: 1300, y: 750, w: 290, h: 250 } },
  { id: "headphones", rect: { x: 2052, y: 1232, w: 240, h: 165 } },
  { id: "musicPlayer", rect: { x: 1545, y: 690, w: 205, h: 125 } },
  { id: "backpack", rect: { x: 555, y: 390, w: 200, h: 385 } },
  { id: "notebook", rect: { x: 1090, y: 992, w: 185, h: 85 } },
  { id: "skateboard", rect: { x: 1908, y: 748, w: 160, h: 497 } }, // 多邊形熱區的外接框
];

export const elementSrc = (id: ItemId) => `/scene/elements/${id}.png`;

interface ElementLayersProps {
  /** 目前 hover 的物件(對應圖層會亮起) */
  hoveredItem: ItemId | null;
}

/**
 * 逐一探測 ELEMENT_SLOTS 有沒有對應的去背圖(404 = 沒畫,靜默跳過),
 * 載入到的才畫成 SVG <image> 層,與 hotspots 共用同一套 viewBox / slice 裁切數學,
 * desktop 裁切與 mobile 橫捲都結構性對齊。
 */
export function ElementLayers({ hoveredItem }: ElementLayersProps) {
  const [loaded, setLoaded] = useState<Set<ItemId>>(new Set());

  useEffect(() => {
    ELEMENT_SLOTS.forEach((slot) => {
      const img = new Image();
      img.onload = () => setLoaded((prev) => new Set(prev).add(slot.id));
      img.onerror = () => {
        /* 沒畫這個物件,保持底圖原樣 */
      };
      img.src = elementSrc(slot.id);
    });
  }, []);

  return (
    <svg
      viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {ELEMENT_SLOTS.filter((slot) => loaded.has(slot.id)).map((slot) => (
        <image
          key={slot.id}
          href={elementSrc(slot.id)}
          x={slot.rect.x}
          y={slot.rect.y}
          width={slot.rect.w}
          height={slot.rect.h}
          preserveAspectRatio="none"
          className={`element-layer ${hoveredItem === slot.id ? "element-layer-hover" : ""}`}
        />
      ))}
    </svg>
  );
}
