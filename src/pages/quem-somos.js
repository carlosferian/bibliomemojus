import React, { useEffect, useMemo } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SeoHead from "../components/SeoHead"
import { GTS } from "../data/gts"

const getInitials = nome => {
  const parts = nome.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : nome.slice(0, 2).toUpperCase()
}

const MemberCard = ({ m, i }) => (
  <div className={`member-card reveal d${(i % 3) + 1}`}>
    <div className="member-avatar">
      {m.foto
        ? <img src={m.foto} alt={m.nome} className="member-photo" />
        : <span className="member-initials" aria-hidden="true">{getInitials(m.nome)}</span>
      }
    </div>
    <div className="member-info">
      <p className="member-cargo">{m.cargo}</p>
      <p className="member-nome">{m.nome}</p>
      <p className="member-inst">{m.instituicao}</p>
      {m.mini_bio && <p className="member-bio">{m.mini_bio}</p>}
      {m.linkedin && (
        <a href={m.linkedin} target="_blank" rel="noreferrer" className="member-linkedin">
          LinkedIn →
        </a>
      )}
    </div>
  </div>
)

const QuemSomosPage = () => {
  const data = useStaticQuery(graphql`
    query QuemSomos {
      allMarkdownRemark(
        filter: {
          fields: { collection: { eq: "membros" } }
          frontmatter: { ativo: { eq: true } }
        }
        sort: { frontmatter: { ordem: ASC } }
      ) {
        nodes {
          frontmatter {
            nome
            cargo
            gt
            instituicao
            mini_bio
            linkedin
            foto
          }
        }
      }
    }
  `)

  const members = data.allMarkdownRemark.nodes.map(n => n.frontmatter)

  const byGT = useMemo(() => {
    const map = {}
    members.forEach(m => {
      const key = String(m.gt)
      if (!map[key]) map[key] = []
      map[key].push(m)
    })
    return map
  }, [members])

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
      <Navbar activePage="quem-somos" />

      <section className="page-hero">
        <div className="orb orb-1" style={{ opacity: 0.6 }} />
        <div className="page-hero-inner">
          <div>
            <span className="gt-num-badge">Coordenação</span>
          </div>
          <h1>
            Quem somos
            <br />
            <strong>nós</strong>
          </h1>
          <p className="page-hero-sub">
            Conheça os coordenadores e subcoordenadores das sete Coordenações
            da Bibliomemojus — profissionais de bibliotecas judiciárias de todo
            o Brasil.
          </p>
        </div>
      </section>

      <section className="section about">
        <div className="section-inner">
          {GTS.map(gt => {
            const gtMembers = byGT[String(gt.num)] || []
            return (
              <div key={gt.num} className="members-section reveal">
                <div className="members-section-header">
                  <span className="members-gt-badge">Coord. {gt.num}</span>
                  <span className="members-gt-name">{gt.name}</span>
                  <Link to={`/grupos/${gt.slug}`} className="members-gt-link">
                    Ver Coordenação →
                  </Link>
                </div>

                {gtMembers.length > 0 ? (
                  <div className="members-grid">
                    {gtMembers.map((m, i) => (
                      <MemberCard key={`${gt.num}-${m.nome}`} m={m} i={i} />
                    ))}
                  </div>
                ) : (
                  <div className="member-empty">
                    A coordenação deste GT será divulgada em breve.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <div className="enquete-strip">
        <div className="enquete-strip-inner reveal">
          <h3>Faça parte da rede!</h3>
          <p>
            Entre em contato e saiba como sua biblioteca pode integrar a
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

export default QuemSomosPage

export const Head = () => (
  <SeoHead
    title="Quem Somos Nós | BIBLIOMEMOJUS"
    description="Conheça a coordenação da Bibliomemojus — coordenadores e subcoordenadores das sete Coordenações da Rede Nacional de Bibliotecas Judiciárias."
    path="/quem-somos"
  />
)
