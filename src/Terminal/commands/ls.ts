import { ShellCommandTuple, notYetSupported, hasInvalidOption, usage } from "./common";
import { poems } from "./poems";

const COMMAND_NAME: string = "ls";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = ["-l", "-d", "--directory", "-a", "--all"];

function _projects(args: string[], options: string[]): string {
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
      return (`<p style="white-space:pre-wrap">${lsLine("dr--r-----", ".")}</p>`);
    }
    return (`<p style="white-space:pre-wrap">.</p>`);
  }

  if(options.includes("-l")) {
    let result = `<p style="white-space:pre-wrap">`;
    for(const poem of poems) {
      result += `${lsLine("-r--r--r--", poem.name, poem.size)}.txt<br>`
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

function lsLine(perms: string, name: string, size: number = randInt()): string {
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, " ");
  const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

  return [
    perms.padEnd(14),
    "0",
    "jimothych".padEnd(11),
    "staff",
    String(size).padStart(8),
    `${month} ${day} ${time}`,
    name
  ].join(" ");
}

function randInt() {
  return Math.floor(Math.random() * (3000 - 50 + 1)) + 50;
}

export const LS: ShellCommandTuple = [COMMAND_NAME, _projects];