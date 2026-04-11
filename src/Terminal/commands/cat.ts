import { type ShellCommandObject, invalidOption, usage, hasInvalidArg } from "./common";
import { getPoemNames, getPoemContent, removeFileExtensions, getPoemNamesWithFileExtensions } from "./poems";

const COMMAND_NAME: string = "cat";
const ALLOWED_ARGS: string[] = getPoemNames();
const ALLOWED_ARGS_DESCRIPTION: string[] = ["file ..."];
const ALLOWED_OPTIONS: string[] = [];

function cat(args: string[], options: string[], isSuperUser: boolean): string {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length === 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }

  removeFileExtensions(args); //for unix-like behaviour

  const invalidArgDetected: string | null = (
    hasInvalidArg(COMMAND_NAME, args, ALLOWED_ARGS, "no such file or directory"));
  if(invalidArgDetected) return invalidArgDetected; 

  let result = "";
  for(const arg of args){ result += getPoemContent(arg); }
  return result;
}

export const CAT: ShellCommandObject = {
  name: COMMAND_NAME, 
  shellCommand: cat, 
  autocompleteOptions: [...getPoemNamesWithFileExtensions(), ...ALLOWED_OPTIONS]
};