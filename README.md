# Bibliomemojus — Site Oficial

Site da **Rede Nacional de Bibliotecas Judiciárias**, construído com [Gatsby](https://www.gatsbyjs.com/) e hospedado no [Netlify](https://netlify.com). O conteúdo é gerenciado por meio de arquivos Markdown e JSON, com pipelines de automação via GitHub Actions para captura de notícias e curadoria de contratações públicas.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Gatsby 5 (React) |
| Conteúdo | Markdown + frontmatter YAML / JSON |
| Deploy | Netlify (CD automático a cada push em `master`) |
| Automação | GitHub Actions + Python + Node.js |

---

## Estrutura do repositório

```
bibliomemojus/
├── content/
│   ├── noticias/        # Notícias da rede e externas (*.md)
│   ├── eventos/         # ENABIJUDs e demais eventos (*.md)
│   └── publicacoes/     # Publicações e materiais (*.md)
├── src/
│   ├── pages/           # Páginas Gatsby (index, noticias, refarq…)
│   ├── components/      # Navbar, Footer, ArtefatoCard…
│   └── data/
│       └── artefatos/   # Artefatos de contratação em JSON (REFARQ)
├── scripts/
│   ├── capture-pncp.js          # Captura automática de contratações no PNCP
│   └── refarq-form-handler.gs   # Apps Script para Google Forms → GitHub PR
├── .github/
│   ├── workflows/       # GitHub Actions (captura, publicação, PNCP)
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
| `refarq` | Artefato de contratação (REFARQ) |
| `curadoria` | PR aguardando revisão do curador |
| `comunidade` | Submetido via Google Forms |

---

## REFARQ — Banco de Contratações para Bibliotecas Judiciárias

O módulo REFARQ (`/refarq`) reúne artefatos de contratação pública (editais, termos de referência, inexigibilidades etc.) relacionados a bibliotecas judiciárias em todo o Brasil. Os artefatos ficam em `src/data/artefatos/` como arquivos JSON individuais.

### Fluxo de curadoria

Artefatos entram com `"status": "pendente"` e só aparecem no site após serem aprovados (`"status": "aprovado"`). A aprovação acontece pelo merge do PR correspondente, após revisão do curador.

```
Submissão (formulário / captura automática)
  → PR com status "pendente"
  → Curador revisa, edita se necessário, faz merge
  → Site publica com status "aprovado"
```

### Estrutura do arquivo JSON

```json
{
  "id":              "orgao-categoria-ano",
  "titulo":          "Título do processo",
  "orgao":           "Nome do órgão contratante",
  "esfera":          "federal | estadual | municipal",
  "uf":              "SP",
  "categoria":       "rfid | digitalizacao | aquisicaoLivros | ...",
  "tipoArtefato":    "edital | termo-de-referencia | inexigibilidade | ...",
  "dataPublicacao":  "2024-03-15",
  "dataCaptura":     "2026-05-17",
  "url":             "https://pncp.gov.br/app/editais/...",
  "urlFonte":        "https://pncp.gov.br",
  "resumo":          "Descrição do objeto contratado.",
  "valor":           150000,
  "status":          "aprovado | pendente",
  "tags":            ["RFID", "biblioteca judiciária"],
  "contribuidor":    "Nome / Instituição (opcional)"
}
```

### Categorias disponíveis

| Chave | Label |
|---|---|
| `memoriaInstitucional` | Memória Institucional |
| `aquisicaoLivros` | Aquisição de Livros |
| `digitalizacao` | Digitalização |
| `higienizacao` | Higienização / Conservação |
| `bibliotecaDigital` | Biblioteca Digital |
| `terceirizacao` | Terceirização |
| `estagiarios` | Estágio |
| `sistemasGestao` | Sistemas de Gestão (SIGB) |
| `inventarioAcervo` | Inventário de Acervo |
| `rfid` | RFID |
| `restauracao` | Restauração |
| `consultoria` | Consultoria |
| `apresentacoesCulturais` | Apresentações Culturais |

### Captura automática (PNCP)

O workflow `capture-pncp.yml` roda diariamente às 06h UTC e consulta a API do PNCP. Novos artefatos em escopo abrem PRs automaticamente com labels `refarq, curadoria`.

### Submissão via Google Forms (comunidade)

Qualquer membro da rede pode submeter artefatos via formulário sem acesso ao GitHub. O script `scripts/refarq-form-handler.gs` processa cada resposta e abre um PR automaticamente.

**Para configurar:**

1. Crie o Google Form com os campos abaixo (nomes exatos):

   | Campo | Tipo |
   |---|---|
   | Título do artefato | Resposta curta |
   | Órgão contratante | Resposta curta |
   | Esfera | Múltipla escolha: `Federal` / `Estadual` / `Municipal` |
   | UF | Lista suspensa |
   | Categoria | Múltipla escolha (ver tabela acima) |
   | Tipo de artefato | Múltipla escolha |
   | Data de publicação | Data |
   | URL no PNCP | Resposta curta |
   | Resumo | Parágrafo |
   | Valor estimado (R$) | Resposta curta *(opcional)* |
   | Seu nome / instituição | Resposta curta *(opcional)* |

2. Vincule o Form a uma Planilha: **Respostas → ícone de planilha → Criar planilha**

3. Na planilha: **Extensões → Apps Script** → cole o conteúdo de `scripts/refarq-form-handler.gs`

4. Em **Configurações do projeto → Propriedades do script**, adicione:
   - Chave: `GITHUB_TOKEN`
   - Valor: [fine-grained token](https://github.com/settings/tokens?type=beta) com permissões **Contents** e **Pull requests** (leitura + escrita) apenas neste repositório

5. Crie o gatilho: **Gatilhos → + Adicionar → `onFormSubmit` → Ao enviar formulário**

6. Crie as labels `refarq`, `curadoria` e `comunidade` no repositório GitHub

A cada envio, o script cria um branch, grava o JSON com `status: "pendente"` e abre um PR para curadoria.

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
