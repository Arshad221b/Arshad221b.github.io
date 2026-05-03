#!/usr/bin/env python3
"""Generate a mathematically precise Moroccan zellige SVG pattern."""

import math

TILE = 200  # tile size
CX, CY = TILE / 2, TILE / 2  # center


def point(cx, cy, r, angle_deg):
    """Get point at radius r and angle from center."""
    a = math.radians(angle_deg)
    return (round(cx + r * math.cos(a), 2), round(cy + r * math.sin(a), 2))


def polygon_points(cx, cy, r, n, start_angle=0):
    """Generate n-sided regular polygon vertices."""
    pts = []
    for i in range(n):
        angle = start_angle + i * (360 / n)
        pts.append(point(cx, cy, r, angle))
    return pts


def pts_to_str(pts):
    """Convert list of (x,y) tuples to SVG points string."""
    return " ".join(f"{x},{y}" for x, y in pts)


def star_8_points(cx, cy, R):
    """
    Generate the 16 vertices of an 8-pointed star (khatam).
    Alternates between outer radius R and inner radius r.
    """
    # For a classic 8-pointed star formed by two overlapping squares:
    # Inner radius where the square edges intersect
    r = R * math.cos(math.radians(45)) / math.cos(math.radians(22.5))
    # Actually for a proper star: inner concave vertices
    # r = R / (1 + math.tan(math.pi/8))  -- this gives a nicer star
    r = R * math.cos(math.radians(45))  # = R * √2/2

    pts = []
    for i in range(8):
        # Outer point
        outer_angle = i * 45 - 90  # start from top
        pts.append(point(cx, cy, R, outer_angle))
        # Inner (concave) point
        inner_angle = outer_angle + 22.5
        pts.append(point(cx, cy, r, inner_angle))
    return pts


def generate_pattern(stroke_color, opacity):
    R = 38  # star outer radius

    lines = []
    lines.append(f'<svg width="{TILE}" height="{TILE}" viewBox="0 0 {TILE} {TILE}" xmlns="http://www.w3.org/2000/svg">')
    lines.append(f'  <g fill="none" stroke="{stroke_color}" stroke-width="0.7" opacity="{opacity}" stroke-linecap="round" stroke-linejoin="round">')

    # === CENTER 8-POINTED STAR ===
    star = star_8_points(CX, CY, R)
    lines.append(f'    <polygon points="{pts_to_str(star)}"/>')

    # Inner octagon
    octagon = polygon_points(CX, CY, R * 0.45, 8, start_angle=-90 + 22.5)
    lines.append(f'    <polygon points="{pts_to_str(octagon)}"/>')

    # === TWO OVERLAPPING SQUARES (forming the star explicitly) ===
    sq1 = polygon_points(CX, CY, R, 4, start_angle=-90)  # diamond orientation
    lines.append(f'    <polygon points="{pts_to_str(sq1)}"/>')

    sq2 = polygon_points(CX, CY, R, 4, start_angle=-45)  # square orientation
    lines.append(f'    <polygon points="{pts_to_str(sq2)}"/>')

    # === CORNER PARTIAL STARS (at each corner of the tile) ===
    corners = [(0, 0), (TILE, 0), (0, TILE), (TILE, TILE)]
    corner_R = R * 0.6
    for ccx, ccy in corners:
        # Only draw the two overlapping squares — parts will be clipped by tile edge
        csq1 = polygon_points(ccx, ccy, corner_R, 4, start_angle=-90)
        csq2 = polygon_points(ccx, ccy, corner_R, 4, start_angle=-45)
        lines.append(f'    <polygon points="{pts_to_str(csq1)}"/>')
        lines.append(f'    <polygon points="{pts_to_str(csq2)}"/>')

    # === EDGE MIDPOINT DIAMONDS ===
    edge_mids = [(CX, 0), (TILE, CY), (CX, TILE), (0, CY)]
    diamond_r = 12
    for emx, emy in edge_mids:
        diamond = polygon_points(emx, emy, diamond_r, 4, start_angle=-90)
        lines.append(f'    <polygon points="{pts_to_str(diamond)}"/>')
        # Inner smaller diamond
        inner_d = polygon_points(emx, emy, diamond_r * 0.5, 4, start_angle=-90)
        lines.append(f'    <polygon points="{pts_to_str(inner_d)}"/>')

    # === CONNECTING LINES from center star tips to edge diamonds ===
    # The star tips point at: -90, -45, 0, 45, 90, 135, 180, 225 degrees
    # Connect the cardinal tips to edge midpoint diamonds
    connections = [
        (point(CX, CY, R, -90), (CX, 0)),        # top
        (point(CX, CY, R, 0), (TILE, CY)),        # right
        (point(CX, CY, R, 90), (CX, TILE)),       # bottom
        (point(CX, CY, R, 180), (0, CY)),         # left
    ]
    for (x1, y1), (x2, y2) in connections:
        lines.append(f'    <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')

    # === CONNECTING LINES from center star diagonal tips to corners ===
    diag_connections = [
        (point(CX, CY, R, -45), corners[1]),   # top-right
        (point(CX, CY, R, -135), corners[0]),   # top-left
        (point(CX, CY, R, 45), corners[3]),    # bottom-right
        (point(CX, CY, R, 135), corners[2]),   # bottom-left
    ]
    for (x1, y1), (x2, y2) in diag_connections:
        lines.append(f'    <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')

    # === DECORATIVE ARCS around center star ===
    arc_r = R * 0.7
    for angle in range(0, 360, 90):
        a1 = math.radians(angle - 20)
        a2 = math.radians(angle + 20)
        x1 = round(CX + (R + 10) * math.cos(a1), 2)
        y1 = round(CY + (R + 10) * math.sin(a1), 2)
        x2 = round(CX + (R + 10) * math.cos(a2), 2)
        y2 = round(CY + (R + 10) * math.sin(a2), 2)
        # Small arc between the two points
        lines.append(f'    <path d="M{x1},{y1} A{R+10},{R+10} 0 0,1 {x2},{y2}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return "\n".join(lines)


# Light mode
light_svg = generate_pattern("#ddd0c0", "0.28")
with open("/Users/michelangelo/my-cv-notes/public/images/moroccan-pattern.svg", "w") as f:
    f.write(light_svg)

# Dark mode
dark_svg = generate_pattern("#2a2218", "0.35")
with open("/Users/michelangelo/my-cv-notes/public/images/moroccan-pattern-dark.svg", "w") as f:
    f.write(dark_svg)

print("Patterns generated!")
