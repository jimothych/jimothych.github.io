import horizontal_placeholder from "../../../assets/horizontal_placeholder.webp"
import { type BlogData, slugify } from "../template/template"
import { CONTENT } from "./content"

const TITLE = "So Slick and Seamless is Svelte"
const BLOG1: BlogData = {
  slug: slugify(TITLE),
  title: TITLE,
  thumbnail: {
    description: "A behind-the-scenes look at how this website works along with some thoughts about Svelte now that I've used it to make something.",
    date: "Apr 12, 2026",
    asset: horizontal_placeholder
  },
  content: CONTENT
}

export { BLOG1 }