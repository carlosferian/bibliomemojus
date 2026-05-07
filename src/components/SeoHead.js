import React from "react"

const SITE_URL = "https://bibliomemojus.netlify.app"
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpeg`
const SITE_NAME = "BIBLIOMEMOJUS"

const SeoHead = ({ title, description, image, path = "" }) => {
  const ogImage = image ? `${SITE_URL}${image}` : DEFAULT_IMAGE
  const canonical = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}

export default SeoHead
