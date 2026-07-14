"use client";

import { useSceneStore } from "@/stores/scene-store";
import { PhoneOverlay } from "./phone/phone-overlay";
import { ComputerOverlay } from "./computer-overlay";
import { BooksOverlay } from "./books-overlay";
import { NotebookOverlay } from "./notebook-overlay";
import { SkateboardOverlay } from "./skateboard-overlay";
import { OceanOverlay } from "./ocean-overlay";

/** 依 store 的 overlay 狀態渲染對應視窗。 */
export function OverlayRoot() {
  const overlay = useSceneStore((s) => s.overlay);

  switch (overlay) {
    case "phone":
      return <PhoneOverlay />;
    case "computer":
      return <ComputerOverlay />;
    case "books":
      return <BooksOverlay />;
    case "notebook":
      return <NotebookOverlay />;
    case "skateboard":
      return <SkateboardOverlay />;
    case "ocean":
      return <OceanOverlay />;
    default:
      return null;
  }
}
