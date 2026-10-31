# Puts the verse on the clipboard into the Geet Ramayan quote in the
# Dabholkar essay, in place of the song's title line.
# Copy the lines, then run: python3 notes/add-verse.py
import subprocess

p = 'src/pages/thoughts/dabholkar-on-scientific-thinking.astro'
title = '<em>पराधीन आहे जगतीं पुत्र मानवाचा</em>'
lines = subprocess.run(['pbpaste'], capture_output=True, text=True).stdout.splitlines()
verse = '<br />'.join(l.strip() for l in lines if l.strip())
s = open(p).read()
if not verse or title not in s:
    raise SystemExit('nothing changed: copy the lines first, or the quote has moved')
open(p, 'w').write(s.replace(title, verse, 1))
print('done')
