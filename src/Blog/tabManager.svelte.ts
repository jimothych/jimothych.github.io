import { type BlogData, template } from "./blogs/template/template";

const BLOGS = new Map<string, BlogData>();
for(const blog of [
  template
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