import React from "react"
import GTPage from "../../components/GTPage"
import { GTS } from "../../data/gts"
const NUM = 4
const gt = GTS[4 - 1]
const prev = NUM > 1 ? GTS[4 - 2] : null
const next = 4 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => <title>GT 4 — {gt ? gt.name : ""} | BIBLIOMEMOJUS</title>
