import React from "react"
import GTPage from "../../components/GTPage"
import SeoHead from "../../components/SeoHead"
import { GTS } from "../../data/gts"
const NUM = 1
const gt = GTS[1 - 1]
const prev = NUM > 1 ? GTS[1 - 2] : null
const next = 1 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => (
  <SeoHead
    title={`GT ${NUM} — ${gt ? gt.name : ""} | BIBLIOMEMOJUS`}
    description={gt ? gt.shortDesc : ""}
    path={`/grupos/${gt ? gt.slug : ""}`}
  />
)
