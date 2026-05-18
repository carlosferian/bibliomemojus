import React from "react"
import GTPage from "../../components/GTPage"
import SeoHead from "../../components/SeoHead"
import { GTS } from "../../data/gts"
const NUM = 1
const gt   = GTS[NUM - 1]
const prev = NUM > 1 ? GTS[NUM - 2] : null
const next = NUM < GTS.length ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => (
  <SeoHead
    title={`Coord. ${NUM} — ${gt ? gt.name : ""} | BIBLIOMEMOJUS`}
    description={gt ? gt.shortDesc : ""}
    path={`/grupos/${gt ? gt.slug : ""}`}
  />
)
