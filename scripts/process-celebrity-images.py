#!/usr/bin/env python3
"""Crop and enhance celebrity IV drip images from Elixir Clinic reference screenshots."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = Path("/Users/ahmedalnuaimi/Downloads/invita dump/celebrities")
OUT = ROOT / "public/images/celebrities"
OUT_JSON = ROOT / "src/data/celebrities.json"

# PNG carousel screenshots → (filename, column index)
PNG_CROPS = [
    ("Image 7-4-26 at 6.10\u202fAM.png", 0, "taim-al-falasi"),
    ("Image 7-4-26 at 6.10\u202fAM.png", 1, "mona-kattan"),
    ("Image 7-4-26 at 6.10\u202fAM.png", 2, "aseel"),
    ("Image 7-4-26 at 6.10\u202fAM.png", 3, "mohamed-ramadan"),
    ("Image 7-4-26 at 6.08\u202fAM.png", 0, "saoud-alkaabi"),
    ("Image 7-4-26 at 6.08\u202fAM.png", 1, "rita-kahawaty"),
    ("Image 7-4-26 at 6.08\u202fAM.png", 2, "zoya-sakr"),
    ("Image 7-4-26 at 6.08\u202fAM.png", 3, "asallah-kamel"),
    ("Image 7-4-26 at 6.09\u202fAM.png", 0, "ahmed-twistedcurlz"),
    ("Image 7-4-26 at 6.09\u202fAM.png", 1, "aliyah-raey"),
    ("Image 7-4-26 at 6.09\u202fAM.png", 2, "lamiya-slimani"),
    ("Image 7-4-26 at 6.09\u202fAM.png", 3, "leen-jadan"),
    ("Image 7-4-26 at 6.09\u202fAM (1).png", 0, "dalia-el-ali"),
    ("Image 7-4-26 at 6.09\u202fAM (1).png", 1, "diana-ganeeva"),
    ("Image 7-4-26 at 6.09\u202fAM (1).png", 2, "heba-saad"),
]

CELEBRITY_META = {
    "taim-al-falasi": {"name": "Taim AlFalasi", "handle": "@taimalfalasi"},
    "mona-kattan": {"name": "Mona Kattan", "handle": "@monakattan"},
    "aseel": {"name": "Aseel", "handle": "@aseel"},
    "mohamed-ramadan": {"name": "Mohamed Ramadan", "handle": "@mohamedramadanws"},
    "saoud-alkaabi": {"name": "Saoud Alkaabi", "handle": "@saoudalkaabi"},
    "rita-kahawaty": {"name": "Rita Kahawaty", "handle": "@ritakahawaty"},
    "zoya-sakr": {"name": "Zoya Sakr", "handle": "@zoyasakr"},
    "asallah-kamel": {"name": "Asallah Kamel", "handle": "@asallahkamel"},
    "ahmed-twistedcurlz": {"name": "Ahmed", "handle": "@twistedcurlz"},
    "aliyah-raey": {"name": "Aliyah Raey", "handle": "@aliyahraey"},
    "lamiya-slimani": {"name": "Lamiya Slimani", "handle": "@lamiyaslimani"},
    "leen-jadan": {"name": "Leen Jadan", "handle": "@leenjadan"},
    "dalia-el-ali": {"name": "Dalia El Ali", "handle": "@deebydalia"},
    "diana-ganeeva": {"name": "Diana Ganeeva", "handle": "@diana.dxb"},
    "heba-saad": {"name": "Heba Saad", "handle": "@habah_saad"},
}

TARGET_WIDTH = 800
LABEL_RATIO = 0.11
TOP_RATIO = 0.02
SIDE_TRIM_RATIO = 0.04


def enhance(img: Image.Image) -> Image.Image:
    img = img.filter(ImageFilter.UnsharpMask(radius=1.8, percent=140, threshold=2))
    img = ImageEnhance.Contrast(img).enhance(1.06)
    img = ImageEnhance.Color(img).enhance(1.04)
    return img


def crop_panel(src: Image.Image, col: int, cols: int = 4) -> Image.Image:
    w, h = src.size
    panel_w = w // cols
    left = col * panel_w + int(panel_w * SIDE_TRIM_RATIO)
    right = (col + 1) * panel_w - int(panel_w * SIDE_TRIM_RATIO)
    top = int(h * TOP_RATIO)
    bottom = int(h * (1 - LABEL_RATIO))
    return src.crop((left, top, right, bottom))


def to_portrait(img: Image.Image) -> Image.Image:
    target_h = int(TARGET_WIDTH * 4 / 3)
    img = img.resize((TARGET_WIDTH, target_h), Image.Resampling.LANCZOS)
    return enhance(img)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    catalog: list[dict] = []

    for filename, col, slug in PNG_CROPS:
        src_path = SRC / filename
        if not src_path.exists():
            raise FileNotFoundError(src_path)

        with Image.open(src_path) as raw:
            panel = crop_panel(raw.convert("RGB"), col)
            out_img = to_portrait(panel)
            out_path = OUT / f"{slug}.webp"
            out_img.save(out_path, "WEBP", quality=88, method=6)

        meta = CELEBRITY_META[slug]
        catalog.append(
            {
                "id": slug,
                "name": meta["name"],
                "handle": meta["handle"],
                "image": f"/images/celebrities/{slug}.webp",
            }
        )
        print(f"✓ {meta['name']} → {out_path.name} ({out_img.size[0]}×{out_img.size[1]})")

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")
    print(f"\nWrote {len(catalog)} images → {OUT}")
    print(f"Catalog → {OUT_JSON}")


if __name__ == "__main__":
    main()
