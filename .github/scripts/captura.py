"""
Captura notícias de feeds RSS e cria GitHub Issues para revisão manual.
Roda semanalmente via GitHub Actions (captura-noticias.yml).
"""

import html as html_module
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
    {"name": "candidata",             "color": "fbca04", "description": "Notícia aguardando revisão"},
    {"name": "publicar",              "color": "0075ca", "description": "Aprovada — publicar no site"},
    {"name": "publicada",             "color": "0e8a16", "description": "Já publicada no site"},
    {"name": "ignorar",               "color": "e4e669", "description": "Descartada pelo editor"},
    # Labels para eventos e publicações manuais
    {"name": "candidato-evento",      "color": "1d76db", "description": "Evento aguardando publicação"},
    {"name": "publicado-evento",      "color": "0e8a16", "description": "Evento publicado no site"},
    {"name": "candidata-publicacao",  "color": "bfd4f2", "description": "Publicação aguardando revisão"},
    {"name": "publicada-publicacao",  "color": "0e8a16", "description": "Publicação no site"},
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
            urls.add(_normalize_url(match.group(1).strip()))
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


def clean_title(raw_title):
    """Remove o sufixo '- www.fonte.com' que o Google News adiciona ao título."""
    if " - " in raw_title:
        return raw_title.rsplit(" - ", 1)[0].strip()
    return raw_title.strip()


def extract_source(raw_title):
    """Extrai o nome da fonte do sufixo do título do Google News."""
    if " - " in raw_title:
        return raw_title.rsplit(" - ", 1)[1].strip()
    return "Web"


def extract_urls_from_raw_xml(raw_xml):
    """
    Extrai os URLs reais dos blocos CDATA do XML bruto do Google News.
    O Google News embute o link original no <description> assim:
      <description><![CDATA[<a href="URL_REAL">Título</a>...]]></description>
    O feedparser processa esse HTML e pode perder o href; por isso lemos o
    XML bruto diretamente.
    """
    real_urls = []

    # Padrão 1: CDATA explícito
    cdata_blocks = re.findall(
        r"<description><!\[CDATA\[(.*?)\]\]></description>",
        raw_xml,
        re.DOTALL,
    )
    # Padrão 2: description sem CDATA (algumas variantes do feed)
    if not cdata_blocks:
        cdata_blocks = re.findall(
            r"<description>(.*?)</description>",
            raw_xml,
            re.DOTALL,
        )

    for block in cdata_blocks:
        match = re.search(
            r'href=["\']?(https?://(?!(?:news|www)\.google\.com)[^"\'>\s]+)["\']?',
            block,
        )
        real_urls.append(match.group(1) if match else None)

    return real_urls


def _normalize_url(url):
    """
    Normaliza URLs do Google News para comparação e armazenamento.
    Converte /rss/articles/ID?oc=5 → /articles/ID (URL web canônica).

    GitHub Actions recebe 403 ao tentar seguir o redirect HTTP do Google News,
    pois os IPs dos runners são bloqueados. A conversão textual produz a URL
    web canônica que redireciona corretamente no navegador do usuário final,
    sem nenhuma requisição adicional.
    """
    url = url.split("?")[0]                              # remove ?oc=5
    url = url.replace("/rss/articles/", "/articles/")   # rss → web
    return url


def fetch_feed(feed_url, tag):
    try:
        # Busca o XML bruto para extrair URLs antes que o feedparser processe
        resp = requests.get(
            feed_url,
            timeout=15,
            headers={"User-Agent": "Mozilla/5.0 (compatible; RSS reader/1.0)"},
        )
        resp.raise_for_status()
        raw_xml = resp.text

        # Extrai URLs reais do XML bruto (índice 0 é o <description> do canal)
        real_urls = extract_urls_from_raw_xml(raw_xml)
        print(f"  URLs reais encontradas no XML: {len(real_urls)}")

        # Usa feedparser apenas para os metadados (título, data, etc.)
        d = feedparser.parse(resp.content)

        items = []
        for i, entry in enumerate(d.entries[:15]):
            raw_title = (entry.get("title") or "").strip()
            title     = clean_title(raw_title)
            source    = extract_source(raw_title)

            # O índice +1 pula o <description> do canal; garante fallback
            url_index = i + 1
            real_url  = (
                real_urls[url_index]
                if url_index < len(real_urls) and real_urls[url_index]
                else (entry.get("link") or "").strip()
            )

            # Se o CDATA não resolveu, converte para URL web canônica (sem rss/ e sem ?oc=5)
            if "news.google.com" in real_url:
                real_url = _normalize_url(real_url)
                print(f"    → URL web: {real_url[:80]}")

            summary = re.sub(
                r"<[^>]+>",
                "",
                entry.get("summary") or entry.get("description") or "",
            ).strip()
            summary = html_module.unescape(summary)
            # Remove sufixo de fonte que o Google News adiciona (" | Fonte" ou "\xa0\xa0Fonte")
            summary = re.sub(
                r"[\s ]+\|?\s*" + re.escape(source) + r"\s*$", "", summary
            ).strip()
            summary = summary[:400]

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
            norm_link = _normalize_url(item["link"])
            if norm_link not in existing_urls:
                if create_issue(item):
                    created += 1
                    existing_urls.add(norm_link)
                    print(f"  ✓ Issue criada: {item['title'][:70]}")
                else:
                    print(f"  ✗ Falha ao criar issue: {item['title'][:70]}")
                time.sleep(1)  # evita rate limit da API

    print(f"\nTotal de novas issues criadas: {created}")


if __name__ == "__main__":
    main()
