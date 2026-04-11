import horizontal_placeholder from "../../../assets/horizontal_placeholder.webp"
import { CONTENT } from "./content";

//only formats whitespace not special chars
function slugify(s: string): string { 
  return s.toLowerCase().trim().replace(/\s+/g, '-');
}

type BlogData = {
  slug: string,
  title: string,
  thumbnail: {
    description: string,
    date: string,
    asset: string
  },
  content: string
}

const TITLE = "This is a Placeholder Title"
const template: BlogData = {
  slug: slugify(TITLE),
  title: TITLE,
  thumbnail: {
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut mollit anim id est laborum.",
    date: "Nov 13, 2025",
    asset: horizontal_placeholder
  },
  content: CONTENT
}

export { slugify, template }
export type { BlogData }