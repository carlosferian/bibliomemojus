"""
Lê o corpo de uma GitHub Issue e cria/atualiza o arquivo Markdown em content/membros/.
Chamado pelo workflow publica-membro.yml quando a label 'publicar-membro' é adicionada.

Lógica de atualização: o nome do arquivo é derivado de GT + nome do membro.
Publicar um membro já existente com o mesmo nome SOBRESCREVE o registro,
permitindo atualizar dados ou desativar (ativo: false) sem excluir o arquivo.
"""

import html as html_module
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

GT_NAMES = {
    "1": "Gestão",
    "2": "Memória",
    "3": "Redes",
    "4": "Biblioteca Digital",
    "5": "Inovação",
    "6": "Agenda 2030",
    "7": "Capacitação",
}

_FORM_EMPTY = {"_No response_", "_Sem resposta_"}

MEMBER_LABELS = [
    {"name": "candidata-membro",  "color": "d93f0b", "description": "Membro aguardando publicação"},
    {"name": "publicar-membro",   "color": "0075ca", "description": "Aprovado — publicar membro no site"},
    {"name": "publicada-membro",  "color": "0e8a16", "description": "Membro publicado no site"},
]


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text)
    return text[:50].strip("-")


def _clean(value):
    return "" if value.strip() in _FORM_EMPTY else value


def _yaml_sq(value):
    return "'" + str(value).replace("'", "''") + "'"


def ensure_labels():
    url = f"https://api.github.com/repos/{GITHUB_REPO}/labels"
    existing = {l["name"] for l in requests.get(url, headers=HEADERS).json() if isinstance(l, dict)}
    for label in MEMBER_LABELS:
        if label["name"] not in existing:
            requests.post(url, headers=HEADERS, json=label)


def parse_issue(body):
    raw = {}
    parts = re.split(r'^###\s+(.+)$', body, flags=re.MULTILINE)
    it = iter(parts[1:])
    for heading in it:
        raw[heading.strip()] = _clean(html_module.unescape(next(it, "").strip()))
    return {
        "nome":        raw.get("Nome completo", ""),
        "cargo":       raw.get("Cargo", ""),
        "gt":          re.sub(r"[^\d]", "", raw.get("Grupo de Trabalho", "")),
        "instituicao": raw.get("Instituição", ""),
        "mini_bio":    raw.get("Mini currículo", ""),
        "linkedin":    raw.get("LinkedIn (opcional)", ""),
        "foto":        raw.get("URL da foto (opcional)", ""),
        "ativo":       raw.get("Ativo na coordenação?", "Sim"),
    }


def next_ordem():
    return len(list(Path("content/membros").glob("*.md"))) + 1


def create_markdown(fields):
    gt_num = fields["gt"] or "0"
    slug   = slugify(fields["nome"])
    filepath = Path("content/membros") / f"gt{gt_num}-{slug}.md"
    is_update = filepath.exists()
    ativo = fields["ativo"].strip().lower() not in ("não", "nao", "no", "false")

    # Preserva a ordem original; só atribui nova para membros novos
    ordem = next_ordem()
    if is_update:
        m = re.search(r"^ordem:\s*(\d+)", filepath.read_text(encoding="utf-8"), re.MULTILINE)
        if m:
            ordem = int(m.group(1))

    gt_nome = GT_NAMES.get(gt_num, "")

    content = f"""\
---
nome: {_yaml_sq(fields['nome'])}
cargo: {_yaml_sq(fields['cargo'])}
gt: {gt_num}
gt_nome: {_yaml_sq(gt_nome)}
instituicao: {_yaml_sq(fields['instituicao'])}
mini_bio: {_yaml_sq(fields['mini_bio'])}
linkedin: {_yaml_sq(fields['linkedin'])}
foto: {_yaml_sq(fields['foto'])}
ativo: {'true' if ativo else 'false'}
ordem: {ordem}
---
"""
    filepath.write_text(content, encoding="utf-8")
    print(f"Arquivo {'atualizado' if is_update else 'criado'}: {filepath}")
    return str(filepath)


def finalize_issue():
    base = f"https://api.github.com/repos/{GITHUB_REPO}/issues/{ISSUE_NUMBER}"
    requests.post(f"{base}/labels", headers=HEADERS, json={"labels": ["publicada-membro"]})
    requests.patch(base, headers=HEADERS, json={"state": "closed", "state_reason": "completed"})
    requests.post(f"{base}/comments", headers=HEADERS, json={
        "body": (
            "✅ **Membro atualizado no site.**\n\n"
            "O Netlify irá fazer o deploy automaticamente em instantes.\n\n"
            "> Para atualizar novamente, abra uma nova issue com o mesmo nome."
        ),
    })


def main():
    print(f"Processando issue #{ISSUE_NUMBER}...")
    ensure_labels()
    fields = parse_issue(ISSUE_BODY)

    if not fields.get("nome"):
        print("ERRO: não foi possível ler o corpo da issue.")
        raise SystemExit(1)

    if not fields.get("gt"):
        print("ERRO: Grupo de Trabalho não identificado.")
        raise SystemExit(1)

    print(f"Membro: {fields['nome']} — GT {fields['gt']} ({GT_NAMES.get(fields['gt'], '?')})")
    create_markdown(fields)
    finalize_issue()
    print("Concluído.")


if __name__ == "__main__":
    main()
