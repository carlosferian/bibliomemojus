"""
Cria content/publicacoes/*.md a partir de uma GitHub Issue preenchida via formulário.
Disparado por publica-publicacao.yml quando 'publicar' é adicionado
em issues com label 'candidata-publicacao'.
"""

import os
import re
import unicodedata
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
    {"name": "candidata-publicacao",  "color": "e4e669", "description": "Publicação aguardando revisão"},
    {"name": "publicada-publicacao",  "color": "0e8a16", "description": "Publicação no site"},
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


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text)
    return text[:40].strip("-")


def next_ordem():
    return len(list(Path("content/publicacoes").glob("*.md"))) + 1


def extract_icone(raw):
    """Extract just the emoji from e.g. '📊 Diagnóstico / Dados'."""
    parts = raw.strip().split()
    return parts[0] if parts else "📄"


def finalize_issue():
    base = f"https://api.github.com/repos/{GITHUB_REPO}/issues/{ISSUE_NUMBER}"
    requests.post(f"{base}/labels", headers=HEADERS, json={"labels": ["publicada-publicacao"]})
    requests.patch(base, headers=HEADERS, json={"state": "closed", "state_reason": "completed"})
    requests.post(f"{base}/comments", headers=HEADERS, json={
        "body": (
            "✅ **Publicação adicionada ao site.**\n\n"
            "O Netlify irá fazer o deploy automaticamente em instantes."
        ),
    })


def main():
    ensure_labels()
    fields = parse_form(ISSUE_BODY)
    print(f"Campos extraídos: {list(fields.keys())}")

    icone_raw  = fields.get("Ícone", "")
    icone      = extract_icone(icone_raw)
    tag        = fields.get("Categoria", "").strip()
    titulo     = fields.get("Título", "").strip()
    descricao  = fields.get("Descrição", "").strip()
    link       = fields.get("Link", "").strip()
    link_texto = fields.get("Texto do botão", "").strip()

    if not titulo or not link:
        print(f"ERRO: campos obrigatórios ausentes. Campos recebidos: {list(fields.keys())}")
        raise SystemExit(1)

    ordem = next_ordem()
    slug = slugify(titulo)
    filename = f"{ordem:02d}-{slug}.md"
    filepath = Path("content/publicacoes") / filename

    counter = 1
    while filepath.exists():
        filepath = Path("content/publicacoes") / f"{ordem:02d}-{slug}-{counter}.md"
        counter += 1

    titulo_esc     = titulo.replace('"', '\\"')
    descricao_esc  = descricao.replace('"', '\\"')
    link_texto_esc = link_texto.replace('"', '\\"')
    tag_esc        = tag.replace('"', '\\"')

    content = f"""\
---
icone: "{icone}"
titulo: "{titulo_esc}"
descricao: "{descricao_esc}"
link: "{link}"
link_texto: "{link_texto_esc}"
tag: "{tag_esc}"
ordem: {ordem}
---
"""
    filepath.write_text(content, encoding="utf-8")
    print(f"Arquivo criado: {filepath}")
    finalize_issue()
    print("Concluído.")


if __name__ == "__main__":
    main()
