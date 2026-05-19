import grand_asia_market from "../../../assets/grand_asia_market.webp"
import { type BlogData, slugify } from "../template/template"
import { CONTENT } from "./content"

const TITLE = "Grand Asia Market"
const BLOG2: BlogData = {
  slug: slugify(TITLE),
  title: TITLE,
  thumbnail: {
    description: "Without which I would have no Korean radish salad.",
    date: "May 18, 2026",
    asset: grand_asia_market
  },
  content: CONTENT
}

export { BLOG2 }