#!/usr/bin/env node
// Prints resume/resume-1page.html -> assets/resume.pdf and resume/resume-2page.html -> assets/resume-full.pdf.
// Needs Chrome and playwright-core:  npm i --no-save playwright-core && node tools/make-resume-pdfs.js

"use strict";
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright-core");

const ROOT = path.resolve(__dirname, "..");
const JOBS = [
  ["resume/resume-1page.html", "assets/resume.pdf"],
  ["resume/resume-2page.html", "assets/resume-full.pdf"],
];

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  for (const [src, out] of JOBS) {
    await page.goto(pathToFileURL(path.join(ROOT, src)).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const buf = await page.pdf({ path: path.join(ROOT, out), preferCSSPageSize: true, printBackground: true });
    const pages = (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`${out}: ${pages} page(s)`);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
