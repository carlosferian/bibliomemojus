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
            <li><a href="https://sites.google.com/view/bibliomemojus/in%C3%ADcio/sobre/quem-somos" target="_blank" rel="noreferrer">Quem Somos</a></li>
            <li><Link to="/projetos">Publicações</Link></li>
            <li><a href="mailto:bibliomemojus@gmail.com">Fale Conosco</a></li>
            <li><a href="https://sites.google.com/view/bibliomemojus/in%C3%ADcio/enquetes" target="_blank" rel="noreferrer">Enquetes</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Grupos de Trabalho</h4>
          <ul>
            <li><Link to="/grupos/gt1">GT1 — Gestão</Link></li>
            <li><Link to="/grupos/gt2">GT2 — Memória</Link></li>
            <li><Link to="/grupos/gt3">GT3 — Redes</Link></li>
            <li><Link to="/grupos/gt4">GT4 — Biblioteca Digital</Link></li>
            <li><Link to="/grupos/gt5">GT5 — Inovação</Link></li>
            <li><Link to="/grupos/gt6">GT6 — Agenda 2030</Link></li>
            <li><Link to="/grupos/gt7">GT7 — Capacitação</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Eventos</h4>
          <ul>
            <li><Link to="/eventos">1º ENABIJUD</Link></li>
            <li><Link to="/eventos">2º ENABIJUD</Link></li>
            <li><Link to="/eventos">3º ENABIJUD</Link></li>
            <li><Link to="/eventos">ENAM</Link></li>
            <li><Link to="/eventos">Como sediar o ENABIJUD</Link></li>
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
