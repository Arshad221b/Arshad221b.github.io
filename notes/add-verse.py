# Puts the verse on the clipboard into the Geet Ramayan quote in the
# Dabholkar essay, in place of the song's title line, then commits and
# pushes. Run it first; copy the verse when it asks; press Enter.
import subprocess

p = 'src/pages/thoughts/dabholkar-on-scientific-thinking.astro'
title = '<em>पराधीन आहे जगतीं पुत्र मानवाचा</em>'
input('Now copy the nine Marathi lines, then press Enter here... ')
lines = subprocess.run(['pbpaste'], capture_output=True, text=True).stdout.splitlines()
lines = [l.strip() for l in lines if l.strip()]
s = open(p).read()
if title not in s:
    raise SystemExit('nothing changed: the quote has moved')
if not lines or any(c.isascii() and c.isalpha() for l in lines for c in l):
    raise SystemExit('nothing changed: the clipboard is not the Marathi verse')
open(p, 'w').write(s.replace(title, '<br />'.join(lines), 1))
subprocess.run(['git', 'add', p], check=True)
subprocess.run(['git', 'commit', '-m', 'Dabholkar: the Geet Ramayan verse'], check=True)
subprocess.run(['git', 'push', 'origin', 'main'], check=True)
print('done')
