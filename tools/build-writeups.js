#!/usr/bin/env node
// Builds a static page for every post in js/data.js, styled with css/site.css:
//   writeups/<slug>/index.html, writeups/index.html, 404.html, sitemap.xml, robots.txt
// The home page (index.html) is hand-written; the terminal UI at /terminal/ renders
// posts client-side from the same posts/*.md files.
//
// Usage: node tools/build-writeups.js   (no dependencies; rerun after adding or editing a post)

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const miniMarkdown = require("../js/markdown.js");

const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://collin.rocks";

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8"), sandbox);
const SITE = sandbox.window.SITE;

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function ogImage(slug) {
  return fs.existsSync(path.join(ROOT, "assets/og", slug + ".png"))
    ? `${ORIGIN}/assets/og/${slug}.png` : `${ORIGIN}/assets/og/default.png`;
}

// #post/<slug> links are in-app; on a static page they point at the sibling page.
function staticLinks(html) {
  return html.replace(/href="#post\/([a-z0-9-]+)"/g, 'href="../$1/"');
}

const GC = SITE.analytics && SITE.analytics.goatcounter;
const analytics = GC
  ? `  <script data-goatcounter="https://${GC}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>\n`
  : "";

function page({ title, description, url, image, type, body, extraHead = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${image}" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" />
  <link rel="stylesheet" href="/css/site.css" />
${analytics}${extraHead}</head>
<body>
  <a class="skip" href="#content">Skip to content</a>
  <header class="site-head">
    <div class="wrap">
      <a class="brand" href="/">collin<span>.rocks</span></a>
      <nav class="nav" aria-label="Primary">
        <a href="/#work">Work</a>
        <a href="/#experience">Experience</a>
        <a href="/writeups/">Write-ups</a>
        <a href="/#contact">Contact</a>
      </nav>
      <a class="btn btn--dark btn--sm head-cta" href="/assets/resume.pdf">Résumé (PDF)</a>
    </div>
  </header>
  <main id="content">
${body}
  </main>
  <footer class="site-foot">
    <div class="wrap">
      <p>© ${new Date().getFullYear()} Collin Doyle · <a href="mailto:cj.doyle@outlook.com">cj.doyle@outlook.com</a></p>
      <a class="term-link" href="/terminal/">collin@rocks:~$ open terminal_</a>
    </div>
  </footer>
</body>
</html>
`;
}

const fmtDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US",
  { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const posts = SITE.posts.filter((p) => p.slug !== "hello-world");
const urls = [`${ORIGIN}/`, `${ORIGIN}/writeups/`];

posts.forEach((post, i) => {
  // The page supplies the title, so drop the markdown's own "# heading".
  const md = fs.readFileSync(path.join(ROOT, post.file), "utf8").replace(/^\s*#\s+.*\r?\n/, "");
  const url = `${ORIGIN}/writeups/${post.slug}/`;
  const project = SITE.projects.find((p) => p.post === post.slug);
  const description = project ? project.summary : post.summary;
  const minutes = Math.max(1, Math.round(md.split(/\s+/).length / 220));
  const next = posts[(i + 1) % posts.length];
  const ld = {
    "@context": "https://schema.org", "@type": "TechArticle",
    headline: post.title, description, datePublished: post.date, url,
    image: ogImage(post.slug),
    author: { "@type": "Person", name: "Collin Doyle", url: `${ORIGIN}/` },
  };

  const meta = [
    ["My role", "Designed, built and run it"],
    project && project.tags.length ? ["Built with", project.tags.join(" · ")] : null,
    ["Published", fmtDate(post.date)],
  ].filter(Boolean).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n        ");

  const results = project && project.results && project.results.length ? `
    <section class="results" aria-labelledby="results-title">
      <div class="wrap">
        <h2 id="results-title">Results</h2>
        <ul>
          ${project.results.map((r) => `<li><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></li>`).join("\n          ")}
        </ul>
      </div>
    </section>` : "";

  const html = page({
    title: `${post.title} — Collin Doyle`,
    description, url, image: ogImage(post.slug), type: "article",
    extraHead: `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n`,
    body: `  <article>
    <header class="wrap article-head">
      <a class="back" href="/#work">← All work</a>
      <p class="kicker">Case study · ${minutes} min read</p>
      <h1 class="h1">${esc(post.title)}</h1>
      <p class="lede">${esc(description)}</p>
      <dl class="meta">
        ${meta}
      </dl>
    </header>${results}
    <div class="wrap">
      <div class="prose">
${staticLinks(miniMarkdown(md))}
      </div>
      <nav class="pager" aria-label="More write-ups">
        <a class="pager__back" href="/writeups/"><small>← Back</small><strong>All write-ups</strong></a>
        <a class="pager__next" href="../${next.slug}/"><small>Next write-up →</small><strong>${esc(next.title)}</strong></a>
      </nav>
    </div>
  </article>`,
  });
  fs.mkdirSync(path.join(ROOT, "writeups", post.slug), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "writeups", post.slug, "index.html"), html);
  urls.push(url);
  console.log("built writeups/" + post.slug + "/");
});

const list = posts.map((p) => {
  const project = SITE.projects.find((x) => x.post === p.slug);
  return `      <li><a href="${p.slug}/"><span class="post-list__title">${esc(p.title)}</span>` +
    `<span class="post-list__sum">${esc(project ? project.summary : p.summary)}</span></a></li>`;
}).join("\n");
fs.writeFileSync(path.join(ROOT, "writeups", "index.html"), page({
  title: "Write-ups — Collin Doyle",
  description: "Internal apps and automations I designed and built: what they do, the time they save and the money they save.",
  url: `${ORIGIN}/writeups/`, image: `${ORIGIN}/assets/og/default.png`, type: "website",
  body: `  <div class="wrap">
    <header class="article-head">
      <a class="back" href="/">← collin.rocks</a>
      <p class="kicker">Write-ups</p>
      <h1 class="h1">How it's built</h1>
      <p class="lede">Internal apps and automations I designed and built: what they do, how they save time, and how they save money.</p>
    </header>
    <ul class="post-list">
${list}
    </ul>
  </div>`,
}));
console.log("built writeups/");

// 404: GitHub Pages serves /404.html for any missing path, so every link is root-absolute.
fs.writeFileSync(path.join(ROOT, "404.html"), page({
  title: "Page not found — collin.rocks",
  description: "That page doesn't exist.",
  url: `${ORIGIN}/404.html`, image: `${ORIGIN}/assets/og/default.png`, type: "website",
  extraHead: `  <meta name="robots" content="noindex" />\n`,
  body: `  <div class="wrap notfound">
    <pre id="nf">collin@rocks:~$ cd this-page
bash: cd: this-page: No such file or directory</pre>
    <p class="kicker">404</p>
    <h1 class="h1">That page doesn't exist.</h1>
    <p class="lede">It may have moved when the site was redesigned. These should get you where you were going:</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="/">Home</a>
      <a class="btn btn--outline" href="/writeups/">Write-ups</a>
      <a class="btn btn--outline" href="/assets/resume.pdf">Résumé (PDF)</a>
    </div>
  </div>
  <script>
    var p = decodeURIComponent(location.pathname.split("/").filter(Boolean).join("/")) || "this-page";
    document.getElementById("nf").textContent =
      "collin@rocks:~$ cd " + p + "\\nbash: cd: " + p + ": No such file or directory";
  </script>`,
}));
console.log("built 404.html");

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") + "\n</urlset>\n");
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log("built sitemap.xml, robots.txt");
