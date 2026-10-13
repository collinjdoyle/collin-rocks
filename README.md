# collin.rocks

My personal site — hosts my resume, contact info, and small writeups.
- **Live:** https://collin.rocks
- **Stack:** vanilla HTML / CSS / JS


### Writeups
Add the markdown file to `posts/`, add an entry to `posts` in `js/data.js`, then run:

```
node tools/build-writeups.js
```

That builds the static pages in `writeups/`, the 404 page, `sitemap.xml` and `robots.txt`.

Preview images and resume PDFs need Chrome + playwright-core (`npm i --no-save playwright-core`):
- `node tools/make-og-images.js` → `assets/og/`
- `node tools/make-resume-pdfs.js` → `assets/resume.pdf`, `assets/resume-full.pdf`

### Analytics
GoatCounter, no cookies. Set the site code in `js/data.js` (`analytics.goatcounter`) and rebuild.

### Add or change a theme
1. Add a `[data-theme="name"] { … }` block of CSS variables in `css/styles.css`.
2. Add `"name"` to `THEME_LIST` in `js/main.js` (the status-bar toggle cycles it)
   — the terminal's `theme` command picks it up automatically.

Built-in themes: `tokyo-night` (default), `catppuccin`, `gruvbox`, `nord`.
The visitor's choice persists in `localStorage`.


:)
