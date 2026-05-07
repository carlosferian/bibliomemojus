import React, { useEffect } from "react"
import { Link } from "gatsby"
import Navbar from "./Navbar"
import Footer from "./Footer"

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
            ← Grupos de Trabalho
          </Link>
          <div>
            <span className="gt-num-badge">GT {gt.num}</span>
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

      <section className="section about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="gt-content reveal">
              <p className="tag-label">Sobre o GT {gt.num}</p>
              <h2 className="section-title">{gt.name}</h2>
              <p>{gt.longDesc}</p>
              <p>
                O grupo se reúne periodicamente para desenvolver seu Plano de
                Ação, compartilhar experiências e produzir materiais que
                fortalecem as bibliotecas judiciárias em todo o Brasil.
              </p>
              <div style={{ marginTop: "28px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link to="/#grupos" className="btn btn-outline">
                  ← Todos os GTs
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

          <div style={{ marginTop: "64px" }}>
            <p className="tag-label reveal">Recursos</p>
            <h3
              className="section-title reveal d1"
              style={{ fontSize: "clamp(20px,2.5vw,32px)" }}
            >
              Materiais produzidos pelo GT
            </h3>
            <div className="resource-grid">
              {gt.resources.map((res, i) => (
                <div
                  key={i}
                  className={`resource-card reveal d${(i % 4) + 1}`}
                >
                  <span className="resource-card-icon" aria-hidden="true">{res.icon}</span>
                  <p className="resource-card-title">{res.title}</p>
                  <p className="resource-card-desc">{res.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nav between GTs */}
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
              ← GT {prev.num}: {prev.name}
            </Link>
          ) : (
            <span />
          )}
          <Link to="/#grupos" className="btn btn-dark">
            Todos os Grupos
          </Link>
          {next ? (
            <Link to={`/grupos/${next.slug}`} className="btn btn-outline">
              GT {next.num}: {next.name} →
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
