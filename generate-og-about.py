#!/usr/bin/env python3
"""Build the sharing card for the site's front page.

Not the drawing and not a headshot. A title page: the emblem from the
masthead, the name, the site's own line, ruled the way the other cards are
ruled, on the same paper. The codex sketches sit at the edges faint enough
to read as texture rather than as a subject.

    python3 generate-og-about.py
"""

import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BG = (247, 242, 231)
INK = (46, 38, 25)
MUTED = (133, 122, 98)
ACCENT = (156, 81, 56)
BORDER = (221, 210, 186)

BAND = Path("public/images/codex-band.svg")
FLOURISH = Path("public/images/flourish.svg")
OUT = Path("public/images/og-about.jpg")

ACCENT_HEX = "#%02x%02x%02x" % ACCENT
BORDER_HEX = "#%02x%02x%02x" % BORDER


def inner_svg(path):
    """The contents of an svg file, without its outer tag."""
    return re.sub(r"^<svg[^>]*>|</svg>\s*$", "", path.read_text().strip())


def emblem(cx, cy, size):
    """The mark from the masthead: a squared circle with its sights on."""
    s = size / 48.0

    def p(v):
        return v * s

    return f"""
    <g transform="translate({cx - size / 2:.1f}, {cy - size / 2:.1f})"
       fill="none" stroke="{ACCENT_HEX}" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="{p(24):.1f}" cy="{p(24):.1f}" r="{p(21):.1f}" stroke-width="{p(1.1):.2f}"/>
      <rect x="{p(9):.1f}" y="{p(9):.1f}" width="{p(30):.1f}" height="{p(30):.1f}" stroke-width="{p(1):.2f}"/>
      <circle cx="{p(24):.1f}" cy="{p(24):.1f}" r="{p(10.5):.1f}" stroke-width="{p(0.8):.2f}" opacity="0.65"/>
      <line x1="{p(24):.1f}" y1="{p(1.5):.1f}" x2="{p(24):.1f}" y2="{p(46.5):.1f}" stroke-width="{p(0.6):.2f}" opacity="0.5"/>
      <line x1="{p(1.5):.1f}" y1="{p(24):.1f}" x2="{p(46.5):.1f}" y2="{p(24):.1f}" stroke-width="{p(0.6):.2f}" opacity="0.5"/>
      <line x1="{p(9):.1f}" y1="{p(9):.1f}" x2="{p(39):.1f}" y2="{p(39):.1f}" stroke-width="{p(0.5):.2f}" opacity="0.35"/>
      <line x1="{p(39):.1f}" y1="{p(9):.1f}" x2="{p(9):.1f}" y2="{p(39):.1f}" stroke-width="{p(0.5):.2f}" opacity="0.35"/>
      <circle cx="{p(24):.1f}" cy="{p(24):.1f}" r="{p(1.6):.1f}" fill="{ACCENT_HEX}" stroke="none"/>
    </g>"""


def build_svg():
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}">']
    parts.append('<rect width="%d" height="%d" fill="#%02x%02x%02x"/>' % (W, H, *BG))

    # Sketches along the top and bottom edges only, so the middle stays clear
    # for the name. Faint: this is the paper, not the picture.
    if BAND.exists():
        band = inner_svg(BAND)
        parts.append(f'<g opacity="0.15" transform="translate(-120, -34) scale(0.55)">{band}</g>')
        parts.append(
            f'<g opacity="0.13" transform="translate(1320, 664) scale(-0.55) ">{band}</g>'
        )

    parts.append(emblem(W / 2, 214, 74))

    if FLOURISH.exists():
        # 320 wide as drawn, centred under the name.
        parts.append(
            f'<g transform="translate({W / 2 - 210:.0f}, 404) scale(1.31)">{inner_svg(FLOURISH)}</g>'
        )

    parts.append("</svg>")
    return "\n".join(parts)


def font(name, size):
    for path in (
        f"/System/Library/Fonts/Supplemental/{name}",
        "/System/Library/Fonts/Supplemental/Didot.ttc",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def centred(draw, y, text, fnt, fill, tracking=0):
    """Draw centred, optionally letterspaced."""
    if not tracking:
        w = draw.textbbox((0, 0), text, font=fnt)[2]
        draw.text(((W - w) / 2, y), text, font=fnt, fill=fill)
        return
    widths = [draw.textbbox((0, 0), ch, font=fnt)[2] for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += w + tracking


def main():
    svg = build_svg()
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as tmp:
        tmp.write(svg.encode())
        svg_path = tmp.name
    png_path = svg_path.replace(".svg", ".png")
    subprocess.run(["rsvg-convert", "-w", str(W), "-h", str(H), "-o", png_path, svg_path], check=True)

    img = Image.open(png_path).convert("RGB")
    draw = ImageDraw.Draw(img)

    # The same ruled frame the other cards carry.
    draw.rectangle([18, 18, W - 19, H - 19], outline=BORDER, width=1)
    draw.rectangle([27, 27, W - 28, H - 28], outline=BORDER, width=1)

    centred(draw, 292, "Arshad Kazi", font("Didot.ttc", 82), INK)
    centred(draw, 430, "JOURNEY OF CURIOSITY", font("Bodoni 72 Smallcaps Book.ttf", 26), ACCENT, tracking=5)
    centred(draw, 520, "notebooks  ·  essays  ·  computer vision", font("Bodoni 72 Smallcaps Book.ttf", 19), MUTED, tracking=1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "JPEG", quality=92, optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
