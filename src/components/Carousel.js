import React, { useState, useEffect, useCallback } from "react"
import { Link } from "gatsby"

const Carousel = ({ items }) => {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() =>
    setIdx(i => (i - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() =>
    setIdx(i => (i + 1) % items.length), [items.length])

  useEffect(() => {
    if (paused || items.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next, items.length])

  if (!items.length) return null

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-viewport">
        {items.map((item, i) => {
          const isActive = i === idx
          const hasLink = item.link_interno || item.link_externo
          const inner = (
            <div className="carousel-slide-inner">
              {item.tag && <span className="ev-tag">{item.tag}</span>}
              <p className="carousel-title">{item.titulo}</p>
              {item.resumo && <p className="carousel-excerpt">{item.resumo}</p>}
              {(item.fonte || item.data) && (
                <p className="carousel-meta">
                  {[item.fonte, item.data].filter(Boolean).join(" · ")}
                </p>
              )}
              {hasLink && <span className="carousel-cta">Leia mais →</span>}
            </div>
          )
          const cls = `carousel-slide${isActive ? " is-active" : ""}`
          if (item.link_interno)
            return <Link key={i} to={item.link_interno} className={cls} aria-hidden={!isActive}>{inner}</Link>
          if (item.link_externo)
            return <a key={i} href={item.link_externo} target="_blank" rel="noreferrer" className={cls} aria-hidden={!isActive}>{inner}</a>
          return <div key={i} className={cls} aria-hidden={!isActive}>{inner}</div>
        })}
      </div>

      {items.length > 1 && (
        <>
          <button className="carousel-btn carousel-prev" onClick={prev} aria-label="Destaque anterior">
            ‹
          </button>
          <button className="carousel-btn carousel-next" onClick={next} aria-label="Próximo destaque">
            ›
          </button>
          <div className="carousel-dots" role="tablist" aria-label="Destaques">
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Destaque ${i + 1}`}
                className={`carousel-dot${i === idx ? " is-active" : ""}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Carousel
