import { type ShellCommandObject, tooManyArgs, hasInvalidOption, usage, notFound } from "./common";
import { poems } from "./poems";

const COMMAND_NAME: string = "ls";
const ALLOWED_ARGS: string[] = [".", "/users/jimothych/jameschang"];
const ALLOWED_ARGS_DESCRIPTION: string[] = ["directory"];
const ALLOWED_OPTIONS: string[] = ["-l", "-d", "-a"];

function projects(args: string[], options: string[], isSuperUser: boolean): string {
  const invalidOptionDetected: string | null = (
    hasInvalidOption(COMMAND_NAME, options, ALLOWED_ARGS, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS));
  if(invalidOptionDetected) return invalidOptionDetected;
  if(args.length == 1) {
    if(!ALLOWED_ARGS.includes(args[0])){ 
      return notFound(COMMAND_NAME, args[0], "no such directory");
    }
  }

  if(args.length > 1) {
    let result = "";
    result += tooManyArgs(COMMAND_NAME);
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

export const LS: ShellCommandObject = {
  name: COMMAND_NAME, 
  shellCommand: projects, 
  autocompleteOptions: [...ALLOWED_OPTIONS]
};