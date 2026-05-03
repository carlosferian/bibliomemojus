import React, { useEffect } from "react"
import { Link } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NEWS = [
  {
    date: "Maio 2022",
    title: "Bibliomemojus é criada oficialmente",
    excerpt:
      "Em 16 de maio de 2022, durante o II Encontro Nacional de Memória do Poder Judiciário, a rede Bibliomemojus foi formalmente criada por adesão espontânea de profissionais de todo o Brasil.",
    tag: "Institucional",
  },
  {
    date: "2022",
    title: "Sete Grupos de Trabalho em atividade",
    excerpt:
      "A Bibliomemojus estruturou sete Grupos de Trabalho cobrindo Gestão, Memória, Redes, Biblioteca Digital, Inovação, Agenda 2030 e Capacitação. Cada GT desenvolve planos de ação próprios.",
    tag: "Grupos de Trabalho",
    internal: "/#grupos",
  },
  {
    date: "2023",
    title: "Diagnóstico da Rede concluído",
    excerpt:
      "O levantamento situacional das bibliotecas judiciárias foi concluído com total adesão das instituições integrantes. Os resultados estão disponíveis em painel interativo do Power BI.",
    tag: "Publicação",
    internal: "/projetos",
  },
  {
    date: "2023",
    title: "3º ENABIJUD apresenta resultados",
    excerpt:
      "A terceira edição do Encontro Nacional de Bibliotecas Judiciárias apresentou os resultados consolidados dos sete GTs e o painel de Business Intelligence com dados diagnósticos da rede.",
    tag: "Evento",
    internal: "/eventos",
  },
  {
    date: "2024",
    title: "Novo site da Bibliomemojus no ar",
    excerpt:
      "O site da Bibliomemojus foi reformulado para facilitar o acesso aos conteúdos dos Grupos de Trabalho, eventos, notícias e publicações da rede nacional.",
    tag: "Aviso",
  },
  {
    date: "Aberto",
    title: "Enquetes da rede abertas para participação",
    excerpt:
      "As enquetes da Bibliomemojus estão abertas para participação. Sua opinião orienta as decisões estratégicas da rede. Acesse o Google Sites para responder.",
    tag: "Enquetes",
    external: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/enquetes",
  },
]

const NoticiasPage = () => {
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
                  <p className="news-date">{item.tag} · {item.date}</p>
                  <p className="news-title">{item.title}</p>
                  <p className="news-excerpt">{item.excerpt}</p>
                </>
              )
              const cls = `news-card reveal d${(i % 3) + 1}`
              if (item.internal) {
                return (
                  <Link key={i} className={cls} to={item.internal}>
                    {inner}
                  </Link>
                )
              }
              if (item.external) {
                return (
                  <a key={i} className={cls} href={item.external} target="_blank" rel="noreferrer">
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
