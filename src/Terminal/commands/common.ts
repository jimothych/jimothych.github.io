type ShellCommand = (args: string[], options: string[], isSuperUser: boolean) => string | EMIT_COMMAND_ACTION_TYPE;
type ShellCommandTuple = [string, ShellCommand, string[]];

type EMIT_COMMAND_ACTION_TYPE = {
  CLEAR: string,
  REBOOT: string,
  BLOG: string,
  VICTIONARIUS: string,
}
const EMIT_COMMAND_ACTION: EMIT_COMMAND_ACTION_TYPE = {
  CLEAR: "CLEAR",
  REBOOT: "REBOOT",
  BLOG: "BLOG",
  VICTIONARIUS: "VICTIONARIUS",
} as const;

function notYetSupported(commandName: string, value: string): string {
  return(`<p style="white-space:pre-wrap">${commandName}: ${value}: not yet supported</p>`)
}

function tooManyArgs(commandName: string): string {
  return(`<p style="white-space:pre-wrap">${commandName}: too many arguments, pls use but one argument</p>`)
}

function usage(commandName: string, ALLOWED_ARGS_DESCRIPTION: string[], ALLOWED_OPTIONS: string[]): string {
  let argShowcase = ALLOWED_ARGS_DESCRIPTION.map((arg) => {return `[${arg}]`}).join(" "); 
  let optionShowcase = ALLOWED_OPTIONS.map((option) => {return `[${option}]`}).join(" "); 
  return(`<p style="white-space:pre-wrap">usage: ${commandName} ${argShowcase}${optionShowcase}</p>`)
}

function invalidOption(commandName: string, invalidOption: string): string {
  return(`<p style="white-space:pre-wrap">${commandName}: invalid option: ${invalidOption}</p>`)
}

function notFound(commandName: string, invalidArg: string, description: string): string {
  return(`<p style="white-space:pre-wrap">${commandName}: ${invalidArg}: ${description}</p>`)
}

function hasInvalidArg(commandName: string, args: string[], 
                      ALLOWED_ARGS: string[], description: string): string | null{ 

  for(const arg of args){ 
    if(!ALLOWED_ARGS.includes(arg)) {
      let result = "";
      result += notFound(commandName, arg, description);
      return result;
    }
  }

  return null;
}

function hasInvalidOption(commandName: string, options: string[], 
                         ALLOWED_ARGS: string[], ALLOWED_ARGS_DESCRIPTION: string [],
                         ALLOWED_OPTIONS: string[]): string | null { 

  for(const option of options){ 
    if(!ALLOWED_OPTIONS.includes(option)) {
      let result = "";
      result += invalidOption(commandName, option);
      result += usage(commandName, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
      return result;
    }
  }

  return null;
}

export { 
  ShellCommand, 
  ShellCommandTuple, 
  usage, 
  invalidOption,
  tooManyArgs,
  hasInvalidArg,
  hasInvalidOption,
  notYetSupported,
  EMIT_COMMAND_ACTION,
  EMIT_COMMAND_ACTION_TYPE
}