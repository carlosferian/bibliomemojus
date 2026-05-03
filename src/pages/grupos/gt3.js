import React from "react"
import GTPage from "../../components/GTPage"
import { GTS } from "../../data/gts"
const NUM = 3
const gt = GTS[3 - 1]
const prev = NUM > 1 ? GTS[3 - 2] : null
const next = 3 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => <title>GT 3 — {gt ? gt.name : ""} | BIBLIOMEMOJUS</title>
