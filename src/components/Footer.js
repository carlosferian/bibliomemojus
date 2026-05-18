import React from "react"
import { Link } from "gatsby"

const Footer = () => (
  <footer id="contato">
    <div className="footer-inner">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">BIBLIOMEMOJUS</p>
          <p className="footer-tagline">
            A Bibliomemojus é a Rede Nacional de Bibliotecas Judiciárias.
            Conecta profissionais e amplia o acesso à informação jurídica no Brasil.
          </p>
          <p className="footer-email">
            📩{" "}
            <a href="mailto:bibliomemojus@gmail.com">bibliomemojus@gmail.com</a>
          </p>
        </div>
        <div className="footer-col">
          <h4>Sobre</h4>
          <ul>
            <li><Link to="/sobre">Quem Somos</Link></li>
            <li><Link to="/projetos">Publicações</Link></li>
            <li><a href="mailto:bibliomemojus@gmail.com">Fale Conosco</a></li>
            <li><Link to="/enquetes">Enquetes</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Coordenações</h4>
          <ul>
            <li><Link to="/grupos/gt1">Coord. 1 — Gestão de Bibliotecas</Link></li>
            <li><Link to="/grupos/gt2">Coord. 2 — Memória</Link></li>
            <li><Link to="/grupos/gt3">Coord. 3 — Inovação e Tecnologia</Link></li>
            <li><Link to="/grupos/gt4">Coord. 4 — Capacitação</Link></li>
            <li><Link to="/grupos/gt5">Coord. 5 — Direitos Humanos e Agenda 2030</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Eventos</h4>
          <ul>
            <li><Link to="/eventos/enabijud-1">1º ENABIJUD</Link></li>
            <li><Link to="/eventos/enabijud-2">2º ENABIJUD</Link></li>
            <li><Link to="/eventos/enabijud-3">3º ENABIJUD</Link></li>
            <li><Link to="/eventos/enam">ENAM</Link></li>
            <li><Link to="/eventos/como-sediar">Como sediar o ENABIJUD</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bibliomemojus — Rede Nacional de Bibliotecas Judiciárias</span>
        <span>
          Criado a partir da rede{" "}
          <a href="https://www.cnj.jus.br/" target="_blank" rel="noreferrer">MEMOJUS BRASIL</a>
        </span>
      </div>
    </div>
  </footer>
)

export default Footer
