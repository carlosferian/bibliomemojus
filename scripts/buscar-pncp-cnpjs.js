/**
 * Busca contratações relacionadas a bibliotecas judiciárias na API pública do PNCP.
 * Uso: node scripts/buscar-pncp-cnpjs.js
 * Saída: scripts/resultados-pncp.json
 *
 * Este script é executado via GitHub Actions (runners com acesso irrestrito à internet).
 * CNPJs solicitados: STF, STJ, TST, TSE, TCU, CNJ, CJF, TRF1-6, TRT1/2/3/4/5/6/7/15,
 *                   TJMG, TJRS, TJRN, TJCE, MPPA
 */

const https  = require("https")
const fs     = require("fs")
const path   = require("path")

const PNCP_BASE    = "https://pncp.gov.br/api/consulta/v1"
const PAGE_SIZE    = 500
const DATA_INICIAL = "20220101"
const DATA_FINAL   = "20260518"
const OUT_FILE     = path.join(__dirname, "resultados-pncp.json")
const ARTEFATOS_DIR = path.join(__dirname, "..", "src", "data", "artefatos")

// CNPJs a consultar conforme solicitação
const ORGAOS = [
  // Tribunais Superiores
  { cnpj: "00531640000128", nome: "STF",             uf: "DF", esfera: "federal" },
  { cnpj: "00491968000153", nome: "STJ",             uf: "DF", esfera: "federal" },
  { cnpj: "00481052000121", nome: "TST",             uf: "DF", esfera: "federal" },
  { cnpj: "00509018000113", nome: "TSE",             uf: "DF", esfera: "federal" },
  { cnpj: "00414607000118", nome: "TCU",             uf: "DF", esfera: "federal" },
  { cnpj: "07421906000148", nome: "CNJ",             uf: "DF", esfera: "federal" },
  // CJF / TRFs
  { cnpj: "00508903000188", nome: "CJF",             uf: "DF", esfera: "federal" },
  { cnpj: "00527842000100", nome: "TRF1",            uf: "DF", esfera: "federal" },
  { cnpj: "00396207000123", nome: "TRF2",            uf: "RJ", esfera: "federal" },
  { cnpj: "02866826000101", nome: "TRF3",            uf: "SP", esfera: "federal" },
  { cnpj: "01344862000169", nome: "TRF4",            uf: "RS", esfera: "federal" },
  { cnpj: "01470706000181", nome: "TRF5",            uf: "PE", esfera: "federal" },
  { cnpj: "19827023000119", nome: "TRF6",            uf: "MG", esfera: "federal" },
  // TRTs
  { cnpj: "01481511000100", nome: "TRT1 (RJ)",       uf: "RJ", esfera: "federal" },
  { cnpj: "01503786000157", nome: "TRT2 (SP)",       uf: "SP", esfera: "federal" },
  { cnpj: "17625936000100", nome: "TRT3 (MG)",       uf: "MG", esfera: "federal" },
  { cnpj: "94020726000158", nome: "TRT4 (RS)",       uf: "RS", esfera: "federal" },
  { cnpj: "03136024000131", nome: "TRT5 (BA)",       uf: "BA", esfera: "federal" },
  { cnpj: "07963280000136", nome: "TRT6 (PE)",       uf: "PE", esfera: "federal" },
  { cnpj: "00685068000116", nome: "TRT7 (CE)",       uf: "CE", esfera: "federal" },
  { cnpj: "00406671000100", nome: "TRT15 (Campinas)",uf: "SP", esfera: "federal" },
  // TJs / MP estaduais
  { cnpj: "21154554000113", nome: "TJMG",            uf: "MG", esfera: "estadual" },
  { cnpj: "87591309000178", nome: "TJRS",            uf: "RS", esfera: "estadual" },
  { cnpj: "08546459000105", nome: "TJRN",            uf: "RN", esfera: "estadual" },
  { cnpj: "06239088000170", nome: "TJCE",            uf: "CE", esfera: "estadual" },
  { cnpj: "05054960000158", nome: "MPPA",            uf: "PA", esfera: "estadual" },
]

const KEYWORDS = [
  "biblioteca", "acervo bibliográfico", "material bibliográfico",
  "biblioteconomia", "bibliotecário",
  "digitalização de acervo", "scanner", "digitalizadora",
  "higienização de acervo", "restauração de livros", "obras raras",
  "biblioteca digital", "minha biblioteca", "proview", "fórum de livros",
  "sigb", "koha", "folio", "pergamum", "sistema de gestão de biblioteca",
  "rfid acervo", "etiqueta rfid",
  "estagiário biblioteconomia", "estágio biblioteca",
  "aquisição de livros", "compra de livros",
  "encadernação", "restauração de obras raras",
  "inventário de acervo", "controle de acervo",
  "repositório digital", "biblioteca virtual",
]

