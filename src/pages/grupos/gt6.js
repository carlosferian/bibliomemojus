import React from "react"
import GTPage from "../../components/GTPage"
import { GTS } from "../../data/gts"
const NUM = 6
const gt = GTS[6 - 1]
const prev = NUM > 1 ? GTS[6 - 2] : null
const next = 6 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => <title>GT 6 — {gt ? gt.name : ""} | BIBLIOMEMOJUS</title>
