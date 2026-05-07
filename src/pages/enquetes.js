import React, { useEffect } from "react"
import { Link } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const EnquetesPage = () => {
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
      <Navbar activePage="enquetes" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.6 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Enquetes</span>
          </div>
          <h1>
            Participe das
            <br />
            <strong>decisões da rede</strong>
          </h1>
          <p className="page-hero-sub">
            As enquetes da Bibliomemojus coletam opiniões dos profissionais para
            orientar as ações estratégicas dos Grupos de Trabalho. Sua
            participação é fundamental para moldar o futuro da rede.
          </p>
        </div>
      </section>

      <section className="section about">
        <div className="section-inner">
          <div className="about-grid">
            <div>
              <p className="tag-label reveal">Como funcionam</p>
              <h2 className="section-title reveal d1">
                Enquetes abertas pelos Grupos de Trabalho
              </h2>
              <div className="about-content reveal d2">
                <p>
                  As enquetes são abertas periodicamente pelos Grupos de Trabalho
                  da Bibliomemojus para coletar a opinião dos profissionais de
                  bibliotecas judiciárias sobre temas estratégicos relevantes para
                  a rede.
                </p>
                <div className="about-quote">
                  <p>
                    "Cada resposta conta. As enquetes são o canal direto de
                    participação dos profissionais nas decisões da rede nacional."
                  </p>
                </div>
                <p>
                  As enquetes ativas ficam disponíveis conforme abertura pelos
                  GTs. Para ser notificado quando novas enquetes são abertas,
                  entre em contato com a coordenação da rede pelo e-mail abaixo.
                </p>
              </div>
              <div
                className="reveal d3"
                style={{ marginTop: "28px", display: "flex", gap: "10px", flexWrap: "wrap" }}
              >
                <a
                  href="mailto:bibliomemojus@gmail.com"
                  className="btn btn-primary"
                >
                  Receber avisos de enquetes →
                </a>
                <Link to="/#grupos" className="btn btn-outline">
                  Ver Grupos de Trabalho
                </Link>
              </div>
            </div>
            <div>
              <p className="tag-label reveal d1">Por que participar?</p>
              <ul className="goals reveal d2">
                {[
                  "Influenciar diretamente as prioridades dos Grupos de Trabalho",
                  "Contribuir com sua experiência profissional para toda a rede",
                  "Ajudar a mapear as necessidades das bibliotecas judiciárias",
                  "Fortalecer a cultura colaborativa e participativa da rede",
                  "Ser parte ativa da construção do futuro das bibliotecas do Judiciário",
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
        <div className="section-inner" style={{ textAlign: "center" }}>
          <p className="tag-label reveal">Enquetes Ativas</p>
          <h2 className="section-title reveal d1">
            Fique atento às próximas enquetes
          </h2>
          <p className="section-desc reveal d2" style={{ maxWidth: "600px", margin: "0 auto 32px" }}>
            As enquetes são abertas conforme necessidade dos GTs. Para ser
            avisado quando uma nova enquete estiver disponível, envie um e-mail
            para{" "}
            <a href="mailto:bibliomemojus@gmail.com">
              bibliomemojus@gmail.com
            </a>{" "}
            solicitando inclusão na lista de avisos.
          </p>
          <div
            className="reveal d3"
            style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "40px 32px",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗳️</div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "18px",
                color: "var(--navy)",
                marginBottom: "8px",
              }}
            >
              Nenhuma enquete aberta no momento
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--muted)",
                marginBottom: "24px",
              }}
            >
              As enquetes são publicadas pelos Grupos de Trabalho conforme
              abertura. Fique atento aos comunicados da rede.
            </p>
            <a href="mailto:bibliomemojus@gmail.com" className="btn btn-primary">
              Solicitar aviso por e-mail →
            </a>
          </div>
        </div>
      </section>

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Conheça os Grupos de Trabalho</h3>
          <p>
            Os GTs são responsáveis por abrir as enquetes. Conheça cada grupo e
            suas áreas de atuação.
          </p>
          <Link to="/#grupos" className="btn btn-primary">
            Ver todos os GTs →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default EnquetesPage

export const Head = () => (
  <>
    <title>Enquetes | BIBLIOMEMOJUS</title>
    <meta
      name="description"
      content="Participe das enquetes da Bibliomemojus e contribua com as decisões estratégicas da Rede Nacional de Bibliotecas Judiciárias."
    />
  </>
)
