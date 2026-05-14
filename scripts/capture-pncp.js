/**
 * Captura artefatos de contratação do PNCP relacionados a bibliotecas judiciárias.
 * Roda diariamente via GitHub Actions; gera um arquivo JSON por artefato novo
 * em src/data/artefatos/, depois abre um Pull Request para curadoria editorial.
 */

const https = require("https")
const fs    = require("fs")
const path  = require("path")
const crypto = require("crypto")

// ── Configuração ─────────────────────────────────────────────────────────────

const ARTEFATOS_DIR = path.join(__dirname, "..", "src", "data", "artefatos")
const PNCP_BASE     = "https://pncp.gov.br/api/pncp/v1"
const PAGE_SIZE     = 500
const DAYS_BACK     = 7   // quantos dias retroativos buscar

// ── Categorias e keywords ─────────────────────────────────────────────────────

const CATEGORIAS = {
  memoriaInstitucional: [
    "memória institucional", "gestão documental", "arquivo permanente",
    "preservação documental", "organização de acervo",
  ],
  aquisicaoLivros: [
    "aquisição de livros", "compra de livros", "acervo bibliográfico",
    "material bibliográfico", "assinatura de periódicos", "base de dados",
    "periódicos jurídicos", "portal de periódicos",
  ],
  digitalizacao: [
    "scanner de livros", "digitalizadora", "digitalização de acervo",
    "escâner planetário", "digitalização de documentos",
  ],
  higienizacao: [
    "higienização de acervo", "conservação de livros",
    "restauração de documentos", "preservação de acervo",
  ],
  bibliotecaDigital: [
    "biblioteca digital", "repositório digital", "biblioteca virtual",
    "acesso aberto", "open access",
  ],
  terceirizacao: [
    "bibliotecário", "terceirização de biblioteca",
    "serviços de biblioteca", "gestão de biblioteca terceirizada",
  ],
  estagiarios: [
    "estágio biblioteca", "estagiário biblioteconomia",
    "estágio ciência da informação",
  ],
  sistemasGestao: [
    "software de biblioteca", "sistema de gestão de biblioteca",
    "SIGB", "Koha", "PHL", "Pergamum", "sistema integrado de gestão",
  ],
  inventarioAcervo: [
    "controle de acervo", "inventário de acervo", "sistema de inventário",
    "gestão de coleções",
  ],
  rfid: [
    "etiqueta RFID", "leitor RFID", "radiofrequência biblioteca",
    "antifurto biblioteca", "RFID acervo",
  ],
  restauracao: [
    "restauração de livros", "restauração de obras raras",
    "encadernação", "restauro de documentos históricos",
  ],
  consultoria: [
    "consultoria bibliotecária", "consultoria em biblioteconomia",
    "projeto de biblioteca", "diagnóstico de biblioteca",
  ],
}

// Fallback para artefatos que passam no filtro mas não se encaixam em uma categoria específica
const FALLBACK_KEYWORDS = [
  "biblioteca", "acervo", "biblioteconomia", "documentação",
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "REFARQ-capture/1.0" } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(httpGet(res.headers.location))
      }
      let body = ""
      res.on("data", chunk => (body += chunk))
      res.on("end", () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          reject(new Error(`JSON parse error — status ${res.statusCode}`))
        }
      })
    }).on("error", reject)
  })
}

function pad2(n) { return String(n).padStart(2, "0") }

