import { ShellCommandTuple, usage, notYetSupported } from "./common";

const COMMAND_NAME: string = "psh";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = ["--version"];

function psh(args: string[], options: string[], isSuperUser: boolean): string {
  if(args.length > 0) {
    let result = "";
    result += notYetSupported(COMMAND_NAME, args[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }

  for(const option of options) {
    if(ALLOWED_OPTIONS.includes(option)) {
      return (`<pseudo-shell style="white-space:pre-wrap">psh, version 0.1.6</p>`);
    }
  }
  //ignoring all other options
  
  return "";
}

export const PSH: ShellCommandTuple = [COMMAND_NAME, psh, [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]];