import React, { useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NoticiasPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fields: { collection: { eq: "noticias" } } }
        sort: { frontmatter: { ordem: ASC } }
      ) {
        nodes {
          frontmatter {
            titulo
            data
            tag
            resumo
            link_interno
            link_externo
          }
        }
      }
    }
  `)

  const NEWS = data.allMarkdownRemark.nodes.map(n => n.frontmatter)

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
      <Navbar activePage="noticias" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Notícias</span>
          </div>
          <h1>
            Acompanhe as
            <br />
            <strong>novidades da rede</strong>
          </h1>
          <p className="page-hero-sub">
            Fique por dentro das ações, publicações e eventos da Bibliomemojus.
            A rede que conecta bibliotecas judiciárias de todo o Brasil.
          </p>
        </div>
      </section>

      <section className="section noticias">
        <div className="section-inner">
          <p className="tag-label reveal">Últimas notícias</p>
          <h2 className="section-title reveal d1">
            Todas as novidades da Bibliomemojus
          </h2>
          <p className="section-desc reveal d2">
            Acompanhe os avanços dos grupos de trabalho, eventos realizados e
            iniciativas da rede nacional.
          </p>

          <div className="news-grid">
            {NEWS.map((item, i) => {
              const inner = (
                <>
                  <p className="news-date">{item.tag} · {item.data}</p>
                  <p className="news-title">{item.titulo}</p>
                  <p className="news-excerpt">{item.resumo}</p>
                </>
              )
              const cls = `news-card reveal d${(i % 3) + 1}`
              if (item.link_interno) {
                return (
                  <Link key={i} className={cls} to={item.link_interno}>
                    {inner}
                  </Link>
                )
              }
              if (item.link_externo) {
                return (
                  <a key={i} className={cls} href={item.link_externo} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                )
              }
              return (
                <div key={i} className={cls} style={{ cursor: "default" }}>
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Participe da rede!</h3>
          <p>
            Responda às enquetes e contribua com as decisões estratégicas da
            Bibliomemojus.
          </p>
          <a
            href="https://sites.google.com/view/bibliomemojus/in%C3%ADcio/enquetes"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Acessar Enquetes →
          </a>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default NoticiasPage

export const Head = () => (
  <>
    <title>Notícias | BIBLIOMEMOJUS</title>
    <meta name="description" content="Acompanhe as notícias e novidades da Bibliomemojus — Rede Nacional de Bibliotecas Judiciárias." />
  </>
)
