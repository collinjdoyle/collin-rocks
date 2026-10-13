#!/usr/bin/env node
// Builds a static, crawlable page for every post in js/data.js:
//   writeups/<slug>/index.html, writeups/index.html, sitemap.xml, robots.txt
// The desktop site still renders posts client-side; these pages are what search engines,
// LinkedIn and Slack see when a writeup link is shared.
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

function page({ title, description, url, image, type, body, depth, base, extraHead = "" }) {
  const up = base != null ? base : "../".repeat(depth);
  return `<!DOCTYPE html>
<html lang="en" data-theme="tokyo-night">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="color-scheme" content="dark" />
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
  <link rel="icon" href="${up}assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap&subset=latin" />
  <link rel="stylesheet" href="${up}css/styles.css" />
  <script>try{var t=localStorage.getItem("collin-rocks-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
${analytics}${extraHead}</head>
<body class="page">
  <header class="page__bar">
    <a class="statusbar__handle" href="${up}">collin@rocks</a>
    <nav class="page__nav"><a href="${up}writeups/">writeups</a><a href="${up}#resume">resume</a><a href="${up}">desktop →</a></nav>
  </header>
  <main class="page__main post-body">
${body}
  </main>
  <footer class="page__foot">
    <a href="${up}">collin.rocks</a> · <a href="https://www.linkedin.com/in/collinjdoyle/">LinkedIn</a> · <a href="https://github.com/CollinJDoyle">GitHub</a> · <a href="mailto:cj.doyle@outlook.com">cj.doyle@outlook.com</a>
  </footer>
</body>
</html>
`;
}

const posts = SITE.posts.filter((p) => p.slug !== "hello-world");
const urls = [`${ORIGIN}/`, `${ORIGIN}/writeups/`];

for (const post of posts) {
  const md = fs.readFileSync(path.join(ROOT, post.file), "utf8");
  const url = `${ORIGIN}/writeups/${post.slug}/`;
  const project = SITE.projects.find((p) => p.post === post.slug);
  const description = project ? project.summary : post.summary;
  const ld = {
    "@context": "https://schema.org", "@type": "TechArticle",
    headline: post.title, description, datePublished: post.date, url,
    image: ogImage(post.slug),
    author: { "@type": "Person", name: "Collin Doyle", url: `${ORIGIN}/` },
  };
  const tags = project && project.tags.length
    ? `<div class="tags">${project.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>\n` : "";
  const html = page({
    title: `${post.title} — Collin Doyle`,
    description, url, image: ogImage(post.slug), type: "article", depth: 2,
    extraHead: `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n`,
    body: `<p class="post-item__meta">${esc(post.date)} · Collin Doyle</p>\n` +
      staticLinks(miniMarkdown(md)) + "\n" + tags +
      `<p class="page__more"><a href="../">← all writeups</a></p>`,
  });
  fs.mkdirSync(path.join(ROOT, "writeups", post.slug), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "writeups", post.slug, "index.html"), html);
  urls.push(url);
  console.log("built writeups/" + post.slug + "/");
}

const list = posts.map((p) => {
  const project = SITE.projects.find((x) => x.post === p.slug);
  return `<div class="post-item"><a class="post-item__title" href="${p.slug}/">${esc(p.title)}</a>` +
    `<div class="post-item__meta">${esc(project ? project.summary : p.summary)}</div></div>`;
}).join("\n");
fs.writeFileSync(path.join(ROOT, "writeups", "index.html"), page({
  title: "Writeups — Collin Doyle",
  description: "Internal apps and automations I designed and built: what they do, the time they save and the money they save.",
  url: `${ORIGIN}/writeups/`, image: `${ORIGIN}/assets/og/default.png`, type: "website", depth: 1,
  body: `<h1>Writeups</h1>\n<p>Internal apps and automations I designed and built: what they do, how they save time, and how they save money.</p>\n${list}`,
}));
console.log("built writeups/");

// 404: GitHub Pages serves /404.html for any missing path, so links here are root-absolute.
fs.writeFileSync(path.join(ROOT, "404.html"), page({
  title: "404 — command not found · collin.rocks",
  description: "That page doesn't exist.",
  url: `${ORIGIN}/404.html`, image: `${ORIGIN}/assets/og/default.png`, type: "website", base: "/",
  extraHead: `  <meta name="robots" content="noindex" />\n`,
  body: `<div class="notfound">
<p class="notfound__prompt"><span class="term-green">collin@rocks</span>:<span class="term-accent">~</span>$ cd <span id="nf-path">this-page</span></p>
<p class="term-err">bash: cd: <span id="nf-path2">this-page</span>: No such file or directory</p>
<p class="notfound__code">404</p>
<p>That page doesn't exist (or it moved). Try one of these:</p>
<pre><code>$ ls
<a href="/">desktop/</a>      the full site
<a href="/writeups/">writeups/</a>     apps and automations I've built
<a href="/#resume">resume</a>        experience and certifications
<a href="/#contact">contact</a>       get in touch</code></pre>
</div>
<script>
  var p = decodeURIComponent(location.pathname.split("/").filter(Boolean).join("/")) || "this-page";
  document.getElementById("nf-path").textContent = p;
  document.getElementById("nf-path2").textContent = p;
</script>`,
}));
console.log("built 404.html");

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") + "\n</urlset>\n");
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log("built sitemap.xml, robots.txt");
