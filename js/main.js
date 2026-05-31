/* =============================================================================
   main.js — orchestration.
   - theme engine (window.Themes) + status-bar toggle, persisted to localStorage
   - live clock
   - builds each window's content from window.SITE
   - tiny zero-dependency Markdown renderer for the blog
   - dock wiring + default landing layout
   ========================================================================== */
(function () {
  "use strict";

  /* =========================== Themes ==================================== */
  var THEME_LIST = ["tokyo-night", "catppuccin", "gruvbox", "nord"];
  var THEME_KEY = "collin-rocks-theme";

  function applyTheme(name) {
    if (THEME_LIST.indexOf(name) === -1) name = THEME_LIST[0];
    document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem(THEME_KEY, name); } catch (_) {}
    var label = document.getElementById("theme-name");
    if (label) label.textContent = name;
  }
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || THEME_LIST[0];
  }
  window.Themes = {
    list: THEME_LIST,
    set: applyTheme,
    current: currentTheme,
  };

  /* =========================== Clock ===================================== */
  var CLOCK_KEY = "collin-rocks-clock24";   // "1" = 24-hour, else 12-hour (default)
  function is24h() {
    try { return localStorage.getItem(CLOCK_KEY) === "1"; } catch (_) { return false; }
  }
  function tickClock() {
    var el = document.getElementById("clock");
    if (!el) return;
    var d = new Date();
    var h = d.getHours(), mm = String(d.getMinutes()).padStart(2, "0");
    if (is24h()) {
      el.textContent = String(h).padStart(2, "0") + ":" + mm;
    } else {
      var h12 = h % 12 || 12;
      el.textContent = h12 + ":" + mm + " " + (h < 12 ? "AM" : "PM");
    }
  }

  /* =========================== el() helper =============================== */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* =========================== Window builders =========================== */
  function buildAbout() {
    var p = SITE.profile;
    var wrap = el("div", "about-cols");

    // left column: ASCII art stacked above the specs
    var left = el("div", "about-left");
    left.appendChild(el("pre", "neofetch__art", esc((p.asciiLogo || []).join("\n"))));

    var specs = el("div", "neofetch__specs");
    specs.appendChild(el("div", "row", '<span class="term-accent">' + esc(p.name) + "</span>"));
    specs.appendChild(el("div", "row", '<span class="muted">' + "—".repeat(11) + "</span>"));
    var pairs = [
      ["role", p.role], ["location", p.location],
      ["focus", p.currentFocus],
    ];
    pairs.forEach(function (kv) {
      specs.appendChild(el("div", "row", "<dt>" + esc(kv[0]) + "</dt>: " + esc(kv[1])));
    });
    left.appendChild(specs);

    // right column: bio + stack tags
    var right = el("div", "about-right");
    var bio = el("div", "bio");
    bio.appendChild(el("p", null, "<strong>" + esc(p.summary) + "</strong>"));
    (p.bio || []).forEach(function (para) { bio.appendChild(el("p", null, esc(para))); });
    right.appendChild(bio);

    var tags = el("div", "tags");
    (p.stack || []).forEach(function (s) { tags.appendChild(el("span", "tag", esc(s))); });
    right.appendChild(tags);

    wrap.appendChild(left);
    wrap.appendChild(right);
    return wrap;
  }

  function buildProjects() {
    var wrap = el("div");
    wrap.appendChild(el("h2", "win-h", "projects"));
    wrap.appendChild(el("p", "win-sub", "Things I build and run. Most live in the homelab."));
    SITE.projects.forEach(function (proj) {
      var box = el("div", "project");
      box.appendChild(el("div", "project__title", esc(proj.title)));
      box.appendChild(el("div", null, esc(proj.summary)));
      if (proj.tags && proj.tags.length) {
        var t = el("div", "tags");
        proj.tags.forEach(function (tag) { t.appendChild(el("span", "tag", esc(tag))); });
        box.appendChild(t);
      }
      if (proj.links && proj.links.length) {
        var links = el("div", "project__links");
        proj.links.forEach(function (l) {
          links.appendChild(el("a", null, esc(l.label)));
          links.lastChild.href = l.href;
          links.lastChild.target = "_blank";
          links.lastChild.rel = "noopener";
        });
        box.appendChild(links);
      }
      wrap.appendChild(box);
    });
    wrap.appendChild(el("p", "add-hint",
      "More coming. Add projects by editing <code>js/data.js</code> → <code>projects[]</code>."));
    return wrap;
  }

  function buildResume() {
    var wrap = el("div");
    wrap.appendChild(el("h2", "win-h", "resume"));

    var dl = el("a", "btn", "↓ Download résumé (PDF)");
    dl.href = SITE.resumePdf; dl.setAttribute("download", "");
    wrap.appendChild(dl);

    if (SITE.resumePdfFull) {
      var full = el("a", "resume-full-link", "full version (2 pages) ↗");
      full.href = SITE.resumePdfFull; full.target = "_blank"; full.rel = "noopener";
      wrap.appendChild(full);
    }

    if (SITE.certifications && SITE.certifications.length) {
      var c = SITE.certifications.map(function (x) {
        return esc(x.name) + " · " + esc(x.issuer) + (x.year ? " (" + esc(x.year) + ")" : "");
      }).join(" · ");
      wrap.appendChild(el("p", "cert", "🎓 " + c));
    }

    SITE.experience.forEach(function (job) {
      var j = el("div", "job");
      var head = el("div", "job__head");
      head.appendChild(el("span", null,
        '<span class="job__title">' + esc(job.title) + '</span> ' +
        '<span class="job__org">@ ' + esc(job.org) + "</span>"));
      head.appendChild(el("span", "job__dates", esc(job.start) + " – " + esc(job.end) +
        (job.location ? " · " + esc(job.location) : "")));
      j.appendChild(head);
      if (job.bullets && job.bullets.length) {
        var ul = el("ul");
        job.bullets.forEach(function (b) { ul.appendChild(el("li", null, esc(b))); });
        j.appendChild(ul);
      }
      wrap.appendChild(j);
    });
    return wrap;
  }

  function buildContact() {
    var wrap = el("div");
    wrap.appendChild(el("h2", "win-h", "contact"));
    wrap.appendChild(el("p", "win-sub", "No form (no backend) — just reach out directly."));
    var ul = el("ul", "links-list");
    SITE.links.forEach(function (l) {
      var li = el("li");
      li.appendChild(el("span", "label", esc(l.label)));
      var a = el("a", null, esc(l.href.replace(/^mailto:/, "")));
      a.href = l.href;
      if (l.href.indexOf("mailto:") !== 0) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  }

  /* ---- blog (list + reader) with tiny markdown renderer ----------------- */
  function buildBlog() {
    var wrap = el("div");
    wrap.dataset.view = "list";
    renderBlogList(wrap);
    return wrap;
  }
  function renderBlogList(wrap) {
    wrap.innerHTML = "";
    wrap.appendChild(el("h2", "win-h", "blog"));
    wrap.appendChild(el("p", "win-sub", "Notes, writeups, and homelab logs."));
    SITE.posts.forEach(function (post) {
      var item = el("div", "post-item");
      item.appendChild(el("div", "post-item__title", esc(post.title)));
      item.appendChild(el("div", "post-item__meta", esc(post.date) +
        (post.summary ? " — " + esc(post.summary) : "")));
      item.addEventListener("click", function () { openPost(wrap, post); });
      wrap.appendChild(item);
    });
  }
  function openPost(wrap, post) {
    wrap.innerHTML = "";
    var back = el("button", "back-link", "← back to posts");
    back.addEventListener("click", function () { renderBlogList(wrap); });
    wrap.appendChild(back);
    var body = el("div", "post-body");
    body.appendChild(el("p", "post-item__meta", esc(post.date)));
    body.innerHTML += '<p class="muted">loading…</p>';
    wrap.appendChild(body);

    fetch(post.file)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (md) { body.innerHTML = miniMarkdown(md); })
      .catch(function () {
        body.innerHTML =
          '<p class="term-err">Couldn\'t load this post.</p>' +
          '<p class="muted">If you\'re viewing the site from a <code>file://</code> path, ' +
          'browsers block <code>fetch</code>. Serve it over http (e.g. ' +
          '<code>python -m http.server</code>) or view it live. ' +
          'Raw file: <a href="' + esc(post.file) + '">' + esc(post.file) + "</a></p>";
      });
  }

  /* Minimal Markdown -> HTML. Handles headings, bold/italic/inline-code,
     fenced code blocks, links, unordered lists, blockquotes, paragraphs.
     Deliberately small; good enough for short posts, zero dependencies. */
  function miniMarkdown(md) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var out = [], i = 0;

    function inline(s) {
      return esc(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }

    while (i < lines.length) {
      var ln = lines[i];

      if (/^```/.test(ln)) {                       // fenced code
        var buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push("<pre><code>" + esc(buf.join("\n")) + "</code></pre>");
        continue;
      }
      var h = ln.match(/^(#{1,4})\s+(.*)$/);        // headings
      if (h) { out.push("<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">"); i++; continue; }

      if (/^>\s?/.test(ln)) {                       // blockquote
        out.push("<blockquote>" + inline(ln.replace(/^>\s?/, "")) + "</blockquote>"); i++; continue;
      }
      if (/^[-*]\s+/.test(ln)) {                    // unordered list
        var items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push("<li>" + inline(lines[i].replace(/^[-*]\s+/, "")) + "</li>"); i++;
        }
        out.push("<ul>" + items.join("") + "</ul>");
        continue;
      }
      if (/^\s*$/.test(ln)) { i++; continue; }      // blank

      var para = [ln]; i++;                          // paragraph
      while (i < lines.length && !/^\s*$/.test(lines[i]) &&
             !/^(#{1,4}\s|>\s?|[-*]\s|```)/.test(lines[i])) { para.push(lines[i]); i++; }
      out.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return out.join("\n");
  }

  /* =========================== Registration ============================== */
  function registerWindows() {
    // terminal opens anchored to the bottom-right of the desktop, with a
    // comfortable buffer. Positions are relative to the #desktop element
    // (which sits between the status bar and dock), so measure it directly.
    var desk = document.getElementById("desktop");
    var dw = desk ? desk.clientWidth : window.innerWidth;
    var dh = desk ? desk.clientHeight : window.innerHeight - 90;
    var termW = 640, termH = 300;
    var EDGE = 40;           // buffer from the desktop edges
    var termX = Math.max(16, dw - termW - EDGE);
    var termY = Math.max(16, dh - termH - EDGE);

    WM.register("about",    { title: "about — collin",  build: buildAbout,    defaults: { x: 40,  y: 34,  w: 720 } });
    WM.register("projects", { title: "projects",         build: buildProjects, defaults: { x: 60,  y: 120, w: 460, h: 360 } });
    WM.register("resume",   { title: "resume",           build: buildResume,   defaults: { x: 90,  y: 150, w: 480, h: 380 } });
    WM.register("blog",     { title: "blog",             build: buildBlog,     defaults: { x: 540, y: 170, w: 440 } });
    WM.register("contact",  { title: "contact",          build: buildContact,  defaults: { x: 150, y: 200, w: 400 } });
    WM.register("terminal", {
      title: "terminal — zsh", className: "terminal",
      build: function () { return Terminal.build(); },
      defaults: { x: termX, y: termY, w: termW, h: termH },
    });
  }

  // let the terminal's `cat <post>` jump straight to a post
  document.addEventListener("blog:open", function (e) {
    var wrap = document.querySelector('[data-win="blog"] .window__body > div');
    var post = SITE.posts.filter(function (p) { return p.slug === e.detail.slug; })[0];
    if (wrap && post) openPost(wrap, post);
  });

  /* =========================== Boot ====================================== */
  function boot() {
    WM._init();
    registerWindows();

    // theme: restore saved or default
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    applyTheme(saved || "tokyo-night");

    // clock — 12-hour by default; click to toggle 12/24-hour (persisted)
    tickClock();
    setInterval(tickClock, 15000);
    var clock = document.getElementById("clock");
    if (clock) {
      clock.title = "Click to switch 12 / 24-hour";
      clock.addEventListener("click", function () {
        try { localStorage.setItem(CLOCK_KEY, is24h() ? "0" : "1"); } catch (_) {}
        tickClock();
      });
    }

    // theme toggle cycles through the list
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var idx = THEME_LIST.indexOf(currentTheme());
        applyTheme(THEME_LIST[(idx + 1) % THEME_LIST.length]);
      });
    }

    // dock launchers
    document.querySelectorAll(".dock__btn[data-launch]").forEach(function (btn) {
      btn.addEventListener("click", function () { WM.toggle(btn.dataset.launch); });
    });

    // default landing layout: about + terminal visible; projects pre-opened
    // but minimized to the dock to nudge visitors into clicking around.
    var pj = WM.open("projects");
    if (pj) pj.classList.add("is-minimized");
    WM.open("about");
    WM.open("terminal");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
