#!/usr/bin/env python3
"""場景元素轉檔:apps/web/assets/scene/elements/*.png → public/scene/elements/同名.webp(quality 85)

- PNG 源檔放 assets/(不進 public,不會跟著 deploy 出去);前端一律讀 public/ 的 .webp
- 冪等:只轉「PNG 比 .webp 新」的檔,沒變的直接略過;要全部重轉加 --force
- 指名重轉:後面接檔名(不含副檔名),例如 `convert-elements.py bed`
- 源檔不到 2× 的元素列在 UPSCALE_2X,轉檔時順便放大 2 倍(見 upscale_cutout)
- 需求:Python 3 + Pillow(pip install Pillow)

用法:
  python3 apps/web/scripts/convert-elements.py [--force] [檔名 ...]
"""

import glob
import os
import sys

from PIL import Image, ImageChops, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC_DIR = os.path.join(ROOT, "assets", "scene", "elements")
OUT_DIR = os.path.join(ROOT, "public", "scene", "elements")

# 源檔解析度不到 2× 的元素(檔名不含副檔名):轉檔時先放大 2 倍再存
# 床的原稿只有 1448 寬,貼圖框卻有 1258,Retina 上等於被瀏覽器硬拉 2 倍
# 之後拿到真正 2× 的源檔,把名字從這裡拿掉就好
UPSCALE_2X = {"bed"}

# 放大 2 倍後輪廓的半透明過渡帶也跟著變兩倍寬,alpha 陡度乘回 2 才是原生 2× 該有的邊
# 只適合邊緣是硬邊的去背圖;帶柔和陰影的元素不要放進 UPSCALE_2X
EDGE_GAIN = 2.0


def bleed_edges(im: Image.Image) -> Image.Image:
    """把不透明區的顏色往外擴進透明區,回傳 RGB

    放大時邊緣像素會跟隔壁的透明像素混色,透明區底下如果是雜色就會長出白邊或黑邊
    先讓邊緣外側也是同一個顏色,放大後的輪廓才乾淨
    """
    solid = im.split()[3].point(lambda v: 255 if v >= 250 else 0)
    cur = Image.merge("RGBA", im.convert("RGB").split() + (solid,))
    for radius in (1, 2, 4, 8):
        spread = cur.convert("RGBa").filter(ImageFilter.GaussianBlur(radius)).convert("RGBA")
        known = cur.split()[3]
        rgb = Image.composite(cur.convert("RGB"), spread.convert("RGB"), known)
        reach = spread.split()[3].point(lambda v: 255 if v > 0 else 0)
        cur = Image.merge("RGBA", rgb.split() + (ImageChops.lighter(known, reach),))
    return cur.convert("RGB")


def upscale_cutout(im: Image.Image) -> Image.Image:
    """去背圖放大 2 倍:顏色與 alpha 分開放大,輪廓收回原生的銳利度

    這不是 AI 放大,畫面內部不會多出新細節;改善的是輪廓與內部線條的邊緣
    (瀏覽器自己拉 2 倍是雙線性,邊會糊成一條帶子)
    """
    im = im.convert("RGBA")
    size = (im.width * 2, im.height * 2)
    rgb = bleed_edges(im).resize(size, Image.LANCZOS)
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    alpha = im.split()[3].resize(size, Image.LANCZOS)
    alpha = alpha.point(lambda v: max(0, min(255, round((v - 127.5) * EDGE_GAIN + 127.5))))
    return Image.merge("RGBA", rgb.split() + (alpha,))


def main() -> int:
    force = "--force" in sys.argv[1:]
    named = {a for a in sys.argv[1:] if not a.startswith("--")}
    pngs = sorted(glob.glob(os.path.join(SRC_DIR, "*.png")))
    if named:
        pngs = [p for p in pngs if os.path.basename(p)[:-4] in named]
    if not pngs:
        print(f"找不到 PNG:{SRC_DIR} {' '.join(sorted(named))}".rstrip(), file=sys.stderr)
        return 1
    os.makedirs(OUT_DIR, exist_ok=True)

    total_png = total_webp = skipped = 0
    for png in pngs:
        name = os.path.basename(png)[:-4]
        out = os.path.join(OUT_DIR, name + ".webp")
        fresh = os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(png)
        if fresh and not force and name not in named:
            skipped += 1
            continue
        im = Image.open(png)
        if name in UPSCALE_2X:
            im = upscale_cutout(im)
        im.save(out, "WEBP", quality=85, method=6)
        sp, sw = os.path.getsize(png), os.path.getsize(out)
        total_png += sp
        total_webp += sw
        note = f"  (放大 2 倍 → {im.width}x{im.height})" if name in UPSCALE_2X else ""
        print(f"{os.path.basename(png):24s} {sp // 1024:5d}KB -> {sw // 1024:5d}KB{note}")

    print(f"{'TOTAL':24s} {total_png // 1024:5d}KB -> {total_webp // 1024:5d}KB  (略過 {skipped} 張沒變的)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
