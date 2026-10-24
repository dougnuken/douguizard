"""Builds teleprompter.html from GUION.md and teleprompter.template.html.

    python3 presentations/hyperproof/build-teleprompter.py

Run it again after editing GUION.md. The template has no <html>/<head> of its
own so the same file can also be published as a Claude artifact; this adds them
for opening the page straight from disk.
"""
from pathlib import Path

here = Path(__file__).parent
guion = (here / "GUION.md").read_text(encoding="utf-8")
template = (here / "teleprompter.template.html").read_text(encoding="utf-8")
assert "</script" not in guion.lower(), "GUION.md cannot contain a closing script tag"
body = template.replace("/*GUION*/", guion)
page = (
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    "</head>\n<body>\n" + body + "\n</body>\n</html>\n"
)
(here / "teleprompter.html").write_text(page, encoding="utf-8")
print("teleprompter.html written")
