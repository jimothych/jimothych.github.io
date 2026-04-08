import { ShellCommandObject, invalidOption, usage, EMIT_COMMAND_ACTION } from "./common";
import { windowManager } from "../../lib/windowManager.svelte";
import { WINDOW_ID_ENUM } from "../../lib/utilities.svelte";

const COMMAND_NAME: string = "blog";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function blog(args: string[], options: string[], isSuperUser: boolean): string | EMIT_COMMAND_ACTION {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }
  
  return (() => { 
    windowManager.openApp(WINDOW_ID_ENUM.BLOG); 
  }) as EMIT_COMMAND_ACTION;
}

export const BLOG: ShellCommandObject = {
  name: COMMAND_NAME, 
  shellCommand: blog, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};