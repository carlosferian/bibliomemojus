import React, { useEffect } from "react"
import { Link } from "gatsby"
import Navbar from "./Navbar"
import Footer from "./Footer"

const ResourceCard = ({ res, index }) => {
  const cls = `resource-card reveal d${(index % 4) + 1}${res.link ? " is-available" : " is-soon"}`
  const inner = (
    <>
      <span className="resource-card-icon" aria-hidden="true">{res.icon}</span>
      <p className="resource-card-title">{res.title}</p>
      <p className="resource-card-desc">{res.desc}</p>
      {res.link
        ? <span className="resource-card-cta">Acessar →</span>
        : <span className="resource-card-soon">Em breve</span>
      }
    </>
  )
  if (res.link && res.link.startsWith("/"))
    return <Link to={res.link} className={cls}>{inner}</Link>
  if (res.link)
    return <a href={res.link} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  return <div className={cls}>{inner}</div>
}

const GTPage = ({ gt, prev, next }) => {
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
      <Navbar activePage="grupos" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.6 }} />
        <div className="page-hero-inner">
          <Link to="/#grupos" className="back-link">
            ← Coordenações
          </Link>
          <div>
            <span className="gt-num-badge">Coord. {gt.num}</span>
          </div>
          <h1>{gt.name}</h1>
          <p className="page-hero-sub">{gt.shortDesc}</p>
          <div className="page-hero-chips">
            {gt.chips.map(chip => (
              <span className="page-hero-chip" key={chip}>{chip}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Descrição + Atividades */}
      <section className="section about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="gt-content reveal">
              <p className="tag-label">Sobre a Coord. {gt.num}</p>
              <h2 className="section-title">{gt.name}</h2>
              <p>{gt.longDesc}</p>
              <p>
                A coordenação se reúne periodicamente para desenvolver seu Plano
                de Ação, compartilhar experiências e produzir materiais que
                fortalecem as bibliotecas judiciárias em todo o Brasil.
              </p>
              <div style={{ marginTop: "28px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link to="/#grupos" className="btn btn-outline">
                  ← Todas as Coordenações
                </Link>
              </div>
            </div>

            <div>
              <p className="tag-label reveal d1">Atividades</p>
              <ul className="gt-activities reveal d2">
                {gt.activities.map((act, i) => (
                  <li className="gt-activity-item" key={i}>
                    <span className="gt-activity-dot" />
                    <span className="gt-activity-text">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="section" style={{ background: "var(--cream)", paddingTop: "48px", paddingBottom: "48px" }}>
        <div className="section-inner">
          <p className="tag-label reveal">Recursos</p>
          <h3
            className="section-title reveal d1"
            style={{ fontSize: "clamp(20px,2.5vw,32px)" }}
          >
            Materiais produzidos pela Coordenação
          </h3>
          <div className="resource-grid">
            {gt.resources.map((res, i) => (
              <ResourceCard key={i} res={res} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Calendário */}
      <section className="section" style={{ background: "var(--white)", paddingTop: "48px", paddingBottom: "64px" }}>
        <div className="section-inner">
          <p className="tag-label reveal">Calendário</p>
          <h3
            className="section-title reveal d1"
            style={{ fontSize: "clamp(20px,2.5vw,32px)" }}
          >
            Agenda da Coord. {gt.num}
          </h3>

          {gt.calendarEmbedUrl ? (
            <div className="gt-calendar-wrap reveal d2">
              <iframe
                src={gt.calendarEmbedUrl}
                title={`Calendário da Coord. ${gt.num} — ${gt.name}`}
                className="gt-calendar-iframe"
                style={{ border: "none" }}
                scrolling="no"
                aria-label={`Calendário da Coord. ${gt.num}`}
              />
            </div>
          ) : (
            <div className="gt-calendar-placeholder reveal d2">
              <span className="gt-calendar-ph-icon" aria-hidden="true">📅</span>
              <p className="gt-calendar-ph-title">Calendário em configuração</p>
              <p className="gt-calendar-ph-sub">
                A agenda da Coord. {gt.num} será disponibilizada em breve.
                Entre em contato para obter informações sobre os próximos encontros.
              </p>
              <a
                href="mailto:bibliomemojus@gmail.com"
                className="btn btn-outline"
                style={{ marginTop: "20px", display: "inline-flex" }}
              >
                Solicitar informações
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Nav entre GTs */}
      <div
        style={{
          background: "var(--cream)",
          borderTop: "1px solid var(--border)",
          padding: "28px",
        }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {prev ? (
            <Link to={`/grupos/${prev.slug}`} className="btn btn-outline">
              ← Coord. {prev.num}: {prev.name}
            </Link>
          ) : (
            <span />
          )}
          <Link to="/#grupos" className="btn btn-dark">
            Todas as Coordenações
          </Link>
          {next ? (
            <Link to={`/grupos/${next.slug}`} className="btn btn-outline">
              Coord. {next.num}: {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default GTPage
