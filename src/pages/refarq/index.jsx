import React, { useEffect, useMemo, useRef, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SeoHead from "../../components/SeoHead"
import ArtefatoCard from "../../components/refarq/ArtefatoCard"

const PAGE_SIZE = 12

const CATEGORIA_LABELS = {
  memoriaInstitucional: "Memória Institucional",
  aquisicaoLivros:      "Aquisição de Livros",
  digitalizacao:        "Digitalização",
  higienizacao:         "Higienização / Conservação",
  bibliotecaDigital:    "Biblioteca Digital",
  terceirizacao:        "Terceirização",
  estagiarios:          "Estágio",
  sistemasGestao:       "Sistemas de Gestão (SIGB)",
  inventarioAcervo:     "Inventário de Acervo",
  rfid:                 "RFID",
  restauracao:          "Restauração",
  consultoria:              "Consultoria",
  apresentacoesCulturais:   "Apresentações Culturais",
  outro:                    "Outro",
}

const RefarqPage = () => {
  const data = useStaticQuery(graphql`
    query RefarqArtefatos {
      allArtefatosJson(sort: { dataPublicacao: DESC }) {
        nodes {
          id
          titulo
          orgao
          esfera
          uf
          categoria
          tipoArtefato
          dataPublicacao
          dataCaptura
          url
          urlFonte
          resumo
          valor
          status
          tags
        }
      }
    }
  `)

  const TODOS = useMemo(
    () => data.allArtefatosJson.nodes.filter(a => a.status === "aprovado"),
    [data]
  )

  const [busca,      setBusca]      = useState("")
  const [filterCat,  setFilterCat]  = useState("Todas")
  const [filterTipo, setFilterTipo] = useState("Todos")
  const [filterEsf,  setFilterEsf]  = useState("Todas")
  const [filterUF,   setFilterUF]   = useState("Todos")
  const [pagina,     setPagina]     = useState(1)

  const categorias = useMemo(() => {
    const set = new Set(TODOS.map(a => a.categoria).filter(Boolean))
    return ["Todas", ...[...set].sort((a, b) =>
      (CATEGORIA_LABELS[a] || a).localeCompare(CATEGORIA_LABELS[b] || b, "pt-BR")
    )]
  }, [TODOS])

  const tipos = useMemo(() => {
    const set = new Set(TODOS.map(a => a.tipoArtefato).filter(Boolean))
    return ["Todos", ...[...set].sort()]
  }, [TODOS])

  const ufs = useMemo(() => {
    const set = new Set(TODOS.map(a => a.uf).filter(Boolean))
    return ["Todos", ...[...set].sort()]
  }, [TODOS])

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim()
    return TODOS.filter(a => {
      if (filterCat  !== "Todas" && a.categoria    !== filterCat)  return false
      if (filterTipo !== "Todos" && a.tipoArtefato !== filterTipo) return false
      if (filterEsf  !== "Todas" && a.esfera       !== filterEsf)  return false
      if (filterUF   !== "Todos" && a.uf            !== filterUF)   return false
      if (q && ![a.titulo, a.orgao, a.resumo, ...(a.tags || [])].join(" ").toLowerCase().includes(q)) return false
      return true
    })
  }, [TODOS, busca, filterCat, filterTipo, filterEsf, filterUF])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginados    = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)
  const hasFilters   = busca || filterCat !== "Todas" || filterTipo !== "Todos" || filterEsf !== "Todas" || filterUF !== "Todos"

  const topRef = useRef(null)
  useEffect(() => { setPagina(1) }, [busca, filterCat, filterTipo, filterEsf, filterUF])

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target) } }),
      { threshold: 0.07 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [paginados])

  const limpar = () => {
    setBusca(""); setFilterCat("Todas"); setFilterTipo("Todos")
    setFilterEsf("Todas"); setFilterUF("Todos")
  }

  const irParaPagina = p => {
    setPagina(p)
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <Navbar activePage="refarq" />

      <main>
        {/* ── Hero ── */}
        <section className="page-hero" style={{ background: "var(--navy)" }}>
          <div className="page-hero-inner">
            <span className="page-badge reveal d1">Contratações Públicas</span>
            <h1 className="page-hero-title reveal d2">
              Banco de Contratações
              <span className="page-hero-sub"> para Bibliotecas Judiciárias</span>
            </h1>
            <p className="page-hero-desc reveal d3">
              Editais, termos de referência e contratos relacionados a bibliotecas judiciárias,
              acervos documentais e gestão da informação — coletados do PNCP e curados pela rede.
            </p>
            {TODOS.length > 0 && (
              <p className="refarq-hero-count reveal d4">
                <strong>{TODOS.length}</strong> contratação{TODOS.length !== 1 ? "s" : ""} disponíve{TODOS.length !== 1 ? "is" : "l"}
              </p>
            )}
          </div>
        </section>

        {/* ── Filtros ── */}
        <section className="refarq-filtros" ref={topRef} aria-label="Filtros de busca">
          <div className="refarq-filtros-inner">
            <div className="refarq-busca-wrap">
              <label htmlFor="refarq-busca" className="sr-only">Buscar artefatos</label>
              <input
                id="refarq-busca"
                type="search"
                placeholder="Buscar por título, órgão ou palavra-chave…"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="refarq-busca"
                aria-label="Campo de busca"
              />
            </div>

            <div className="refarq-selects">
              <div className="refarq-select-group">
                <label htmlFor="rf-cat">Categoria</label>
                <select id="rf-cat" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  {categorias.map(c => (
                    <option key={c} value={c}>{CATEGORIA_LABELS[c] || c}</option>
                  ))}
                </select>
              </div>

              <div className="refarq-select-group">
                <label htmlFor="rf-tipo">Tipo</label>
                <select id="rf-tipo" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
                  {tipos.map(t => <option key={t} value={t}>{t === "Todos" ? "Todos os tipos" : t}</option>)}
                </select>
              </div>

              <div className="refarq-select-group">
                <label htmlFor="rf-esf">Esfera</label>
                <select id="rf-esf" value={filterEsf} onChange={e => setFilterEsf(e.target.value)}>
                  <option value="Todas">Todas</option>
                  <option value="federal">Federal</option>
                  <option value="estadual">Estadual</option>
                  <option value="municipal">Municipal</option>
                </select>
              </div>

              <div className="refarq-select-group">
                <label htmlFor="rf-uf">UF</label>
                <select id="rf-uf" value={filterUF} onChange={e => setFilterUF(e.target.value)}>
                  {ufs.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="refarq-filtros-status">
              <span className="refarq-count">
                {filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""}
              </span>
              {hasFilters && (
                <button className="refarq-limpar" onClick={limpar}>
                  Limpar filtros ×
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Grid de artefatos ── */}
        <section className="refarq-grid-section">
          <div className="refarq-grid-inner">
            {paginados.length === 0 ? (
              <div className="refarq-empty">
                <p>Nenhum artefato encontrado com os filtros selecionados.</p>
                {hasFilters && (
                  <button className="refarq-limpar" onClick={limpar}>
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="refarq-grid">
                {paginados.map((a, i) => (
                  <ArtefatoCard key={a.id} artefato={a} index={i} />
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <nav className="refarq-pagination" aria-label="Paginação">
                <button
                  onClick={() => irParaPagina(pagina - 1)}
                  disabled={pagina === 1}
                  aria-label="Página anterior"
                >‹</button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…")
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="refarq-pagination-ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => irParaPagina(p)}
                        className={p === pagina ? "is-active" : ""}
                        aria-label={`Ir para página ${p}`}
                        aria-current={p === pagina ? "page" : undefined}
                      >{p}</button>
                    )
                  )
                }

                <button
                  onClick={() => irParaPagina(pagina + 1)}
                  disabled={pagina === totalPaginas}
                  aria-label="Próxima página"
                >›</button>
              </nav>
            )}
          </div>
        </section>

        {/* ── Sobre ── */}
        <section className="section refarq-sobre">
          <div className="section-inner">
            <div className="refarq-sobre-grid">
              <div>
                <h2 className="section-title">Sobre o banco de contratações</h2>
                <p>
                  Reunimos editais, termos de referência, estudos técnicos e atas de
                  registro de preços relacionados a bibliotecas judiciárias, acervos
                  documentais e gestão da informação — tudo em um só lugar para
                  facilitar o trabalho dos profissionais da rede.
                </p>
                <p style={{ marginTop: "1rem" }}>
                  Os artefatos são coletados automaticamente do{" "}
                  <a href="https://pncp.gov.br" target="_blank" rel="noopener noreferrer">
                    Portal Nacional de Contratações Públicas (PNCP)
                  </a>{" "}
                  e revisados editorialmente antes da publicação.
                </p>
              </div>

              <div className="refarq-sobre-cards">
                <div className="refarq-info-card">
                  <span className="refarq-info-icon" aria-hidden="true">🏛️</span>
                  <strong>Fonte oficial</strong>
                  <p>Dados diretamente do PNCP — Portal Nacional de Contratações Públicas</p>
                </div>
                <div className="refarq-info-card">
                  <span className="refarq-info-icon" aria-hidden="true">✅</span>
                  <strong>Curadoria editorial</strong>
                  <p>Cada artefato é revisado antes da publicação</p>
                </div>
                <div className="refarq-info-card">
                  <span className="refarq-info-icon" aria-hidden="true">🔄</span>
                  <strong>Atualização diária</strong>
                  <p>Captura automática todos os dias às 03h (horário de Brasília)</p>
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

export const Head = () => (
  <SeoHead
    title="Banco de Contratações para Bibliotecas Judiciárias | BIBLIOMEMOJUS"
    description="Editais, termos de referência e contratos públicos para bibliotecas judiciárias — coletados do PNCP e curados pela rede Bibliomemojus."
    path="/refarq"
  />
)

export default RefarqPage
