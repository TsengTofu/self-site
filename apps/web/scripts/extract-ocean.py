#!/usr/bin/env python3
"""從使用者的窗景原圖裁出「窗外那片海」,拉正透視後存成全螢幕用的底圖。

來源 = 四張 3000x2250 的窗戶插畫(含立體窗框,玻璃是斜的梯形),
輸出 = public/scene/ocean/ocean-<phase>.webp(把玻璃那塊反透視拉回矩形)。

海景 overlay(components/overlays/ocean-overlay.tsx)直接吃這四張,
所以點窗戶進去看到的是同一支畫筆畫的海,不是另外用 SVG 畫的

用法:
  python3 apps/web/scripts/extract-ocean.py [來源資料夾]

需求:Python 3 + Pillow
"""

import os
import sys

from PIL import Image

DEFAULT_SRC = os.path.expanduser("~/Downloads/🌟最終要用的圖檔/四個時間的窗景")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "scene", "ocean")

# 來源檔名 -> 站上的時段名
PHASES = {
    "window_morning_3000w.png": "dawn",
    "window_noon_3000w.png": "day",
    "window_sunset_3000w_fixed.png": "sunset",
    "window_night_3000w.png": "night",
}

# 玻璃四角(四張圖共用同一組;左右邊是垂直的,上下邊往右收斂)
# 這組是量好寫死的常數,腳本本身不偵測;
# 量法:掃描「藍色系」像素的邊界,再對上下緣各配一條直線,換圖要重量
INSET = 6  # 內縮幾 px,避開窗框的羽化邊
GLASS_L, GLASS_R = 445, 2455
TOP_A, TOP_B = 237.58, 0.09684      # y = A + B*x
BOT_A, BOT_B = 1966.42, -0.05684

# 輸出尺寸:寬度挑過(拉正後椰子樹與太陽比例看起來自然),
# 高度沿用玻璃左緣的高度;OUT_W 2450 比玻璃原寬約 2000 大,
# 那是把透視壓扁的右側撐回來,不是多出解析度
OUT_W, OUT_H = 2450, 1660
QUALITY = 80


def solve(src_quad, dst_quad):
    """求 PIL PERSPECTIVE 要的 8 個係數(輸出座標 -> 來源座標)。"""
    rows = []
    vals = []
    for (xs, ys), (xd, yd) in zip(src_quad, dst_quad):
        rows.append([xd, yd, 1, 0, 0, 0, -xs * xd, -xs * yd])
        vals.append(xs)
        rows.append([0, 0, 0, xd, yd, 1, -ys * xd, -ys * yd])
        vals.append(ys)
    n = 8
    m = [rows[i][:] + [vals[i]] for i in range(n)]
    for i in range(n):
        p = max(range(i, n), key=lambda r: abs(m[r][i]))
        m[i], m[p] = m[p], m[i]
        pv = m[i][i]
        for j in range(i, n + 1):
            m[i][j] /= pv
        for r in range(n):
            if r != i and m[r][i]:
                f = m[r][i]
                for j in range(i, n + 1):
                    m[r][j] -= f * m[i][j]
    return [m[i][n] for i in range(n)]


def main() -> int:
    src_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    if not os.path.isdir(src_dir):
        print(f"找不到來源資料夾:{src_dir}", file=sys.stderr)
        return 1
    os.makedirs(OUT_DIR, exist_ok=True)

    left, right = GLASS_L + INSET, GLASS_R - INSET
    quad = [
        (left, TOP_A + TOP_B * left + INSET),
        (right, TOP_A + TOP_B * right + INSET),
        (right, BOT_A + BOT_B * right - INSET),
        (left, BOT_A + BOT_B * left - INSET),
    ]
    coeffs = solve(quad, [(0, 0), (OUT_W, 0), (OUT_W, OUT_H), (0, OUT_H)])

    for name, phase in PHASES.items():
        path = os.path.join(src_dir, name)
        if not os.path.exists(path):
            print(f"跳過(來源不在):{name}", file=sys.stderr)
            continue
        im = Image.open(path).convert("RGB")
        assert im.size == (3000, 2250), f"{name}: 尺寸 {im.size} 不是 3000x2250,上面的四角常數對不上"
        flat = im.transform((OUT_W, OUT_H), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        out = os.path.join(OUT_DIR, f"ocean-{phase}.webp")
        flat.save(out, "WEBP", quality=QUALITY, method=6)
        print(f"{name:34s} -> ocean-{phase}.webp  {os.path.getsize(out) // 1024}KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
