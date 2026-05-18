/**
 * Busca contratações relacionadas a bibliotecas judiciárias na API pública do PNCP.
 * Uso: node scripts/buscar-pncp.js
 * Saída: scripts/resultados-pncp.json
 */

const https  = require("https")
const fs     = require("fs")
const path   = require("path")
const crypto = require("crypto")

const PNCP_BASE     = "https://pncp.gov.br/api/consulta/v1"
const PAGE_SIZE     = 500
const DATA_INICIAL  = "20220101"
const DATA_FINAL    = "20260518"
const ARTEFATOS_DIR = path.join(__dirname, "..", "src", "data", "artefatos")
const OUT_FILE      = path.join(__dirname, "resultados-pncp.json")

// CNPJs confirmados de tribunais e órgãos do Poder Judiciário / MP / Defensoria
const ORGAOS = [
  // ── Tribunais Superiores ─────────────────────────────────────
  { cnpj: "00531640000128", nome: "STF", esfera: "federal", uf: "DF" },
  { cnpj: "00491968000153", nome: "STJ", esfera: "federal", uf: "DF" },
  { cnpj: "00481052000121", nome: "TST", esfera: "federal", uf: "DF" },
  { cnpj: "00509018000113", nome: "TSE", esfera: "federal", uf: "DF" },
  { cnpj: "00414607000118", nome: "TCU", esfera: "federal", uf: "DF" },
  { cnpj: "07421906000148", nome: "CNJ", esfera: "federal", uf: "DF" },
  // ── CJF / TRFs ───────────────────────────────────────────────
  { cnpj: "00508903000188", nome: "CJF",  esfera: "federal", uf: "DF" },
  { cnpj: "00527842000100", nome: "TRF1", esfera: "federal", uf: "DF" },
  { cnpj: "00396207000123", nome: "TRF2", esfera: "federal", uf: "RJ" },
  { cnpj: "02866826000101", nome: "TRF3", esfera: "federal", uf: "SP" },
  { cnpj: "01344862000169", nome: "TRF4", esfera: "federal", uf: "RS" },
  { cnpj: "01470706000181", nome: "TRF5", esfera: "federal", uf: "PE" },
  { cnpj: "19827023000119", nome: "TRF6", esfera: "federal", uf: "MG" },
  // ── TRTs ─────────────────────────────────────────────────────
  { cnpj: "01481511000100", nome: "TRT1 (RJ)",       esfera: "federal", uf: "RJ" },
  { cnpj: "01503786000157", nome: "TRT2 (SP)",       esfera: "federal", uf: "SP" },
  { cnpj: "17625936000100", nome: "TRT3 (MG)",       esfera: "federal", uf: "MG" },
  { cnpj: "94020726000158", nome: "TRT4 (RS)",       esfera: "federal", uf: "RS" },
  { cnpj: "03136024000131", nome: "TRT5 (BA)",       esfera: "federal", uf: "BA" },
  { cnpj: "07963280000136", nome: "TRT6 (PE)",       esfera: "federal", uf: "PE" },
  { cnpj: "00685068000116", nome: "TRT7 (CE)",       esfera: "federal", uf: "CE" },
  { cnpj: "01538074000177", nome: "TRT8 (PA/AP)",    esfera: "federal", uf: "PA" },
  { cnpj: "34128849000115", nome: "TRT9 (PR)",       esfera: "federal", uf: "PR" },
  { cnpj: "00476560000153", nome: "TRT10 (DF/TO)",   esfera: "federal", uf: "DF" },
  { cnpj: "00378133000154", nome: "TRT11 (AM/RR)",   esfera: "federal", uf: "AM" },
  { cnpj: "33650739000153", nome: "TRT12 (SC)",      esfera: "federal", uf: "SC" },
  { cnpj: "06209977000174", nome: "TRT13 (PB)",      esfera: "federal", uf: "PB" },
  { cnpj: "24854923000198", nome: "TRT14 (RO/AC)",   esfera: "federal", uf: "RO" },
  { cnpj: "00406671000100", nome: "TRT15 (Campinas)",esfera: "federal", uf: "SP" },
  { cnpj: "02975490000107", nome: "TRT16 (MA)",      esfera: "federal", uf: "MA" },
  { cnpj: "06192128000195", nome: "TRT17 (ES)",      esfera: "federal", uf: "ES" },
  { cnpj: "07536768000147", nome: "TRT18 (GO)",      esfera: "federal", uf: "GO" },
  { cnpj: "01551569000191", nome: "TRT19 (AL)",      esfera: "federal", uf: "AL" },
  { cnpj: "09460883000108", nome: "TRT20 (SE)",      esfera: "federal", uf: "SE" },
  { cnpj: "02953636000160", nome: "TRT21 (RN)",      esfera: "federal", uf: "RN" },
  { cnpj: "33327438000178", nome: "TRT22 (PI)",      esfera: "federal", uf: "PI" },
  { cnpj: "33562872000175", nome: "TRT23 (MT)",      esfera: "federal", uf: "MT" },
  { cnpj: "03342783000131", nome: "TRT24 (MS)",      esfera: "federal", uf: "MS" },
  // ── TJs estaduais ────────────────────────────────────────────
  { cnpj: "46395128000165", nome: "TJSP", esfera: "estadual", uf: "SP" },
  { cnpj: "21154554000113", nome: "TJMG", esfera: "estadual", uf: "MG" },
  { cnpj: "28538467000172", nome: "TJRJ", esfera: "estadual", uf: "RJ" },
  { cnpj: "87591309000178", nome: "TJRS", esfera: "estadual", uf: "RS" },
  { cnpj: "75799433000110", nome: "TJPR", esfera: "estadual", uf: "PR" },
  { cnpj: "83476033000108", nome: "TJSC", esfera: "estadual", uf: "SC" },
  { cnpj: "14089919000150", nome: "TJBA", esfera: "estadual", uf: "BA" },
  { cnpj: "05054855000120", nome: "TJPA", esfera: "estadual", uf: "PA" },
  { cnpj: "05090018000190", nome: "TJAM", esfera: "estadual", uf: "AM" },
  { cnpj: "08546459000105", nome: "TJRN", esfera: "estadual", uf: "RN" },
  { cnpj: "06239088000170", nome: "TJCE", esfera: "estadual", uf: "CE" },
  { cnpj: "13557105000150", nome: "TJGO", esfera: "estadual", uf: "GO" },
  { cnpj: "15395019000146", nome: "TJMT", esfera: "estadual", uf: "MT" },
  { cnpj: "05054960000158", nome: "MPPA", esfera: "estadual", uf: "PA" },
]

