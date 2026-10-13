#!/usr/bin/env node
// Renders the 1200x630 social preview images in assets/og/ (default.png + one per writeup).
// Needs Chrome and playwright-core:  npm i --no-save playwright-core && node tools/make-og-images.js
// Run tools/build-writeups.js afterwards so the writeup pages pick up any new image.

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright-core");

const ROOT = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8"), sandbox);
const SITE = sandbox.window.SITE;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function card({ kicker, title, sub, tags }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    font-family: "JetBrains Mono", monospace; color: #c0caf5; background: #1a1b26;
    background-image: radial-gradient(rgba(122,162,247,.07) 1.5px, transparent 1.5px),
      radial-gradient(900px 500px at 85% -10%, rgba(187,154,247,.18), transparent 60%),
      radial-gradient(900px 500px at 0% 110%, rgba(122,162,247,.16), transparent 60%);
    background-size: 26px 26px, 100% 100%, 100% 100%;
    box-sizing: border-box; padding: 56px 64px; display: flex; flex-direction: column;
  }
  .win { flex: 1; border: 1px solid #2f334d; border-radius: 14px; background: rgba(31,35,53,.92);
    box-shadow: 0 30px 80px -20px rgba(0,0,0,.7); display: flex; flex-direction: column; overflow: hidden; }
  .bar { height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
    background: #24283b; border-bottom: 1px solid #2f334d; font-size: 20px; color: #7aa2f7; }
  .dots span { display: inline-block; width: 14px; height: 14px; border-radius: 50%; margin-left: 8px; }
  .content { flex: 1; padding: 40px 48px; display: flex; flex-direction: column; }
  .kicker { color: #9ece6a; font-size: 24px; margin-bottom: 18px; }
  .kicker b { color: #565f89; font-weight: 400; }
  h1 { margin: 0; color: #c0caf5; font-size: ${title.length > 48 ? 50 : 60}px; line-height: 1.15; letter-spacing: -1px; }
  .sub { margin-top: 22px; color: #a9b1d6; font-size: 25px; line-height: 1.45; max-width: 960px; }
  .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; }
  .tags span { display: inline-block; margin: 0 10px 0 0; padding: 6px 14px; border: 1px solid #3b4261;
    border-radius: 6px; color: #7dcfff; font-size: 19px; background: rgba(122,162,247,.08); }
  .site { color: #bb9af7; font-size: 24px; font-weight: 700; }
</style></head><body>
<div class="win">
  <div class="bar"><span>● collin@rocks</span><span class="dots"><span style="background:#e0af68"></span><span style="background:#9ece6a"></span><span style="background:#f7768e"></span></span></div>
  <div class="content">
    <div class="kicker">${kicker}</div>
    <h1>${esc(title)}</h1>
    <div class="sub">${esc(sub)}</div>
    <div class="foot"><div class="tags">${(tags || []).slice(0, 5).map((t) => `<span>${esc(t)}</span>`).join("")}</div><div class="site">collin.rocks</div></div>
  </div>
</div></body></html>`;
}

(async () => {
  const out = path.join(ROOT, "assets/og");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  async function shot(file, html) {
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, file) });
    console.log("assets/og/" + file);
  }

  await shot("default.png", card({
    kicker: "$ whoami <b>→</b> Collin Doyle",
    title: "I manage IT through automation",
    sub: "IT operations & automation lead. Zero-touch onboarding, internal platforms, bare-metal Kubernetes, M365 / Entra ID.",
    tags: ["Automation", "Entra ID", "Kubernetes", "Node.js", "React"],
  }));

  for (const post of SITE.posts) {
    const project = SITE.projects.find((p) => p.post === post.slug);
    if (!project) continue;
    await shot(post.slug + ".png", card({
      kicker: `$ cat ${esc(post.slug)} <b>·</b> writeup`,
      title: post.title,
      sub: project.summary,
      tags: project.tags,
    }));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
