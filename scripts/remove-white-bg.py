"""Remove (near-)white background from a PNG, preserving edge antialiasing.

Usage: python remove-white-bg.py <input.png> [output.png]
"""
import sys
from pathlib import Path
from PIL import Image

WHITE_THRESHOLD = 245
SOFT_EDGE_START = 200


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: remove-white-bg.py <input.png> [output.png]")
        sys.exit(1)
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src

    img = Image.open(src).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    span = WHITE_THRESHOLD - SOFT_EDGE_START

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            minc = min(r, g, b)
            if minc >= WHITE_THRESHOLD:
                pixels[x, y] = (r, g, b, 0)
            elif minc > SOFT_EDGE_START:
                ratio = (WHITE_THRESHOLD - minc) / span
                pixels[x, y] = (r, g, b, int(a * ratio))

    img.save(dst, "PNG", optimize=True)
    print(f"Saved: {dst} ({w}x{h})")


if __name__ == "__main__":
    main()
