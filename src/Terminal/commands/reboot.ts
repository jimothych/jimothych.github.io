import { ShellCommandObject, invalidOption, usage, EMIT_COMMAND_ACTION } from "./common";
import { urlManager } from "../../lib/urlManager.svelte";

const COMMAND_NAME: string = "reboot";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function reboot(args: string[], options: string[], isSuperUser: boolean): string | EMIT_COMMAND_ACTION {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(!isSuperUser) {
    return (`<p style="white-space:pre-wrap">${COMMAND_NAME}: operation not permitted</p>`);
  }
  
  return () => { urlManager.reload(); }
}

export const REBOOT: ShellCommandObject = {
  name: COMMAND_NAME, 
  shellCommand: reboot, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};