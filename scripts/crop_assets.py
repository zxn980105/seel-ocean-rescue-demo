"""Crop illustration assets out of the two reference screenshots in docs/assets.

Coordinates are given in the 1024px-wide preview space and scaled to the source size.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "public" / "assets"
PAGE = ROOT / "docs/assets/seel-ocean-rescue-after-sales.png"
MODAL = ROOT / "docs/assets/seel-ocean-rescue-rewards-modal.png"

CROPS = {
    PAGE: {
        "card-seal.png": (46, 239, 224, 391),
        "card-island.png": (520, 239, 626, 298),
        "avatar-1.png": (58, 425, 94, 462),
        "avatar-2.png": (58, 469, 94, 506),
        "item-shirt.png": (58, 543, 94, 575),
        "item-bag.png": (58, 582, 94, 614),
        "item-headphones.png": (58, 621, 94, 653),
    },
    MODAL: {
        "modal-hero.png": (500, 185, 777, 313),
        "reward-bottle.png": (250, 349, 418, 425),
        "reward-mystery.png": (430, 349, 597, 425),
        "reward-partner.png": (609, 349, 776, 425),
        "product-bag.png": (256, 516, 321, 624),
        "product-sneakers.png": (438, 516, 509, 624),
        "product-headphones.png": (614, 516, 682, 624),
    },
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src, crops in CROPS.items():
        img = Image.open(src).convert("RGB")
        scale = img.width / 1024
        for name, box in crops.items():
            scaled = tuple(round(v * scale) for v in box)
            img.crop(scaled).save(OUT / name, optimize=True)
            print(name, scaled)


if __name__ == "__main__":
    main()