const KEYWORDS = [
  "biblioteca", "acervo bibliográfico", "material bibliográfico",
  "biblioteconomia", "bibliotecário", "bibliomemojus",
  "aquisição de livros", "compra de livros",
  "digitalização de acervo", "digitalização de documentos",
  "scanner", "digitalizadora",
  "higienização de acervo", "higienização de livros",
  "restauração de livros", "restauração de obras raras",
  "encadernação",
  "biblioteca digital", "repositório digital", "biblioteca virtual",
  "minha biblioteca", "proview", "revista dos tribunais online",
  "editora fórum", "fórum de livros", "pergamum", "koha", "folio",
  "SIGB", "sistema de gestão de biblioteca",
  "estágio biblioteca", "estagiário biblioteconomia",
  "RFID acervo", "etiqueta rfid biblioteca",
  "inventário de acervo", "controle de acervo",
]

const CATEGORIAS = {
  rfid:                 ["rfid", "etiqueta rfid", "radiofrequência"],
  digitalizacao:        ["digitaliz", "scanner", "digitalizadora"],
  aquisicaoLivros:      ["aquisição de livros", "material bibliográfico", "compra de livros", "periódicos"],
  higienizacao:         ["higienização", "conservação de livros"],
  bibliotecaDigital:    ["biblioteca digital", "repositório digital", "minha biblioteca", "proview", "fórum de livros", "koha", "folio", "pergamum"],
  terceirizacao:        ["terceirização de biblioteca", "serviços de biblioteca", "bibliotecário"],
  estagiarios:          ["estágio biblioteca", "estagiário biblioteconomia"],
  sistemasGestao:       ["sigb", "sistema de gestão de biblioteca", "software de biblioteca", "koha", "folio", "pergamum"],
  inventarioAcervo:     ["inventário de acervo", "controle de acervo"],
  restauracao:          ["restauração de livros", "restauração de obras raras", "encadernação"],
  consultoria:          ["consultoria bibliotecária", "projeto de biblioteca"],
  memoriaInstitucional: ["memória institucional", "arquivo permanente"],
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        "User-Agent": "REFARQ-bibliomemojus/1.0 (pesquisa bibliotecas judiciárias)",
        "Accept": "application/json",
      }
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(httpGet(res.headers.location))
      }
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`))
      }
      let body = ""
      res.on("data", c => body += c)
      res.on("end", () => {
        try { resolve(JSON.parse(body)) }
        catch { reject(new Error(`JSON inválido — ${url}`)) }
      })
    }).on("error", reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function isRelevante(texto) {
  const t = texto.toLowerCase()
  return KEYWORDS.some(kw => t.includes(kw.toLowerCase()))
}

function detectarCategoria(texto) {
  const t = texto.toLowerCase()
  for (const [cat, kws] of Object.entries(CATEGORIAS)) {
    if (kws.some(kw => t.includes(kw.toLowerCase()))) return cat
  }
  return "outro"
}

function mapTipo(modalidade) {
  const m = (modalidade || "").toLowerCase()
  if (m.includes("pregão"))          return "edital"
  if (m.includes("dispensa"))        return "dispensa"
  if (m.includes("inexigibilidade")) return "inexigibilidade"
  if (m.includes("concorrência"))    return "edital"
  return "outro"
}

function existingUrls() {
  if (!fs.existsSync(ARTEFATOS_DIR)) return new Set()
  const urls = new Set()
  for (const f of fs.readdirSync(ARTEFATOS_DIR).filter(f => f.endsWith(".json"))) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(ARTEFATOS_DIR, f)))
      if (j.url) urls.add(j.url)
    } catch {}
  }
  return urls
}

// ── Consulta ─────────────────────────────────────────────────────────────────

async function fetchOrgao(cnpj, nomeOrgao) {
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
        const urlPncp = `https://pncp.gov.br/app/editais/${numCtrl}`

        results.push({
          numeroControlePNCP: numCtrl,
          titulo:      (raw.objetoCompra || "").slice(0, 200),
          orgao:       raw.orgaoEntidade?.razaoSocial || nomeOrgao,
          uf:          raw.unidadeOrgao?.ufSigla || "",
          categoria:   detectarCategoria(texto),
          tipo:        mapTipo(raw.modalidadeNome),
          data:        (raw.dataPublicacaoPncp || "").slice(0, 10),
          url:         raw.linkSistemaOrigem || urlPncp,
          resumo:      (raw.informacaoComplementar || raw.objetoCompra || "").slice(0, 400),
          valor:       raw.valorTotalEstimado || null,
          modalidade:  raw.modalidadeNome || "",
        })
      }

      process.stdout.write(`  ${nomeOrgao} p${pagina}/${totalPaginas}: ${items.length} itens, ${results.length} relevantes até agora\n`)
      pagina++
      await sleep(800)
    } catch (err) {
      process.stdout.write(`  ${nomeOrgao}: ERRO — ${err.message}\n`)
      break
    }
  }

  return results
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const knownUrls = existingUrls()
  console.log(`URLs já existentes: ${knownUrls.size}`)
  console.log(`Consultando ${ORGAOS.length} órgãos de ${DATA_INICIAL} a ${DATA_FINAL}...\n`)

  const todos = []

  for (const orgao of ORGAOS) {
    console.log(`→ ${orgao.nome} (${orgao.cnpj})`)
    const items = await fetchOrgao(orgao.cnpj, orgao.nome)
    for (const item of items) {
      if (!knownUrls.has(item.url)) {
        todos.push({ ...item, esfera: orgao.esfera, uf: item.uf || orgao.uf })
      }
    }
    await sleep(500)
  }

  // Deduplica por numeroControlePNCP
  const seen = new Set()
  const deduplicados = todos.filter(item => {
    if (seen.has(item.numeroControlePNCP)) return false
    seen.add(item.numeroControlePNCP)
    return true
  })

  fs.writeFileSync(OUT_FILE, JSON.stringify(deduplicados, null, 2))
  console.log(`\n✓ ${deduplicados.length} novos artefatos encontrados → ${OUT_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
