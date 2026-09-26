"""Show how pages look in search results and link previews, from the built site's own metadata.

    npm run build && python3 scripts/preview_share.py [out.html]

Truncation limits are approximations of what search engines and social apps display
(title ~60 characters, description ~155); the real check after launch is each platform's
own tool (listed at the bottom of the generated page).
"""
import html
import re
import sys
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / "dist"
SITE = "https://corneliucroitoru.com"
PAGES = ["", "cv/", "about/", "writing/librarian-pattern/", "photography/japan/"]
TITLE_LIMIT = 60
DESCRIPTION_LIMIT = 155


def meta(page_html, attr, name):
    match = re.search(rf'<meta {attr}="{re.escape(name)}" content="([^"]*)"', page_html)
    return html.unescape(match.group(1)) if match else ""


def cut(text, limit):
    return text if len(text) <= limit else text[: limit - 1].rsplit(" ", 1)[0] + " …"


def local_image(url):
    # Point at the built file so the preview works before the site is live.
    return str(DIST / url.removeprefix(SITE).lstrip("/"))


def card(page):
    source = (DIST / page / "index.html").read_text()
    title = html.unescape(re.search(r"<title>(.*?)</title>", source).group(1))
    description = meta(source, "name", "description")
    og_title = meta(source, "property", "og:title")
    image = local_image(meta(source, "property", "og:image"))
    url = f"{SITE}/{page}"
    crumbs = " › ".join(["corneliucroitoru.com"] + [p for p in page.split("/") if p])
    esc = html.escape
    return f"""
<section>
  <h2>/{esc(page)}</h2>
  <div class="grid">
    <div><p class="label">Search result · Google-style · title {len(title)}/{TITLE_LIMIT}, description {len(description)}/{DESCRIPTION_LIMIT}</p>
      <div class="serp"><div class="site"><span class="fav">CC</span><div><b>Corneliu Croitoru</b><br><small>{esc(crumbs)}</small></div></div>
      <a class="serp-title">{esc(cut(title, TITLE_LIMIT))}</a><p>{esc(cut(description, DESCRIPTION_LIMIT))}</p></div>
      <p class="label">Search result · Bing-style</p>
      <div class="serp bing"><a class="serp-title">{esc(cut(title, 65))}</a><small class="green">{esc(url)}</small><p>{esc(cut(description, 160))}</p></div>
    </div>
    <div><p class="label">Post preview · LinkedIn-style</p>
      <div class="social"><img src="{esc(image)}" alt=""><div class="body"><b>{esc(cut(og_title, 70))}</b><small>corneliucroitoru.com</small></div></div>
      <p class="label">Message preview · Slack / WhatsApp-style</p>
      <div class="chat"><small>Corneliu Croitoru</small><b>{esc(og_title)}</b><p>{esc(cut(description, 120))}</p><img src="{esc(image)}" alt=""></div>
    </div>
  </div>
</section>"""


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/share-preview.html")
    body = "".join(card(p) for p in PAGES)
    out.write_text(f"""<!doctype html><meta charset="utf-8"><title>Share previews</title>
<style>
body{{margin:0;padding:32px 16px;background:#f3f3f1;font:15px/1.45 system-ui,sans-serif;color:#202124}}
main{{max-width:1100px;margin:auto}} h1{{margin:0 0 4px}} h2{{margin:40px 0 12px;font-size:16px;font-family:ui-monospace,monospace}}
.grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}} @media(max-width:800px){{.grid{{grid-template-columns:1fr}}}}
.label{{margin:14px 0 6px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.05em}}
.serp{{background:#fff;padding:16px 18px;border-radius:8px}} .serp p{{margin:4px 0 0;color:#4d5156;font-size:14px}}
.site{{display:flex;gap:10px;align-items:center;font-size:13px;margin-bottom:4px}} .site small{{color:#4d5156}}
.fav{{width:26px;height:26px;border-radius:50%;background:#191919;color:#fff;font:700 11px Georgia;display:grid;place-items:center}}
.serp-title{{display:block;color:#1a0dab;font-size:20px;line-height:1.3}} .bing .serp-title{{color:#174ae4;font-size:19px}} .green{{color:#006d21;font-size:13px}}
.social{{background:#fff;border-radius:8px;overflow:hidden;border:1px solid #ddd}} .social img{{display:block;width:100%;aspect-ratio:1.91/1;object-fit:cover}}
.social .body{{padding:10px 14px;display:flex;flex-direction:column;gap:2px}} .social small{{color:#666}}
.chat{{background:#fff;border-left:4px solid #ccc;padding:8px 12px;border-radius:4px;display:flex;flex-direction:column;gap:2px}}
.chat img{{max-width:360px;border-radius:6px;margin-top:6px}} .chat p{{margin:0;color:#444;font-size:14px}}
footer{{margin-top:48px;font-size:14px}}
</style><main><h1>Share previews</h1><p>Generated from the built site's metadata. Approximate renderings; no platform branding.</p>{body}
<footer><h2>After launch, check with each platform's own tool</h2><ul>
<li>LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/</li>
<li>Google Rich Results Test: https://search.google.com/test/rich-results</li>
<li>Schema validator: https://validator.schema.org/</li>
<li>Google Search Console and Bing Webmaster Tools: submit /sitemap-index.xml</li>
<li>Any card preview: https://www.opengraph.xyz/</li></ul></footer></main>""")
    print(out)


if __name__ == "__main__":
    main()
