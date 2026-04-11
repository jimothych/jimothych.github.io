import { type ShellCommandObject, invalidOption, usage } from "./common";

const COMMAND_NAME: string = "help";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function help(args: string[], options: string[], isSuperUser: boolean): string {
  if(options.length > 0) {
    let result = "";
    result += invalidOption(COMMAND_NAME, options[0]);
    result += usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
    return result;
  }
  if(args.length > 0) {
    return usage(COMMAND_NAME, ALLOWED_ARGS_DESCRIPTION, ALLOWED_OPTIONS);
  }
  
  return (`<p style="white-space:pre-wrap">
pseudo-shell (psh), version 0.1.6

hi friend! if you'd like to read some of my poems you can &#96;ls&#96; to find my poems stored in this directory.
use &#96;cat [file]&#96; to read the poems, e.g. &#96;cat poem2.txt&#96;. 
below are a few other commands you can run to learn more about me!

commands:
${createPaddedString(`whoami`, `who i am`)}
${createPaddedString(`projects`, `what i've been up to`)}
${createPaddedString(`blog`, `my blog`)}
${createPaddedString(`ls`, `list directory contents`)}
${createPaddedString(`cat`, `print file contents to output, e.g. &#96;cat poem1.txt&#96;`)}
${createPaddedString(`victionarium`, `id quod me iuvat`)}
${createPaddedString(`help`, `show this help message`)}
${createPaddedString(`clear`, `clear terminal`)}
${createPaddedString(`sudo reboot`, `make the earth spin a bit faster`)}

</p>`); 
}

function createPaddedString(word1: string, word2:string): string { //helper for the above
  const paddedWord1 = `  ${word1.padEnd(20)}`;
  return `${paddedWord1} ${word2}`;
}

export const HELP: ShellCommandObject = {
  name: COMMAND_NAME, 
  shellCommand: help, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};