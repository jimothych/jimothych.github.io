import { WINDOW_ID_ENUM, type WINDOW_ID } from "./utilities.svelte";
import { type Component } from "svelte";
import TerminalHeader from "../Terminal/TerminalHeader.svelte";
import Terminal from "../Terminal/Terminal.svelte";
import VictionariumHeader from "../Victionarium/VictionariumHeader.svelte";
import Victionarium from "../Victionarium/Victionarium.svelte";
import Blog from "../Blog/Blog.svelte";
import BlogHeader from "../Blog/BlogHeader.svelte";
import { urlManager } from "./urlManager.svelte";

type APPLICATION = {
  ID: WINDOW_ID,
  HEADER: Component<any>,
  CONTENT: Component<any>,
  FONT_FAMILY: "Ubuntu Mono" | "Ubuntu Sans",
  TEXT_COLOR: "--white" | "--pink",
  OFFSET_X: number,
  OFFSET_Y: number,
  INITIAL_WIDTH: string,
  INITIAL_HEIGHT: string,
  BORDER_COLOR: "--dark-grey" | "--black"
};
const TERMINAL: APPLICATION = {
  ID: WINDOW_ID_ENUM.TERMINAL, 
  HEADER: TerminalHeader, 
  CONTENT: Terminal,
  FONT_FAMILY: "Ubuntu Mono",
  TEXT_COLOR: "--pink",
  OFFSET_X: 0,
  OFFSET_Y: 0,
  INITIAL_WIDTH: "60vw",
  INITIAL_HEIGHT: "70vh",
  BORDER_COLOR: "--dark-grey",
} as const;
const VICTIONARIUM: APPLICATION = {
  ID: WINDOW_ID_ENUM.VICTIONARIUM, 
  HEADER: VictionariumHeader, 
  CONTENT: Victionarium,
  FONT_FAMILY: "Ubuntu Sans",
  TEXT_COLOR: "--white",
  OFFSET_X: 0.20, //relative percentage of screen width
  OFFSET_Y: -0.01, //relative percentage of screen height
  INITIAL_WIDTH: "50vw",
  INITIAL_HEIGHT: "95vh",
  BORDER_COLOR: "--black",
} as const;
const BLOG: APPLICATION = {
  ID: WINDOW_ID_ENUM.BLOG, 
  HEADER: BlogHeader, 
  CONTENT: Blog,
  FONT_FAMILY: "Ubuntu Sans",
  TEXT_COLOR: "--white",
  OFFSET_X: 0.10, //relative percentage of screen width
  OFFSET_Y: -0.01, //relative percentage of screen height
  INITIAL_WIDTH: "60vw",
  INITIAL_HEIGHT: "95vh",
  BORDER_COLOR: "--black",
} as const;
const APPLICATIONS: APPLICATION[] = [TERMINAL, VICTIONARIUM, BLOG];

//decided that only one app can be open at a time besides the terminal (kinda like a process) such that shareable urls can work
type ActiveWindowPair = {
  terminal: APPLICATION;
  app: APPLICATION | null;
};
type WindowZOrder = {
  bottom: WINDOW_ID;
  top: WINDOW_ID;
}

class WindowManager {
  activeWindows = $state<ActiveWindowPair>({ terminal: TERMINAL, app: null });
  hasActiveApp = $derived<boolean>(this.activeWindows.app ? true : false);

  windowZOrder = $state<WindowZOrder>({ bottom: WINDOW_ID_ENUM.TERMINAL, top: WINDOW_ID_ENUM.TERMINAL });
  activeWindow = $derived<WINDOW_ID>(this.windowZOrder.top);

  closeApp(): void { //reset back to just terminal
    this.activeWindows.app = null;
    this.windowZOrder = { bottom: WINDOW_ID_ENUM.TERMINAL, top: WINDOW_ID_ENUM.TERMINAL };
    urlManager.navigate("/");
  }

  openApp(id: WINDOW_ID): void {
    const app = APPLICATIONS.find((app) => { return app.ID === id; });
    if(!app) { return; }
    if(this.hasActiveApp) { return; } //only one app at a time (not including terminal) can be opened
    if(this.activeWindows.app?.ID !== id) { 
      this.activeWindows.app = app; 
    }
    this.setActiveWindow(id);
  } 

  setActiveWindow(id: WINDOW_ID): void { 
    if(this.activeWindow === id) { return; } 
    const previousTop = this.windowZOrder.top === id ? this.windowZOrder.bottom : this.windowZOrder.top;
    this.windowZOrder = { bottom: previousTop, top: id };
    console.log(`currently focused window: ${id}`);
  }

  getZIndex(id: WINDOW_ID): number {
    if(this.windowZOrder.top === id) { return 2; }
    if(this.windowZOrder.bottom === id) { return 1; }
    return 0;
  }
}

let windowManager = new WindowManager();
export { windowManager }
