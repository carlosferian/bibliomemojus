# Bibliomemojus — Site Oficial

Site da **Rede Nacional de Bibliotecas Judiciárias**, construído com [Gatsby](https://www.gatsbyjs.com/) e hospedado no [Netlify](https://netlify.com). O conteúdo é gerenciado por meio de arquivos Markdown e um pipeline de automação via GitHub Actions que captura, revisa e publica notícias sem necessidade de acesso direto ao repositório.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Gatsby 5 (React) |
| Conteúdo | Markdown + frontmatter YAML |
| Deploy | Netlify (CD automático a cada push em `master`) |
| Automação | GitHub Actions + Python |

---

## Estrutura do repositório

```
bibliomemojus/
├── content/
│   ├── noticias/        # Notícias da rede e externas (*.md)
│   ├── eventos/         # ENABIJUDs e demais eventos (*.md)
│   └── publicacoes/     # Publicações e materiais (*.md)
├── src/
│   ├── pages/           # Páginas Gatsby (index, noticias, eventos, projetos…)
│   └── components/      # Navbar, Footer, GTPage…
├── .github/
│   ├── workflows/       # GitHub Actions (captura, publicação)
│   ├── scripts/         # Scripts Python (captura.py, publica.py…)
│   └── ISSUE_TEMPLATE/  # Formulários de issue para submissão de conteúdo
└── static/              # Arquivos estáticos (favicon, imagens)
```

---

## Pipeline de conteúdo

### Notícias — captura automática

O workflow `captura-noticias.yml` roda toda segunda-feira ao meio-dia (UTC) e também pode ser disparado manualmente.

```
RSS (Google News) → captura.py → GitHub Issue com label "candidata"
```

O editor revisa a issue, ajusta título/resumo/link se necessário e adiciona a label **`publicar`**.

### Notícias — publicação manual (autoral)

Use o formulário **"✍️ Notícia Autoral do Grupo"** em _Issues → New Issue_ para submeter uma notícia escrita pela própria rede. Após preencher e enviar, adicione a label **`publicar`**.

### Publicação automática (todas as fontes)

Quando a label `publicar` é adicionada em uma issue com label `candidata`:

```
Issue (publicar) → publica.py → content/noticias/*.md → commit → push → Netlify deploy
```

O mesmo fluxo existe para eventos (`candidato-evento`) e publicações (`candidata-publicacao`).

### Labels utilizadas

| Label | Significado |
|---|---|
| `candidata` | Notícia aguardando revisão |
| `publicar` | Aprovada — dispara o workflow |
| `publicada` | Publicada no site (issue fechada) |
| `ignorar` | Descartada pelo editor |
| `candidato-evento` | Evento aguardando publicação |
| `publicado-evento` | Evento publicado |
| `candidata-publicacao` | Publicação aguardando revisão |
| `publicada-publicacao` | Publicação no site |

---

## Estrutura do frontmatter

### `content/noticias/*.md`

```yaml
titulo: "Título da notícia"
data: "Maio 2025"
tag: "Institucional"
resumo: "Texto do card (até ~400 caracteres)."
link_interno: ""          # rota interna, ex: /projetos
link_externo: ""          # URL externa
fonte: "CNJ"              # nome da fonte; vazio para conteúdo próprio
ordem: 10                 # número inteiro; notícias são exibidas em ordem DESC
```

### `content/eventos/*.md`

```yaml
numero: "4"
tag: "ENABIJUD"
titulo: "4º ENABIJUD"
descricao: "Descrição do evento."
url: "https://..."
ordem: 4
```

### `content/publicacoes/*.md`

```yaml
icone: "📊"
titulo: "Diagnóstico da Rede"
descricao: "Descrição da publicação."
link: "https://..."
link_texto: "Acessar"
tag: "Diagnóstico / Dados"
ordem: 1
```

---

## Desenvolvimento local

```bash
npm install
gatsby develop        # http://localhost:8000
```

Requer Node.js 18+ e Gatsby CLI.

---

## Deploy

Todo push em `master` dispara um deploy automático no Netlify. Não é necessário nenhum passo manual.
