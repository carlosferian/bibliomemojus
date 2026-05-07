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
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const handleScroll = () =>
      nav.classList.toggle("scrolled", window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const close = () => setMenuOpen(false)
  const isActive = page => (activePage === page ? "active" : "")

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
          <Link to="/#grupos" className={isActive("grupos")} onClick={close}>Grupos de Trabalho</Link>
          <Link to="/eventos" className={isActive("eventos")} onClick={close}>Eventos</Link>
          <Link to="/projetos" className={isActive("projetos")} onClick={close}>Publicações</Link>
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
