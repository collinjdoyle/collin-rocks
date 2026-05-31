// Terminal games & toys. Registers with the terminal via window.Games.init(api).
// Two input styles the terminal provides:
//   api.readLine({prompt, onLine})  — turn-based: each Enter calls onLine(text)
//   api.captureKeys(handler)        — real-time: handler(keydownEvent) per key
// Both end by calling api.endGame().
(function () {
  "use strict";

  var T; // TermAPI, set in init()

  // ---- helpers ----
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[rnd(arr.length)]; }
  function rep(ch, n) { return n > 0 ? new Array(n + 1).join(ch) : ""; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function pad(s, n) { while (s.length < n) s += " "; return s; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ============================================================ TURN-BASED

  function guess() {
    var target = 1 + rnd(100), tries = 0;
    T.print('<span class="term-accent">Number Guess</span> — I picked a number between 1 and 100.');
    T.print('<span class="term-muted">Type a guess, or </span><span class="term-yellow">q</span><span class="term-muted"> to quit.</span>');
    T.readLine({ prompt: "guess>", onLine: function (s) {
      if (s === "q" || s === "quit") { T.print('<span class="term-muted">It was ' + target + '. Bye.</span>'); T.endGame(); return; }
      var n = parseInt(s, 10);
      if (isNaN(n)) { T.print('<span class="term-err">Enter a number 1–100.</span>'); return; }
      tries++;
      if (n === target) {
        T.print('<span class="term-green">✓ Got it in ' + tries + ' tr' + (tries === 1 ? "y" : "ies") + '! It was ' + target + '.</span>');
        T.endGame();
      } else if (n < target) { T.print('<span class="term-yellow">↑ higher</span>'); }
      else { T.print('<span class="term-yellow">↓ lower</span>'); }
    } });
  }

  function rps() {
    var moves = ["rock", "paper", "scissors"];
    var map = { r: "rock", p: "paper", s: "scissors", rock: "rock", paper: "paper", scissors: "scissors" };
    var you = 0, cpu = 0;
    T.print('<span class="term-accent">Rock · Paper · Scissors</span> — first to 3.');
    T.print('<span class="term-muted">Type </span><span class="term-yellow">rock</span><span class="term-muted">, </span><span class="term-yellow">paper</span><span class="term-muted">, </span><span class="term-yellow">scissors</span><span class="term-muted"> (or r/p/s). </span><span class="term-yellow">q</span><span class="term-muted"> quits.</span>');
    T.readLine({ prompt: "rps>", onLine: function (s) {
      if (s === "q" || s === "quit") { T.endGame(); return; }
      var m = map[s];
      if (!m) { T.print('<span class="term-err">rock, paper, or scissors?</span>'); return; }
      var c = pick(moves), res;
      if (m === c) { res = '<span class="term-muted">tie</span>'; }
      else if ((m === "rock" && c === "scissors") || (m === "paper" && c === "rock") || (m === "scissors" && c === "paper")) {
        you++; res = '<span class="term-green">you win the round</span>';
      } else { cpu++; res = '<span class="term-err">cpu wins the round</span>'; }
      T.print('you: <span class="term-yellow">' + m + '</span>  ·  cpu: <span class="term-magenta">' + c + '</span>  →  ' + res + '  <span class="term-muted">[' + you + '–' + cpu + ']</span>');
      if (you === 3) { T.print('<span class="term-green">🏆 You win the match ' + you + '–' + cpu + '!</span>'); T.endGame(); }
      else if (cpu === 3) { T.print('<span class="term-err">💀 CPU wins the match ' + cpu + '–' + you + '.</span>'); T.endGame(); }
    } });
  }

  function hangman() {
    var words = ["react", "docker", "kubernetes", "prisma", "linux", "entra",
      "intune", "powershell", "automation", "homelab", "container", "network",
      "express", "redis", "postgres", "terminal", "cluster", "firewall"];
    var GALLOWS = [
      "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
    ];
    var word = pick(words), guessed = {}, missed = [], wrong = 0, MAX = 6;

    function masked() {
      return word.split("").map(function (c) { return guessed[c] ? c : "_"; }).join(" ");
    }
    function show() {
      T.text(GALLOWS[wrong], "term-muted");
      T.print('<span class="term-accent">' + masked() + '</span>' +
        (missed.length ? '   <span class="term-err">missed: ' + missed.join(" ") + '</span>' : ''));
    }
    T.print('<span class="term-accent">Hangman</span> — guess the word, one letter at a time. <span class="term-yellow">q</span> quits.');
    show();
    T.readLine({ prompt: "hangman>", onLine: function (s) {
      if (s === "q" || s === "quit") { T.print('<span class="term-muted">It was "' + word + '".</span>'); T.endGame(); return; }
      var c = (s[0] || "").toLowerCase();
      if (!/^[a-z]$/.test(c)) { T.print('<span class="term-err">One letter, please.</span>'); return; }
      if (guessed[c] || missed.indexOf(c) !== -1) { T.print('<span class="term-muted">already tried "' + c + '"</span>'); return; }
      if (word.indexOf(c) !== -1) {
        guessed[c] = true;
        if (word.split("").every(function (ch) { return guessed[ch]; })) {
          show(); T.print('<span class="term-green">✓ Solved: ' + word + '</span>'); T.endGame(); return;
        }
      } else {
        wrong++; missed.push(c);
        if (wrong >= MAX) { show(); T.print('<span class="term-err">💀 Out of guesses — it was "' + word + '".</span>'); T.endGame(); return; }
      }
      show();
    } });
  }

  function wordle() {
    var WORDS = ["react", "redis", "cache", "query", "stack", "async", "bytes",
      "debug", "regex", "scope", "mount", "props", "hooks", "axios", "token",
      "azure", "cloud", "array", "class", "yield", "fetch", "route", "field",
      "queue", "slice", "shell", "logic", "macro", "patch", "build"];
    var answer = pick(WORDS), turn = 0, MAX = 6;

    function score(g, a) {
      var res = ["b", "b", "b", "b", "b"], counts = {};
      for (var i = 0; i < 5; i++) counts[a[i]] = (counts[a[i]] || 0) + 1;
      for (i = 0; i < 5; i++) if (g[i] === a[i]) { res[i] = "g"; counts[g[i]]--; }
      for (i = 0; i < 5; i++) {
        if (res[i] === "g") continue;
        if (counts[g[i]] > 0) { res[i] = "y"; counts[g[i]]--; }
      }
      return res;
    }
    T.print('<span class="term-accent">Wordle</span> — guess the 5-letter word in 6 tries.');
    T.print('<span class="term-muted">green = right spot · yellow = wrong spot · gray = not in word · </span><span class="term-yellow">q</span><span class="term-muted"> quits</span>');
    T.readLine({ prompt: "wordle>", onLine: function (s) {
      if (s === "q" || s === "quit") { T.print('<span class="term-muted">It was ' + answer.toUpperCase() + '.</span>'); T.endGame(); return; }
      s = s.toLowerCase();
      if (!/^[a-z]{5}$/.test(s)) { T.print('<span class="term-err">Enter a 5-letter word.</span>'); return; }
      turn++;
      var r = score(s, answer);
      var html = s.split("").map(function (c, i) {
        var cls = r[i] === "g" ? "wd-g" : (r[i] === "y" ? "wd-y" : "wd-b");
        return '<span class="' + cls + '">' + c.toUpperCase() + "</span>";
      }).join("");
      T.print(html, "wordle-row");
      if (s === answer) { T.print('<span class="term-green">✓ Solved in ' + turn + '!</span>'); T.endGame(); return; }
      if (turn >= MAX) { T.print('<span class="term-err">Out of guesses — it was ' + answer.toUpperCase() + '.</span>'); T.endGame(); }
    } });
  }

  function trivia() {
    var QA = [
      { q: "What does the 'S' in HTTPS stand for?", a: ["Secure", "Server", "Socket", "System"], c: 0 },
      { q: "Which language runs natively in web browsers?", a: ["Python", "JavaScript", "Go", "Rust"], c: 1 },
      { q: "What city is Collin based in?", a: ["Miami", "Orlando", "Fort Myers", "Tampa"], c: 2 },
      { q: "Collin's go-to scripting language for IT automation?", a: ["Bash", "PowerShell", "Perl", "Ruby"], c: 1 },
      { q: "What does CSS stand for?", a: ["Cascading Style Sheets", "Computer Style System", "Creative Styling Syntax", "Cascading Syntax Sheets"], c: 0 },
      { q: "Which data structure is first-in, first-out?", a: ["Stack", "Queue", "Tree", "Heap"], c: 1 },
      { q: "Which protocol resolves domain names to IP addresses?", a: ["DHCP", "DNS", "SMTP", "SNMP"], c: 1 },
      { q: "What does git call a saved snapshot of changes?", a: ["Branch", "Commit", "Merge", "Stash"], c: 1 },
      { q: "Kubernetes groups one or more containers into a…?", a: ["Pod", "Node", "Cluster", "Shard"], c: 0 },
      { q: "Which company does Collin lead IT for?", a: ["Microsoft", "Eightpoint", "Google", "Cloudflare"], c: 1 }
    ];
    var pool = shuffle(QA.slice()).slice(0, 5), idx = 0, scoreN = 0;

    function ask() {
      if (idx >= pool.length) {
        T.print('<span class="term-accent">Final score: ' + scoreN + '/' + pool.length + '</span> ' +
          (scoreN === pool.length ? '<span class="term-green">— flawless!</span>' : ''));
        T.endGame(); return;
      }
      var it = pool[idx];
      T.print('<span class="term-yellow">Q' + (idx + 1) + '.</span> ' + T.esc(it.q));
      it.a.forEach(function (opt, i) {
        T.print('  <span class="term-cyan">' + (i + 1) + ')</span> ' + T.esc(opt));
      });
    }
    T.print('<span class="term-accent">Dev Trivia</span> — answer with 1–4. <span class="term-yellow">q</span> quits.');
    ask();
    T.readLine({ prompt: "trivia>", onLine: function (s) {
      if (s === "q" || s === "quit") { T.endGame(); return; }
      var n = parseInt(s, 10);
      if (isNaN(n) || n < 1 || n > 4) { T.print('<span class="term-err">Type 1, 2, 3, or 4.</span>'); return; }
      var it = pool[idx];
      if (n - 1 === it.c) { scoreN++; T.print('<span class="term-green">✓ correct</span>'); }
      else { T.print('<span class="term-err">✗ nope — ' + T.esc(it.a[it.c]) + '</span>'); }
      idx++;
      ask();
    } });
  }

  // ============================================================ REAL-TIME

  function snake() {
    var W = 24, H = 15;
    var snk = [{ x: 9, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 7 }];
    var dir = { x: 1, y: 0 }, nd = { x: 1, y: 0 };
    var food, score = 0, timer = null;
    var frame = T.frame();

    function occupied(p) { return snk.some(function (s) { return s.x === p.x && s.y === p.y; }); }
    function spawn() { var p; do { p = { x: rnd(W), y: rnd(H) }; } while (occupied(p)); return p; }
    food = spawn();

    function render() {
      var occ = {};
      snk.forEach(function (s, i) { occ[s.x + "," + s.y] = i === 0 ? 2 : 1; });
      var rows = ['<span class="term-muted">┌' + rep("─", W) + '┐</span>'];
      for (var y = 0; y < H; y++) {
        var s = '<span class="term-muted">│</span>';
        for (var x = 0; x < W; x++) {
          var o = occ[x + "," + y];
          if (o === 2) s += '<span class="snk-head">█</span>';
          else if (o === 1) s += '<span class="snk-body">█</span>';
          else if (food.x === x && food.y === y) s += '<span class="snk-food">●</span>';
          else s += " ";
        }
        rows.push(s + '<span class="term-muted">│</span>');
      }
      rows.push('<span class="term-muted">└' + rep("─", W) + '┘</span>');
      rows.push('<span class="term-yellow">score: ' + score + '</span>');
      T.setHTML(frame, rows.join("\n"));
      T.scrollToEnd();
    }
    function step() {
      dir = nd;
      var h = { x: snk[0].x + dir.x, y: snk[0].y + dir.y };
      if (h.x < 0 || h.x >= W || h.y < 0 || h.y >= H || occupied(h)) { over(false); return; }
      snk.unshift(h);
      if (h.x === food.x && h.y === food.y) { score++; food = spawn(); }
      else snk.pop();
      render();
    }
    function over(quit) {
      clearInterval(timer);
      T.print(quit ? '<span class="term-muted">quit — score ' + score + '</span>'
        : '<span class="term-err">game over — score ' + score + '</span>');
      T.endGame();
    }
    function key(e) {
      var k = e.key.toLowerCase(), n = null;
      if (k === "q") { e.preventDefault(); over(true); return; }
      if (k === "arrowup" || k === "w") n = { x: 0, y: -1 };
      else if (k === "arrowdown" || k === "s") n = { x: 0, y: 1 };
      else if (k === "arrowleft" || k === "a") n = { x: -1, y: 0 };
      else if (k === "arrowright" || k === "d") n = { x: 1, y: 0 };
      if (n) { e.preventDefault(); if (!(n.x === -dir.x && n.y === -dir.y)) nd = n; }
    }
    T.print('<span class="term-muted">arrows / WASD to move · </span><span class="term-yellow">q</span><span class="term-muted"> quits</span>');
    render();
    T.captureKeys(key);
    timer = setInterval(step, 140);
  }

  function pong() {
    var W = 34, H = 14, PAD = 4;
    var py = Math.floor((H - PAD) / 2), ay = py;
    var bx, by, vx, vy, ps = 0, as = 0, timer = null;
    var frame = T.frame();

    function reset(d) { bx = Math.floor(W / 2); by = Math.floor(H / 2); vx = d; vy = pick([-1, 1]); }
    function hit(b, top) { var rel = b - (top + PAD / 2); return rel < 0 ? -1 : (rel > 0 ? 1 : 0); }
    reset(-1);

    function render() {
      var rows = ['<span class="term-muted">' + rep("─", W) + '</span>'];
      for (var y = 0; y < H; y++) {
        var s = "";
        for (var x = 0; x < W; x++) {
          var isP = x === 0 && y >= py && y < py + PAD;
          var isA = x === W - 1 && y >= ay && y < ay + PAD;
          if (isP || isA) s += '<span class="snk-head">█</span>';
          else if (x === bx && y === by) s += '<span class="snk-food">●</span>';
          else s += " ";
        }
        rows.push(s);
      }
      rows.push('<span class="term-muted">' + rep("─", W) + '</span>');
      rows.push('<span class="term-accent">you ' + ps + '</span>   <span class="term-muted">vs</span>   <span class="term-magenta">cpu ' + as + '</span>');
      T.setHTML(frame, rows.join("\n"));
      T.scrollToEnd();
    }
    function step() {
      var aic = ay + PAD / 2;
      if (aic < by - 0.5 && Math.random() < 0.85) ay++;
      else if (aic > by + 0.5 && Math.random() < 0.85) ay--;
      ay = clamp(ay, 0, H - PAD);

      bx += vx; by += vy;
      if (by <= 0) { by = 0; vy = 1; }
      else if (by >= H - 1) { by = H - 1; vy = -1; }

      if (bx <= 1) {
        if (by >= py && by < py + PAD) { bx = 1; vx = 1; vy = hit(by, py); }
        else if (bx <= 0) { as++; if (as >= 5) { done(false); return; } reset(1); }
      }
      if (bx >= W - 2) {
        if (by >= ay && by < ay + PAD) { bx = W - 2; vx = -1; vy = hit(by, ay); }
        else if (bx >= W - 1) { ps++; if (ps >= 5) { done(true); return; } reset(-1); }
      }
      render();
    }
    function done(win) {
      clearInterval(timer);
      T.print(win ? '<span class="term-green">🏆 You win ' + ps + '–' + as + '!</span>'
        : '<span class="term-err">💀 CPU wins ' + as + '–' + ps + '.</span>');
      T.endGame();
    }
    function key(e) {
      var k = e.key.toLowerCase();
      if (k === "q") { e.preventDefault(); clearInterval(timer); T.print('<span class="term-muted">quit</span>'); T.endGame(); return; }
      if (k === "arrowup" || k === "w") { e.preventDefault(); py = clamp(py - 1, 0, H - PAD); }
      else if (k === "arrowdown" || k === "s") { e.preventDefault(); py = clamp(py + 1, 0, H - PAD); }
    }
    T.print('<span class="term-muted">↑/↓ or W/S to move · </span><span class="term-yellow">q</span><span class="term-muted"> quits · first to 5</span>');
    render();
    T.captureKeys(key);
    timer = setInterval(step, 90);
  }

  // ============================================================ TOYS

  function matrix() {
    var W = 46, H = 20;
    var CH = "abcdefghijklmnopqrstuvwxyz0123456789#$%*+=/".split("");
    var head = [], life = [], chmap = [], timer = null;
    var frame = T.frame();
    for (var c = 0; c < W; c++) head[c] = rnd(H * 2) - H;
    for (var y = 0; y < H; y++) { life[y] = []; chmap[y] = []; for (c = 0; c < W; c++) { life[y][c] = 0; chmap[y][c] = " "; } }

    function step() {
      for (var c = 0; c < W; c++) {
        var hy = head[c];
        if (hy >= 0 && hy < H) { life[hy][c] = 9; chmap[hy][c] = pick(CH); }
        head[c]++;
        if (head[c] >= H && Math.random() < 0.06) head[c] = -rnd(H);
      }
      for (var y = 0; y < H; y++) for (c = 0; c < W; c++) if (life[y][c] > 0) life[y][c]--;
      render();
    }
    function render() {
      var rows = [];
      for (var y = 0; y < H; y++) {
        var s = "";
        for (var c = 0; c < W; c++) {
          var l = life[y][c];
          if (l <= 0) s += " ";
          else if (l >= 8) s += '<span class="mtx-head">' + chmap[y][c] + "</span>";
          else if (l >= 3) s += '<span class="mtx">' + chmap[y][c] + "</span>";
          else s += '<span class="mtx-dim">' + chmap[y][c] + "</span>";
        }
        rows.push(s);
      }
      T.setHTML(frame, rows.join("\n"));
      T.scrollToEnd();
    }
    function key(e) { e.preventDefault(); clearInterval(timer); T.print('<span class="term-muted">— matrix off —</span>'); T.endGame(); }
    T.print('<span class="term-muted">press any key to stop</span>');
    render();
    T.captureKeys(key);
    timer = setInterval(step, 80);
  }

  var FORTUNES = [
    "There are only two hard things in CS: cache invalidation and naming things.",
    "It works on my machine. — every developer, eventually",
    "Weeks of coding can save you hours of planning.",
    "A user interface is like a joke. If you have to explain it, it's not that good.",
    "The cloud is just someone else's computer.",
    "99 little bugs in the code… take one down, patch it around… 127 little bugs in the code.",
    "Always code as if the person maintaining it is a violent psychopath who knows where you live.",
    "Documentation is a love letter you write to your future self.",
    "Premature optimization is the root of all evil.",
    "There's no place like 127.0.0.1.",
    "Real programmers count from 0.",
    "To understand recursion, you must first understand recursion."
  ];
  function fortune() {
    T.print('<span class="term-cyan">' + T.esc(pick(FORTUNES)) + "</span>");
  }

  function cowsay(args) {
    var text = (args && args.length) ? args.join(" ") : "Moo. Try a command, human.";
    text = text.replace(/\s+/g, " ").trim();
    var width = 38, words = text.split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if (!cur) cur = w;
      else if ((cur + " " + w).length <= width) cur += " " + w;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    if (!lines.length) lines = [""];
    var len = lines.reduce(function (m, l) { return Math.max(m, l.length); }, 0);

    var bubble = [" " + rep("_", len + 2)];
    if (lines.length === 1) {
      bubble.push("< " + pad(lines[0], len) + " >");
    } else {
      lines.forEach(function (l, i) {
        var lc = i === 0 ? "/" : (i === lines.length - 1 ? "\\" : "|");
        var rc = i === 0 ? "\\" : (i === lines.length - 1 ? "/" : "|");
        bubble.push(lc + " " + pad(l, len) + " " + rc);
      });
    }
    bubble.push(" " + rep("-", len + 2));
    var cow = [
      "        \\   ^__^",
      "         \\  (oo)\\_______",
      "            (__)\\       )\\/\\",
      "                ||----w |",
      "                ||     ||"
    ];
    T.text(bubble.join("\n"), "term-yellow");
    T.text(cow.join("\n"), "term-muted");
  }

  function sl() {
    var train = [
      "      ====        ________                ___________",
      "  _D _|  |_______/        \\__I_I_____===__|_________|",
      "   |(_)---  |   H\\________/ |   |        =|___ ___|  ",
      "   /     |  |   H  |  |     |   |         ||_| |_||  ",
      "  |      |  |   H  |__--------------------| [___] |  ",
      "  | ________|___H__/__|_____/[][]~\\_______|       |  ",
      "  |/ |   |-----------I_____I [][] []  D   |=======|__"
    ];
    var tw = train.reduce(function (m, l) { return Math.max(m, l.length); }, 0);
    var WIN = 58, offset = WIN, timer = null;
    var frame = T.frame();

    function render() {
      var rows = train.map(function (line) {
        var buf = rep(" ", WIN).split("");
        for (var i = 0; i < line.length; i++) {
          var col = offset + i;
          if (col >= 0 && col < WIN) buf[col] = line[i];
        }
        return buf.join("");
      });
      T.setHTML(frame, '<span class="term-yellow">' + T.esc(rows.join("\n")) + "</span>");
      T.scrollToEnd();
    }
    function stop() { clearInterval(timer); T.endGame(); }
    function tick() { offset -= 2; if (offset < -tw) { stop(); return; } render(); }
    function key(e) { e.preventDefault(); stop(); }
    render();
    T.captureKeys(key);
    timer = setInterval(tick, 55);
  }

  // ============================================================ REGISTRY

  var REGISTRY = [
    { name: "guess",   desc: "guess my number (1–100)",        fn: guess },
    { name: "hangman", desc: "classic word guessing",          fn: hangman },
    { name: "wordle",  desc: "5-letter word in 6 tries",       fn: wordle },
    { name: "rps",     desc: "rock · paper · scissors",        fn: rps },
    { name: "trivia",  desc: "dev trivia quiz",                fn: trivia },
    { name: "snake",   desc: "the classic — eat, don't crash", fn: snake },
    { name: "pong",    desc: "you vs. the CPU paddle",         fn: pong },
    { name: "matrix",  desc: "falling code (toy)",             fn: matrix },
    { name: "fortune", desc: "a random dev quip (toy)",        fn: fortune },
    { name: "cowsay",  desc: "cowsay <text> (toy)",            fn: cowsay },
    { name: "sl",      desc: "you typed sl, not ls (toy)",     fn: sl }
  ];

  window.Games = {
    init: function (api) { T = api; return REGISTRY; }
  };
})();
