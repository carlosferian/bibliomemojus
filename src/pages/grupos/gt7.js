import React from "react"
import GTPage from "../../components/GTPage"
import { GTS } from "../../data/gts"
const NUM = 7
const gt = GTS[7 - 1]
const prev = NUM > 1 ? GTS[7 - 2] : null
const next = 7 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => <title>GT 7 — {gt ? gt.name : ""} | BIBLIOMEMOJUS</title>
