import React, { useEffect } from "react"
import { Link } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { GTS } from "../data/gts"

const IndexPage = () => {
  useEffect(() => {
    // Scroll-based active nav link
    const nav = document.getElementById("navbar")
    if (!nav) return
    nav.classList.remove("solid")
    const ids = ["inicio", "sobre", "grupos", "eventos", "diagnostico", "noticias", "contato"]
    const navAs = document.querySelectorAll(".nav-links a")
    const handleScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 40)
      const y = window.scrollY + 90
      let cur = ids[0]
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) cur = id
      })
      navAs.forEach(a => {
        const href = a.getAttribute("href")
        a.classList.toggle(
          "active",
          href === "#" + cur ||
            (cur === "inicio" && href === "/") ||
            (cur === "grupos" && href === "/#grupos") ||
            (cur === "noticias" && href === "/noticias") ||
            (cur === "eventos" && href === "/eventos") ||
            (cur === "diagnostico" && href === "/projetos")
        )
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Reveal on scroll
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

  useEffect(() => {
    // Counter animation
    function animCount(el, target, dur) {
      const start = target > 100 ? target - 5 : 0
      let t0 = null
      const step = ts => {
        if (!t0) t0 = ts
        const p = Math.min((ts - t0) / dur, 1)
        const e = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(start + (target - start) * e)
        if (p < 1) requestAnimationFrame(step)
        else el.textContent = target
      }
      requestAnimationFrame(step)
    }
    let counted = false
    const statsEl = document.querySelector(".hero-stats")
    if (!statsEl) return
    const statsObs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !counted) {
          counted = true
          document.querySelectorAll(".cnt").forEach((el, i) =>
            setTimeout(() => animCount(el, +el.dataset.target, 1000), i * 160)
          )
        }
      },
      { threshold: 0.5 }
    )
    statsObs.observe(statsEl)
    return () => statsObs.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="hero-inner">
          <div className="hero-body">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Rede Nacional · Poder Judiciário
            </div>
            <h1>
              Rede Nacional de
              <br />
              <strong>Bibliotecas Judiciárias</strong>
            </h1>
            <p className="hero-sub">
              A Bibliomemojus conecta profissionais de bibliotecas dos cinco
              ramos do Poder Judiciário para fomentar cooperação, inovação e o
              acesso à informação jurídica em todo o Brasil.
            </p>
            <div className="hero-actions">
              <Link to="/#grupos" className="btn btn-primary">
                Grupos de Trabalho →
              </Link>
              <Link to="/#sobre" className="btn btn-ghost">
                Quem somos
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <p className="hs-label">Rede em números</p>
            <div className="hs-item">
              <span className="hs-num">
                <span className="cnt" data-target="7">0</span>
              </span>
              <span className="hs-desc">Grupos de Trabalho ativos</span>
            </div>
            <div className="hs-item">
              <span className="hs-num">
                <span className="cnt" data-target="3">0</span>
              </span>
              <span className="hs-desc">Edições do ENABIJUD</span>
            </div>
            <div className="hs-item">
              <span className="hs-num">
                <span className="cnt" data-target="5">0</span>
              </span>
              <span className="hs-desc">Ramos do Judiciário</span>
            </div>
            <div className="hs-item">
              <span className="hs-num">
                <span className="cnt" data-target="2022">2018</span>
              </span>
              <span className="hs-desc">Ano de fundação</span>
            </div>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Rolar</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* SOBRE */}
      <section className="section about" id="sobre">
        <div className="section-inner">
          <div className="about-grid">
            <div>
              <p className="tag-label reveal">Sobre a Rede</p>
              <h2 className="section-title reveal d1">
                Uma rede construída por profissionais, para profissionais
              </h2>
              <div className="about-content reveal d2">
                <p>
                  A Bibliomemojus foi criada a partir da experiência da rede
                  MEMOJUS BRASIL, que congrega profissionais das áreas de
                  Arquivos, Museus e Bibliotecas dos cinco ramos do Poder
                  Judiciário e de outros órgãos públicos.
                </p>
                <div className="about-quote">
                  <p>
                    "A ideia nasceu no II Encontro Nacional de Memória do Poder
                    Judiciário, em maio de 2022. A rede foi formalmente criada
                    em 16 de maio de 2022, por adesão espontânea."
                  </p>
                </div>
                <p>
                  A Biblioteca da Justiça Federal da 3ª Região assessora a rede
                  após aprovação da Presidência do TRF da 3ª Região e da
                  Diretoria do Foro da Seção Judiciária de São Paulo.
                </p>
              </div>
              <div className="reveal d3" style={{ marginTop: "28px" }}>
                <Link to="/#grupos" className="btn btn-primary">
                  Ver Grupos de Trabalho →
                </Link>
              </div>
            </div>
            <div>
              <p className="tag-label reveal d1">Objetivos</p>
              <ul className="goals reveal d2">
                {[
                  "Fomentar a interlocução e colaboração entre profissionais de Bibliotecas judiciárias de todo o país",
                  "Incentivar a cooperação integrada entre as Bibliotecas",
                  "Ampliar o acesso à informação jurídica",
                  "Fomentar a cultura da inovação e o aprimoramento da qualidade do atendimento e do tratamento dos acervos",
                  "Preservar, valorizar e difundir a Memória do Poder Judiciário",
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

      {/* GRUPOS DE TRABALHO */}
      <section className="section gts" id="grupos">
        <div className="section-inner">
          <p className="tag-label reveal">Grupos de Trabalho</p>
          <h2 className="section-title reveal d1">
            Sete eixos de atuação colaborativa
          </h2>
          <p className="section-desc reveal d2">
            Cada GT atua em um eixo estratégico com Planos de Ação, Calendários
            próprios e produção de conteúdo especializado.
          </p>
          <div className="gt-grid">
            {GTS.map((gt, i) => (
              <Link
                key={gt.num}
                className={`gt-card reveal d${(i % 4) + 1}`}
                to={`/grupos/${gt.slug}`}
              >
                <p className="gt-num">GT {gt.num}</p>
                <p className="gt-name">{gt.name}</p>
                <p className="gt-desc">{gt.shortDesc}</p>
                <div className="gt-chips">
                  {gt.chips.map(chip => (
                    <span className="gt-chip" key={chip}>{chip}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTOS */}
      <section className="section events" id="eventos">
        <div className="events-bg" />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <p className="tag-label reveal">Eventos Realizados</p>
          <h2 className="section-title reveal d1">
            Encontros que constroem a rede
          </h2>
          <p className="section-desc reveal d2">
            A Bibliomemojus organiza encontros nacionais que aproximam
            profissionais e avançam a agenda das bibliotecas judiciárias.
          </p>
          <div className="events-grid">
            {[
              { tag: "ENABIJUD", title: "1º Encontro Nacional de Bibliotecas Judiciárias", desc: "Primeira edição que inaugurou o diálogo nacional entre bibliotecas do Poder Judiciário." },
              { tag: "ENABIJUD", title: "2º Encontro Nacional de Bibliotecas Judiciárias", desc: "Segunda edição, consolidando a rede e expandindo a participação de todo o Brasil." },
              { tag: "ENABIJUD", title: "3º Encontro Nacional de Bibliotecas Judiciárias", desc: "Terceira edição com apresentação do Diagnóstico da Rede e resultados dos GTs." },
              { tag: "ENAM", title: "Encontro Nacional de Arquivos e Memória", desc: "Conecta a rede ao universo da gestão documental e da memória do Judiciário." },
            ].map((ev, i) => (
              <Link
                key={i}
                className={`event-card reveal d${i + 1}`}
                to="/eventos"
              >
                <span className="ev-tag">{ev.tag}</span>
                <p className="ev-title">{ev.title}</p>
                <p className="ev-desc">{ev.desc}</p>
                <span className="ev-arrow">→</span>
              </Link>
            ))}
          </div>
          <div className="see-all-wrap">
            <Link to="/eventos" className="btn btn-ghost">
              Ver todos os eventos →
            </Link>
          </div>
        </div>
      </section>

      {/* DIAGNÓSTICO */}
      <section className="section diagnostico" id="diagnostico">
        <div className="section-inner">
          <div className="diag-flex">
            <div className="diag-body">
              <p className="tag-label reveal">Publicações &amp; Diagnóstico</p>
              <h2 className="section-title reveal d1">
                Conhecimento produzido pela rede, para a rede
              </h2>
              <div className="reveal d2">
                <p>
                  A Bibliomemojus realizou um amplo diagnóstico situacional com
                  total adesão das bibliotecas do Poder Judiciário. Os resultados
                  são apresentados em painéis de Business Intelligence e
                  nortearão as ações dos sete Grupos de Trabalho.
                </p>
                <p>
                  Além do diagnóstico, a rede produz publicações, relatórios e
                  materiais técnicos acessíveis a todos os profissionais do setor.
                </p>
              </div>
              <div className="diag-actions reveal d3">
                <Link to="/projetos" className="btn btn-primary">
                  Ver Publicações →
                </Link>
                <a
                  href="https://app.powerbi.com/view?r=eyJrIjoiN2EyZGY2N2QtNmMyZC00NDcyLTgzNmYtYmYxOWJlZWI1Mzg2IiwidCI6IjExMjBlOWFjLTRmMGUtNDkxOS1hZDY4LTU4ZTU5YzIwNDZjZiJ9"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Painel Power BI
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

      {/* NOTÍCIAS */}
      <section className="section noticias" id="noticias">
        <div className="section-inner">
          <p className="tag-label reveal">Notícias</p>
          <h2 className="section-title reveal d1">Acompanhe as novidades</h2>
          <p className="section-desc reveal d2">
            Fique por dentro das ações, publicações e eventos da Bibliomemojus.
          </p>
          <div className="news-grid">
            <Link className="news-card reveal d1" to="/noticias">
              <p className="news-date">Aviso</p>
              <p className="news-title">Nosso site está no ar!</p>
              <p className="news-excerpt">
                Faça parte dos grupos de trabalho e ajude a Bibliomemojus a
                crescer. Descubra como participar.
              </p>
            </Link>
            <Link className="news-card reveal d2" to="/#grupos">
              <p className="news-date">Grupos de Trabalho</p>
              <p className="news-title">Participe de um dos 7 GTs</p>
              <p className="news-excerpt">
                Os GTs estão ativos e produzindo conteúdo. Veja planos de ação,
                calendários e materiais.
              </p>
            </Link>
            <a
              className="news-card reveal d3"
              href="https://sites.google.com/view/bibliomemojus/in%C3%ADcio/enquetes"
              target="_blank"
              rel="noreferrer"
            >
              <p className="news-date">Enquetes</p>
              <p className="news-title">Responda às enquetes</p>
              <p className="news-excerpt">
                Sua opinião orienta as ações da rede. Participe das enquetes
                abertas da Bibliomemojus.
              </p>
            </a>
          </div>
          <div className="see-all-wrap">
            <Link to="/noticias" className="btn btn-outline">
              Ver todas as notícias →
            </Link>
          </div>
        </div>
      </section>

      {/* ENQUETE STRIP */}
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

export default IndexPage

export const Head = () => (
  <>
    <title>BIBLIOMEMOJUS — Rede Nacional de Bibliotecas Judiciárias</title>
    <meta name="description" content="A Bibliomemojus conecta profissionais de bibliotecas dos cinco ramos do Poder Judiciário para fomentar cooperação, inovação e o acesso à informação jurídica em todo o Brasil." />
  </>
)
