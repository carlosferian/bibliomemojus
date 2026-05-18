import React, { useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SeoHead from "../components/SeoHead"

const EventosPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fields: { collection: { eq: "eventos" } } }
        sort: { frontmatter: { ordem: ASC } }
      ) {
        nodes {
          frontmatter {
            numero
            tag
            titulo
            descricao
            url
          }
        }
      }
    }
  `)

  const EVENTS = data.allMarkdownRemark.nodes.map(n => n.frontmatter)

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
      <Navbar activePage="eventos" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Eventos</span>
          </div>
          <h1>
            Encontros que
            <br />
            <strong>constroem a rede</strong>
          </h1>
          <p className="page-hero-sub">
            A Bibliomemojus organiza encontros nacionais que aproximam
            profissionais e avançam a agenda das bibliotecas judiciárias em todo
            o Brasil.
          </p>
        </div>
      </section>

      <section className="section events" style={{ background: "var(--navy)" }}>
        <div className="events-bg" />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <p className="tag-label reveal">ENABIJUD &amp; ENAM</p>
          <h2 className="section-title reveal d1" style={{ color: "#fff" }}>
            Todos os eventos realizados
          </h2>
          <p
            className="section-desc reveal d2"
            style={{ color: "rgba(255,255,255,.5)" }}
          >
            Conheça cada edição dos encontros nacionais organizados pela
            Bibliomemojus.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {EVENTS.map((ev, i) => (
              <Link
                key={i}
                to={ev.url}
                className={`event-detail reveal d${(i % 3) + 1}`}
                style={{ textDecoration: "none" }}
              >
                <div className="event-detail-header">
                  <div className="event-detail-num">{ev.numero}</div>
                  <div className="event-detail-meta">
                    <span className="ev-tag">{ev.tag}</span>
                    <h3>{ev.titulo}</h3>
                    <p>{ev.descricao}</p>
                  </div>
                  <span
                    className="ev-arrow"
                    style={{ alignSelf: "center", flexShrink: 0 }}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="reveal">
              <p className="tag-label">Próxima edição</p>
              <h2 className="section-title">
                Interesse em sediar o próximo ENABIJUD?
              </h2>
              <div className="about-content">
                <p>
                  O ENABIJUD é organizado anualmente pela Bibliomemojus em
                  parceria com instituições do Poder Judiciário interessadas em
                  sediar o evento. Qualquer biblioteca judiciária de qualquer
                  ramo do Judiciário pode manifestar interesse.
                </p>
                <div className="about-quote">
                  <p>
                    "Sediar o ENABIJUD é uma oportunidade de fortalecer a
                    visibilidade da sua biblioteca e contribuir com toda a rede
                    nacional."
                  </p>
                </div>
                <p>
                  Consulte o guia completo sobre como sediar o evento e entre em
                  contato com a coordenação da rede.
                </p>
              </div>
              <div style={{ marginTop: "28px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  to="/eventos/como-sediar"
                  className="btn btn-primary"
                >
                  Guia: Como Sediar →
                </Link>
                <a
                  href="mailto:bibliomemojus@gmail.com"
                  className="btn btn-outline"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
            <div>
              <p className="tag-label reveal d1">Sobre o ENABIJUD</p>
              <ul className="goals reveal d2">
                {[
                  "Promover o diálogo entre profissionais de bibliotecas judiciárias",
                  "Apresentar resultados e avanços das Coordenações",
                  "Fortalecer a rede nacional de cooperação entre bibliotecas",
                  "Debater tendências e inovações para o setor",
                  "Conectar os cinco ramos do Poder Judiciário",
                ].map((text, i) => (
                  <li className="goal-item" key={i}>
                    <span className="goal-letter">
                      {String.fromCharCode(97 + i)}
                    </span>
                    <span className="goal-text">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default EventosPage

export const Head = () => (
  <SeoHead
    title="Eventos | BIBLIOMEMOJUS"
    description="Encontros nacionais organizados pela Bibliomemojus: ENABIJUD e ENAM — fortalecendo a rede de bibliotecas judiciárias brasileiras."
    path="/eventos"
  />
)
