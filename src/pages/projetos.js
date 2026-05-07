import React, { useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const ProjetosPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fields: { collection: { eq: "publicacoes" } } }
        sort: { frontmatter: { ordem: ASC } }
      ) {
        nodes {
          frontmatter {
            icone
            titulo
            descricao
            link
            link_texto
            tag
          }
        }
      }
    }
  `)

  const PROJECTS = data.allMarkdownRemark.nodes.map(n => n.frontmatter)

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
      <Navbar activePage="projetos" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Publicações &amp; Projetos</span>
          </div>
          <h1>
            Conhecimento produzido
            <br />
            <strong>pela rede, para a rede</strong>
          </h1>
          <p className="page-hero-sub">
            Publicações, diagnósticos, projetos colaborativos e iniciativas
            estratégicas da Bibliomemojus.
          </p>
        </div>
      </section>

      {/* Diagnóstico em destaque */}
      <section className="section diagnostico">
        <div className="section-inner">
          <div className="diag-flex">
            <div className="diag-body">
              <p className="tag-label reveal">Diagnóstico Situacional</p>
              <h2 className="section-title reveal d1">
                Diagnóstico da Rede de Bibliotecas Judiciárias
              </h2>
              <div className="reveal d2">
                <p>
                  A Bibliomemojus realizou um amplo diagnóstico situacional com
                  total adesão das bibliotecas do Poder Judiciário. O levantamento
                  abrangeu recursos humanos, infraestrutura física, acervos,
                  tecnologia e serviços oferecidos.
                </p>
                <p>
                  Os resultados são apresentados em painéis de Business
                  Intelligence e nortearão as ações dos sete Grupos de Trabalho
                  nos próximos ciclos de planejamento.
                </p>
                <p>
                  O diagnóstico representa um marco histórico para as bibliotecas
                  judiciárias brasileiras: a primeira radiografia nacional do setor,
                  produzida pelos próprios profissionais da área.
                </p>
              </div>
              <div className="diag-actions reveal d3">
                <a
                  href="https://app.powerbi.com/view?r=eyJrIjoiN2EyZGY2N2QtNmMyZC00NDcyLTgzNmYtYmYxOWJlZWI1Mzg2IiwidCI6IjExMjBlOWFjLTRmMGUtNDkxOS1hZDY4LTU4ZTU5YzIwNDZjZiJ9"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Abrir Painel Power BI →
                </a>
                <Link
                  to="/projetos"
                  className="btn btn-outline"
                >
                  Ver Publicações
                </Link>
              </div>
            </div>
            <div className="diag-panel reveal d2">
              <div className="diag-icon-wrap">📊</div>
              <p className="diag-panel-title">Diagnóstico da Rede</p>
              <p className="diag-panel-sub">
                Painel interativo com dados situacionais de todas as Bibliotecas
                Judiciárias integrantes.
              </p>
              <a
                href="https://app.powerbi.com/view?r=eyJrIjoiN2EyZGY2N2QtNmMyZC00NDcyLTgzNmYtYmYxOWJlZWI1Mzg2IiwidCI6IjExMjBlOWFjLTRmMGUtNDkxOS1hZDY4LTU4ZTU5YzIwNDZjZiJ9"
                target="_blank"
                rel="noreferrer"
                className="btn btn-dark"
                style={{ display: "inline-flex" }}
              >
                Abrir Power BI →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projetos grid */}
      <section className="section gts">
        <div className="section-inner">
          <p className="tag-label reveal">Todos os Projetos</p>
          <h2 className="section-title reveal d1">
            Projetos e iniciativas da rede
          </h2>
          <p className="section-desc reveal d2">
            Conheça as publicações, ferramentas e projetos colaborativos
            desenvolvidos pela Bibliomemojus.
          </p>
          <div className="projects-grid">
            {PROJECTS.map((proj, i) => {
              const isInternal = proj.link && proj.link.startsWith("/")
              const cardClass = `project-card reveal d${(i % 3) + 1}`
              const inner = (
                <>
                  <span className="project-card-icon">{proj.icone}</span>
                  <p className="news-date">{proj.tag}</p>
                  <p className="project-card-title">{proj.titulo}</p>
                  <p className="project-card-desc">{proj.descricao}</p>
                  <span className="project-card-link">
                    {proj.link_texto} →
                  </span>
                </>
              )
              return isInternal ? (
                <Link key={i} to={proj.link} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <a key={i} href={proj.link} target="_blank" rel="noreferrer" className={cardClass}>
                  {inner}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Contribua com a rede!</h3>
          <p>
            Responda às enquetes e ajude a definir as prioridades da
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

export default ProjetosPage

export const Head = () => (
  <>
    <title>Publicações &amp; Projetos | BIBLIOMEMOJUS</title>
    <meta name="description" content="Publicações, diagnóstico e projetos da Bibliomemojus — Rede Nacional de Bibliotecas Judiciárias." />
  </>
)
