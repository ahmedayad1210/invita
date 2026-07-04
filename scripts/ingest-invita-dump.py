#!/usr/bin/env python3
"""Ingest assets from ~/Downloads/invita dump into public/ for the Invita site.

Output files are raw — always present them through MediaFrame / MediaImage
and invita-assets.css so they match Invita's espresso / ivory / rose design.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

ROOT = Path(__file__).resolve().parent.parent
DUMP = Path("/Users/ahmedalnuaimi/Downloads/invita dump")
BRAND_DRIVE = Path("/Users/ahmedalnuaimi/Downloads/invita-brand-identity")
OUT = ROOT / "public/images/invita"
FONTS_OUT = ROOT / "public/fonts/plain"
RESOURCES = ROOT / "public/resources"
MEDIA = ROOT / "public/media/reels"
CATALOG = ROOT / "src/data/invita-media.json"

# Official logo variants (Prancheta board from brand identity kit)
LOGO_VARIANTS: dict[str, str] = {
    "logo-icon-navy.png": "Logotype/PNG/Prancheta 1.png",
    "logo-icon-gold.png": "Logotype/PNG/Prancheta 9.png",
    "logo-wordmark-navy.png": "Logotype/PNG/Prancheta 14.png",
    "logo-wordmark-ivory.png": "Logotype/PNG/Prancheta 11.png",
    "logo-wordmark-gold.png": "Logotype/PNG/Prancheta 12.png",
    "logo-wordmark-periwinkle.png": "Logotype/PNG/Prancheta 13.png",
    "logo-stack-dark.png": "Logotype/PNG/Prancheta 9.png",
    "logo-stack-navy.png": "Logotype/PNG/Prancheta 15.png",
    "logo-stack-ivory.png": "Logotype/PNG/Prancheta 17.png",
    "brand-capsules.png": "Aplications/Prancheta 21_1.png",
}

# Back-compat aliases used across the site
LOGO_ALIASES = {
    "logo-icon.png": "logo-icon-gold.png",
    "logo-wordmark-dark.png": "logo-wordmark-navy.png",
}

PLAIN_FONT_FILES = [
    "Plain-Regular.otf",
    "Plain-Medium.otf",
    "Plain-Bold.otf",
    "Plain-Light.otf",
]

IV_RE = re.compile(r"^I V (\d+)\.jpg$", re.I)


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def file_hash(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def save_webp(src: Path, dest: Path, width: int | None = None, quality: int = 88) -> tuple[int, int]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as img:
        img = img.convert("RGB")
        if width and img.width > width:
            ratio = width / img.width
            img = img.resize((width, int(img.height * ratio)), Image.Resampling.LANCZOS)
        img.save(dest, "WEBP", quality=quality, method=6)
    with Image.open(dest) as out:
        return out.size


def save_png_copy(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


def ingest_iv_infographics(catalog: dict) -> None:
    items = []
    for path in sorted(DUMP.glob("I V *.jpg")):
        m = IV_RE.match(path.name)
        if not m:
            continue
        num = int(m.group(1))
        dest = OUT / "infographics" / f"iv-{num:02d}.webp"
        w, h = save_webp(path, dest, width=1080)
        items.append(
            {
                "id": f"iv-{num:02d}",
                "type": "infographic",
                "source": path.name,
                "path": f"/images/invita/infographics/iv-{num:02d}.webp",
                "width": w,
                "height": h,
            }
        )
    catalog["infographics"] = items


def ingest_photos(catalog: dict) -> None:
    seen: set[str] = set()
    items = []
    for path in sorted(DUMP.glob("PHOTO-*.jpg")):
        try:
            digest = file_hash(path)
        except OSError:
            print(f"  skip unreadable: {path.name}")
            continue
        if digest in seen:
            continue
        seen.add(digest)
        slug = slugify(path.stem)
        dest = OUT / "clinic" / f"{slug}.webp"
        try:
            w, h = save_webp(path, dest, width=1200)
        except OSError as exc:
            print(f"  skip corrupt image {path.name}: {exc}")
            continue
        items.append(
            {
                "id": slug,
                "type": "clinic",
                "source": path.name,
                "path": f"/images/invita/clinic/{slug}.webp",
                "width": w,
                "height": h,
            }
        )
    catalog["clinicPhotos"] = items


def ingest_hero_and_featured(catalog: dict) -> None:
    featured = []

    hero_src = DUMP / "AJM06177-scaled (1).jpg"
    if hero_src.exists():
        w, h = save_webp(hero_src, OUT / "hero.webp", width=1920)
        featured.append({"role": "hero", "path": "/images/invita/hero.webp", "source": hero_src.name, "width": w, "height": h})

    product = DUMP / "PHOTO-2026-04-24-02-32-00.jpg"
    if product.exists():
        w, h = save_webp(product, OUT / "product-still-life.webp", width=1400)
        featured.append(
            {
                "role": "productStillLife",
                "path": "/images/invita/product-still-life.webp",
                "source": product.name,
                "width": w,
                "height": h,
            }
        )

    image_png = DUMP / "image.png"
    if image_png.exists():
        w, h = save_webp(image_png, OUT / "wellness-lounge.webp", width=1400)
        featured.append(
            {
                "role": "wellnessLounge",
                "path": "/images/invita/wellness-lounge.webp",
                "source": image_png.name,
                "width": w,
                "height": h,
            }
        )

    catalog["featured"] = featured


def find_brand_file(rel: str) -> Path | None:
    for base in (DUMP / "Invita IV", BRAND_DRIVE):
        if not base.exists():
            continue
        path = base / rel
        if path.exists():
            return path
    return None


def brand_source_dir() -> Path | None:
    for candidate in (DUMP / "Invita IV", BRAND_DRIVE):
        if (candidate / "Logotype" / "PNG").exists():
            return candidate
    return None


def ingest_brand(catalog: dict) -> None:
    brand_dir = brand_source_dir()
    if not brand_dir:
        print("  skip — no brand kit folder found")
        return

    logos = []
    brand_out = OUT / "brand"
    brand_out.mkdir(parents=True, exist_ok=True)

    for dest_name, rel in LOGO_VARIANTS.items():
        src = find_brand_file(rel)
        if src is None:
            print(f"  skip missing logo: {rel}")
            continue
        dest = brand_out / dest_name
        save_png_copy(src, dest)
        logos.append(
            {
                "id": slugify(dest_name),
                "path": f"/images/invita/brand/{dest_name}",
                "source": rel,
                "role": dest_name.replace(".png", "").replace("logo-", ""),
            }
        )

    for alias, target in LOGO_ALIASES.items():
        target_path = brand_out / target
        if target_path.exists():
            save_png_copy(target_path, brand_out / alias)

    colors = []
    for base in (brand_dir, BRAND_DRIVE, DUMP / "Invita IV"):
        colors_dir = base / "Colors"
        if colors_dir.exists():
            for swatch in sorted(colors_dir.glob("#*.png")):
                dest = brand_out / "colors" / swatch.name
                save_png_copy(swatch, dest)
                colors.append({"hex": swatch.stem, "path": f"/images/invita/brand/colors/{swatch.name}"})
            break

    catalog["brand"] = {
        "source": str(brand_dir),
        "colors": colors,
        "logos": logos,
    }

    # Plain — official UI typeface
    for base in (brand_dir, DUMP / "Invita IV", BRAND_DRIVE):
        font_src = base / "Type" / "Plain-Font"
        if font_src.exists():
            FONTS_OUT.mkdir(parents=True, exist_ok=True)
            copied = 0
            for name in PLAIN_FONT_FILES:
                src = font_src / name
                if src.exists():
                    shutil.copy2(src, FONTS_OUT / name)
                    copied += 1
            print(f"  {copied} Plain font files → {FONTS_OUT}")
            break


def ingest_resources(catalog: dict) -> None:
    RESOURCES.mkdir(parents=True, exist_ok=True)
    pdfs = [
        (DUMP / "invita 101 safety.pdf", "invita-safety-101.pdf"),
        (DUMP / "catalouge invita .pdf", "invita-catalogue.pdf"),
        (DUMP / "iv brochure 2.pdf", "invita-iv-brochure.pdf"),
        (DUMP / "INVITA IV DRIPS – 500ml Normal Saline v2.pdf", "invita-normal-saline.pdf"),
        (DUMP / "Invita IV/regulatory iso/KAPSAM-SAGLIK-ISO-13485-.pdf", "iso-13485.pdf"),
        (DUMP / "Invita IV/regulatory iso/Kapsam-Saglik-ISO-14001.pdf", "iso-14001.pdf"),
    ]
    items = []
    for src, name in pdfs:
        if not src.exists():
            print(f"  skip missing pdf: {src}")
            continue
        dest = RESOURCES / name
        if not dest.exists() or src.stat().st_mtime > dest.stat().st_mtime:
            shutil.copy2(src, dest)
        size_mb = round(dest.stat().st_size / (1024 * 1024), 1)
        items.append({"id": slugify(name), "path": f"/resources/{name}", "sizeMb": size_mb, "source": str(src.relative_to(DUMP)) if src.is_relative_to(DUMP) else src.name})
    catalog["resources"] = items


def ingest_reels(catalog: dict) -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    video_dir = DUMP / "Invita video store"
    items = []
    if not video_dir.exists():
        catalog["reels"] = items
        return

    videos = sorted(video_dir.glob("*.mp4"), key=lambda p: p.stat().st_size)
    for i, src in enumerate(videos[:6], start=1):
        dest = MEDIA / f"reel-{i:02d}.mp4"
        if not dest.exists():
            shutil.copy2(src, dest)
        items.append(
            {
                "id": f"reel-{i:02d}",
                "path": f"/media/reels/reel-{i:02d}.mp4",
                "source": src.name,
                "sizeMb": round(dest.stat().st_size / (1024 * 1024), 1),
            }
        )
    catalog["reels"] = items


def main() -> None:
    if not DUMP.exists():
        raise SystemExit(f"Dump folder not found: {DUMP}")

    catalog: dict = {"source": str(DUMP), "generatedBy": "scripts/ingest-invita-dump.py"}

    print("→ IV infographics…")
    ingest_iv_infographics(catalog)
    print(f"  {len(catalog.get('infographics', []))} files")

    print("→ Clinic photos…")
    ingest_photos(catalog)
    print(f"  {len(catalog.get('clinicPhotos', []))} unique")

    print("→ Hero & featured…")
    ingest_hero_and_featured(catalog)

    print("→ Brand kit…")
    ingest_brand(catalog)

    print("→ PDF resources…")
    ingest_resources(catalog)

    print("→ Reels…")
    ingest_reels(catalog)
    print(f"  {len(catalog.get('reels', []))} videos")

    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    CATALOG.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")
    print(f"\nCatalog → {CATALOG}")


if __name__ == "__main__":
    main()
