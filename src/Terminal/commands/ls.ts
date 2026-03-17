import { ShellCommandTuple, notYetSupported, hasInvalidOption, usage } from "./common";
import { poems } from "./poems";

const COMMAND_NAME: string = "ls";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = ["-l", "-d", "--directory", "-a", "--all"];

function projects(args: string[], options: string[], isSuperUser: boolean): string {
  const invalidOptionDetected: string | null = (
    hasInvalidOption(COMMAND_NAME, options, ALLOWED_ARGS, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS));
  if(invalidOptionDetected) return invalidOptionDetected;

  if(args.length > 0) {
    let result = "";
    result += notYetSupported(COMMAND_NAME, args[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }

  if(options.includes("-d") || options.includes("--directory")) {
    if(options.includes("-l")){
      return (`<p style="white-space:pre-wrap">${listLongFormat("dr--r-----", ".")}</p>`);
    }
    return (`<p style="white-space:pre-wrap">.</p>`);
  }

  if(options.includes("-l")) {
    let result = `<p style="white-space:pre-wrap">`;
    for(const poem of poems) {
      result += `${listLongFormat("-r--r--r--", poem.name, poem.date, poem.size)}.txt<br>`
    }
    result += `</p>`;
    return result;
  }
  
  let result = `<p style="white-space:pre-wrap">`;
  for(const poem of poems) {
    result += `${poem.name}.txt   `
  }
  result += `</p>`;
  return result;
}

function listLongFormat(
  perms: string, name: string, time: string = "Mar 16 14:17", size: number = 2748): string {

  return [
    perms.padEnd(14),
    "0",
    "jimothych".padEnd(11),
    "staff",
    String(size).padStart(8),
    time,    
    name
  ].join(" ");
}

export const LS: ShellCommandTuple = [COMMAND_NAME, projects, ALLOWED_ARGS];