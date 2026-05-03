#!/usr/bin/env python3
"""Generate OG image with full Moroccan geometric background + themed text."""

from PIL import Image, ImageDraw, ImageFont
import math

WIDTH, HEIGHT = 1200, 630

BG_COLOR = (255, 250, 240)        # warm cream
ACCENT = (255, 138, 76)           # warm orange
ACCENT_LIGHT = (255, 210, 170)    # light peach
TITLE_COLOR = (50, 40, 35)        # warm dark brown
SUBTITLE_COLOR = (140, 120, 105)  # warm gray-brown

# Pattern colors - bolder
PAT1 = (225, 200, 170)
PAT2 = (235, 185, 145)

img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Load fonts - Didot for Moroccan elegance
try:
    font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Didot.ttc", 72)
    font_tagline = ImageFont.truetype("/System/Library/Fonts/Supplemental/Didot.ttc", 22)
    font_author = ImageFont.truetype("/System/Library/Fonts/Supplemental/Bodoni 72 Smallcaps Book.ttf", 20)
except:
    font_title = ImageFont.load_default()
    font_tagline = ImageFont.load_default()
    font_author = ImageFont.load_default()


# --- Moroccan pattern helpers ---
def draw_octagon(cx, cy, r, color):
    pts = []
    for i in range(8):
        angle = math.radians(i * 45 + 22.5)
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(pts, outline=color)

def draw_star8(cx, cy, r, color):
    sq1 = []
    for i in range(4):
        angle = math.radians(i * 90)
        sq1.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(sq1, outline=color)
    sq2 = []
    for i in range(4):
        angle = math.radians(i * 90 + 45)
        sq2.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(sq2, outline=color)

def draw_tile_unit(cx, cy, size, col1, col2):
    s = size * 0.45
    draw_star8(cx, cy, s, col1)
    draw_octagon(cx, cy, s * 0.52, col1)
    draw_star8(cx, cy, s * 0.3, col2)
    half = size * 0.5
    for angle_deg in [0, 90, 180, 270]:
        angle = math.radians(angle_deg)
        mx = cx + half * math.cos(angle)
        my = cy + half * math.sin(angle)
        d = size * 0.12
        diamond = [(mx, my - d), (mx + d, my), (mx, my + d), (mx - d, my)]
        draw.polygon(diamond, outline=col1)


# Draw full background pattern
cell_size = 80
cols = int(WIDTH / cell_size) + 2
rows = int(HEIGHT / cell_size) + 2
for row in range(-1, rows + 1):
    for col in range(-1, cols + 1):
        cx = col * cell_size + cell_size / 2
        cy = row * cell_size + cell_size / 2
        draw_tile_unit(cx, cy, cell_size, PAT1, PAT2)


# --- Central text area with soft backdrop ---
# Wider, centered backdrop
for y in range(130, 500):
    for x in range(150, 1050):
        edge_fade = 1.0
        if x > 1010:
            edge_fade = (1050 - x) / 40.0
        if x < 190:
            edge_fade = (x - 150) / 40.0
        if y < 155:
            edge_fade *= (y - 130) / 25.0
        if y > 475:
            edge_fade *= (500 - y) / 25.0
        alpha = 0.88
        if edge_fade < 1.0:
            px = img.getpixel((x, y))
            blend = edge_fade * alpha
            nr = int(px[0] * (1 - blend) + BG_COLOR[0] * blend)
            ng = int(px[1] * (1 - blend) + BG_COLOR[1] * blend)
            nb = int(px[2] * (1 - blend) + BG_COLOR[2] * blend)
            img.putpixel((x, y), (nr, ng, nb))
        else:
            img.putpixel((x, y), BG_COLOR)

draw = ImageDraw.Draw(img)


# --- Geometric frame around text area (Moroccan border) ---
frame_x1, frame_y1 = 190, 150
frame_x2, frame_y2 = 1010, 480

# Outer frame line
draw.rectangle([frame_x1, frame_y1, frame_x2, frame_y2], outline=ACCENT_LIGHT, width=1)

# Inner frame line with slight offset
draw.rectangle([frame_x1 + 8, frame_y1 + 8, frame_x2 - 8, frame_y2 - 8], outline=ACCENT_LIGHT, width=1)

# Corner ornaments - small 8-pointed stars at corners
corner_size = 12
for cx, cy in [(frame_x1, frame_y1), (frame_x2, frame_y1), (frame_x1, frame_y2), (frame_x2, frame_y2)]:
    draw_star8(cx, cy, corner_size, ACCENT)

# Mid-point ornaments on each edge
for cx, cy in [
    ((frame_x1 + frame_x2) / 2, frame_y1),  # top center
    ((frame_x1 + frame_x2) / 2, frame_y2),  # bottom center
    (frame_x1, (frame_y1 + frame_y2) / 2),  # left center
    (frame_x2, (frame_y1 + frame_y2) / 2),  # right center
]:
    draw_star8(cx, cy, 8, ACCENT_LIGHT)


# --- Text (centered) ---
# Title - centered
title1 = "Small Explorations"
title2 = "Driven by Curiosity"

bbox1 = draw.textbbox((0, 0), title1, font=font_title)
w1 = bbox1[2] - bbox1[0]
bbox2 = draw.textbbox((0, 0), title2, font=font_title)
w2 = bbox2[2] - bbox2[0]

center_x = WIDTH // 2
title_y = 190

draw.text((center_x - w1 // 2, title_y), title1, fill=TITLE_COLOR, font=font_title)
draw.text((center_x - w2 // 2, title_y + 85), title2, fill=TITLE_COLOR, font=font_title)

# Decorative divider - centered geometric element
div_y = title_y + 175
# Center diamond
d = 6
draw.polygon([(center_x, div_y - d), (center_x + d, div_y), (center_x, div_y + d), (center_x - d, div_y)], fill=ACCENT)
# Lines on either side
draw.rounded_rectangle([center_x - 100, div_y - 1, center_x - 15, div_y + 1], radius=1, fill=ACCENT)
draw.rounded_rectangle([center_x + 15, div_y - 1, center_x + 100, div_y + 1], radius=1, fill=ACCENT)
# Small dots at line ends
for dx in [-100, 100]:
    draw.ellipse([center_x + dx - 3, div_y - 3, center_x + dx + 3, div_y + 3], fill=ACCENT_LIGHT)

# Tagline - centered
tagline = "Show up  ·  Learn something  ·  Write it down"
bbox_t = draw.textbbox((0, 0), tagline, font=font_tagline)
wt = bbox_t[2] - bbox_t[0]
draw.text((center_x - wt // 2, div_y + 20), tagline, fill=SUBTITLE_COLOR, font=font_tagline)

# Author name - centered below
author = "arshad kazi"
bbox_a = draw.textbbox((0, 0), author, font=font_author)
wa = bbox_a[2] - bbox_a[0]
author_y = div_y + 65
draw.text((center_x - wa // 2, author_y), author, fill=SUBTITLE_COLOR, font=font_author)

img.save('/Users/michelangelo/my-cv-notes/public/images/og-tiny-experiments.png', 'PNG', quality=95)
print("OG image saved!")
