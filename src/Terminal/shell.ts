import { ShellCommand, EMIT_COMMAND_ACTION_TYPE } from "./commands/common";
import { WHOAMI } from "./commands/whoami";
import { PROJECTS } from "./commands/projects";
import { LS } from "./commands/ls";
import { CAT } from "./commands/cat";
import { HELP } from "./commands/help";
import { CLEAR } from "./commands/clear";
import { SUDO } from "./commands/sudo";
import { PWD } from "./commands/pwd";
import { PSH } from "./commands/psh";

const SHELL_COMMANDS = new Map<string, ShellCommand>([
  WHOAMI,
  PROJECTS,
  LS,
  CAT,
  HELP,
  CLEAR,
  SUDO,
  PWD,
  PSH
]);

//tries to return @html for svelte to parse
function determineOutput(commandLineArgs: string[]): string | EMIT_COMMAND_ACTION_TYPE | null {
  const command: Command | null = parseArgs(commandLineArgs);
  if(!command) { return null } //nothing entered into input, go next

  if(SHELL_COMMANDS.has(command.command)) {
    const functionReference = SHELL_COMMANDS.get(command.command);
    if(functionReference){ return functionReference(command.args, command.options); }
  }
  return commandNotFound(command.command);
}

type Command = {
  command: string,
  args: string[],
  options: string[]
}
function parseArgs(commandLineArgs: string[]): Command | null {
  if(commandLineArgs.length === 0) return null; //nothing entered into input
  const command = commandLineArgs[0];
  commandLineArgs.shift(); //pop from front of array

  const options: string[] = [];
  const args: string[] = [];
  for(const arg of commandLineArgs) {
    if (arg.startsWith('-')) options.push(arg);
    else args.push(arg);
  }

  return { command: command, args: args, options: options } as Command;
}

function commandNotFound(commandName: string): string {
  return(`<p style="white-space:pre-wrap">psh: command not found: ${commandName}</p>`)
}

export { determineOutput }