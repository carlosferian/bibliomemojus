import React from "react"
import GTPage from "../../components/GTPage"
import { GTS } from "../../data/gts"
const NUM = 1
const gt = GTS[1 - 1]
const prev = NUM > 1 ? GTS[1 - 2] : null
const next = 1 < 7 ? GTS[NUM] : null
const Page = () => <GTPage gt={gt} prev={prev} next={next} />
export default Page
export const Head = () => <title>GT 1 — {gt ? gt.name : ""} | BIBLIOMEMOJUS</title>
