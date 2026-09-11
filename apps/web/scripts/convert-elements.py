#!/usr/bin/env python3
"""場景元素轉檔:apps/web/assets/scene/elements/*.png → public/scene/elements/同名.webp(quality 85)

- PNG 源檔放 assets/(不進 public,不會跟著 deploy 出去);前端一律讀 public/ 的 .webp
- 冪等:只轉「PNG 比 .webp 新」的檔,沒變的直接略過;要全部重轉加 --force
- 需求:Python 3 + Pillow(pip install Pillow)

用法:
  python3 apps/web/scripts/convert-elements.py [--force]
"""

import glob
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC_DIR = os.path.join(ROOT, "assets", "scene", "elements")
OUT_DIR = os.path.join(ROOT, "public", "scene", "elements")


def main() -> int:
    force = "--force" in sys.argv[1:]
    pngs = sorted(glob.glob(os.path.join(SRC_DIR, "*.png")))
    if not pngs:
        print(f"找不到 PNG:{SRC_DIR}", file=sys.stderr)
        return 1
    os.makedirs(OUT_DIR, exist_ok=True)

    total_png = total_webp = skipped = 0
    for png in pngs:
        out = os.path.join(OUT_DIR, os.path.basename(png)[:-4] + ".webp")
        if not force and os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(png):
            skipped += 1
            continue
        Image.open(png).save(out, "WEBP", quality=85, method=6)
        sp, sw = os.path.getsize(png), os.path.getsize(out)
        total_png += sp
        total_webp += sw
        print(f"{os.path.basename(png):24s} {sp // 1024:5d}KB -> {sw // 1024:5d}KB")

    print(f"{'TOTAL':24s} {total_png // 1024:5d}KB -> {total_webp // 1024:5d}KB  (略過 {skipped} 張沒變的)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
