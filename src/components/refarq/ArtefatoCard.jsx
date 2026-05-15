import React from "react"

const CATEGORIA_LABELS = {
  memoriaInstitucional: "Memória Institucional",
  aquisicaoLivros:      "Aquisição de Livros",
  digitalizacao:        "Digitalização",
  higienizacao:         "Higienização / Conservação",
  bibliotecaDigital:    "Biblioteca Digital",
  terceirizacao:        "Terceirização",
  estagiarios:          "Estágio",
  sistemasGestao:       "Sistemas de Gestão (SIGB)",
  inventarioAcervo:     "Inventário de Acervo",
  rfid:                 "RFID",
  restauracao:          "Restauração",
  consultoria:              "Consultoria",
  apresentacoesCulturais:   "Apresentações Culturais",
  outro:                    "Outro",
}

const TIPO_LABELS = {
  "edital":                    "Edital",
  "termo-de-referencia":       "Termo de Referência",
  "estudo-tecnico-preliminar": "Estudo Técnico Preliminar",
  "ata-de-registro-de-precos": "Ata de Registro de Preços",
  "contrato":                  "Contrato",
  "dispensa":                  "Dispensa",
  "inexigibilidade":           "Inexigibilidade",
  "projeto-basico":            "Projeto Básico",
  "outro":                     "Outro",
}

const ESFERA_LABELS = {
  federal:   "Federal",
  estadual:  "Estadual",
  municipal: "Municipal",
}

function formatValor(valor) {
  if (!valor) return null
  return new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor)
}

const ArtefatoCard = ({ artefato, index = 0 }) => {
  const {
    titulo, orgao, esfera, uf, categoria, tipoArtefato,
    dataPublicacao, resumo, valor, url, tags = [],
  } = artefato

  const delay = `d${(index % 5) + 1}`

  return (
    <article className={`artefato-card reveal ${delay}`}>
      <header className="artefato-card-header">
        <div className="artefato-card-badges">
          <span className="artefato-badge artefato-badge--tipo">
            {TIPO_LABELS[tipoArtefato] || tipoArtefato}
          </span>
          <span className="artefato-badge artefato-badge--esfera">
            {ESFERA_LABELS[esfera] || esfera}
          </span>
          {uf && (
            <span className="artefato-badge artefato-badge--uf">{uf}</span>
          )}
        </div>
        <span className="artefato-card-data">{dataPublicacao}</span>
      </header>

      <h3 className="artefato-card-titulo">{titulo}</h3>
      <p className="artefato-card-orgao">{orgao}</p>

      {resumo && (
        <p className="artefato-card-resumo">{resumo}</p>
      )}

      <footer className="artefato-card-footer">
        <div className="artefato-card-meta">
          <span className="artefato-badge artefato-badge--cat">
            {CATEGORIA_LABELS[categoria] || categoria}
          </span>
          {valor && (
            <span className="artefato-card-valor">{formatValor(valor)}</span>
          )}
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="artefato-card-link"
            aria-label={`Ver artefato: ${titulo}`}
          >
            Ver no PNCP →
          </a>
        )}
      </footer>

      {tags.length > 0 && (
        <ul className="artefato-card-tags" aria-label="Tags">
          {tags.map(tag => (
            <li key={tag} className="artefato-tag">{tag}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default ArtefatoCard
