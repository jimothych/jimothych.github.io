
import { type BlogData } from "./template/template";
import { BLOG1 } from "./blog1/blog1";

const BLOGS = new Map<string, BlogData>();
for(const blog of [
  BLOG1
]) {
  BLOGS.set(blog.slug, blog);
}

export { BLOGS }