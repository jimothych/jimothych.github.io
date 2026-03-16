import { ShellCommandTuple, invalidOption, usage, tooManyArgs, hasInvalidArg } from "./common";
import { poems, getFileNames, getPoemContent } from "./poems";

const COMMAND_NAME: string = "cat";
const ALLOWED_ARGS: string[] = getFileNames(poems);
const ALLOWED_ARGS_DESCRIPTION: string[] = ["file"];
const ALLOWED_OPTIONS: string[] = [];

function _cat(args: string[], options: string[]): string {
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

  return getPoemContent(args[0]);
}

export const CAT: ShellCommandTuple = [COMMAND_NAME, _cat];