import { EMIT_COMMAND_ACTION_ENUM, EMIT_COMMAND_ACTION, ShellCommandTuple, invalidOption, usage } from "./common";

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
  
  return EMIT_COMMAND_ACTION_ENUM.CLEAR;
}

export const CLEAR: ShellCommandTuple = [COMMAND_NAME, clear, [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]];