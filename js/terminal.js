/* =============================================================================
   terminal.js — interactive terminal widget, reads from window.SITE.
   -----------------------------------------------------------------------------
   Exposes window.Terminal.build() -> DOM node used as the terminal window body.
   Commands are case-insensitive. Theme switching goes through window.Themes.
   ========================================================================== */
(function () {
  "use strict";

  var PROMPT_USER = "collin@rocks";
  var outputEl, inputEl, scrollEl;
  var history = [];
  var histIdx = -1;

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  /* ---- output helpers ----------------------------------------------------- */
  function line(html, cls) {
    var p = document.createElement("div");
    p.className = "term-line" + (cls ? " " + cls : "");
    p.innerHTML = html;
    outputEl.appendChild(p);
    return p;
  }
  function blank() { line("&nbsp;"); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function scrollToEnd() {
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }
  function echoCommand(cmd) {
    line('<span class="term-prompt">' + PROMPT_USER +
      ':<span class="path">~</span>$</span> ' +
      '<span class="term-cmd-echo">' + esc(cmd) + "</span>");
  }

  /* ---- command table ------------------------------------------------------ */
  var COMMANDS = {
    help: function () {
      line('<span class="term-accent">Available commands:</span>');
      var rows = [
        ["help", "this list"],
        ["whoami / about", "who I am"],
        ["neofetch", "the specs panel"],
        ["projects", "list projects"],
        ["cat <project>", "project details (name or number)"],
        ["resume", "experience + résumé download"],
        ["blog", "list posts  ·  cat <post> to read"],
        ["contact", "how to reach me"],
        ["theme [name]", "tokyo-night · catppuccin · gruvbox · nord"],
        ["gui", "open the windowed desktop view"],
        ["clear", "clear the terminal"],
        ["echo / pwd / history", "unix flavor"],
      ];
      rows.forEach(function (r) {
        line('  <span class="term-green term-accent">' + r[0].padEnd(22) +
          '</span><span class="term-muted">' + r[1] + "</span>");
      });
    },

    whoami: function () { COMMANDS.about(); },
    about: function () {
      var p = SITE.profile;
      line('<span class="term-accent">' + esc(p.name) + '</span> — ' + esc(p.role));
      line('<span class="term-muted">' + esc(p.location) + "</span>");
      blank();
      line(esc(p.summary));
      blank();
      (p.bio || []).forEach(function (para) { line(esc(para)); blank(); });
      line('<span class="term-muted">› try </span><span class="term-yellow">neofetch</span>' +
        '<span class="term-muted">, </span><span class="term-yellow">projects</span>' +
        '<span class="term-muted">, or </span><span class="term-yellow">gui</span>');
    },

    neofetch: function () {
      var p = SITE.profile;
      var art = (p.asciiLogo || []).slice();
      var specs = [
        ["", PROMPT_USER],
        ["", "-----------"],
        ["role", p.role],
        ["location", p.location],
        ["focus", p.currentFocus],
        ["stack", (p.stack || []).join(", ")],
      ];
      var rows = Math.max(art.length, specs.length);
      for (var i = 0; i < rows; i++) {
        var a = art[i] || "";
        var s = specs[i];
        var specHtml = "";
        if (s) {
          specHtml = s[0]
            ? '<span class="term-green">' + esc(s[0]) + '</span><span class="term-muted">: </span>' + esc(s[1])
            : '<span class="term-accent">' + esc(s[1]) + "</span>";
        }
        line('<span class="term-magenta">' + esc(a.padEnd(22)) + "</span>" + specHtml);
      }
    },

    projects: function () {
      line('<span class="term-accent">projects/</span>');
      SITE.projects.forEach(function (proj, i) {
        line('  <span class="term-yellow">' + (i + 1) + ".</span> " +
          '<span class="term-cmd-echo">' + esc(proj.title) + "</span> " +
          '<span class="term-muted">— ' + esc(proj.summary) + "</span>");
      });
      blank();
      line('<span class="term-muted">› </span><span class="term-yellow">cat &lt;number|name&gt;</span>' +
        '<span class="term-muted"> for details</span>');
    },

    cat: function (args) {
      var key = (args[0] || "").toLowerCase();
      if (!key) { line('<span class="term-err">usage: cat &lt;project|post&gt;</span>'); return; }

      // by index
      var proj = null;
      if (/^\d+$/.test(key)) proj = SITE.projects[parseInt(key, 10) - 1];
      if (!proj) {
        proj = SITE.projects.filter(function (p) {
          return slug(p.title).indexOf(slug(key)) !== -1;
        })[0];
      }
      if (proj) { printProject(proj); return; }

      // try posts
      var post = SITE.posts.filter(function (p) {
        return slug(p.slug).indexOf(slug(key)) !== -1 || slug(p.title).indexOf(slug(key)) !== -1;
      })[0];
      if (post) { window.WM.open("blog"); document.dispatchEvent(new CustomEvent("blog:open", { detail: { slug: post.slug } })); line('<span class="term-muted">opening post in blog window…</span>'); return; }

      line('<span class="term-err">cat: ' + esc(key) + ": no such project or post</span>");
    },
    open: function (args) {
      // `open <project>` opens project's first link or the projects window
      var key = (args[0] || "").toLowerCase();
      var proj = SITE.projects.filter(function (p) { return slug(p.title).indexOf(slug(key)) !== -1; })[0];
      if (proj && proj.links && proj.links.length) {
        line('<span class="term-muted">opening ' + esc(proj.links[0].href) + "…</span>");
        window.open(proj.links[0].href, "_blank", "noopener");
      } else { window.WM.open("projects"); }
    },

    resume: function () {
      line('<span class="term-accent">experience/</span>');
      SITE.experience.forEach(function (job) {
        line('  <span class="term-cmd-echo">' + esc(job.title) + '</span> ' +
          '<span class="term-magenta">@ ' + esc(job.org) + "</span> " +
          '<span class="term-muted">(' + esc(job.start) + " – " + esc(job.end) + ")</span>");
      });
      blank();
      line('<span class="term-muted">› download: </span><a href="' + esc(SITE.resumePdf) +
        '" download>' + esc(SITE.resumePdf) + "</a>");
    },

    blog: function () { COMMANDS.ls(["posts"]); },

    ls: function (args) {
      var what = (args[0] || "").toLowerCase();
      if (what === "posts" || what === "blog") {
        line('<span class="term-accent">posts/</span>');
        SITE.posts.forEach(function (post) {
          line('  <span class="term-yellow">' + esc(post.slug) + "</span> " +
            '<span class="term-muted">' + esc(post.date) + " — " + esc(post.title) + "</span>");
        });
        blank();
        line('<span class="term-muted">› </span><span class="term-yellow">cat &lt;slug&gt;</span>');
      } else if (what === "projects" || what === "") {
        COMMANDS.projects();
      } else {
        line('<span class="term-err">ls: cannot access \'' + esc(what) + "'</span>");
      }
    },

    contact: function () {
      line('<span class="term-accent">contact/</span>');
      SITE.links.forEach(function (l) {
        line('  <span class="term-green">' + esc(l.label).padEnd(10) + "</span>" +
          '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.href) + "</a>");
      });
    },

    theme: function (args) {
      var name = (args[0] || "").toLowerCase();
      if (!name) {
        line('<span class="term-muted">themes: </span>' + window.Themes.list.map(function (t) {
          return t === window.Themes.current()
            ? '<span class="term-accent">' + t + " (current)</span>"
            : '<span class="term-yellow">' + t + "</span>";
        }).join('<span class="term-muted">, </span>'));
        return;
      }
      if (window.Themes.list.indexOf(name) === -1) {
        line('<span class="term-err">theme: unknown \'' + esc(name) + "'</span>");
        line('<span class="term-muted">try: </span>' + window.Themes.list.join(", "));
        return;
      }
      window.Themes.set(name);
      line('<span class="term-green">✓ theme → ' + esc(name) + "</span>");
    },

    gui: function () {
      line('<span class="term-green">opening windowed desktop…</span>');
      ["about", "projects", "resume", "blog", "contact"].forEach(function (id) {
        window.WM.open(id);
      });
      window.WM.open("terminal");
    },

    clear: function () { outputEl.innerHTML = ""; },

    echo: function (args) { line(esc(args.join(" "))); },
    pwd: function () { line("/home/collin"); },

    history: function () {
      history.forEach(function (h, i) {
        line('  <span class="term-muted">' + String(i + 1).padStart(3) + "</span>  " + esc(h));
      });
    },

    sudo: function (args) {
      line('<span class="term-err">' + esc(PROMPT_USER) +
        " is not in the sudoers file. This incident will be reported.</span>");
      if (args.join(" ").indexOf("rm") !== -1) {
        line('<span class="term-muted">(nice try 🙂)</span>');
      }
    },
  };

  // aliases
  COMMANDS.ll = COMMANDS.ls;

  function printProject(proj) {
    line('<span class="term-accent">' + esc(proj.title) + "</span>");
    line(esc(proj.summary));
    if (proj.tags && proj.tags.length) {
      line('<span class="term-cyan term-muted">[' + proj.tags.map(esc).join("] [") + "]</span>");
    }
    if (proj.links && proj.links.length) {
      proj.links.forEach(function (l) {
        line('  <span class="term-green">' + esc(l.label) + ": </span><a href=\"" +
          esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.href) + "</a>");
      });
    } else {
      line('<span class="term-muted">  (private — no public link)</span>');
    }
  }

  /* ---- input handling ----------------------------------------------------- */
  var ALL_NAMES = null;
  function commandNames() {
    if (!ALL_NAMES) {
      ALL_NAMES = Object.keys(COMMANDS).concat(["whoami", "about"]).filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });
    }
    return ALL_NAMES;
  }

  function run(raw) {
    var input = raw.trim();
    echoCommand(input);
    if (input) { history.push(input); }
    histIdx = history.length;
    if (!input) { scrollToEnd(); return; }

    var parts = input.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);

    // "ls projects" / "ls posts" handled by ls; allow "projects"/"blog" direct
    if (COMMANDS[cmd]) {
      try { COMMANDS[cmd](args); }
      catch (err) { line('<span class="term-err">error: ' + esc(err.message) + "</span>"); }
    } else {
      line('<span class="term-err">command not found: ' + esc(cmd) + "</span>");
      var guess = suggest(cmd);
      if (guess) line('<span class="term-muted">did you mean </span><span class="term-yellow">' + guess + "</span><span class=\"term-muted\">?</span>");
      else line('<span class="term-muted">type </span><span class="term-yellow">help</span>');
    }
    scrollToEnd();
  }

  function suggest(cmd) {
    // cheap: first command that shares the most leading chars
    var best = null, bestScore = 0;
    commandNames().forEach(function (name) {
      var n = 0;
      while (n < cmd.length && n < name.length && cmd[n] === name[n]) n++;
      if (n > bestScore && n >= 1) { bestScore = n; best = name; }
    });
    return bestScore >= 2 ? best : null;
  }

  function onKey(e) {
    if (e.key === "Enter") {
      run(inputEl.value);
      inputEl.value = "";
    } else if (e.key === "ArrowUp") {
      if (histIdx > 0) { histIdx--; inputEl.value = history[histIdx] || ""; }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (histIdx < history.length - 1) { histIdx++; inputEl.value = history[histIdx] || ""; }
      else { histIdx = history.length; inputEl.value = ""; }
      e.preventDefault();
    } else if (e.key === "Tab") {
      e.preventDefault();
      var v = inputEl.value.toLowerCase();
      if (!v) return;
      var matches = commandNames().filter(function (n) { return n.indexOf(v) === 0; });
      if (matches.length === 1) inputEl.value = matches[0] + " ";
      else if (matches.length > 1) line('<span class="term-muted">' + matches.join("  ") + "</span>"), scrollToEnd();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      COMMANDS.clear();
    }
  }

  /* ---- build -------------------------------------------------------------- */
  function build() {
    var wrap = document.createElement("div");
    wrap.className = "term-wrap";

    outputEl = document.createElement("div");
    outputEl.className = "term-output";

    var inputLine = document.createElement("div");
    inputLine.className = "term-inputline";
    inputLine.innerHTML = '<span class="term-prompt">' + PROMPT_USER +
      ':<span class="path">~</span>$</span>';
    inputEl = document.createElement("input");
    inputEl.className = "term-input";
    inputEl.setAttribute("aria-label", "Terminal input");
    inputEl.setAttribute("autocomplete", "off");
    inputEl.setAttribute("autocapitalize", "off");
    inputEl.setAttribute("spellcheck", "false");
    inputLine.appendChild(inputEl);

    wrap.appendChild(outputEl);
    wrap.appendChild(inputLine);

    inputEl.addEventListener("keydown", onKey);
    // clicking anywhere in the terminal focuses the input
    wrap.addEventListener("click", function (e) {
      if (window.getSelection().toString()) return; // allow text selection
      inputEl.focus();
    });

    // remember scroll container after mount
    setTimeout(function () {
      scrollEl = wrap.closest(".window__body");
      banner();
      inputEl.focus();
    }, 0);

    return wrap;
  }

  function banner() {
    line('<span class="term-accent">collin.rocks</span> <span class="term-muted">— interactive terminal</span>');
    line('<span class="term-muted">type </span><span class="term-yellow">help</span>' +
      '<span class="term-muted"> to get started, or </span><span class="term-yellow">neofetch</span>');
    blank();
  }

  window.Terminal = { build: build, focusInput: function () { if (inputEl) inputEl.focus(); } };
})();
