import { VICTIONARIUM } from "../Terminal/commands/victionarium";

class URLManager {
  pathname = $state<string>(window.location.pathname);

  //navigates absolute from root
  navigate(path: string): void {
    window.history.pushState(null, '', path);
    this.pathname = path;
  }

  reload(): void {
    this.navigate("/");
    window.location.reload();
  }

  getInitialRoute(): string {
    //add listener for next and prev browser history actions
    //handling this as an edge case. Dont want to add active browser url history as a feature
    window.addEventListener('popstate', () => { this.reload(); });

    const path = this.pathname;
    const segments = path.split('/').filter(Boolean); //split & filter out empty strings

    if(segments.length === 0) { return ""; } //root

    if((segments.length === 1) && (segments[0] === VICTIONARIUM.name)) { 
      return VICTIONARIUM.name; 
    }

    //if(segments.length === 2 && validBlogSlugs.includes(segments[1])

    // 404 unknown route fallback
    this.navigate('/');
    //window.alert("invalid path! redirecting to root");
    return "";
  }
}

let urlManager = new URLManager();
export { urlManager }