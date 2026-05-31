/* =============================================================================
   windows.js — minimal window manager. No dependencies.
   -----------------------------------------------------------------------------
   Windows are *registered* with a builder (title + a function that returns the
   body node + default geometry), then opened on demand. main.js does the
   registering; the dock and terminal call open()/toggle().

   Public API (window.WM):
     WM.register(id, { title, build, defaults, className })
     WM.open(id)      -> create if needed, un-minimize, focus
     WM.close(id)
     WM.toggle(id)
     WM.isOpen(id)
   ========================================================================== */
(function () {
  "use strict";

  var desktop = null;
  var registry = {};          // id -> { title, build, defaults, className }
  var open = {};              // id -> window element (only while open/minimized)
  var zCounter = 10;
  var spawnOffset = 0;

  var isMobile = function () {
    return window.matchMedia("(max-width: 720px)").matches;
  };

  /* ---- dock sync ---------------------------------------------------------- */
  function setDockState(id, on) {
    var btn = document.querySelector('.dock__btn[data-launch="' + id + '"]');
    if (btn) btn.classList.toggle("is-open", !!on);
  }

  /* ---- focus -------------------------------------------------------------- */
  function focus(el) {
    Object.keys(open).forEach(function (k) {
      open[k].classList.remove("is-focused");
    });
    el.classList.add("is-focused");
    el.style.zIndex = String(++zCounter);
  }

  /* ---- dragging (pointer based, titlebar handle) -------------------------- */
  function makeDraggable(el, handle) {
    var startX, startY, originX, originY, dragging = false;

    handle.addEventListener("pointerdown", function (e) {
      if (isMobile() || el.classList.contains("is-maximized")) return;
      if (e.target.closest(".win-ctrl")) return; // don't drag from buttons
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      startX = e.clientX; startY = e.clientY;
      var r = el.getBoundingClientRect();
      originX = r.left; originY = r.top;
      focus(el);
      e.preventDefault();
    });

    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var nx = originX + (e.clientX - startX);
      var ny = originY + (e.clientY - startY);
      // keep titlebar reachable: clamp within viewport-ish bounds
      var maxX = window.innerWidth - 80;
      var maxY = window.innerHeight - 60;
      nx = Math.min(Math.max(nx, -el.offsetWidth + 120), maxX);
      ny = Math.min(Math.max(ny, 34), maxY); // 34 = status bar height
      el.style.left = nx + "px";
      el.style.top = ny + "px";
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  }

  /* ---- resize handle ------------------------------------------------------ */
  function makeResizable(el, handle) {
    var startX, startY, startW, startH, resizing = false;
    handle.addEventListener("pointerdown", function (e) {
      if (isMobile()) return;
      resizing = true;
      handle.setPointerCapture(e.pointerId);
      startX = e.clientX; startY = e.clientY;
      startW = el.offsetWidth; startH = el.offsetHeight;
      focus(el);
      e.preventDefault();
      e.stopPropagation();
    });
    handle.addEventListener("pointermove", function (e) {
      if (!resizing) return;
      el.style.width = Math.max(260, startW + (e.clientX - startX)) + "px";
      el.style.height = Math.max(120, startH + (e.clientY - startY)) + "px";
    });
    function end(e) {
      if (!resizing) return;
      resizing = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  /* ---- build a window element -------------------------------------------- */
  function build(id) {
    var def = registry[id];
    var d = def.defaults || {};

    var el = document.createElement("section");
    el.className = "window window--animate" + (def.className ? " " + def.className : "");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", def.title);
    el.dataset.win = id;

    // geometry (ignored on mobile via CSS)
    if (!isMobile()) {
      el.style.width = (d.w || 420) + "px";
      if (d.h) el.style.height = d.h + "px";
      var ox = (d.x != null ? d.x : 60) + spawnOffset;
      var oy = (d.y != null ? d.y : 50) + spawnOffset;
      el.style.left = ox + "px";
      el.style.top = oy + "px";
      spawnOffset = (spawnOffset + 26) % 120;
    }

    // titlebar
    var bar = document.createElement("div");
    bar.className = "window__titlebar";
    bar.innerHTML =
      '<span class="window__title">' + def.title + "</span>" +
      '<span class="window__controls">' +
        '<button class="win-ctrl win-ctrl--min" title="Minimize" aria-label="Minimize">_</button>' +
        '<button class="win-ctrl win-ctrl--max" title="Maximize" aria-label="Maximize">□</button>' +
        '<button class="win-ctrl win-ctrl--close" title="Close" aria-label="Close">✕</button>' +
      "</span>";

    // body
    var body = document.createElement("div");
    body.className = "window__body";
    var content = def.build();
    if (typeof content === "string") body.innerHTML = content;
    else if (content) body.appendChild(content);

    // resize handle
    var resize = document.createElement("div");
    resize.className = "window__resize";
    resize.setAttribute("aria-hidden", "true");

    el.appendChild(bar);
    el.appendChild(body);
    el.appendChild(resize);

    // controls
    bar.querySelector(".win-ctrl--close").addEventListener("click", function () { close(id); });
    bar.querySelector(".win-ctrl--min").addEventListener("click", function () {
      el.classList.add("is-minimized");
    });
    bar.querySelector(".win-ctrl--max").addEventListener("click", function () {
      el.classList.toggle("is-maximized");
      focus(el);
    });

    el.addEventListener("pointerdown", function () { focus(el); }, true);
    makeDraggable(el, bar);
    makeResizable(el, resize);

    return el;
  }

  /* ---- public ------------------------------------------------------------- */
  function open_(id) {
    if (!registry[id]) { console.warn("[WM] no window registered:", id); return; }
    var el = open[id];
    if (el) {
      el.classList.remove("is-minimized");
      focus(el);
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return el;
    }
    el = build(id);
    open[id] = el;
    desktop.appendChild(el);
    focus(el);
    setDockState(id, true);
    // notify (e.g. terminal/gui mode)
    document.dispatchEvent(new CustomEvent("wm:open", { detail: { id: id, el: el } }));
    return el;
  }

  function close(id) {
    var el = open[id];
    if (!el) return;
    el.remove();
    delete open[id];
    setDockState(id, false);
    document.dispatchEvent(new CustomEvent("wm:close", { detail: { id: id } }));
  }

  function toggle(id) {
    if (open[id] && !open[id].classList.contains("is-minimized")) close(id);
    else open_(id);
  }

  window.WM = {
    register: function (id, def) { registry[id] = def; },
    open: open_,
    close: close,
    toggle: toggle,
    isOpen: function (id) { return !!open[id]; },
    focus: function (id) { if (open[id]) focus(open[id]); },
    _init: function () { desktop = document.getElementById("desktop"); },
  };
})();
