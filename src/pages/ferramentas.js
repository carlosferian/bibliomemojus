import React, { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SeoHead from "../components/SeoHead"
import { FERRAMENTAS } from "../data/ferramentas"

const ToolCard = ({ tool, index }) => (
  <a
    href={tool.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`project-card reveal d${(index % 3) + 1}`}
    style={{ textDecoration: "none" }}
  >
    <span className="project-card-icon" aria-hidden="true">{tool.icone}</span>
    {tool.nota && (
      <span className="tool-nota">{tool.nota}</span>
    )}
    <p className="project-card-title">{tool.nome}</p>
    <p className="project-card-desc">{tool.descricao}</p>
    <span className="project-card-link">Acessar →</span>
  </a>
)

const FeramentasPage = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible")
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Navbar activePage="ferramentas" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Ferramentas</span>
          </div>
          <h1>
            Ferramentas para
            <br />
            <strong>bibliotecários jurídicos</strong>
          </h1>
          <p className="page-hero-sub">
            Recursos digitais selecionados para o dia a dia das bibliotecas
            judiciárias — classificação, catalogação, pesquisa jurídica,
            periódicos e muito mais.
          </p>
        </div>
      </section>

      {FERRAMENTAS.map((cat, ci) => (
        <section
          key={cat.categoria}
          className="section"
          style={{ background: ci % 2 === 0 ? "var(--white)" : "var(--cream)" }}
        >
          <div className="section-inner">
            <div className="tool-cat-header reveal">
              <span className="tool-cat-icon" aria-hidden="true">{cat.icone}</span>
              <h2 className="section-title" style={{ margin: 0 }}>{cat.categoria}</h2>
            </div>
            <div className="projects-grid" style={{ marginTop: "28px" }}>
              {cat.items.map((tool, ti) => (
                <ToolCard key={tool.nome} tool={tool} index={ti} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Conhece outra ferramenta útil?</h3>
          <p>
            Envie sugestões para que possamos ampliar esta lista com recursos
            relevantes para as bibliotecas judiciárias.
          </p>
          <a href="mailto:bibliomemojus@gmail.com" className="btn btn-primary">
            Sugerir ferramenta →
          </a>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default FeramentasPage

export const Head = () => (
  <SeoHead
    title="Ferramentas | BIBLIOMEMOJUS"
    description="Recursos digitais para bibliotecários jurídicos: classificação CDU, tabela Cutter, pesquisa jurídica, catálogos, periódicos e bases de dados oficiais."
    path="/ferramentas"
  />
)
