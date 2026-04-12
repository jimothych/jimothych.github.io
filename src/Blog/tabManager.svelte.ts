import { type BlogData, TEMPLATE } from "./blogs/template/template";
import { BLOG1 } from "./blogs/blog1/blog1";

const BLOGS = new Map<string, BlogData>();
for(const blog of [
  BLOG1
]) {
  BLOGS.set(blog.slug, blog);
}

class TabManager {
  blogData = $state<BlogData | null>(null);
  activeTabSlug = $state<string>("home");

  reset() {
    this.blogData = null;
    this.activeTabSlug = "home"
  }
}

let tabManager = new TabManager();
export { tabManager, BLOGS }