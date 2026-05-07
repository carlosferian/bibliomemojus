import React from "react"
import { Link } from "gatsby"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const NotFoundPage = () => (
  <>
    <Navbar />

    <section className="page-hero">
      <div className="orb orb-1" style={{ opacity: 0.5 }} />
      <div className="page-hero-inner" style={{ textAlign: "center" }}>
        <span className="gt-num-badge">404</span>
        <h1>
          Página não
          <br />
          <strong>encontrada</strong>
        </h1>
        <p className="page-hero-sub">
          O endereço que você acessou não existe ou foi movido.
          Use os links abaixo para continuar navegando.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "32px" }}>
          <Link to="/" className="btn btn-primary">← Ir para a Home</Link>
          <Link to="/noticias" className="btn btn-outline">Ver Notícias</Link>
          <Link to="/eventos" className="btn btn-outline">Ver Eventos</Link>
        </div>
      </div>
    </section>

    <Footer />
  </>
)

export default NotFoundPage

export const Head = () => (
  <>
    <title>Página não encontrada | BIBLIOMEMOJUS</title>
    <meta name="description" content="A página que você procura não existe. Volte à home da Bibliomemojus." />
  </>
)
