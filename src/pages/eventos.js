import React, { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const EVENTS = [
  {
    num: "01",
    tag: "ENABIJUD",
    title: "1º Encontro Nacional de Bibliotecas Judiciárias",
    desc: "Primeira edição que inaugurou o diálogo nacional entre bibliotecas do Poder Judiciário. Reuniu profissionais de diferentes ramos do Judiciário para debater os desafios e perspectivas das bibliotecas especializadas.",
    url: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/eventos-realizados/enabijud/1o-enabijud",
  },
  {
    num: "02",
    tag: "ENABIJUD",
    title: "2º Encontro Nacional de Bibliotecas Judiciárias",
    desc: "Segunda edição, consolidando a rede e expandindo a participação de todo o Brasil. Apresentação dos primeiros resultados dos Grupos de Trabalho e definição de novas prioridades estratégicas.",
    url: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/eventos-realizados/enabijud/2o-enabijud",
  },
  {
    num: "03",
    tag: "ENABIJUD",
    title: "3º Encontro Nacional de Bibliotecas Judiciárias",
    desc: "Terceira edição com apresentação do Diagnóstico da Rede e resultados consolidados dos sete GTs. Painel interativo de Business Intelligence com dados situacionais das bibliotecas judiciárias do país.",
    url: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/eventos-realizados/enabijud/3o-enabijud",
  },
  {
    num: "04",
    tag: "ENAM",
    title: "Encontro Nacional de Arquivos e Memória",
    desc: "Conecta a rede ao universo da gestão documental e da memória do Judiciário. Promove o diálogo entre as três áreas da MEMOJUS: Arquivos, Museus e Bibliotecas.",
    url: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/eventos-realizados/enam",
  },
  {
    num: "05",
    tag: "Guia",
    title: "Como sediar o ENABIJUD",
    desc: "Guia completo para instituições interessadas em sediar futuras edições do encontro nacional. Contém orientações sobre organização, infraestrutura, programação e gestão do evento.",
    url: "https://sites.google.com/view/bibliomemojus/in%C3%ADcio/eventos-realizados/enabijud/como-sediar-o-enabijud",
  },
]

const EventosPage = () => {
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
              <a
                key={i}
                href={ev.url}
                target="_blank"
                rel="noreferrer"
                className={`event-detail reveal d${(i % 3) + 1}`}
                style={{ textDecoration: "none" }}
              >
                <div className="event-detail-header">
                  <div className="event-detail-num">{ev.num}</div>
                  <div className="event-detail-meta">
                    <span className="ev-tag">{ev.tag}</span>
                    <h3>{ev.title}</h3>
                    <p>{ev.desc}</p>
                  </div>
                  <span
                    className="ev-arrow"
                    style={{ alignSelf: "center", flexShrink: 0 }}
                  >
                    →
                  </span>
                </div>
              </a>
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
                <a
                  href="https://sites.google.com/view/bibliomemojus/in%C3%ADcio/eventos-realizados/enabijud/como-sediar-o-enabijud"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Guia: Como Sediar →
                </a>
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
                  "Apresentar resultados e avanços dos Grupos de Trabalho",
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
  <>
    <title>Eventos | BIBLIOMEMOJUS</title>
    <meta name="description" content="Encontros nacionais organizados pela Bibliomemojus: ENABIJUD e ENAM." />
  </>
)
