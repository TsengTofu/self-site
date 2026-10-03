"""從 laptop.png 產出 laptop-frame.png:把白色螢幕挖空,只留機身和黑框

網站在挖空的地方墊一塊深色底、上面寫時間(scene/laptop-clock.tsx),
邊緣交給原圖的黑框蓋住,不會再透出一圈白邊

做法:從螢幕中心往外 flood fill,只走亮的像素,碰到黑框就停(鍵盤那塊銀色不會被吃到)
填到的像素依亮度變透明:純白全透明,跟黑框之間的過渡像素半透明
跑完記得再跑 convert-elements.py 轉成 webp
"""

import os
from collections import deque

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "scene", "elements", "laptop.png")
OUT = os.path.join(ROOT, "assets", "scene", "elements", "laptop-frame.png")

# 螢幕中心(laptop.png 像素座標),flood fill 從這裡開始
SEED = (180, 130)
# 亮度高於這個才算螢幕;黑框大約 70,螢幕大約 250
FILL_MIN = 110
# 亮度到這個以上就完全透明
CLEAR_AT = 235
FRAME_LUM = 80


def lum(p: tuple[int, int, int, int]) -> float:
    r, g, b, _ = p
    return 0.299 * r + 0.587 * g + 0.114 * b


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    seen = bytearray(w * h)
    queue = deque([SEED])
    seen[SEED[1] * w + SEED[0]] = 1
    filled = []
    while queue:
        x, y = queue.popleft()
        filled.append((x, y))
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                seen[ny * w + nx] = 1
                if lum(px[nx, ny]) >= FILL_MIN:
                    queue.append((nx, ny))

    # 填到的區域再往外擴一圈,把半亮的過渡像素也算進來
    edge = set()
    for x, y in filled:
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and lum(px[nx, ny]) < FILL_MIN:
                edge.add((nx, ny))

    for x, y in list(filled) + list(edge):
        r, g, b, a = px[x, y]
        t = (lum((r, g, b, a)) - FRAME_LUM) / (CLEAR_AT - FRAME_LUM)
        t = max(0.0, min(1.0, t))
        px[x, y] = (r, g, b, round(a * (1 - t)))

    im.save(OUT, optimize=True)
    print(f"laptop-frame.png: 挖空 {len(filled)} 像素 + 邊緣 {len(edge)} 像素")


if __name__ == "__main__":
    main()
