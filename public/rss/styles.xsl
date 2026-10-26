<?xml version="1.0" encoding="utf-8"?>
<!-- How the feed looks when it is opened in a browser rather than a feed
     reader: a page in the site's own style, saying what the feed is and
     listing what is in it. Feed readers never see this. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>RSS · <xsl:value-of select="/rss/channel/title"/></title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&amp;family=IBM+Plex+Mono:wght@400;500&amp;family=Great+Vibes&amp;display=swap"/>
        <style>
          :root {
            --bg: #f4eee3; --text: #151412; --sub: #46433e; --muted: #85817a;
            --accent: #e5461c; --rule: #ddd3c1; --chip: #ebe2d2;
          }
          @media (prefers-color-scheme: dark) {
            :root { --bg: #000; --text: #ecebe6; --sub: #b7b3aa; --muted: #85817a; --accent: #ff6838; --rule: #262626; --chip: #121212; }
          }
          * { box-sizing: border-box; }
          html { background: var(--bg); }
          body {
            margin: 0; color: var(--text); background: var(--bg);
            font: 400 1.12rem/1.7 'Newsreader', Georgia, serif;
          }
          main { max-width: 720px; margin: 0 auto; padding: 56px 20px 96px; }
          .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; color: var(--text); }
          .brand svg { width: 18px; height: 31px; color: var(--accent); }
          .brand span { font: 400 2.05rem/1 'Great Vibes', cursive; }
          .brand em { font-style: normal; color: var(--accent); }
          .label { font: 500 0.72rem/1 'IBM Plex Mono', monospace; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin: 56px 0 14px; }
          h1 { font-weight: 300; font-size: clamp(2.2rem, 6vw, 3.2rem); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 18px; }
          .note { color: var(--sub); margin: 0 0 14px; }
          .feed-url {
            display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
            font: 400 0.86rem/1.4 'IBM Plex Mono', monospace; color: var(--sub);
            background: var(--chip); border-radius: 4px; padding: 10px 14px; margin: 6px 0 0;
          }
          .feed-url code { color: var(--text); word-break: break-all; }
          ol { list-style: none; padding: 0; margin: 48px 0 0; border-top: 1px solid var(--rule); }
          li { padding: 22px 0; border-bottom: 1px solid var(--rule); }
          li a { color: var(--text); text-decoration: none; font-size: 1.34rem; line-height: 1.3; letter-spacing: -0.01em; }
          li a:hover { color: var(--accent); }
          .date { display: block; font: 400 0.72rem/1 'IBM Plex Mono', monospace; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
          li p { margin: 8px 0 0; color: var(--sub); font-size: 1.02rem; line-height: 1.55; }
          .back { display: inline-block; margin-top: 40px; color: var(--accent); text-decoration: none; font: 500 0.78rem/1 'IBM Plex Mono', monospace; letter-spacing: 0.14em; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <main>
          <a class="brand" href="/">
            <svg viewBox="22 2 56 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M50 52 C46 40 60 36 56 26 C52 16 40 20 44 30 C47 37 58 32 60 22 C62 12 54 6 48 8" stroke-width="4"/>
              <path d="M39.2 94 C29.6 94 28.4 79.6 36.8 72.4 C40.4 69.4 41.6 67.6 41.6 64 L58.4 64 C58.4 67.6 59.6 69.4 63.2 72.4 C71.6 79.6 70.4 94 60.8 94 Z" stroke-width="3.6"/>
              <path d="M42.8 64 L42.8 59.2 L57.2 59.2 L57.2 64 Z" fill="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Journey of <em>Curiosity</em></span>
          </a>

          <p class="label">RSS feed</p>
          <h1>Everything new, in your feed reader.</h1>
          <p class="note">This is a feed: copy its address into a feed reader (Feedly, NetNewsWire, Reeder, Inoreader and the like) and every new essay and post arrives there as it is published. No email, no account.</p>
          <div class="feed-url">Feed address <code>https://arshad-kazi.com/rss.xml</code></div>

          <ol>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <span class="date"><xsl:value-of select="substring(pubDate, 6, 11)"/></span>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
                <p><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ol>

          <a class="back" href="/">&#8592; Back to the site</a>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
