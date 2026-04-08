import { VICTIONARIUM } from "../Terminal/commands/victionarium";
import { toast } from "./toast/toastController.svelte";

class URLManager {
  pathname = $state<string>(window.location.pathname);

  isRestoringHistory = $state(false);
  constructor() {
    window.addEventListener('popstate', () => { //keeps track of browser history
      this.isRestoringHistory = true;
      this.pathname = window.location.pathname;
    });
  }

  //navigates absolute from root
  navigate(path: string): void {
    if (window.location.pathname === path) { return; } //guard against duplicate nav
    window.history.pushState(null, '', path);
    this.pathname = path;
  }

  restart(): void {
    this.navigate("/");
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

    // 404 unknown route fallback
    toast.open(`<p>invalid path :(<br>redirecting to root</p>`);
    this.navigate("/");
    return "";
  }

  getVictionariumSearchable(): string | null {
    const segments = this.pathname.split('/').filter(Boolean);
    if (segments[0] !== VICTIONARIUM.name || segments.length < 2) { return null; }

    if(segments.length > 2) { 
      toast.open(`<p>redirecting to /${segments[1]}</p>`);
    }
    return segments[1];
  }
}

let urlManager = new URLManager();
export { urlManager }