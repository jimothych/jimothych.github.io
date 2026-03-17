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
import { REBOOT } from "./commands/reboot";

const SHELL_COMMANDS = new Map<string, ShellCommand>();
const SHELL_AUTOCOMPLETE_OPTIONS = new Map<string, string[]>();

for (const [name, shellCommand, autocompleteOptions] of [
  WHOAMI,
  PROJECTS,
  LS,
  CAT,
  HELP,
  CLEAR,
  PWD,
  PSH,
  REBOOT
]) {
  SHELL_COMMANDS.set(name, shellCommand);
  SHELL_AUTOCOMPLETE_OPTIONS.set(name, autocompleteOptions);
}

//tries to return @html for svelte to parse
function determineOutput(inputValue: string): string | EMIT_COMMAND_ACTION_TYPE | null {
  if(!inputValue) { return null } //nothing entered into input, go next

  const commandLineArgs = inputValue.trim().split(/\s+/);
  console.log(`determineOutput --> ${[...commandLineArgs]}`);

  let command: Command = parseArgs(commandLineArgs);

  //handling sudo
  let isSuperUser = false;
  if(command.command === SUDO[0]) { //COMMAND_NAME at index 0 of tuple
    isSuperUser = true; 
    if(command.args.length === 0) { //sudo has a specific no args behaviour
      return SUDO[1](command.args, command.options, isSuperUser);
    }
    //otherwise slice sudo off and continue
    command.command = command.args[0];
    command.args = command.args.slice(1);
  }

  if(SHELL_COMMANDS.has(command.command)) {
    const shellCommand = SHELL_COMMANDS.get(command.command);
    if(shellCommand){ return shellCommand(command.args, command.options, isSuperUser); }
  }

  return commandNotFound(command.command, isSuperUser);
}

type Command = {
  command: string,
  args: string[],
  options: string[]
}
function parseArgs(commandLineArgs: string[]): Command {
  const command = commandLineArgs[0];
  commandLineArgs.shift(); //pop from front of array

  const options: string[] = [];
  const args: string[] = [];
  for(const arg of commandLineArgs) {
    if(arg.startsWith('-')) options.push(arg);
    else args.push(arg);
  }

  return { command: command, args: args, options: options } as Command;
}

function commandNotFound(commandName: string, isSuperUser: boolean): string {
  if(isSuperUser) {
    return(`<p style="white-space:pre-wrap">sudo: command not found: ${commandName}</p>`)
  }
  return(`<p style="white-space:pre-wrap">psh: command not found: ${commandName}</p>`)
}

export { determineOutput, SHELL_AUTOCOMPLETE_OPTIONS }