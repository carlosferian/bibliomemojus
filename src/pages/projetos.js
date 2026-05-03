import React, { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const PROJECTS = [
  {
    icon: "📊",
    title: "Diagnóstico da Rede",
    desc: "Painel interativo com dados situacionais de todas as Bibliotecas Judiciárias integrantes. Desenvolvido com Power BI, apresenta o perfil das coleções, recursos humanos e infraestrutura.",
    link: "https://app.powerbi.com/view?r=eyJrIjoiN2EyZGY2N2QtNmMyZC00NDcyLTgzNmYtYmYxOWJlZWI1Mzg2IiwidCI6IjExMjBlOWFjLTRmMGUtNDkxOS1hZDY4LTU4ZTU5YzIwNDZjZiJ9",
    linkText: "Abrir Power BI",
    tag: "Diagnóstico",
  },
  {
    icon: "📚",
    title: "Publicações da Rede",
    desc: "Relatórios, artigos e materiais técnicos produzidos pelos Grupos de Trabalho da Bibliomemojus. Acervo em crescimento contínuo com contribuições dos profissionais da rede.",
    link: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/publica%C3%A7%C3%B5es",
    linkText: "Ver Publicações",
    tag: "Publicações",
  },
  {
    icon: "🗳️",
    title: "Enquetes da Rede",
    desc: "As enquetes coletam a opinião dos profissionais sobre temas estratégicos para orientar as decisões dos GTs. Abertas a todos os membros da rede.",
    link: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/enquetes",
    linkText: "Participar",
    tag: "Participação",
  },
  {
    icon: "🤝",
    title: "Cooperação com a MEMOJUS",
    desc: "A Bibliomemojus integra o ecossistema MEMOJUS BRASIL, articulando Arquivos, Museus e Bibliotecas do Poder Judiciário em torno de objetivos comuns de preservação da memória institucional.",
    link: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/sobre/quem-somos",
    linkText: "Saiba mais",
    tag: "Parceria",
  },
  {
    icon: "🌱",
    title: "Agenda 2030 e ODS",
    desc: "Projeto transversal de alinhamento das ações das bibliotecas judiciárias aos Objetivos de Desenvolvimento Sustentável da ONU, liderado pelo GT6.",
    link: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/grupos-de-trabalho/gt6-agenda-2030",
    linkText: "Ver GT 6",
    tag: "Sustentabilidade",
  },
  {
    icon: "💡",
    title: "Inovação nas Bibliotecas",
    desc: "Iniciativas de incorporação de inteligência artificial, automação e novas tecnologias aos serviços das bibliotecas judiciárias, desenvolvidas pelo GT5.",
    link: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/grupos-de-trabalho/gt5-inova%C3%A7%C3%A3o",
    linkText: "Ver GT 5",
    tag: "Inovação",
  },
]

const ProjetosPage = () => {
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
                <a
                  href="https://sites.google.com/view/bibliomemojus/in%C3%ADcio/publica%C3%A7%C3%B5es"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Ver Publicações
                </a>
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
            {PROJECTS.map((proj, i) => (
              <a
                key={i}
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className={`project-card reveal d${(i % 3) + 1}`}
              >
                <span className="project-card-icon">{proj.icon}</span>
                <p className="news-date">{proj.tag}</p>
                <p className="project-card-title">{proj.title}</p>
                <p className="project-card-desc">{proj.desc}</p>
                <span className="project-card-link">
                  {proj.linkText} →
                </span>
              </a>
            ))}
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

export default ProjetosPage

export const Head = () => (
  <>
    <title>Publicações &amp; Projetos | BIBLIOMEMOJUS</title>
    <meta name="description" content="Publicações, diagnóstico e projetos da Bibliomemojus — Rede Nacional de Bibliotecas Judiciárias." />
  </>
)
