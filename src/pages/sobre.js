import React, { useEffect } from "react"
import { Link } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const SobrePage = () => {
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
      <Navbar activePage="sobre" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.6 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Sobre</span>
          </div>
          <h1>
            A rede nacional de
            <br />
            <strong>bibliotecas judiciárias</strong>
          </h1>
          <p className="page-hero-sub">
            A Bibliomemojus conecta profissionais de bibliotecas dos cinco ramos
            do Poder Judiciário para fomentar cooperação, inovação e o acesso à
            informação jurídica em todo o Brasil.
          </p>
        </div>
      </section>

      <section className="section about">
        <div className="section-inner">
          <div className="about-grid">
            <div>
              <p className="tag-label reveal">Nossa Missão</p>
              <h2 className="section-title reveal d1">
                Construída por profissionais, para profissionais
              </h2>
              <div className="about-content reveal d2">
                <p>
                  A Bibliomemojus é a Rede Nacional de Bibliotecas Judiciárias,
                  criada formalmente em <strong>16 de maio de 2022</strong> durante
                  o II Encontro Nacional de Memória do Poder Judiciário — por
                  adesão espontânea de profissionais de todo o país.
                </p>
                <div className="about-quote">
                  <p>
                    "A ideia nasceu no II Encontro Nacional de Memória do Poder
                    Judiciário, em maio de 2022. A rede foi formalmente criada
                    em 16 de maio de 2022, por adesão espontânea."
                  </p>
                </div>
                <p>
                  A rede surgiu a partir da experiência da rede MEMOJUS BRASIL,
                  que congrega profissionais das áreas de Arquivos, Museus e
                  Bibliotecas dos cinco ramos do Poder Judiciário e de outros
                  órgãos públicos. A Biblioteca da Justiça Federal da 3ª Região
                  assessora a rede após aprovação da Presidência do TRF da 3ª
                  Região e da Diretoria do Foro da Seção Judiciária de São Paulo.
                </p>
              </div>
              <div className="reveal d3" style={{ marginTop: "28px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link to="/#grupos" className="btn btn-primary">
                  Ver Grupos de Trabalho →
                </Link>
                <Link to="/eventos" className="btn btn-outline">
                  Nossos Eventos
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

      <section className="section gts" style={{ background: "var(--cream)" }}>
        <div className="section-inner">
          <p className="tag-label reveal">A rede em números</p>
          <h2 className="section-title reveal d1">
            Sete eixos de atuação colaborativa
          </h2>
          <p className="section-desc reveal d2">
            A Bibliomemojus é estruturada em 7 Grupos de Trabalho que atuam em
            eixos estratégicos com Planos de Ação, Calendários próprios e
            produção de conteúdo especializado. A rede reúne bibliotecas de
            todos os cinco ramos do Poder Judiciário brasileiro.
          </p>
          <div
            className="reveal d3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "32px",
            }}
          >
            {[
              { num: "GT1", name: "Gestão", slug: "gt1" },
              { num: "GT2", name: "Memória", slug: "gt2" },
              { num: "GT3", name: "Redes", slug: "gt3" },
              { num: "GT4", name: "Biblioteca Digital", slug: "gt4" },
              { num: "GT5", name: "Inovação", slug: "gt5" },
              { num: "GT6", name: "Agenda 2030", slug: "gt6" },
              { num: "GT7", name: "Capacitação", slug: "gt7" },
            ].map(gt => (
              <Link
                key={gt.slug}
                to={`/grupos/${gt.slug}`}
                className="btn btn-outline"
              >
                {gt.num} — {gt.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="reveal">
              <p className="tag-label">Conexão com a MEMOJUS BRASIL</p>
              <h2 className="section-title">
                Parte de um ecossistema maior
              </h2>
              <div className="about-content">
                <p>
                  A Bibliomemojus integra o ecossistema{" "}
                  <a
                    href="https://www.cnj.jus.br/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    MEMOJUS BRASIL
                  </a>
                  , que articula profissionais de Arquivos, Museus e Bibliotecas
                  do Poder Judiciário em torno de objetivos comuns de preservação
                  da memória institucional e democratização do acesso à informação
                  jurídica.
                </p>
                <p>
                  Desde sua criação em 16 de maio de 2022, a rede cresceu para
                  abranger bibliotecas de todos os ramos do Judiciário brasileiro,
                  realizando 3 edições do ENABIJUD e participando do ENAM.
                </p>
              </div>
              <div style={{ marginTop: "28px" }}>
                <Link to="/eventos" className="btn btn-primary">
                  Ver Eventos Realizados →
                </Link>
              </div>
            </div>
            <div>
              <p className="tag-label reveal d1">Marcos da Rede</p>
              <ul className="goals reveal d2">
                {[
                  "Criada em 16 de maio de 2022 no II Encontro Nacional de Memória do Poder Judiciário",
                  "7 Grupos de Trabalho ativos com Planos de Ação e Calendários próprios",
                  "3 edições do ENABIJUD realizadas com participação nacional",
                  "Primeiro diagnóstico situacional nacional das bibliotecas judiciárias",
                  "Integração com os cinco ramos do Poder Judiciário brasileiro",
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

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Faça parte da rede!</h3>
          <p>
            Entre em contato e conheça como sua biblioteca pode integrar a
            Bibliomemojus.
          </p>
          <a href="mailto:bibliomemojus@gmail.com" className="btn btn-primary">
            Fale Conosco →
          </a>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default SobrePage

export const Head = () => (
  <>
    <title>Quem Somos | BIBLIOMEMOJUS</title>
    <meta
      name="description"
      content="Conheça a Bibliomemojus — Rede Nacional de Bibliotecas Judiciárias, criada em 2022 para conectar profissionais dos cinco ramos do Poder Judiciário."
    />
  </>
)
