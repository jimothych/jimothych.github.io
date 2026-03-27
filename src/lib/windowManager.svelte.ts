import { WINDOW_ID_ENUM, WINDOW_ID } from "./utilities.svelte";
import { Component } from "svelte";
import TerminalHeader from "../Terminal/TerminalHeader.svelte";
import Terminal from "../Terminal/Terminal.svelte";
import VictionariumHeader from "../Victionarium/VictionariumHeader.svelte";
import Victionarium from "../Victionarium/Victionarium.svelte";
import { urlManager } from "./urlManager.svelte";

type APPLICATION = {
  ID: WINDOW_ID,
  HEADER: Component<any> | null,
  CONTENT: Component<any> | null,
  FONT_FAMILY: "Ubuntu Mono" | "Ubuntu Sans",
  TEXT_COLOR: "--white" | "--pink",
  OFFSET_X: number,
  OFFSET_Y: number,
  INITIAL_WIDTH: string,
  INITIAL_HEIGHT: string,
  BORDER_COLOR: "--dark-grey" | "--black"
};
const TERMINAL_APPLICATION: APPLICATION = {
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
const VICTIONARIUM_APPLICATION: APPLICATION = {
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
const APPLICATIONS: APPLICATION[] = [TERMINAL_APPLICATION, VICTIONARIUM_APPLICATION];

class WindowManager {
  activeWindows = $state<APPLICATION[]>([TERMINAL_APPLICATION]);
  //decided that only one app can be open at a time besides the terminal (kinda like a process) such that reactive state based on urls can work
  hasActiveApp = $derived<boolean>((this.activeWindows.length > 1) ? true : false);

  windowZOrder = $state<WINDOW_ID[]>([WINDOW_ID_ENUM.TERMINAL]);
  currentlyFocusedWindow = $derived<WINDOW_ID>(
    this.windowZOrder.at(-1) ?? WINDOW_ID_ENUM.NONE //either last elem or none
  );

  close(): void { //reset back to just terminal
    this.activeWindows = [TERMINAL_APPLICATION];
    this.windowZOrder = [WINDOW_ID_ENUM.TERMINAL];
    urlManager.navigate("/");
  }

  open(id: WINDOW_ID): void {
    const app = APPLICATIONS.find((app) => { return app.ID === id; });
    if(!app) { return; }
    if(this.hasActiveApp) { return; } //only one app at a time (not including terminal) can be opened

    if(!this.activeWindows.some((activeWindow) => activeWindow.ID === id)) { 
      this.activeWindows.push(app); 
    }
    this.setCurrentlyFocusedWindow(id);
  } 

  setCurrentlyFocusedWindow(id: WINDOW_ID): void { 
    if(this.currentlyFocusedWindow == id) { return; } 

    const targetRemoved = this.windowZOrder.filter((windowID) => windowID !== id);
    const targetReplacedOnTop = [...targetRemoved, id];
    this.windowZOrder = targetReplacedOnTop;
    console.log(`currently focused window: ${id}`);
  }

  getZIndex(id: WINDOW_ID): number {
    return this.windowZOrder.indexOf(id); // -1 for unknown, 0...n otherwise
  }
}

const windowManager = new WindowManager(); //singleton
export { windowManager }
