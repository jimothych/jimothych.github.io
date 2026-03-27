import { ShellCommandTuple, invalidOption, usage, EMIT_COMMAND_ACTION } from "./common";
import { windowManager } from "../../lib/windowManager.svelte";
import { urlManager } from "../../lib/urlManager.svelte";
import { WINDOW_ID_ENUM } from "../../lib/utilities.svelte";

const COMMAND_NAME: string = "victionarium";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function victionarium(args: string[], options: string[], isSuperUser: boolean): string | EMIT_COMMAND_ACTION {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }
  
  return () => { 
    windowManager.openApp(WINDOW_ID_ENUM.VICTIONARIUM); 
    urlManager.navigate(`/${VICTIONARIUM.name}`);
  }
}

export const VICTIONARIUM: ShellCommandTuple = {
  name: COMMAND_NAME, 
  shellCommand: victionarium, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};