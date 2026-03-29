import { VICTIONARIUM } from "../Terminal/commands/victionarium";
import { toast } from "./toast/toastController.svelte";

class URLManager {
  pathname = $state<string>(window.location.pathname);

  //navigates absolute from root
  navigate(path: string): void {
    window.history.pushState(null, '', path);
    this.pathname = path;
  }

  restart(): void {
    this.navigate("/");
    window.location.reload();
  }

  getInitialRoute(): string {
    //add listener for next and prev browser history actions
    //handling this as an edge case. Dont want to add active browser url history as a feature
    window.addEventListener('popstate', () => { this.restart(); });

    const path = this.pathname;
    const segments = path.split('/').filter(Boolean); //split & filter out empty strings

    if(segments.length === 0) { return ""; } //root

    if(segments[0] === VICTIONARIUM.name) { 
      if(segments.length > 1) { 
        toast.open(
          `<p>victionarium doesn't support shareable urls :(<br>redirecting to /victionarium/{random}</p>`
        );
      }
      return VICTIONARIUM.name; 
    }

    //if(segments.length === 2 && validBlogSlugs.includes(segments[1])

    // 404 unknown route fallback
    toast.open(
      `<p>invalid path :(<br>redirecting to root</p>`
    );
    this.navigate("/");
    return "";
  }
}

let urlManager = new URLManager();
export { urlManager }