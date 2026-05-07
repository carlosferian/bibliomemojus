import React, { useEffect } from "react"
import { Link, graphql } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const EventoTemplate = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark

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
      { threshold: 0.11 }
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
          <Link to="/eventos" className="back-link">
            ← Todos os Eventos
          </Link>
          <div>
            <span className="gt-num-badge">{frontmatter.tag}</span>
          </div>
          <h1>{frontmatter.titulo}</h1>
          <p className="page-hero-sub">{frontmatter.descricao}</p>
        </div>
      </section>

      {html && (
        <section className="section about">
          <div className="section-inner">
            <div
              className="about-content reveal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </section>
      )}

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="section-inner" style={{ textAlign: "center" }}>
          <Link to="/eventos" className="btn btn-outline">
            ← Todos os Eventos
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default EventoTemplate

export const Head = ({ data }) => {
  const { titulo, descricao } = data.markdownRemark.frontmatter
  return (
    <>
      <title>{titulo} | BIBLIOMEMOJUS</title>
      <meta name="description" content={descricao} />
    </>
  )
}

export const query = graphql`
  query EventoBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        tag
        titulo
        descricao
      }
    }
  }
`
