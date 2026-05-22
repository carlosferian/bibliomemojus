/**
 * Portal de Duplicatas — Google Apps Script
 *
 * Trigger: Google Form "On form submit"
 * What it does:
 *   1. Reads the form response (biblioteca name, orgao, uf, esfera, contato,
 *      prazo, observacoes, and a Google Sheets URL)
 *   2. Opens the linked spreadsheet and reads the books table
 *   3. Builds a JSON object matching the DuplicatasJson schema
 *   4. Pushes the JSON file to the bibliomemojus GitHub repo via the GitHub API
 *
 * Required Script Properties (set via Project Settings → Script Properties):
 *   GITHUB_TOKEN   — fine-grained PAT with Contents: Read & Write on the repo
 *   GITHUB_OWNER   — e.g. "carlosferian"
 *   GITHUB_REPO    — e.g. "bibliomemojus"
 *   GITHUB_BRANCH  — e.g. "master"
 *
 * Spreadsheet expected columns (row 1 = headers, data from row 2):
 *   titulo | autor | isbn | editora | ano | exemplares | condicao | obs
 */

// ── Column mapping for the books spreadsheet ──────────────────────────────────
var BOOK_COLS = {
  titulo:     0,
  autor:      1,
  isbn:       2,
  editora:    3,
  ano:        4,
  exemplares: 5,
  condicao:   6,
  obs:        7,
}

// ── Form field titles (must match exactly what was set in Google Forms) ───────
var FIELD = {
  biblioteca:     "Nome da Biblioteca",
  orgao:          "Órgão / Tribunal",
  uf:             "UF",
  esfera:         "Esfera",
  contato:        "E-mail de contato",
  prazo:          "Prazo para manifestação (AAAA-MM-DD)",
  observacoes:    "Observações (opcional)",
  planilhaUrl:    "Link da Planilha Google com os Livros",
}

// ─────────────────────────────────────────────────────────────────────────────

function onFormSubmit(e) {
  var props   = PropertiesService.getScriptProperties()
  var token   = props.getProperty("GITHUB_TOKEN")
  var owner   = props.getProperty("GITHUB_OWNER")
  var repo    = props.getProperty("GITHUB_REPO")
  var branch  = props.getProperty("GITHUB_BRANCH") || "master"

  if (!token || !owner || !repo) {
    Logger.log("ERROR: Script Properties não configuradas.")
    return
  }

  // Parse form response
  var resp = e.namedValues
  var biblioteca  = (resp[FIELD.biblioteca]  || [""])[0].trim()
  var orgao       = (resp[FIELD.orgao]       || [""])[0].trim()
  var uf          = (resp[FIELD.uf]          || [""])[0].trim().toUpperCase()
  var esfera      = (resp[FIELD.esfera]      || [""])[0].trim().toLowerCase()
  var contato     = (resp[FIELD.contato]     || [""])[0].trim().toLowerCase()
  var prazo       = (resp[FIELD.prazo]       || [""])[0].trim()
  var observacoes = (resp[FIELD.observacoes] || [""])[0].trim()
  var planilhaUrl = (resp[FIELD.planilhaUrl] || [""])[0].trim()

  if (!planilhaUrl) {
    Logger.log("ERRO: URL da planilha não fornecida.")
    return
  }

  // Extract spreadsheet ID from URL
  var ssId = extractSheetId_(planilhaUrl)
  if (!ssId) {
    Logger.log("ERRO: Não foi possível extrair o ID da planilha: " + planilhaUrl)
    return
  }

  // Read books from spreadsheet
  var livros = readLivros_(ssId)
  if (!livros.length) {
    Logger.log("AVISO: Nenhum livro encontrado na planilha.")
  }

  // Build edital id and JSON
  var dateStr = new Date().toISOString().slice(0, 10)
  var slug    = slugify_(biblioteca)
  var editId  = slug + "-" + dateStr
  var dataPublicacao = dateStr

  var edital = {
    id: editId,
    biblioteca: biblioteca,
    orgao: orgao,
    uf: uf,
    esfera: esfera,
    contato: contato,
    tituloEdital: "Edital de Duplicatas — " + biblioteca + " (" + dateStr + ")",
    dataPublicacao: dataPublicacao,
    prazo: prazo || null,
    status: "aberto",
    observacoes: observacoes || null,
    livros: livros,
  }

  var json    = JSON.stringify(edital, null, 2)
  var path    = "src/data/duplicatas/" + editId + ".json"

  pushToGitHub_(token, owner, repo, branch, path, json, "Novo edital de duplicatas: " + editId)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSheetId_(url) {
  var m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return m ? m[1] : null
}

function readLivros_(ssId) {
  var ss     = SpreadsheetApp.openById(ssId)
  var sheet  = ss.getSheets()[0]
  var data   = sheet.getDataRange().getValues()
  var livros = []

  // Skip header row (index 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i]
    var titulo = String(row[BOOK_COLS.titulo] || "").trim()
    if (!titulo) continue  // skip empty rows

    var exemplares = parseInt(row[BOOK_COLS.exemplares], 10)
    livros.push({
      titulo:     titulo,
      autor:      String(row[BOOK_COLS.autor]    || "").trim() || null,
      isbn:       String(row[BOOK_COLS.isbn]     || "").replace(/\D/g, "") || null,
      editora:    String(row[BOOK_COLS.editora]  || "").trim() || null,
      ano:        String(row[BOOK_COLS.ano]      || "").trim() || null,
      exemplares: isNaN(exemplares) ? 1 : exemplares,
      condicao:   String(row[BOOK_COLS.condicao] || "bom").trim().toLowerCase(),
      obs:        String(row[BOOK_COLS.obs]      || "").trim() || null,
    })
  }
  return livros
}

function slugify_(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

function pushToGitHub_(token, owner, repo, branch, path, content, message) {
  var apiBase = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path

  // Check if file already exists (to get its SHA for update)
  var sha = null
  var checkResp = UrlFetchApp.fetch(apiBase + "?ref=" + branch, {
    method: "get",
    headers: { Authorization: "token " + token, Accept: "application/vnd.github.v3+json" },
    muteHttpExceptions: true,
  })
  if (checkResp.getResponseCode() === 200) {
    sha = JSON.parse(checkResp.getContentText()).sha
  }

  var body = {
    message: message,
    content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
    branch:  branch,
  }
  if (sha) body.sha = sha

  var putResp = UrlFetchApp.fetch(apiBase, {
    method: "put",
    contentType: "application/json",
    headers: { Authorization: "token " + token, Accept: "application/vnd.github.v3+json" },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  })

  var code = putResp.getResponseCode()
  if (code === 200 || code === 201) {
    Logger.log("OK: Arquivo enviado para GitHub — " + path)
  } else {
    Logger.log("ERRO GitHub (" + code + "): " + putResp.getContentText())
  }
}
