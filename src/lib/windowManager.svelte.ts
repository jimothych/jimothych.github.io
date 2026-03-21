import { WINDOW_ID_ENUM, WINDOW_ID } from "./utilities";
import { Component } from "svelte";
import TerminalHeader from "../Terminal/TerminalHeader.svelte";
import TerminalInterface from "../Terminal/TerminalInterface.svelte";

type APPLICATION_TYPE = {
  ID: WINDOW_ID,
  HEADER: Component<any> | null,
  CONTENT: Component<any> | null,
};
const TERMINAL_APPLICATION: APPLICATION_TYPE = {
  ID: WINDOW_ID_ENUM.TERMINAL, 
  HEADER: TerminalHeader, 
  CONTENT: TerminalInterface
} as const;
const APPLICATIONS: APPLICATION_TYPE[] = [TERMINAL_APPLICATION];

class WindowManager {
  activeWindows = $state<APPLICATION_TYPE[]>([TERMINAL_APPLICATION]);
  currentlyFocusedWindow = $state<WINDOW_ID>(WINDOW_ID_ENUM.NONE);

  close(id: WINDOW_ID): void {
    this.activeWindows = this.activeWindows.filter((window) => { return window.ID !== id; });
  }

  open(id: WINDOW_ID): void {
    const app = APPLICATIONS.find((app) => { return app.ID === id; });
    if(app && !this.activeWindows.includes(app)) { this.activeWindows.push(app); }
  }

  setCurrentlyFocusedWindow(id: WINDOW_ID): void { 
    if(this.currentlyFocusedWindow != id) { 
      this.currentlyFocusedWindow = id; 
      console.log(`currently focused window: ${id}`);
    } 
  }
}

const windowManager = new WindowManager(); //singleton
export { windowManager }
