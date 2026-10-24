"""Copies the teleprompter script (GUION.md) into the speaker notes of both decks,
so the notes (N, P) and the teleprompter always say the same thing.
EN lines go to index.html, ES lines to index.es.html; the CUE stays in Spanish as a hint."""
import html, pathlib, re

here = pathlib.Path(__file__).parent
blocks = {}
for part in re.split(r"^## ", (here / "GUION.md").read_text(encoding="utf-8"), flags=re.M)[1:]:
    m = re.match(r"(\d+) ", part)
    if not m:
        continue
    b = {"cue": "", "en": [], "es": []}
    for line in part.split("# Frases de rescate")[0].splitlines()[1:]:
        line = line.strip()
        for key, pre, arrow in (("cue", "CUE:", False), ("en", "→ EN:", True), ("es", "→ ES:", True), ("en", "EN:", False), ("es", "ES:", False)):
            if line.startswith(pre):
                text = line[len(pre):].strip()
                if key == "cue":
                    b["cue"] = text
                else:
                    b[key].append(("→ " if arrow else "") + text)
                break
    blocks[int(m.group(1))] = b

def notes(b, lang):
    out = []
    if b["cue"]:
        out.append('<p class="hint">%s</p>' % html.escape(b["cue"], quote=False))
    for t in b[lang]:
        cls = ' class="hint"' if t.startswith("[DOUG") or t.startswith("[Opcional") or t.startswith("[Optional") else ""
        out.append("<p%s>%s</p>" % (cls, html.escape(t, quote=False)))
    return "\n  <aside class=\"notes\">\n    " + "\n    ".join(out) + "\n  </aside>"

for name, lang in (("index.html", "en"), ("index.es.html", "es")):
    path = here / name
    src = path.read_text(encoding="utf-8")
    i = 0
    def repl(m):
        global i
        i += 1
        return notes(blocks[i], lang) if i in blocks else m.group(0)
    src = re.sub(r"\n\s*<aside class=\"notes\">.*?</aside>", repl, src, flags=re.S)
    path.write_text(src, encoding="utf-8")
    print(name, i, "slides,", len(blocks), "script blocks")
