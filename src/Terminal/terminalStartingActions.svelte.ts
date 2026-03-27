import { tick } from "svelte";
import { windowManager } from "../lib/windowManager.svelte";
import { log, inputElementStore } from "./terminalStore.svelte";
import { sleep, WINDOW_ID_ENUM } from "../lib/utilities.svelte";
import { HELP } from "./commands/help";

async function bootTerminal(): Promise<void> {
  await tick();
  windowManager.setActiveWindow(WINDOW_ID_ENUM.TERMINAL);
  log.add("<em>salvēte amīcī!</em>");
  await sleep(700);
  log.add("booting environment...");
  await sleep(1000);
  inputElementStore.visible = true;
  await inputElementStore.simulateTyping('help');
}

async function instantlyBootTerminalAndOpenApp(command: string): Promise<void> {
  await tick();
  windowManager.setActiveWindow(WINDOW_ID_ENUM.TERMINAL);
  log.add("<em>salvēte amīcī!</em>");
  log.add("booting environment...");
  log.add( 
    `<span style="color: var(--yellow)">user</span>@weewaa-land-352 
    <span style="color: var(--light-grey)"> ~/jameschang ›</span> 
    <span style="color: var(--pink); white-space: pre-wrap;">help</span>` 
  );
  let help = HELP.shellCommand([], [], false) as string; //mocking help output
  log.add(help);
  inputElementStore.visible = true;
  inputElementStore.value = command;
}

export { bootTerminal, instantlyBootTerminalAndOpenApp };