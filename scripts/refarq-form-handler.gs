// ================================================================
// REFARQ – Processador de submissões via Google Forms
//
// Como usar:
//   1. Crie o Google Form com os campos descritos abaixo
//   2. Vincule o Form a uma Planilha Google (Respostas → Planilha)
//   3. Na Planilha: Extensões → Apps Script → cole este código
//   4. Em "Configurações do projeto" → "Propriedades do script",
//      adicione: GITHUB_TOKEN = <seu fine-grained token>
//   5. Adicione o gatilho: Gatilhos → + Adicionar gatilho
//      Função: onFormSubmit | Evento: "Ao enviar formulário"
//
// Campos obrigatórios no Google Form (nomes EXATOS):
//   • Título do artefato        (Resposta curta)
//   • Órgão contratante         (Resposta curta)
//   • Esfera                    (Múltipla escolha: Federal / Estadual / Municipal)
//   • UF                        (Lista suspensa com todas as siglas)
//   • Categoria                 (Múltipla escolha — ver CATEGORIA_MAP abaixo)
//   • Tipo de artefato          (Múltipla escolha — ver TIPO_MAP abaixo)
//   • Data de publicação        (Data)
//   • URL no PNCP               (Resposta curta)
//   • Resumo                    (Parágrafo)
//
// Campos opcionais:
//   • Valor estimado (R$)       (Resposta curta — só números, ex: 85000)
//   • Seu nome / instituição    (Resposta curta — para crédito no PR)
//
// GitHub fine-grained token necessário:
//   Permissões: Contents (read & write) + Pull requests (read & write)
//   Repositório: carlosferian/bibliomemojus
// ================================================================

const GITHUB_OWNER = 'carlosferian'
const GITHUB_REPO  = 'bibliomemojus'
const BASE_BRANCH  = 'master'
const PR_LABELS    = ['refarq', 'curadoria', 'comunidade']

const CATEGORIA_MAP = {
  'Memória Institucional':      'memoriaInstitucional',
  'Aquisição de Livros':        'aquisicaoLivros',
  'Digitalização':              'digitalizacao',
  'Higienização / Conservação': 'higienizacao',
  'Biblioteca Digital':         'bibliotecaDigital',
  'Terceirização':              'terceirizacao',
  'Estágio':                    'estagiarios',
  'Sistemas de Gestão (SIGB)':  'sistemasGestao',
  'Inventário de Acervo':       'inventarioAcervo',
  'RFID':                       'rfid',
  'Restauração':                'restauracao',
  'Consultoria':                'consultoria',
  'Apresentações Culturais':    'apresentacoesCulturais',
  'Outro':                      'outro',
}

const TIPO_MAP = {
  'Edital':                    'edital',
  'Termo de Referência':       'termo-de-referencia',
  'Estudo Técnico Preliminar': 'estudo-tecnico-preliminar',
  'Ata de Registro de Preços': 'ata-de-registro-de-precos',
  'Contrato':                  'contrato',
  'Dispensa':                  'dispensa',
  'Inexigibilidade':           'inexigibilidade',
  'Projeto Básico':            'projeto-basico',
  'Outro':                     'outro',
}

