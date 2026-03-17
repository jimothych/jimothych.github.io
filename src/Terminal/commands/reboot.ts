import { EMIT_COMMAND_ACTION, EMIT_COMMAND_ACTION_TYPE, ShellCommandTuple, invalidOption, usage } from "./common";

const COMMAND_NAME: string = "reboot";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function reboot(args: string[], options: string[], isSuperUser: boolean): string | EMIT_COMMAND_ACTION_TYPE {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if((args.length > 0) || (!isSuperUser)) {
    return (`<p style="white-space:pre-wrap">${COMMAND_NAME}: operation not permitted</p>`);
  }
  
  return EMIT_COMMAND_ACTION.REBOOT;
}

export const REBOOT: ShellCommandTuple = [COMMAND_NAME, reboot, ALLOWED_ARGS];