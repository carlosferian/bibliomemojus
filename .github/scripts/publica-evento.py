"""
Cria content/eventos/*.md a partir de uma GitHub Issue preenchida via formulário.
Disparado por publica-evento.yml quando 'publicar' é adicionado
em issues com label 'candidato-evento'.
"""

import os
import re
from pathlib import Path

import requests

GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
GITHUB_REPO  = os.environ["GITHUB_REPO"]
ISSUE_BODY   = os.environ["ISSUE_BODY"]
ISSUE_NUMBER = os.environ["ISSUE_NUMBER"]

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

LABELS = [
    {"name": "candidato-evento", "color": "0075ca", "description": "Evento aguardando publicação"},
    {"name": "publicado-evento",  "color": "0e8a16", "description": "Evento publicado no site"},
]


def ensure_labels():
    url = f"https://api.github.com/repos/{GITHUB_REPO}/labels"
    existing = {l["name"] for l in requests.get(url, headers=HEADERS).json()}
    for label in LABELS:
        if label["name"] not in existing:
            requests.post(url, headers=HEADERS, json=label)


def parse_form(body):
    """Parse GitHub issue form body (### Heading\\n\\nValue)."""
    fields = {}
    parts = re.split(r'^###\s+(.+)$', body, flags=re.MULTILINE)
    it = iter(parts[1:])
    for heading in it:
        value = next(it, '').strip()
        fields[heading.strip()] = value
    return fields


def next_ordem():
    return len(list(Path("content/eventos").glob("*.md"))) + 1


def slugify_tag(tag):
    return re.sub(r'[^\w]', '-', tag.lower()).strip('-')


def finalize_issue():
    base = f"https://api.github.com/repos/{GITHUB_REPO}/issues/{ISSUE_NUMBER}"
    requests.post(f"{base}/labels", headers=HEADERS, json={"labels": ["publicado-evento"]})
    requests.patch(base, headers=HEADERS, json={"state": "closed", "state_reason": "completed"})
    requests.post(f"{base}/comments", headers=HEADERS, json={
        "body": (
            "✅ **Evento publicado no site.**\n\n"
            "O Netlify irá fazer o deploy automaticamente em instantes."
        ),
    })


def main():
    ensure_labels()
    fields = parse_form(ISSUE_BODY)
    print(f"Campos extraídos: {list(fields.keys())}")

    numero    = fields.get("Número da edição", "").strip()
    tag       = fields.get("Tipo", "").strip()
    titulo    = fields.get("Título", "").strip()
    descricao = fields.get("Descrição", "").strip()
    url       = fields.get("Link do evento", "").strip()

    if not titulo or not url:
        print(f"ERRO: campos obrigatórios ausentes. Campos recebidos: {list(fields.keys())}")
        raise SystemExit(1)

    n = int(numero) if numero.isdigit() else next_ordem()
    tag_slug = slugify_tag(tag or "evento")
    filename = f"{n:02d}-{tag_slug}.md"
    filepath = Path("content/eventos") / filename

    counter = 1
    while filepath.exists():
        filepath = Path("content/eventos") / f"{n:02d}-{tag_slug}-{counter}.md"
        counter += 1

    tag_esc       = tag.replace('"', '\\"')
    titulo_esc    = titulo.replace('"', '\\"')
    descricao_esc = descricao.replace('"', '\\"')

    content = f"""\
---
numero: "{numero}"
tag: "{tag_esc}"
titulo: "{titulo_esc}"
descricao: "{descricao_esc}"
url: "{url}"
ordem: {n}
---
"""
    filepath.write_text(content, encoding="utf-8")
    print(f"Arquivo criado: {filepath}")
    finalize_issue()
    print("Concluído.")


if __name__ == "__main__":
    main()
