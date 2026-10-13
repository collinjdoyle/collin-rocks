// Themes, clock, window content, blog markdown, and boot.
(function () {
  "use strict";

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

  var CLOCK_KEY = "collin-rocks-clock24";   // "1" = 24-hour, else 12-hour
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

  function buildAbout() {
    var p = SITE.profile;
    var wrap = el("div", "about-cols");

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
    wrap.appendChild(el("p", "win-sub", "Internal apps I designed and built (writeups inside), plus the homelab."));
    SITE.projects.forEach(function (proj) {
      var box = el("div", "project");
      box.appendChild(el("div", "project__title", esc(proj.title)));
      box.appendChild(el("div", null, esc(proj.summary)));
      if (proj.tags && proj.tags.length) {
        var t = el("div", "tags");
        proj.tags.forEach(function (tag) { t.appendChild(el("span", "tag", esc(tag))); });
        box.appendChild(t);
      }
      if (proj.post) {
        var w = el("a", "project__writeup", "read the writeup →");
        w.href = "#post/" + proj.post;
        box.appendChild(w);
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
        return esc(x.name) + (x.year ? " (" + esc(x.year) + ")" : "");
      }).join(" · ");
      wrap.appendChild(el("p", "cert", c));
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

    if (SITE.education && SITE.education.length) {
      wrap.appendChild(el("h3", "win-h3", "education"));
      var edu = el("ul", "edu");
      SITE.education.forEach(function (e) { edu.appendChild(el("li", null, esc(e))); });
      wrap.appendChild(edu);
    }
    return wrap;
  }

  function buildContact() {
    var wrap = el("div");
    wrap.appendChild(el("h2", "win-h", "contact"));
    wrap.appendChild(el("p", "win-sub", "Reach out directly."));
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
    setHash("post/" + post.slug);
    var back = el("button", "back-link", "← back to posts");
    back.addEventListener("click", function () {
      setHash("");
      renderBlogList(wrap);
    });
    wrap.appendChild(back);
    var body = el("div", "post-body");
    body.appendChild(el("p", "post-item__meta", esc(post.date)));
    body.innerHTML += '<p class="muted">loading…</p>';
    wrap.appendChild(body);

    fetch(post.file)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (md) {
        body.innerHTML = '<p class="post-item__meta">' + esc(post.date) +
          ' · <a href="writeups/' + esc(post.slug) + '/">permalink</a></p>' + window.miniMarkdown(md);
        document.title = post.title + " — collin.rocks";
        trackView("/writeups/" + post.slug + "/", post.title);
      })
      .catch(function () {
        body.innerHTML =
          '<p class="term-err">Couldn\'t load this post.</p>' +
          '<p class="muted">Try again in a moment, or ' +
          '<a href="' + esc(post.file) + '">open it directly</a>.</p>';
      });
  }

  function registerWindows() {
    // terminal sits center-left of the desktop
    var desk = document.getElementById("desktop");
    var dw = desk ? desk.clientWidth : window.innerWidth;
    var dh = desk ? desk.clientHeight : window.innerHeight - 90;
    var termW = 640, termH = 300;
    var termX = 40;
    var termY = Math.max(16, Math.round((dh - termH) / 2));

    WM.register("about",    { title: "about — collin",  build: buildAbout,    defaults: { x: 40,  y: 34,  w: 720 } });
    WM.register("projects", { title: "projects",         build: buildProjects, defaults: { x: 60,  y: 90,  w: 560, h: 440 } });
    WM.register("resume",   { title: "resume",           build: buildResume,   defaults: { x: 90,  y: 150, w: 480, h: 380 } });
    WM.register("blog",     { title: "blog",             build: buildBlog,     defaults: { x: 420, y: 60,  w: 640 } });
    WM.register("contact",  { title: "contact",          build: buildContact,  defaults: { x: 150, y: 200, w: 400 } });
    WM.register("terminal", {
      title: "terminal@collin.rocks", className: "terminal",
      build: function () { return Terminal.build(); },
      defaults: { x: termX, y: termY, w: termW, h: termH },
    });
  }

  // Posts get shareable URLs: collin.rocks/#post/<slug>
  var BASE_TITLE = document.title;
  function setHash(h) {
    if (h ? window.location.hash === "#" + h : !window.location.hash) return;
    try {
      history.replaceState(null, "", h ? "#" + h : window.location.pathname + window.location.search);
    } catch (_) {}
    if (!h) document.title = BASE_TITLE;
  }
  function openPostBySlug(slug) {
    var post = SITE.posts.filter(function (p) { return p.slug === slug; })[0];
    if (!post) return false;
    if (window.matchMedia("(max-width: 720px)").matches) {   // mobile: one section at a time
      ["about", "projects", "resume", "contact", "terminal"].forEach(function (id) {
        if (WM.isOpen(id)) WM.close(id);
      });
      window.scrollTo({ top: 0 });
    }
    if (!WM.isOpen("blog")) WM.open("blog");
    var wrap = document.querySelector('[data-win="blog"] .window__body > div');
    if (wrap) openPost(wrap, post);
    return true;
  }
  function routeFromHash() {
    var m = window.location.hash.match(/^#post\/([a-z0-9-]+)$/);
    if (m) return openPostBySlug(m[1]);
    var win = window.location.hash.slice(1);             // #resume, #projects, #contact …
    if (["projects", "resume", "blog", "contact", "terminal"].indexOf(win) !== -1) {
      if (window.matchMedia("(max-width: 720px)").matches && WM.isOpen("about")) WM.close("about");
      WM.open(win);
      return true;
    }
    return false;
  }
  window.addEventListener("hashchange", routeFromHash);

  document.addEventListener("blog:open", function (e) { openPostBySlug(e.detail.slug); });

  // Cookie-free analytics (GoatCounter). No-op until SITE.analytics.goatcounter is set.
  var GC = SITE.analytics && SITE.analytics.goatcounter;
  function loadAnalytics() {
    if (!GC) return;
    window.goatcounter = { no_onload: true };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + GC + ".goatcounter.com/count");
    s.onload = function () {        // first view: the post a shared link points at, else the desktop
      var m = window.location.hash.match(/^#post\/([a-z0-9-]+)$/);
      trackView(m ? "/writeups/" + m[1] + "/" : "/");
    };
    document.head.appendChild(s);
  }
  function trackView(path, title) {
    if (!GC || !window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({ path: path || "/", title: title || document.title });
  }

  function boot() {
    loadAnalytics();
    WM._init();
    registerWindows();

    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    applyTheme(saved || "tokyo-night");

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

    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var idx = THEME_LIST.indexOf(currentTheme());
        applyTheme(THEME_LIST[(idx + 1) % THEME_LIST.length]);
      });
    }

    // On mobile, show one section at a time (tap-to-open). On desktop, toggle.
    var mqMobile = window.matchMedia("(max-width: 720px)");
    var SECTIONS = ["about", "projects", "resume", "blog", "contact", "terminal"];
    function openSolo(id) {
      SECTIONS.forEach(function (other) {
        if (other !== id && WM.isOpen(other)) WM.close(other);
      });
      WM.open(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.querySelectorAll(".dock__btn[data-launch]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (mqMobile.matches) openSolo(btn.dataset.launch);
        else WM.toggle(btn.dataset.launch);
      });
    });

    // only about opens on load; everything else is reachable from the dock.
    WM.open("about");
    routeFromHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
