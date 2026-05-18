import React, { useEffect, useRef, useState } from "react"
import { Link } from "gatsby"

const MENU_OPEN_STYLE = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "66px",
  left: 0,
  right: 0,
  background: "rgba(22,34,47,.96)",
  backdropFilter: "blur(18px)",
  padding: "14px 22px 22px",
  gap: "2px",
  borderBottom: "1px solid rgba(255,255,255,.08)",
}

const Navbar = ({ activePage }) => {
  const navRef          = useRef(null)
  const dropRef         = useRef(null)
  const dropCoordsRef   = useRef(null)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [dropOpen,      setDropOpen]      = useState(false)
  const [dropCoordsOpen, setDropCoordsOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const handleScroll = () =>
      nav.classList.toggle("scrolled", window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (dropCoordsRef.current && !dropCoordsRef.current.contains(e.target)) setDropCoordsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const close = () => { setMenuOpen(false); setDropOpen(false); setDropCoordsOpen(false) }
  const isActive = page => (activePage === page ? "active" : "")
  const isProjetosActive = ["projetos", "refarq", "ferramentas"].includes(activePage) ? "active" : ""
  const isCoordsActive   = ["grupos", "quem-somos"].includes(activePage) ? "active" : ""

  return (
    <nav
      className={`navbar${activePage && activePage !== "inicio" ? " solid" : ""}`}
      ref={navRef}
      id="navbar"
    >
      <div className="nav-inner">
        <Link className="nav-logo" to="/" onClick={close}>
          <div className="nav-logo-mark-img">
            <img
              src="/logo.jpeg"
              alt="Logotipo da Bibliomemojus — Rede Nacional de Bibliotecas Judiciárias"
              width={38}
              height={46}
              loading="lazy"
            />
          </div>
          <span className="nav-logo-text">BIBLIOMEMOJUS</span>
        </Link>

        <div
          className="nav-links"
          id="navLinks"
          style={menuOpen ? MENU_OPEN_STYLE : undefined}
        >
          <Link to="/" className={isActive("inicio")} onClick={close}>Início</Link>
          <Link to="/sobre" className={isActive("sobre")} onClick={close}>Sobre</Link>

          {/* ── Dropdown Coordenações ── */}
          {menuOpen ? (
            <>
              <button
                className={`nav-dropdown-btn${isCoordsActive ? " active" : ""}`}
                onClick={() => setDropCoordsOpen(o => !o)}
                aria-expanded={dropCoordsOpen}
              >
                Coordenações <span className={`nav-dropdown-caret${dropCoordsOpen ? " is-open" : ""}`} aria-hidden="true">▾</span>
              </button>
              {dropCoordsOpen && (
                <div className="nav-dropdown-mobile">
                  <Link to="/#grupos" className={`nav-sub-link${isActive("grupos")}`} onClick={close}>
                    As Coordenações
                  </Link>
                  <Link to="/quem-somos" className={`nav-sub-link${isActive("quem-somos")}`} onClick={close}>
                    Coordenadores
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div
              className="nav-dropdown-wrap"
              ref={dropCoordsRef}
              onMouseEnter={() => setDropCoordsOpen(true)}
              onMouseLeave={() => setDropCoordsOpen(false)}
            >
              <button
                className={`nav-dropdown-btn${isCoordsActive ? " active" : ""}`}
                aria-haspopup="true"
                aria-expanded={dropCoordsOpen}
                onClick={() => setDropCoordsOpen(o => !o)}
              >
                Coordenações <span className={`nav-dropdown-caret${dropCoordsOpen ? " is-open" : ""}`} aria-hidden="true">▾</span>
              </button>
              {dropCoordsOpen && (
                <div className="nav-dropdown-panel" role="menu">
                  <Link to="/#grupos" role="menuitem" className={isActive("grupos")} onClick={close}>
                    As Coordenações
                  </Link>
                  <Link to="/quem-somos" role="menuitem" className={isActive("quem-somos")} onClick={close}>
                    Coordenadores
                  </Link>
                </div>
              )}
            </div>
          )}

          <Link to="/eventos" className={isActive("eventos")} onClick={close}>Eventos</Link>

          {/* ── Dropdown Projetos ── */}
          {menuOpen ? (
            <>
              <button
                className={`nav-dropdown-btn${isProjetosActive ? " active" : ""}`}
                onClick={() => setDropOpen(o => !o)}
                aria-expanded={dropOpen}
              >
                Projetos <span className={`nav-dropdown-caret${dropOpen ? " is-open" : ""}`} aria-hidden="true">▾</span>
              </button>
              {dropOpen && (
                <div className="nav-dropdown-mobile">
                  <Link to="/projetos" className={`nav-sub-link${isActive("projetos")}`} onClick={close}>
                    Iniciativas &amp; Projetos
                  </Link>
                  <Link to="/refarq" className={`nav-sub-link${isActive("refarq")}`} onClick={close}>
                    Banco de Contratações
                  </Link>
                  <Link to="/ferramentas" className={`nav-sub-link${isActive("ferramentas")}`} onClick={close}>
                    Ferramentas
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div
              className="nav-dropdown-wrap"
              ref={dropRef}
              onMouseEnter={() => setDropOpen(true)}
              onMouseLeave={() => setDropOpen(false)}
            >
              <button
                className={`nav-dropdown-btn${isProjetosActive ? " active" : ""}`}
                aria-haspopup="true"
                aria-expanded={dropOpen}
                onClick={() => setDropOpen(o => !o)}
              >
                Projetos <span className={`nav-dropdown-caret${dropOpen ? " is-open" : ""}`} aria-hidden="true">▾</span>
              </button>
              {dropOpen && (
                <div className="nav-dropdown-panel" role="menu">
                  <Link to="/projetos" role="menuitem" className={isActive("projetos")} onClick={close}>
                    Iniciativas &amp; Projetos
                  </Link>
                  <Link to="/refarq" role="menuitem" className={isActive("refarq")} onClick={close}>
                    Banco de Contratações
                  </Link>
                  <Link to="/ferramentas" role="menuitem" className={isActive("ferramentas")} onClick={close}>
                    Ferramentas
                  </Link>
                </div>
              )}
            </div>
          )}

          <Link to="/noticias" className={isActive("noticias")} onClick={close}>Notícias</Link>
          <a href="mailto:bibliomemojus@gmail.com" className="nav-cta" onClick={close}>Fale Conosco</a>
        </div>

        <button
          className={`hamburger${menuOpen ? " is-open" : ""}`}
          id="hamburger"
          aria-label="Abrir menu de navegação"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
