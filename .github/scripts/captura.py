"""
Captura notícias de feeds RSS e cria GitHub Issues para revisão manual.
Roda semanalmente via GitHub Actions (captura-noticias.yml).
"""

import os
import re
import time
from datetime import datetime

import feedparser
import requests

GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
GITHUB_REPO = os.environ["GITHUB_REPO"]

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

# ── Feeds RSS ─────────────────────────────────────────────────────────────────
FEEDS = [
    {
        "url": "https://news.google.com/rss/search?q=biblioteconomia+jur%C3%ADdica&hl=pt-BR&gl=BR&ceid=BR:pt",
        "tag": "Biblioteconomia",
    },
    {
        "url": "https://news.google.com/rss/search?q=ENABIJUD+OR+Bibliomemojus&hl=pt-BR&gl=BR&ceid=BR:pt",
        "tag": "Institucional",
    },
    {
        "url": "https://news.google.com/rss/search?q=%22biblioteca+judici%C3%A1ria%22&hl=pt-BR&gl=BR&ceid=BR:pt",
        "tag": "Biblioteca Judiciária",
    },
    {
        "url": "https://news.google.com/rss/search?q=%22gest%C3%A3o+documental%22+judici%C3%A1rio&hl=pt-BR&gl=BR&ceid=BR:pt",
        "tag": "Gestão Documental",
    },
    {
        "url": "https://news.google.com/rss/search?q=ciencia+informacao+juridica&hl=pt-BR&gl=BR&ceid=BR:pt",
        "tag": "Ciência da Informação",
    },
]

# Filtra itens claramente fora do escopo
REQUIRED_KEYWORDS = [
    "biblioteca", "judici", "bibliomemojus", "enabijud",
    "biblioteconomia", "tribunal", "cnj", "gestão documental",
    "ciência da informação", "poder judiciário", "memojus",
]

MONTHS_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

LABELS = [
    {"name": "candidata",  "color": "fbca04", "description": "Notícia aguardando revisão"},
    {"name": "publicar",   "color": "0075ca", "description": "Aprovada — publicar no site"},
    {"name": "publicada",  "color": "0e8a16", "description": "Já publicada no site"},
    {"name": "ignorar",    "color": "e4e669", "description": "Descartada pelo editor"},
]


def ensure_labels():
    url = f"https://api.github.com/repos/{GITHUB_REPO}/labels"
    existing = {l["name"] for l in requests.get(url, headers=HEADERS).json()}
    for label in LABELS:
        if label["name"] not in existing:
            requests.post(url, headers=HEADERS, json=label)


def get_existing_urls():
    """Busca URLs já registradas em issues (abertas e fechadas) para evitar duplicatas."""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
    params = {"state": "all", "labels": "candidata", "per_page": 100}
    resp = requests.get(url, headers=HEADERS, params=params)
    issues = resp.json() if resp.status_code == 200 else []

    urls = set()
    for issue in issues:
        body = issue.get("body") or ""
        match = re.search(r"\*\*Link:\*\*\s*(https?://\S+)", body)
        if match:
            urls.add(match.group(1).strip())
    return urls


def is_relevant(title, summary):
    text = (title + " " + summary).lower()
    return any(kw in text for kw in REQUIRED_KEYWORDS)


def parse_date(entry):
    try:
        t = entry.published_parsed
        return f"{MONTHS_PT[t.tm_mon - 1]} {t.tm_year}"
    except Exception:
        return datetime.now().strftime(f"{MONTHS_PT[datetime.now().month - 1]} %Y")


def extract_real_url(entry):
    """Extrai o URL original do artigo a partir do HTML do summary do Google News."""
    summary_html = entry.get("summary") or entry.get("description") or ""
    # O Google News embute o link real como primeiro <a href="..."> no summary
    matches = re.findall(r'href="(https?://[^"]+)"', summary_html)
    for url in matches:
        if "google.com" not in url and "googleapis.com" not in url:
            return url
    # Fallback: o entry.link do Google News (URL de rastreamento)
    return (entry.get("link") or "").strip()


def clean_title(raw_title):
    """Remove o sufixo '- www.fonte.com' que o Google News adiciona ao título."""
    if " - " in raw_title:
        return raw_title.rsplit(" - ", 1)[0].strip()
    return raw_title.strip()


def extract_source(raw_title):
    """Extrai o nome da fonte do sufixo do título do Google News."""
    if " - " in raw_title:
        return raw_title.rsplit(" - ", 1)[1].strip()
    # Tenta pegar do campo source do feedparser
    return "Web"


def fetch_feed(feed_url, tag):
    try:
        d = feedparser.parse(feed_url)
        items = []
        for entry in d.entries[:15]:
            raw_title = (entry.get("title") or "").strip()
            title     = clean_title(raw_title)
            source    = extract_source(raw_title)
            real_url  = extract_real_url(entry)
            summary   = re.sub(r"<[^>]+>", "", entry.get("summary") or entry.get("description") or "").strip()
            # Remove o trecho "SourceName" que aparece no texto do summary
            summary   = re.sub(r"\s*\|\s*" + re.escape(source) + r"\s*$", "", summary).strip()
            summary   = summary[:400]

            if title and real_url and is_relevant(title, summary):
                items.append({
                    "title":    title,
                    "link":     real_url,
                    "source":   source,
                    "summary":  summary,
                    "tag":      tag,
                    "pub_date": parse_date(entry),
                })
        return items
    except Exception as e:
        print(f"Erro no feed {tag}: {e}")
        return []


def create_issue(item):
    body = f"""\
**Título:** {item['title']}
**Data:** {item['pub_date']}
**Tag:** {item['tag']}
**Resumo:** {item['summary']}
**Link:** {item['link']}
**Fonte:** {item['source']}

---
> Para **publicar** no site, adicione a label `publicar`.
> Para **descartar**, adicione a label `ignorar` e feche a issue.
> Você pode editar o Título, Tag e Resumo acima antes de publicar."""

    resp = requests.post(
        f"https://api.github.com/repos/{GITHUB_REPO}/issues",
        headers=HEADERS,
        json={
            "title":  f"[Notícia] {item['title'][:100]}",
            "body":   body,
            "labels": ["candidata"],
        },
    )
    return resp.status_code == 201


def main():
    print("Garantindo labels...")
    ensure_labels()

    print("Buscando URLs já processadas...")
    existing_urls = get_existing_urls()
    print(f"  {len(existing_urls)} URLs já registradas")

    created = 0
    for feed in FEEDS:
        items = fetch_feed(feed["url"], feed["tag"])
        print(f"Feed [{feed['tag']}]: {len(items)} item(s) relevante(s)")

        for item in items:
            if item["link"] not in existing_urls:
                if create_issue(item):
                    created += 1
                    existing_urls.add(item["link"])
                    print(f"  ✓ Issue criada: {item['title'][:70]}")
                else:
                    print(f"  ✗ Falha ao criar issue: {item['title'][:70]}")
                time.sleep(1)  # evita rate limit da API

    print(f"\nTotal de novas issues criadas: {created}")


if __name__ == "__main__":
    main()
