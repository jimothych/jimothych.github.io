import { ShellCommandTuple, invalidOption, usage } from "./common";

const COMMAND_NAME: string = "sudo";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = ["command [arg ...]"];
const ALLOWED_OPTIONS: string[] = [];

//only need to handle empty args behaviour because we sliced off and handled non-empty args behaviour in shell.ts
function sudo(args: string[], options: string[], isSuperUser: boolean): string {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  
  return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
}

export const SUDO: ShellCommandTuple = [COMMAND_NAME, sudo, ALLOWED_ARGS];