// URLs já existentes no banco (não duplicar)
const KNOWN_URL_FRAGMENTS = [
  "pncp.gov.br/app/editais/00531640000128",
  "pncp.gov.br/app/editais/00509018000113",
  "pncp.gov.br/app/editais/00414607000118",
]

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Bibliomemojus-REFARQ/1.0 (pesquisa bibliotecas judiciarias; github.com/carlosferian/bibliomemojus)",
        "Accept": "application/json",
      }
    }
    https.get(url, options, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(httpGet(res.headers.location))
      }
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      let body = ""
      res.on("data", c => body += c)
      res.on("end", () => {
        try { resolve(JSON.parse(body)) }
        catch { reject(new Error(`JSON inválido`)) }
      })
    }).on("error", reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function isRelevante(texto) {
  const t = (texto || "").toLowerCase()
  return KEYWORDS.some(kw => t.includes(kw.toLowerCase()))
}

function mapTipo(modalidade) {
  const m = (modalidade || "").toLowerCase()
  if (m.includes("pregão"))          return "edital"
  if (m.includes("dispensa"))        return "dispensa"
  if (m.includes("inexigibilidade")) return "inexigibilidade"
  if (m.includes("concorrência"))    return "edital"
  return "outro"
}

function isKnown(url) {
  // Verifica URLs já existentes no banco
  if (KNOWN_URL_FRAGMENTS.some(f => url.includes(f))) return true
  // Verifica artefatos em src/data/artefatos/
  if (!fs.existsSync(ARTEFATOS_DIR)) return false
  for (const f of fs.readdirSync(ARTEFATOS_DIR).filter(f => f.endsWith(".json"))) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(ARTEFATOS_DIR, f)))
      if (j.url && j.url === url) return true
    } catch {}
  }
  return false
}

async function fetchOrgao(cnpj, nomeOrgao, uf, esfera) {
  const results = []
  let pagina = 1
  let totalPaginas = 1

  while (pagina <= totalPaginas && pagina <= 5) {
    const url = `${PNCP_BASE}/contratacoes/publicacao` +
      `?dataInicial=${DATA_INICIAL}&dataFinal=${DATA_FINAL}` +
      `&cnpj=${cnpj}&pagina=${pagina}&tamanhoPagina=${PAGE_SIZE}`

    try {
      const data = await httpGet(url)
      totalPaginas = data.totalPaginas || 1
      const items = data.data || []

      for (const raw of items) {
        const texto = [
          raw.objetoCompra || "",
          raw.informacaoComplementar || "",
        ].join(" ")

        if (!isRelevante(texto)) continue

        const numCtrl = raw.numeroControlePNCP || ""
        const urlPncp = raw.linkSistemaOrigem ||
          (numCtrl ? `https://pncp.gov.br/app/editais/${numCtrl}` : "https://pncp.gov.br")

        if (isKnown(urlPncp)) continue

        results.push({
          numeroControlePNCP: numCtrl,
          titulo:      (raw.objetoCompra || "").slice(0, 200),
          orgao:       raw.orgaoEntidade?.razaoSocial || nomeOrgao,
          uf:          raw.unidadeOrgao?.ufSigla || uf,
          esfera,
          tipo:        mapTipo(raw.modalidadeNome),
          data:        (raw.dataPublicacaoPncp || "").slice(0, 10),
          url:         urlPncp,
          resumo:      (raw.informacaoComplementar || raw.objetoCompra || "").slice(0, 400),
          valor:       raw.valorTotalEstimado ?? null,
          modalidade:  raw.modalidadeNome || "",
          linkSistemaOrigem: raw.linkSistemaOrigem || null,
        })
      }

      process.stdout.write(`  ${nomeOrgao} p${pagina}/${totalPaginas}: ${items.length} contratos, ${results.length} relevantes\n`)
      pagina++
      if (pagina <= totalPaginas && pagina <= 5) await sleep(700)
    } catch (err) {
      process.stdout.write(`  ${nomeOrgao} p${pagina}: ERRO — ${err.message}\n`)
      break
    }
  }

  return results
}

async function main() {
  console.log(`Consultando ${ORGAOS.length} órgãos | período ${DATA_INICIAL}–${DATA_FINAL}\n`)

  const todos = []

  for (const orgao of ORGAOS) {
    process.stdout.write(`→ ${orgao.nome} (${orgao.cnpj})\n`)
    const items = await fetchOrgao(orgao.cnpj, orgao.nome, orgao.uf, orgao.esfera)
    todos.push(...items)
    await sleep(500)
  }

  // Deduplica por numeroControlePNCP
  const seen = new Set()
  const deduplicados = todos.filter(item => {
    const key = item.numeroControlePNCP || item.url
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  fs.writeFileSync(OUT_FILE, JSON.stringify(deduplicados, null, 2))
  console.log(`\n✓ ${deduplicados.length} novo(s) artefato(s) encontrado(s) → ${OUT_FILE}`)

  // Output para GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const fs2 = require("fs")
    fs2.appendFileSync(process.env.GITHUB_OUTPUT, `total=${deduplicados.length}\n`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
