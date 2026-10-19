"""Genera el CV ATS en blanco y negro (con y sin foto) desde cv-ats.template.html.

    python3 docs/cv/build.py

Incrusta Archivo y Geist Mono como TTF estáticos (las variables salen como Type 3
en el PDF, y algunos ATS no leen Type 3) y la foto en escala de grises.
Imprime con la Chromium de Playwright o la que diga CHROME.
"""
import base64, os, re, subprocess, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium")
FONTS = "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Geist+Mono:wght@400;500"


def fonts():
    # Sin user-agent, Google Fonts devuelve TTF estáticos por peso.
    css = urllib.request.urlopen(FONTS).read().decode()
    out = []
    for block in re.findall(r"@font-face \{.*?\}", css, re.S):
        url = re.search(r"url\((https://[^)]+\.ttf)\)", block).group(1)
        data = base64.b64encode(urllib.request.urlopen(url).read()).decode()
        out.append(re.sub(r"url\(https://[^)]+\)", f"url(data:font/ttf;base64,{data})", block))
    return "\n".join(out)


def pages(pdf):
    return len(re.findall(rb"/Type\s*/Page[^s]", open(pdf, "rb").read()))


html = open(f"{HERE}/cv-ats.template.html").read().replace("/*FONTS*/", fonts())
img = base64.b64encode(open(f"{HERE}/portrait-cv.jpg", "rb").read()).decode()
photo = f'<img class="photo" src="data:image/jpeg;base64,{img}" alt="">'
variants = {
    "Doug-Vargas-CV": html.replace("<!--PHOTO-->", photo),
    "Doug-Vargas-CV-sin-foto": html.replace("  <!--PHOTO-->\n", ""),
}
tmp = os.path.join(HERE, ".build.html")
for name, page in variants.items():
    open(tmp, "w").write(page)
    pdf = f"{HERE}/{name}.pdf"
    args = [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={pdf}"]
    if hasattr(os, "getuid") and os.getuid() == 0:
        args.append("--no-sandbox")
    subprocess.run(args + ["file://" + tmp], check=True, capture_output=True)
    n = pages(pdf)
    print(f"{name}.pdf: {n} páginas")
    if n > 2:
        print("  AVISO: pasó de 2 páginas")
os.remove(tmp)
