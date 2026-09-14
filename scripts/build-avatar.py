#!/usr/bin/env python3
"""Regenerate the header avatar from the master portrait.

The crop is the whole point of this file existing. The first header avatar was
cut at 100% face — cropped inside the hairline and the jaw, so at 28px it read
as a smudge of skin rather than as a person. This crop backs off to ~66% face
with air above the crown and the shoulders in frame, which is what survives
being drawn the size of a full stop.

    python3 scripts/build-avatar.py [SOURCE]

Coordinates are in the master's own pixels (864 x 1184).
"""
import sys
from pathlib import Path

from PIL import Image

SOURCE = Path(sys.argv[1] if len(sys.argv) > 1 else
              "/Users/dvargas/Desktop/bdo-figma-export/doug.png")
OUT = Path(__file__).resolve().parent.parent / "public" / "portrait"

# left, top, right, bottom. Square, so `object-cover` never re-crops it.
# The head runs y 345→820 and sits x 355→625, so this leaves ~9% above the
# crown and carries the shoulders — the head lands just above centre, where a
# circular mask wants it.
CROP = (124, 280, 844, 1000)
SIZES = {"doug-avatar-256.webp": 256, "doug-avatar-128.webp": 128}


def main() -> None:
    if not SOURCE.exists():
        sys.exit(f"master portrait not found: {SOURCE}")
    master = Image.open(SOURCE).convert("RGB")
    face = master.crop(CROP)
    for name, size in SIZES.items():
        face.resize((size, size), Image.LANCZOS).save(
            OUT / name, "WEBP", quality=86, method=6
        )
        print(f"{name}  {size}x{size}")


if __name__ == "__main__":
    main()
