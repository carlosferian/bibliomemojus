import React from "react"
const Seo = ({ title, description, children }) => (
  <>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {children}
  </>
)
export default Seo
