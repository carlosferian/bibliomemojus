import React, { useEffect, useState, useMemo } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SeoHead from "../components/SeoHead"

const SELECT_STYLE = active => ({
  fontSize: "12px",
  fontWeight: 500,
  padding: "5px 28px 5px 10px",
  borderRadius: "8px",
  border: `1px solid ${active ? "var(--amber)" : "var(--border)"}`,
  background: active ? "var(--amber-bg)" : "var(--white)",
  color: active ? "var(--amber)" : "var(--navy)",
  cursor: "pointer",
  fontFamily: "var(--sans)",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
})

const NoticiasPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fields: { collection: { eq: "noticias" } } }
        sort: { frontmatter: { ordem: DESC } }
      ) {
        nodes {
          frontmatter {
            titulo
            data
            tag
            resumo
            link_interno
            link_externo
            fonte
          }
        }
      }
    }
  `)

  const NEWS = data.allMarkdownRemark.nodes.map(n => n.frontmatter)

  const [filterTag,   setFilterTag]   = useState("Todas")
  const [filterAno,   setFilterAno]   = useState("Todos")
  const [filterFonte, setFilterFonte] = useState("Todas")

  const tags = useMemo(() => [
    "Todas",
    ...Array.from(new Set(NEWS.map(n => n.tag).filter(Boolean))).sort(),
  ], [NEWS])

  const anos = useMemo(() => {
    const years = NEWS
      .map(n => { const m = (n.data || "").match(/\d{4}/); return m ? m[0] : null })
      .filter(Boolean)
    return ["Todos", ...Array.from(new Set(years)).sort((a, b) => b - a)]
  }, [NEWS])

  const fontes = useMemo(() => {
    const fs = NEWS.map(n => n.fonte).filter(Boolean)
    return fs.length ? ["Todas", ...Array.from(new Set(fs)).sort()] : []
  }, [NEWS])

  const filtered = useMemo(() => NEWS.filter(n => {
    if (filterTag !== "Todas" && n.tag !== filterTag) return false
    if (filterAno !== "Todos") {
      const m = (n.data || "").match(/\d{4}/)
      if (!m || m[0] !== filterAno) return false
    }
    if (filterFonte !== "Todas" && (n.fonte || "") !== filterFonte) return false
    return true
  }), [NEWS, filterTag, filterAno, filterFonte])

  const hasFilters = filterTag !== "Todas" || filterAno !== "Todos" || filterFonte !== "Todas"

  const resetFilters = () => { setFilterTag("Todas"); setFilterAno("Todos"); setFilterFonte("Todas") }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [filtered])

  return (
    <>
      <Navbar activePage="noticias" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div className="page-hero-inner">
          <span className="gt-num-badge">Notícias</span>
          <h1>
            Notícias da rede e
            <br />
            <strong>do setor em geral</strong>
          </h1>
          <p className="page-hero-sub">
            Acompanhe as ações da Bibliomemojus e um compilado de notícias sobre
            biblioteconomia jurídica, gestão documental e ciência da informação
            no Poder Judiciário de todo o Brasil. O conteúdo inclui tanto
            publicações próprias da rede quanto notícias externas de instituições
            e veículos especializados.
          </p>
        </div>
      </section>

      <section className="section noticias">
        <div className="section-inner">
          <p className="tag-label reveal">Notícias</p>
          <h2 className="section-title reveal d1">
            Bibliomemojus e o setor em pauta
          </h2>
          <p className="section-desc reveal d2">
            Conteúdo produzido pela rede e curadoria de notícias externas sobre
            biblioteconomia judiciária, gestão documental e ciência da informação.
          </p>

          {/* ── Barra de filtros ── */}
          <div className="filter-bar reveal d3">

            {/* Pills de tag */}
            <div className="filter-pills">
              <span className="filter-label">Assunto</span>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: ".07em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    border: `1px solid ${filterTag === tag ? "var(--amber)" : "var(--border)"}`,
                    background: filterTag === tag ? "var(--amber-bg)" : "transparent",
                    color: filterTag === tag ? "var(--amber)" : "var(--muted)",
                    cursor: "pointer",
                    transition: "all .15s",
                    fontFamily: "var(--sans)",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Selects de ano e fonte */}
            <div className="filter-selects">
              <div className="filter-select-group">
                <span className="filter-label">Ano</span>
                <select value={filterAno} onChange={e => setFilterAno(e.target.value)} style={SELECT_STYLE(filterAno !== "Todos")}>
                  {anos.map(a => (
                    <option key={a} value={a}>{a === "Todos" ? "Todos os anos" : a}</option>
                  ))}
                </select>
              </div>

              {fontes.length > 1 && (
                <div className="filter-select-group">
                  <span className="filter-label">Fonte</span>
                  <select value={filterFonte} onChange={e => setFilterFonte(e.target.value)} style={SELECT_STYLE(filterFonte !== "Todas")}>
                    {fontes.map(f => (
                      <option key={f} value={f}>{f === "Todas" ? "Todas as fontes" : f}</option>
                    ))}
                  </select>
                </div>
              )}

              {hasFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    fontSize: "11px", fontWeight: 500, padding: "5px 12px",
                    borderRadius: "8px", border: "1px solid var(--border)",
                    background: "transparent", color: "var(--muted)",
                    cursor: "pointer", fontFamily: "var(--sans)",
                  }}
                >
                  × Limpar filtros
                </button>
              )}

              <span className="filter-count">
                {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* ── Grid de notícias ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 0", color: "var(--muted)", fontSize: "15px" }}>
              Nenhuma notícia encontrada para os filtros selecionados.{" "}
              <button
                onClick={resetFilters}
                style={{ background: "none", border: "none", color: "var(--amber)", cursor: "pointer", fontFamily: "var(--sans)", fontSize: "15px", padding: 0 }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="news-grid">
              {filtered.map((item, i) => {
                const meta = [item.tag, item.fonte, item.data].filter(Boolean).join(" · ")
                const inner = (
                  <>
                    <p className="news-date">{meta}</p>
                    <p className="news-title">{item.titulo}</p>
                    <p className="news-excerpt">{item.resumo}</p>
                  </>
                )
                const cls = `news-card reveal d${(i % 3) + 1}`
                if (item.link_interno) return <Link key={i} className={cls} to={item.link_interno}>{inner}</Link>
                if (item.link_externo) return <a key={i} className={cls} href={item.link_externo} target="_blank" rel="noreferrer">{inner}</a>
                return <div key={i} className={cls} style={{ cursor: "default" }}>{inner}</div>
              })}
            </div>
          )}
        </div>
      </section>

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Participe da rede!</h3>
          <p>
            Responda às enquetes e contribua com as decisões estratégicas da
            Bibliomemojus.
          </p>
          <Link
            to="/enquetes"
            className="btn btn-primary"
          >
            Acessar Enquetes →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default NoticiasPage

export const Head = () => (
  <SeoHead
    title="Notícias | BIBLIOMEMOJUS"
    description="Notícias da Bibliomemojus e curadoria sobre biblioteconomia jurídica, gestão documental e ciência da informação no Poder Judiciário."
    path="/noticias"
  />
)
