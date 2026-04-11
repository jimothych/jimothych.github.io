import { type BlogData, TEMPLATE } from "./blogs/template/template";
import { HELLO_WORLD } from "./blogs/hello-world/helloWorld";

const BLOGS = new Map<string, BlogData>();
for(const blog of [
  HELLO_WORLD
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