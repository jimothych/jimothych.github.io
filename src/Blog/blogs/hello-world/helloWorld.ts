import horizontal_placeholder from "../../../assets/horizontal_placeholder.webp"
import { type BlogData, slugify } from "../template/template"
import { CONTENT } from "./content"

const TITLE = "Hello World"
const HELLO_WORLD: BlogData = {
  slug: slugify(TITLE),
  title: TITLE,
  thumbnail: {
    description: "So slick and seamless is Svelte...",
    date: "Apr 11, 2026",
    asset: horizontal_placeholder
  },
  content: CONTENT
}

export { HELLO_WORLD }