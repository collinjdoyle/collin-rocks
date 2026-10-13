# collin.rocks

My personal site — hosts my resume, contact info, and small writeups.
- **Live:** https://collin.rocks
- **Stack:** vanilla HTML / CSS / JS, served by GitHub Pages from `main`

### Layout
- `index.html` — the home page (hand-written), styled by `css/site.css`
- `writeups/` and `404.html` — generated pages, also styled by `css/site.css`
- `terminal/` — the original desktop + terminal UI, linked from the footer.
  It renders from `js/data.js` and uses `css/styles.css`.

The home page is plain HTML, so when a project or job changes, update both `index.html`
and `js/data.js` (the terminal and the writeup pages read from `data.js`).

### Writeups
Add the markdown file to `posts/`, add an entry to `posts` in `js/data.js`, then run:

```
node tools/build-writeups.js
```

That builds the static pages in `writeups/`, the 404 page, `sitemap.xml` and `robots.txt`.
A project in `data.js` can add `results: [{ value, label }]` to show a results band on its writeup.

Preview images and resume PDFs need Chrome + playwright-core (`npm i --no-save playwright-core`):
- `node tools/make-og-images.js` → `assets/og/`
- `node tools/make-resume-pdfs.js` → `assets/resume.pdf`, `assets/resume-full.pdf`

### Analytics
GoatCounter, no cookies. Set the site code in `js/data.js` (`analytics.goatcounter`) and rebuild.

### Terminal themes
1. Add a `[data-theme="name"] { … }` block of CSS variables in `css/styles.css`.
2. Add `"name"` to `THEME_LIST` in `js/main.js` (the status-bar toggle cycles it)
   — the terminal's `theme` command picks it up automatically.

Built-in themes: `tokyo-night` (default), `catppuccin`, `gruvbox`, `nord`.
The visitor's choice persists in `localStorage`. The main site follows the system light/dark setting.


:)
