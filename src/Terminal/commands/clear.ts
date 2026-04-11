import { type ShellCommandObject, invalidOption, usage, type EMIT_COMMAND_ACTION } from "./common";
import { log } from "../terminalStore.svelte";

const COMMAND_NAME: string = "clear";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function clear(args: string[], options: string[], isSuperUser: boolean): string | EMIT_COMMAND_ACTION {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }
  
  return (() => { log.clear() }) as EMIT_COMMAND_ACTION
}

export const CLEAR: ShellCommandObject = {
  name: COMMAND_NAME, 
  shellCommand: clear, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};
