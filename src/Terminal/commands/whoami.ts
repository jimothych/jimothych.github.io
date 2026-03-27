import { ShellCommandTuple, invalidOption, usage } from "./common";

const COMMAND_NAME: string = "whoami";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function whoami(args: string[], options: string[], isSuperUser: boolean): string {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }
  
  return (
`<p style="white-space:pre-wrap">
  Hi! I'm James, a Computer Engineer and sometimes poet at Boston University.

  At the moment my primary interest lies in embedded systems. 
  Please feel free to contact me anytime at jameschang2005@icloud.com

</p>`); 
}

export const WHOAMI: ShellCommandTuple = {
  name: COMMAND_NAME, 
  shellCommand: whoami, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};