#!/usr/bin/env python3
"""Build the About page's sharing card from the page itself.

The card is the constellation, not a headshot, because the constellation is
what the page is. Positions and ties are read straight out of the built
index.html, so the card can never drift from the drawing it represents:
rebuild the site, run this, and it matches.

    npm run build && python3 generate-og-about.py
"""

import math
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

BUILT = Path("dist/index.html")
OUT = Path("public/images/og-about.jpg")


def read_drawing():
    """Pull the cells and the ties out of the built page."""
    html = BUILT.read_text()

    facets = []
    for m in re.finditer(
        r'<g class="facet" data-i="(\d+)"[^>]*aria-label="([^"]+)"[^>]*>.*?'
        r'<circle class="pip" cx="([\d.]+)" cy="([\d.]+)"',
        html,
        re.S,
    ):
        facets.append(
            {"i": int(m.group(1)), "label": m.group(2), "x": float(m.group(3)), "y": float(m.group(4))}
        )

    ties = []
    for m in re.finditer(
        r'<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" data-a="(\d+)" data-b="(\d+)"',
        html,
    ):
        ties.append(
            {
                "x1": float(m.group(1)), "y1": float(m.group(2)),
                "x2": float(m.group(3)), "y2": float(m.group(4)),
                "a": int(m.group(5)), "b": int(m.group(6)),
            }
        )

    if not facets or not ties:
        raise SystemExit("No drawing found in dist/index.html. Build the site first.")
    return facets, ties


def build_svg(facets, ties, lit):
    """The drawing alone, placed in the right two thirds of the card."""
    xs = [f["x"] for f in facets]
    ys = [f["y"] for f in facets]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)

    # Room on the left for the name, the drawing fills what is left.
    box = (452, 54, 1152, 576)
    sx = (box[2] - box[0]) / (maxx - minx)
    sy = (box[3] - box[1]) / (maxy - miny)
    s = min(sx, sy)
    ox = box[0] + ((box[2] - box[0]) - (maxx - minx) * s) / 2
    oy = box[1] + ((box[3] - box[1]) - (maxy - miny) * s) / 2

    def px(f):
        return ox + (f["x"] - minx) * s, oy + (f["y"] - miny) * s

    ink = "#%02x%02x%02x" % INK
    muted = "#%02x%02x%02x" % MUTED
    accent = "#%02x%02x%02x" % ACCENT

    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}">']
    parts.append(f'<rect width="{W}" height="{H}" fill="#%02x%02x%02x"/>' % BG)

    # The masthead sketches, faint enough to read as paper rather than as a
    # subject. It ties the card to the top of the site without competing
    # with the drawing.
    band = Path("public/images/codex-band.svg")
    if band.exists():
        inner = re.sub(r"^<svg[^>]*>|</svg>\s*$", "", band.read_text().strip())
        parts.append(
            f'<g opacity="0.13" transform="translate(-70, 22) scale(0.62)">{inner}</g>'
        )

    for t in ties:
        a, b = facets[t["a"]], facets[t["b"]]
        x1, y1 = px(a)
        x2, y2 = px(b)
        on = t["a"] == lit or t["b"] == lit
        col = accent if on else muted
        wid = 1.5 if on else 0.7
        op = 0.95 if on else 0.42
        parts.append(
            f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{col}" stroke-width="{wid}" stroke-opacity="{op}"/>'
        )

    kin = {t["b"] if t["a"] == lit else t["a"] for t in ties if lit in (t["a"], t["b"])}
    for f in facets:
        x, y = px(f)
        if f["i"] == lit:
            col, r, op = accent, 6.5, 1
        elif f["i"] in kin:
            col, r, op = accent, 4.2, 0.9
        else:
            col, r, op = muted, 3.4, 0.6
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{col}" fill-opacity="{op}"/>')

    # Only the lit cluster is named, so the card stays legible at thumbnail size.
    for f in facets:
        if f["i"] != lit and f["i"] not in kin:
            continue
        x, y = px(f)
        size = 21 if f["i"] == lit else 16
        col = accent if f["i"] == lit else ink
        style = "italic" if f["i"] == lit else "normal"
        anchor = "start" if x < 620 else ("end" if x > 1080 else "middle")
        parts.append(
            f'<text x="{x:.1f}" y="{y - 13:.1f}" font-family="Didot, Georgia, serif" '
            f'font-size="{size}" font-style="{style}" fill="{col}" text-anchor="{anchor}">{f["label"]}</text>'
        )

    parts.append("</svg>")
    return "\n".join(parts)


def main():
    facets, ties = read_drawing()

    # Light whichever cell is tied to the most others: it shows the most.
    degree = {f["i"]: 0 for f in facets}
    for t in ties:
        degree[t["a"]] += 1
        degree[t["b"]] += 1
    lit = max(degree, key=lambda k: degree[k])

    svg = build_svg(facets, ties, lit)
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as tmp:
        tmp.write(svg.encode())
        svg_path = tmp.name
    png_path = svg_path.replace(".svg", ".png")
    subprocess.run(
        ["rsvg-convert", "-w", str(W), "-h", str(H), "-o", png_path, svg_path], check=True
    )

    img = Image.open(png_path).convert("RGB")
    draw = ImageDraw.Draw(img)

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

    f_name = font("Didot.ttc", 62)
    f_line = font("Didot.ttc", 31)
    f_small = font("Bodoni 72 Smallcaps Book.ttf", 19)

    # The ruled border the other cards use.
    draw.rectangle([18, 18, W - 19, H - 19], outline=BORDER, width=1)
    draw.rectangle([27, 27, W - 28, H - 28], outline=BORDER, width=1)

    draw.text((72, 238), "Arshad Kazi", font=f_name, fill=INK)
    draw.text((74, 330), "Journey of Curiosity", font=f_line, fill=ACCENT)

    draw.line([(74, 392), (152, 392)], fill=BORDER, width=1)
    draw.text((74, 410), "engineer  ·  writer  ·  reader", font=f_small, fill=MUTED)
    draw.text((74, 438), "son  ·  autistic  ·  curious", font=f_small, fill=MUTED)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "JPEG", quality=92, optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB), lit facet: {facets[lit]['label']}")


if __name__ == "__main__":
    main()
