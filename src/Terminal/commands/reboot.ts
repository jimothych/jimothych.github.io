import { EMIT_COMMAND_ACTION_ENUM, EMIT_COMMAND_ACTION, ShellCommandTuple, invalidOption, usage } from "./common";

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
  
  return EMIT_COMMAND_ACTION_ENUM.REBOOT;
}

export const REBOOT: ShellCommandTuple = [COMMAND_NAME, reboot, [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]];