import React from "react"
import GTPage from "../../components/GTPage"
import { GTS } from "../../data/gts"
const NUM = 5
const gt = GTS[5 - 1]
const prev = NUM > 1 ? GTS[5 - 2] : null
const next = 5 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => <title>GT 5 — {gt ? gt.name : ""} | BIBLIOMEMOJUS</title>
