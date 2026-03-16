import { EMIT_COMMAND_ACTION, EMIT_COMMAND_ACTION_TYPE, ShellCommandTuple, invalidOption, usage, tooManyArgs, hasInvalidArg } from "./common";

const COMMAND_NAME: string = "sudo";
const ALLOWED_ARGS: string[] = ["reboot"];
const ALLOWED_ARGS_DESCRIPTION: string[] = ["command"];
const ALLOWED_OPTIONS: string[] = [];

function _sudo(args: string[], options: string[]): string | EMIT_COMMAND_ACTION_TYPE {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 1) {
    let result = "";
    result += tooManyArgs(COMMAND_NAME);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length === 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }

  const invalidArgDetected: string | null = (
    hasInvalidArg(COMMAND_NAME, args, ALLOWED_ARGS, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS));
  if(invalidArgDetected) return invalidArgDetected; 

  return EMIT_COMMAND_ACTION.REBOOT;
}

export const SUDO: ShellCommandTuple = [COMMAND_NAME, _sudo];