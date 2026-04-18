import { VICTIONARIUM } from "../Terminal/commands/victionarium";
import { BLOG } from "../Terminal/commands/blog";
import { toast } from "./toast/toastController.svelte";
import { windowManager } from "./windowManager.svelte";

class URLManager {
  pathname = $state<string>(window.location.pathname);

  isRestoringHistory = $state(false);
  constructor() {
    window.addEventListener('popstate', () => { //keeps track of browser history
      this.isRestoringHistory = true;
      this.pathname = window.location.pathname;

      //to clear stale open windows if history nav goes back to root
      if(this.pathname === "/") { this.reload(); }

      //to re-open stale closed windows if history nav goes back to open window
      if(!windowManager.hasActiveApp) { this.reload(); }
    });
  }

  //navigates absolute from root
  navigate(path: string): void {
    if (window.location.pathname === path) { return; } //guard against duplicate nav
    window.history.pushState(null, '', path);
    this.pathname = path;
    //console.log(`navigating to: ${this.pathname}`);
  }

  reload(): void {
    window.location.reload();
  }

  //this method's purpose is just to get the app mounted.
  //url management once the app is mounted is up to the app to implement.
  getInitialRoute(): string {
    const path = this.pathname;
    const segments = path.split('/').filter(Boolean); //split & filter out empty strings

    if(segments.length === 0) { return ""; } //root

    if(segments[0] === VICTIONARIUM.name) { 
      return VICTIONARIUM.name; 
    }
    if(segments[0] === BLOG.name) {
      return BLOG.name;
    }

    // 404 unknown route fallback
    toast.open(`<p>invalid path :(<br>redirecting to root</p>`);
    this.navigate("/");
    return "";
  }

  getSubpath(appName: string): string | null {
    const segments = this.pathname.split('/').filter(Boolean);
    if (segments[0] !== appName || segments.length < 2) { return null; }

    if(segments.length > 2) { 
      toast.open(`<p>redirecting to /${segments[1]}</p>`);
    }
    return segments[1];
  }
}

let urlManager = new URLManager();
export { urlManager }