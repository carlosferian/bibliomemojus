"""
Lê o corpo de uma GitHub Issue e cria o arquivo Markdown em content/noticias/.
Chamado pelo workflow publica-noticia.yml quando a label 'publicar' é adicionada.
"""

import os
import re
import unicodedata
from datetime import datetime
from pathlib import Path

import requests

GITHUB_TOKEN  = os.environ["GITHUB_TOKEN"]
GITHUB_REPO   = os.environ["GITHUB_REPO"]
ISSUE_BODY    = os.environ["ISSUE_BODY"]
ISSUE_NUMBER  = os.environ["ISSUE_NUMBER"]

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text)
    return text[:50].strip("-")


def parse_issue(body):
    patterns = {
        "titulo":       r"\*\*Título:\*\*\s*(.+)",
        "data":         r"\*\*Data:\*\*\s*(.+)",
        "tag":          r"\*\*Tag:\*\*\s*(.+)",
        "resumo":       r"\*\*Resumo:\*\*\s*(.+)",
        "link_externo": r"\*\*Link:\*\*\s*(https?://\S+)",
    }
    fields = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, body, re.MULTILINE)
        fields[key] = match.group(1).strip() if match else ""
    return fields


def next_ordem():
    files = list(Path("content/noticias").glob("*.md"))
    return len(files) + 1


def create_markdown(fields):
    now = datetime.now()
    slug = slugify(fields["titulo"])
    filename = f"{now.strftime('%Y-%m')}-{slug}.md"
    filepath = Path("content/noticias") / filename

    # Evita sobrescrever arquivo existente
    counter = 1
    while filepath.exists():
        filepath = Path("content/noticias") / f"{now.strftime('%Y-%m')}-{slug}-{counter}.md"
        counter += 1

    # Escapa aspas no resumo para não quebrar o YAML
    titulo  = fields["titulo"].replace('"', '\\"')
    resumo  = fields["resumo"].replace('"', '\\"')
    tag     = fields["tag"].replace('"', '\\"')
    data    = fields["data"].replace('"', '\\"')

    content = f"""\
---
titulo: "{titulo}"
data: "{data}"
tag: "{tag}"
resumo: "{resumo}"
link_interno: ""
link_externo: "{fields['link_externo']}"
ordem: {next_ordem()}
---
"""
    filepath.write_text(content, encoding="utf-8")
    print(f"Arquivo criado: {filepath}")
    return str(filepath)


def finalize_issue():
    base = f"https://api.github.com/repos/{GITHUB_REPO}/issues/{ISSUE_NUMBER}"

    requests.post(f"{base}/labels", headers=HEADERS, json={"labels": ["publicada"]})

    requests.patch(base, headers=HEADERS, json={
        "state": "closed",
        "state_reason": "completed",
    })

    requests.post(f"{base}/comments", headers=HEADERS, json={
        "body": (
            "✅ **Notícia publicada no site.**\n\n"
            "O Netlify irá fazer o deploy automaticamente em instantes."
        ),
    })


def main():
    print(f"Processando issue #{ISSUE_NUMBER}...")
    fields = parse_issue(ISSUE_BODY)

    if not fields.get("titulo"):
        print("ERRO: não foi possível ler o corpo da issue. Verifique o formato.")
        raise SystemExit(1)

    print(f"Título: {fields['titulo']}")
    create_markdown(fields)
    finalize_issue()
    print("Concluído.")


if __name__ == "__main__":
    main()