function toYYYYMMDD(date) {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`
}

function dateRange(daysBack) {
  const end   = new Date()
  const start = new Date()
  start.setDate(start.getDate() - daysBack)
  return { dataInicial: toYYYYMMDD(start), dataFinal: toYYYYMMDD(end) }
}

function detectarCategoria(texto) {
  const t = texto.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORIAS)) {
    if (keywords.some(kw => t.includes(kw.toLowerCase()))) return cat
  }
  return "outro"
}

function isRelevante(texto) {
  const t = texto.toLowerCase()
  const allKeywords = Object.values(CATEGORIAS).flat().concat(FALLBACK_KEYWORDS)
  return allKeywords.some(kw => t.includes(kw.toLowerCase()))
}

function detectarEsfera(orgao) {
  const o = (orgao || "").toLowerCase()
  if (
    o.includes("stf") || o.includes("stj") || o.includes("tst") ||
    o.includes("trf") || o.includes("tcu") || o.includes("cnj") ||
    o.includes("superior") || o.includes("federal") || o.includes("união")
  ) return "federal"
  if (
    o.includes("tjm") || o.includes(" tj") || o.includes("tribunal de justiça") ||
    o.includes("estadual") || o.includes("estado de")
  ) return "estadual"
  return "municipal"
}

function mapTipoArtefato(modalidade) {
  const m = (modalidade || "").toLowerCase()
  if (m.includes("pregão"))            return "edital"
  if (m.includes("dispensa"))          return "dispensa"
  if (m.includes("inexigibilidade"))   return "inexigibilidade"
  if (m.includes("concorrência"))      return "edital"
  if (m.includes("credenciamento"))    return "edital"
  return "outro"
}

function makeId(numeroControlePNCP) {
  return crypto.createHash("sha1").update(numeroControlePNCP).digest("hex").slice(0, 12)
}

function existingIds() {
  if (!fs.existsSync(ARTEFATOS_DIR)) return new Set()
  return new Set(
    fs.readdirSync(ARTEFATOS_DIR)
      .filter(f => f.endsWith(".json") && !f.startsWith("exemplo-"))
      .map(f => f.replace(".json", ""))
  )
}

// ── Busca PNCP ────────────────────────────────────────────────────────────────

async function fetchPage(dataInicial, dataFinal, pagina) {
  const url =
    `${PNCP_BASE}/contratacoes/publicacoes` +
    `?dataInicial=${dataInicial}&dataFinal=${dataFinal}` +
    `&pagina=${pagina}&tamanhoPagina=${PAGE_SIZE}`
  console.log(`  GET ${url}`)
  return httpGet(url)
}

async function buscarArtefatos() {
  const { dataInicial, dataFinal } = dateRange(DAYS_BACK)
  console.log(`Buscando publicações de ${dataInicial} a ${dataFinal}...`)

  const first = await fetchPage(dataInicial, dataFinal, 1)
  const totalPaginas = first.totalPaginas || 1
  const resultados = [...(first.data || [])]

  for (let p = 2; p <= Math.min(totalPaginas, 10); p++) {
    const page = await fetchPage(dataInicial, dataFinal, p)
    resultados.push(...(page.data || []))
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`Total de registros recebidos: ${resultados.length}`)
  return resultados
}

// ── Transformação ─────────────────────────────────────────────────────────────

function transformar(raw) {
  const orgao =
    raw.orgaoEntidade?.razaoSocial ||
    raw.unidadeOrgao?.nomeUnidade ||
    "Não informado"

  const texto = [
    raw.objetoCompra || "",
    raw.informacaoComplementar || "",
    orgao,
  ].join(" ")

  if (!isRelevante(texto)) return null

  const id = makeId(raw.numeroControlePNCP || raw.numeroControlPNCP || String(Math.random()))

  const dataPublicacao =
    (raw.dataPublicacaoPncp || raw.dataPublicacaoFutura || "").slice(0, 10)

  const url = raw.linkSistemaOrigem ||
    `https://pncp.gov.br/app/contratacoes/${(raw.numeroControlePNCP || "").replace(/\//g, "-")}`

  return {
    id,
    titulo:          (raw.objetoCompra || "Sem título").slice(0, 200),
    orgao,
    esfera:          detectarEsfera(orgao),
    uf:              raw.unidadeOrgao?.ufSigla || "",
    categoria:       detectarCategoria(texto),
    tipoArtefato:    mapTipoArtefato(raw.modalidadeNome),
    dataPublicacao,
    dataCaptura:     new Date().toISOString().slice(0, 10),
    url,
    urlFonte:        "https://pncp.gov.br",
    resumo:          (raw.informacaoComplementar || raw.objetoCompra || "").slice(0, 400),
    valor:           raw.valorTotalEstimado || null,
    status:          "pendente",
    tags:            [],
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(ARTEFATOS_DIR)) fs.mkdirSync(ARTEFATOS_DIR, { recursive: true })

  const known = existingIds()
  console.log(`IDs já existentes: ${known.size}`)

  let rawList
  try {
    rawList = await buscarArtefatos()
  } catch (err) {
    console.error("Erro ao buscar API PNCP:", err.message)
    process.exit(1)
  }

  let created = 0
  for (const raw of rawList) {
    const artefato = transformar(raw)
    if (!artefato) continue
    if (known.has(artefato.id)) continue

    const filePath = path.join(ARTEFATOS_DIR, `${artefato.id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(artefato, null, 2))
    known.add(artefato.id)
    created++
    console.log(`  ✓ ${artefato.id} — ${artefato.titulo.slice(0, 70)}`)
  }

  console.log(`\nNovos artefatos gerados: ${created}`)

  // Sinaliza para o workflow se houve alterações
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `created=${created}\n`)
  }
}

main()
