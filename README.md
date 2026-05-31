# collin.rocks

My personal site — a "desktop rice" portfolio styled like a tiling-window-manager
Linux desktop, with an interactive terminal. Static, no build step, deployed on
GitHub Pages.

- **Live:** https://collin.rocks
- **Stack:** vanilla HTML / CSS / JS. No framework, no bundler, no `npm install`.
  The repo as committed *is* the deployed site.

---

## How to edit this site (30-second refresher)

**Almost everything lives in [`js/data.js`](js/data.js)** — one object called `SITE`.
Edit that, not the HTML. The windowed view *and* the terminal both render from it.

### Add a project
Open `js/data.js`, find `projects: [ ]`, copy an existing block:

```js
{
  title:   "My new project",
  summary: "One line about what it is.",
  tags:    ["Tag1", "Tag2"],
  links:   [{ label: "Repo", href: "https://github.com/..." }], // [] if private
},
```

### Add a blog post
1. Create a Markdown file in `posts/`, e.g. `posts/my-post.md`.
2. Add an entry to `posts: [ ]` in `js/data.js`:
   ```js
   { slug: "my-post", title: "My Post", date: "2026-06-01", file: "posts/my-post.md",
     summary: "one-liner" },
   ```
The blog uses a tiny built-in Markdown renderer (headings, bold/italic, code,
links, lists, blockquotes).

### Update bio / role / experience
Edit `profile { }` and `experience: [ ]` in `js/data.js`.

### Update the résumé
The résumé PDFs are generated from HTML sources in [`resume/`](resume/):
- `resume/resume-1page.html` → `assets/resume.pdf` (1-page, the site default)
- `resume/resume-2page.html` → `assets/resume-full.pdf` (2-page, full history)

Edit the HTML, then re-render with headless Chrome (uses an isolated profile so
it doesn't attach to a running Chrome):

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
& $chrome --headless=new --disable-gpu --no-pdf-header-footer `
  --user-data-dir="$env:TEMP\chrpdf" `
  --print-to-pdf="assets\resume.pdf" `
  ((Resolve-Path resume\resume-1page.html).Path -as [uri]).AbsoluteUri
```

(Both files are kept ATS-safe: single column, real selectable text, standard
headings, no text inside tables.) Prefer to keep your own PDF? Just drop it in as
`assets/resume.pdf` — keep the filename.

### Add or change a theme
1. Add a `[data-theme="name"] { … }` block of CSS variables in `css/styles.css`.
2. Add `"name"` to `THEME_LIST` in `js/main.js` (the status-bar toggle cycles it)
   — the terminal's `theme` command picks it up automatically.

Built-in themes: `tokyo-night` (default), `catppuccin`, `gruvbox`, `nord`.
The visitor's choice persists in `localStorage`.

---

## Project structure

```
index.html          shell: status bar, desktop mount, dock, no-JS fallback
css/styles.css       themes + all styling
js/data.js           ← SINGLE SOURCE OF TRUTH for content
js/windows.js        window manager (drag/focus/min/max/close)
js/terminal.js       interactive terminal, reads from SITE
js/main.js           theme engine, clock, window content, markdown, boot
posts/               blog posts in Markdown
assets/              resume.pdf, favicon.svg
CNAME                custom domain (collin.rocks)
```

## Local preview

Because the blog fetches Markdown files, open it over http rather than `file://`:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

(Everything else works from `file://`; only the blog reader needs a server.)

## Deployment

Push to `main` → GitHub Pages rebuilds automatically. In the repo:
**Settings → Pages → Source = `main` / root (`/`)**, then enable **Enforce HTTPS**
once the certificate provisions.

## DNS — apex domain `collin.rocks`

Verified against GitHub's "Managing a custom domain for your GitHub Pages site"
docs (re-check before changing — these are infra values that can move):

**A records** (apex `collin.rocks`):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**AAAA records** (optional, IPv6):

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**`www` subdomain:** `CNAME` → `collinjdoyle.github.io`

---

## Accessibility & performance notes

- Core content is in the HTML `<noscript>` fallback — readable with JS disabled.
- Keyboard-navigable, `:focus-visible` states, semantic markup, AA contrast.
- `prefers-reduced-motion: reduce` disables all animation.
- Fonts (JetBrains Mono) preconnected + `display=swap`; zero JS dependencies.
