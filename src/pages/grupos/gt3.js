import React from "react"
import GTPage from "../../components/GTPage"
import SeoHead from "../../components/SeoHead"
import { GTS } from "../../data/gts"
const NUM = 3
const gt = GTS[3 - 1]
const prev = NUM > 1 ? GTS[3 - 2] : null
const next = 3 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => (
  <SeoHead
    title={`GT ${NUM} — ${gt ? gt.name : ""} | BIBLIOMEMOJUS`}
    description={gt ? gt.shortDesc : ""}
    path={`/grupos/${gt ? gt.slug : ""}`}
  />
)
