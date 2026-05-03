import React, { useEffect, useRef } from "react"
import { Link } from "gatsby"

const Navbar = ({ activePage }) => {
  const navRef = useRef(null)
  const navLinksRef = useRef(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const handleScroll = () =>
      nav.classList.toggle("scrolled", window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    const links = navLinksRef.current
    if (!links) return
    const isOpen = links.style.display === "flex"
    links.style.cssText = isOpen
      ? ""
      : "display:flex;flex-direction:column;position:absolute;top:66px;left:0;right:0;background:rgba(22,34,47,.96);backdrop-filter:blur(18px);padding:14px 22px 22px;gap:2px;border-bottom:1px solid rgba(255,255,255,.08);"
  }

  const isActive = page => (activePage === page ? "active" : "")

  return (
    <nav className={`navbar${activePage && activePage !== "inicio" ? " solid" : ""}`} ref={navRef} id="navbar">
      <div className="nav-inner">
        <Link className="nav-logo" to="/">
          <div className="nav-logo-mark-img">
            <img src="/logo.jpeg" alt="BIBLIOMEMOJUS" />
          </div>
          <span className="nav-logo-text">BIBLIOMEMOJUS</span>
        </Link>
        <div className="nav-links" ref={navLinksRef} id="navLinks">
          <Link to="/" className={isActive("inicio")}>Início</Link>
          <Link to="/#sobre">Sobre</Link>
          <Link to="/#grupos" className={isActive("grupos")}>Grupos de Trabalho</Link>
          <Link to="/eventos" className={isActive("eventos")}>Eventos</Link>
          <Link to="/projetos" className={isActive("projetos")}>Publicações</Link>
          <Link to="/noticias" className={isActive("noticias")}>Notícias</Link>
          <a href="mailto:bibliomemojus@gmail.com" className="nav-cta">Fale Conosco</a>
        </div>
        <button className="hamburger" id="hamburger" aria-label="Menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
