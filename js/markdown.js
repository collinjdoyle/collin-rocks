// Small Markdown -> HTML, shared by the site (window.miniMarkdown) and tools/build-writeups.js (require).
// Headings, bold/italic/code, fences, links, lists (one nested level), tables, quotes.
(function (root) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function miniMarkdown(md) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var out = [], i = 0;

    function inline(s) {
      return esc(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, href) {
          return href.charAt(0) === "#"
            ? '<a href="' + href + '">' + text + "</a>"
            : '<a href="' + href + '" target="_blank" rel="noopener">' + text + "</a>";
        });
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
      if (/^\|/.test(ln)) {                         // table (first row = header)
        var rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        var cells = function (r) {
          return r.replace(/^\||\|\s*$/g, "").split("|").map(function (c) { return c.trim(); });
        };
        var bodyRows = rows.filter(function (r, k) { return k > 0 && !/^\|[\s:|-]+$/.test(r.trim()); });
        out.push('<div class="table-wrap"><table><thead><tr>' +
          cells(rows[0]).map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          bodyRows.map(function (r) {
            return "<tr>" + cells(r).map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>");
        continue;
      }
      if (/^[-*]\s+/.test(ln)) {                    // unordered list, one level of nesting
        var items = [];
        while (i < lines.length) {
          if (/^[-*]\s+/.test(lines[i])) {
            items.push({ text: inline(lines[i].replace(/^[-*]\s+/, "")), sub: [], more: [] }); i++;
          } else if (items.length && /^\s{2,}[-*]\s+/.test(lines[i])) {
            items[items.length - 1].sub.push(inline(lines[i].replace(/^\s+[-*]\s+/, ""))); i++;
          } else if (items.length && /^\s{2,}\S/.test(lines[i])) {
            items[items.length - 1].more.push(inline(lines[i].trim())); i++;
          } else if (/^\s*$/.test(lines[i]) && i + 1 < lines.length &&
                     /^\s{2,}\S/.test(lines[i + 1])) {
            i++;                                     // blank line before an indented continuation
          } else break;
        }
        out.push("<ul>" + items.map(function (it) {
          return "<li>" + it.text +
            (it.sub.length ? "<ul>" + it.sub.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" : "") +
            (it.more.length ? "<p>" + it.more.join(" ") + "</p>" : "") + "</li>";
        }).join("") + "</ul>");
        continue;
      }
      if (/^\s*$/.test(ln)) { i++; continue; }      // blank

      var para = [ln]; i++;                          // paragraph
      while (i < lines.length && !/^\s*$/.test(lines[i]) &&
             !/^(#{1,4}\s|>\s?|[-*]\s|```|\|)/.test(lines[i])) { para.push(lines[i]); i++; }
      out.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return out.join("\n");
  }

  if (typeof module !== "undefined" && module.exports) module.exports = miniMarkdown;
  else root.miniMarkdown = miniMarkdown;
})(this);
