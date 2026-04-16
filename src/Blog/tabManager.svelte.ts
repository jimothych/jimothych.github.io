import { type BlogData } from "./blogs/template/template";

class TabManager {
  blogData = $state<BlogData | null>(null);
  activeTabSlug = $state<string>("home");

  reset() {
    this.blogData = null;
    this.activeTabSlug = "home"
  }
}

let tabManager = new TabManager();
export { tabManager }