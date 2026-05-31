# collin.rocks

My personal site — hosts my resume, contact info, and small writeups.
- **Live:** https://collin.rocks
- **Stack:** vanilla HTML / CSS / JS


### Add or change a theme
1. Add a `[data-theme="name"] { … }` block of CSS variables in `css/styles.css`.
2. Add `"name"` to `THEME_LIST` in `js/main.js` (the status-bar toggle cycles it)
   — the terminal's `theme` command picks it up automatically.

Built-in themes: `tokyo-night` (default), `catppuccin`, `gruvbox`, `nord`.
The visitor's choice persists in `localStorage`.


:)
