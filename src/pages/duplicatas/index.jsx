import React, { useEffect, useMemo, useRef, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SeoHead from "../../components/SeoHead"

const CONDICAO_LABELS = {
  ótimo: "Ótimo",
  otimo: "Ótimo",
  bom: "Bom",
  regular: "Regular",
  ruim: "Ruim",
}

const FORM_URL = "https://forms.gle/bibliomemojusduplicatas"

function EditalCard({ edital, query }) {
  const [expanded, setExpanded] = useState(false)
  const q = query.toLowerCase().trim()

  const livrosVisiveis = useMemo(() => {
    if (!q) return edital.livros || []
    return (edital.livros || []).filter(l =>
      [l.titulo, l.autor, l.isbn].join(" ").toLowerCase().includes(q)
    )
  }, [edital.livros, q])

  const isOpen    = edital.status === "aberto"
  const dataPubl  = edital.dataPublicacao
    ? new Date(edital.dataPublicacao + "T12:00:00").toLocaleDateString("pt-BR")
    : null
  const dataPrazo = edital.prazo
    ? new Date(edital.prazo + "T12:00:00").toLocaleDateString("pt-BR")
    : null

  return (
    <div className={`dup-card${expanded ? " is-open" : ""}`}>
      <div className="dup-card-header" onClick={() => setExpanded(o => !o)} role="button" tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setExpanded(o => !o)}
        aria-expanded={expanded}
      >
        <div className="dup-card-meta">
          <span className={`dup-badge dup-badge--status${isOpen ? " is-open" : ""}`}>
            {isOpen ? "Aberto" : "Encerrado"}
          </span>
          <span className="dup-badge dup-badge--esfera">{edital.esfera}</span>
          <span className="dup-badge dup-badge--uf">{edital.uf}</span>
        </div>
        <div className="dup-card-titulo">{edital.tituloEdital}</div>
        <div className="dup-card-info">
          <span className="dup-card-biblioteca">{edital.biblioteca}</span>
          <span className="dup-card-dates">
            {dataPubl && <span>Publicado: <strong>{dataPubl}</strong></span>}
            {dataPrazo && <span>Prazo: <strong>{dataPrazo}</strong></span>}
          </span>
        </div>
        <div className="dup-card-summary">
          <span>{(edital.livros || []).length} livro{(edital.livros || []).length !== 1 ? "s" : ""} disponíve{(edital.livros || []).length !== 1 ? "is" : "l"}</span>
          {edital.contato && (
            <a href={`mailto:${edital.contato}`} className="dup-contato-link" onClick={e => e.stopPropagation()}>
              {edital.contato}
            </a>
          )}
          <span className="dup-expand-caret">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="dup-card-body">
          {edital.observacoes && (
            <p className="dup-obs">{edital.observacoes}</p>
          )}
          <div className="dup-livros-header">
            <span>Título / Autor</span>
            <span>ISBN</span>
            <span>Editora / Ano</span>
            <span>Qtd.</span>
            <span>Estado</span>
          </div>
          {livrosVisiveis.length === 0 ? (
            <p className="dup-empty-livros">Nenhum livro corresponde à busca neste edital.</p>
          ) : (
            livrosVisiveis.map((l, i) => (
              <div key={i} className="dup-livro-row">
                <div className="dup-livro-titulo">
                  <strong>{l.titulo}</strong>
                  {l.autor && <span className="dup-livro-autor">{l.autor}</span>}
                  {l.obs && <span className="dup-livro-obs">{l.obs}</span>}
                </div>
                <div className="dup-livro-isbn">{l.isbn || "—"}</div>
                <div className="dup-livro-editora">
                  {l.editora || "—"}{l.ano ? `, ${l.ano}` : ""}
                </div>
                <div className="dup-livro-qtd">{l.exemplares ?? 1}</div>
                <div className="dup-livro-condicao">
                  {CONDICAO_LABELS[l.condicao] || l.condicao || "—"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const DuplicatasPage = () => {
  const data = useStaticQuery(graphql`
    query DuplicatasEditais {
      allDuplicatasJson(sort: { dataPublicacao: DESC }) {
        nodes {
          id
          biblioteca
          orgao
          uf
          esfera
          contato
          tituloEdital
          dataPublicacao
          prazo
          status
          observacoes
          livros {
            titulo
            autor
            isbn
            editora
            ano
            exemplares
            condicao
            obs
          }
        }
      }
    }
  `)

  const TODOS = data.allDuplicatasJson.nodes

  const [busca,       setBusca]       = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [filterUF,    setFilterUF]    = useState("Todos")
  const [filterEsf,   setFilterEsf]   = useState("Todas")

  const ufs = useMemo(() => {
    const set = new Set(TODOS.map(e => e.uf).filter(Boolean))
    return ["Todos", ...[...set].sort()]
  }, [TODOS])

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim()
    return TODOS.filter(edital => {
      if (filterStatus !== "Todos" && edital.status !== filterStatus) return false
      if (filterUF     !== "Todos" && edital.uf     !== filterUF)     return false
      if (filterEsf    !== "Todas" && edital.esfera !== filterEsf)    return false
      if (q) {
        const livrosMatch = (edital.livros || []).some(l =>
          [l.titulo, l.autor, l.isbn].join(" ").toLowerCase().includes(q)
        )
        const editalMatch = [edital.tituloEdital, edital.biblioteca, edital.orgao]
          .join(" ").toLowerCase().includes(q)
        if (!livrosMatch && !editalMatch) return false
      }
      return true
    })
  }, [TODOS, busca, filterStatus, filterUF, filterEsf])

  const hasFilters = busca || filterStatus !== "Todos" || filterUF !== "Todos" || filterEsf !== "Todas"
  const topRef = useRef(null)

  const limpar = () => {
    setBusca(""); setFilterStatus("Todos"); setFilterUF("Todos"); setFilterEsf("Todas")
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target) } }),
      { threshold: 0.07 }
    )
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [filtrados])

  const totalLivros = TODOS.reduce((acc, e) => acc + (e.livros || []).length, 0)

  return (
    <>
      <Navbar activePage="duplicatas" />

      <main>
        {/* Hero */}
        <section className="page-hero" style={{ background: "var(--navy)" }}>
          <div className="page-hero-inner">
            <span className="page-badge reveal d1">Portal de Duplicatas</span>
            <h1 className="page-hero-title reveal d2">
              Livros para doação
              <span className="page-hero-sub"> entre bibliotecas judiciárias</span>
            </h1>
            <p className="page-hero-desc reveal d3">
              Bibliotecas que desejam se desfazer de exemplares publicam editais de duplicatas.
              Qualquer biblioteca interessada pode manifestar interesse dentro do prazo.
            </p>
            {TODOS.length > 0 && (
              <p className="refarq-hero-count reveal d4">
                <strong>{filtrados.length}</strong> edital{filtrados.length !== 1 ? "is" : ""} aberto{filtrados.length !== 1 ? "s" : ""} &nbsp;·&nbsp; <strong>{totalLivros}</strong> título{totalLivros !== 1 ? "s" : ""} disponíve{totalLivros !== 1 ? "is" : "l"}
              </p>
            )}
          </div>
        </section>

        {/* Filtros */}
        <section className="refarq-filtros" ref={topRef} aria-label="Filtros de busca">
          <div className="refarq-filtros-inner">
            <div className="refarq-busca-wrap">
              <label htmlFor="dup-busca" className="sr-only">Buscar livros</label>
              <input
                id="dup-busca"
                type="search"
                placeholder="Buscar por título, autor, ISBN ou biblioteca…"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="refarq-busca"
                aria-label="Campo de busca"
              />
            </div>
            <div className="refarq-selects">
              <div className="refarq-select-group">
                <label htmlFor="dup-status">Status</label>
                <select id="dup-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="Todos">Todos</option>
                  <option value="aberto">Abertos</option>
                  <option value="encerrado">Encerrados</option>
                </select>
              </div>
              <div className="refarq-select-group">
                <label htmlFor="dup-esf">Esfera</label>
                <select id="dup-esf" value={filterEsf} onChange={e => setFilterEsf(e.target.value)}>
                  <option value="Todas">Todas</option>
                  <option value="federal">Federal</option>
                  <option value="estadual">Estadual</option>
                  <option value="municipal">Municipal</option>
                </select>
              </div>
              <div className="refarq-select-group">
                <label htmlFor="dup-uf">UF</label>
                <select id="dup-uf" value={filterUF} onChange={e => setFilterUF(e.target.value)}>
                  {ufs.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="refarq-filtros-status">
              <span className="refarq-count">
                {filtrados.length} edital{filtrados.length !== 1 ? "is" : ""}
              </span>
              {hasFilters && (
                <button className="refarq-limpar" onClick={limpar}>Limpar filtros ×</button>
              )}
            </div>
          </div>
        </section>

        {/* Lista de editais */}
        <section className="refarq-grid-section">
          <div className="dup-list-inner">
            {filtrados.length === 0 ? (
              <div className="refarq-empty">
                <p>Nenhum edital encontrado com os filtros selecionados.</p>
                {hasFilters && (
                  <button className="refarq-limpar" onClick={limpar}>Limpar filtros</button>
                )}
              </div>
            ) : (
              filtrados.map(edital => (
                <EditalCard key={edital.id} edital={edital} query={busca} />
              ))
            )}
          </div>
        </section>

        {/* CTA publicar edital */}
        <section className="section dup-cta-section">
          <div className="section-inner">
            <div className="dup-cta-grid">
              <div>
                <h2 className="section-title">Sua biblioteca tem duplicatas?</h2>
                <p>
                  Publique um edital no Portal de Duplicatas da Bibliomemojus. Preencha
                  o formulário com os dados da sua biblioteca e o link de uma planilha
                  Google com a lista de livros — processamos tudo automaticamente.
                </p>
                <p style={{ marginTop: "1rem" }}>
                  A planilha deve estar compartilhada com o perfil{" "}
                  <strong>bibliomemojus@gmail.com</strong> e seguir o modelo disponível
                  no formulário.
                </p>
                <div style={{ marginTop: "24px" }}>
                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Publicar edital →
                  </a>
                </div>
              </div>
              <div className="refarq-sobre-cards">
                <div className="refarq-info-card">
                  <span className="refarq-info-icon" aria-hidden="true">📋</span>
                  <strong>Preencha o formulário</strong>
                  <p>Informe os dados da biblioteca e o link da planilha Google com os livros</p>
                </div>
                <div className="refarq-info-card">
                  <span className="refarq-info-icon" aria-hidden="true">🔄</span>
                  <strong>Processamento automático</strong>
                  <p>Extraímos os dados dos livros diretamente da planilha compartilhada</p>
                </div>
                <div className="refarq-info-card">
                  <span className="refarq-info-icon" aria-hidden="true">📚</span>
                  <strong>Edital publicado</strong>
                  <p>O edital fica disponível para busca por título, autor e ISBN</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default DuplicatasPage

export const Head = () => (
  <SeoHead
    title="Portal de Duplicatas | BIBLIOMEMOJUS"
    description="Editais de doação de livros entre bibliotecas judiciárias — busque por título, autor ou ISBN e manifeste interesse."
    path="/duplicatas"
  />
)
