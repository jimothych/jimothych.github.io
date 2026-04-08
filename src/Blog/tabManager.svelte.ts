import { BlogContract } from "./blogs/template/template";

const TAB_ENUM = {
  HOME: "HOME",
  BLOG: "BLOG",
} as const;
type Tab = typeof TAB_ENUM[keyof typeof TAB_ENUM];

class TabManager {
  blogData = $state<BlogContract | null>(null);
  activeTabID = $state<Tab>(TAB_ENUM.HOME);
}

let tabManager = new TabManager();
export { tabManager, TAB_ENUM }