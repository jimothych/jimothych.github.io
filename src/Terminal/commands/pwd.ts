import { ShellCommandTuple, invalidOption, usage } from "./common";

const COMMAND_NAME: string = "pwd";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function pwd(args: string[], options: string[], isSuperUser: boolean): string {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }
  
  return (`<p style="white-space:pre-wrap">/users/jimothych/jameschang</p>`); 
}

export const PWD: ShellCommandTuple = [COMMAND_NAME, pwd, ALLOWED_ARGS];