// ── Entrada principal ─────────────────────────────────────────
function onFormSubmit(e) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN')
  if (!token) throw new Error('GITHUB_TOKEN não configurado nas propriedades do script.')

  const r = e.namedValues

  const titulo    = getField(r, 'Título do artefato')
  const orgao     = getField(r, 'Órgão contratante')
  const esfera    = getField(r, 'Esfera').toLowerCase()
  const uf        = getField(r, 'UF').toUpperCase()
  const catLabel  = getField(r, 'Categoria')
  const tipoLabel = getField(r, 'Tipo de artefato')
  const dataPub   = parseDate(getField(r, 'Data de publicação'))
  const url       = getField(r, 'URL no PNCP')
  const resumo    = getField(r, 'Resumo')
  const valorRaw  = getField(r, 'Valor estimado (R$)')
  const contrib   = getField(r, 'Seu nome / instituição')

  const categoria    = CATEGORIA_MAP[catLabel]  || 'outro'
  const tipoArtefato = TIPO_MAP[tipoLabel]       || 'outro'
  const hoje         = new Date().toISOString().split('T')[0]
  const ano          = dataPub ? dataPub.slice(0, 4) : hoje.slice(0, 4)
  const valor        = valorRaw
    ? parseFloat(valorRaw.replace(/\./g, '').replace(',', '.')) || null
    : null

  const id       = `${slugify(orgao).slice(0, 24)}-${categoria}-${ano}-${Date.now().toString(36)}`
  const filename = `${id}.json`
  const filePath = `src/data/artefatos/${filename}`

  const artefato = {
    id,
    titulo,
    orgao,
    esfera,
    uf,
    categoria,
    tipoArtefato,
    dataPublicacao: dataPub || hoje,
    dataCaptura:    hoje,
    url:            url || 'https://pncp.gov.br',
    urlFonte:       'https://pncp.gov.br',
    resumo,
    valor,
    status:         'pendente',
    tags:           [],
    contribuidor:   contrib || null,
  }

  const b64 = Utilities.base64Encode(
    JSON.stringify(artefato, null, 2),
    Utilities.Charset.UTF_8
  )
  const branchName = `refarq/contrib-${id}`

  // 1. SHA do branch base
  const baseSha = getRefSha(token, `heads/${BASE_BRANCH}`)

  // 2. Cria branch para a contribuição
  createRef(token, `refs/heads/${branchName}`, baseSha)

  // 3. Cria o arquivo JSON no branch
  putFile(token, filePath, b64, `feat(refarq): contribuição via formulário — ${titulo}`, branchName)

  // 4. Abre PR para curadoria
  const pr = openPR(token, `[REFARQ] ${titulo}`, buildPrBody(artefato, contrib), branchName, BASE_BRANCH)

  // 5. Adiciona labels ao PR
  if (pr && pr.number) {
    addLabels(token, pr.number, PR_LABELS)
  }

  Logger.log(`PR criado: ${pr.html_url}`)
}

// ── API GitHub ────────────────────────────────────────────────
function ghRequest(token, method, path, body) {
  const opts = {
    method,
    headers: {
      Authorization:        `Bearer ${token}`,
      Accept:               'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type':       'application/json',
    },
    muteHttpExceptions: true,
  }
  if (body) opts.payload = JSON.stringify(body)

  const res  = UrlFetchApp.fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${path}`,
    opts
  )
  const code = res.getResponseCode()
  if (code >= 400) {
    throw new Error(`GitHub ${method} ${path} → HTTP ${code}: ${res.getContentText()}`)
  }
  return JSON.parse(res.getContentText())
}

function getRefSha(token, ref) {
  return ghRequest(token, 'GET', `git/ref/${ref}`).object.sha
}

function createRef(token, ref, sha) {
  ghRequest(token, 'POST', 'git/refs', { ref, sha })
}

function putFile(token, path, content, message, branch) {
  ghRequest(token, 'PUT', `contents/${path}`, { message, content, branch })
}

function openPR(token, title, body, head, base) {
  return ghRequest(token, 'POST', 'pulls', { title, body, head, base })
}

function addLabels(token, prNumber, labels) {
  ghRequest(token, 'POST', `issues/${prNumber}/labels`, { labels })
}

// ── Helpers ───────────────────────────────────────────────────
function getField(namedValues, key) {
  const v = namedValues[key]
  return (v && v[0]) ? v[0].trim() : ''
}

function parseDate(str) {
  if (!str) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
  return null
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildPrBody(a, contrib) {
  const valorStr = a.valor
    ? `R$ ${a.valor.toLocaleString('pt-BR')}`
    : '—'

  return `## Artefato submetido via formulário da comunidade

| Campo | Valor |
|---|---|
| **Órgão** | ${a.orgao} |
| **Esfera** | ${a.esfera} |
| **UF** | ${a.uf} |
| **Categoria** | ${a.categoria} |
| **Tipo** | ${a.tipoArtefato} |
| **Data publicação** | ${a.dataPublicacao} |
| **URL** | ${a.url} |
| **Valor** | ${valorStr} |
| **Contribuidor** | ${contrib || '—'} |

### Resumo
${a.resumo}

---
> Submissão automática via Google Forms.
> Status \`pendente\` — visível no site somente após o curador alterar para \`aprovado\` e fazer merge.`
}
