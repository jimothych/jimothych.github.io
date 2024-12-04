import { poems } from "./poems";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//returns @html for svelte to parse; function input has been sanitized
function determineCommandOutput(command) {
  command = command.trim(); //trimming extraneous whitespace
  if(!command || command === 'psh') { return null; } //checking for empty strings etc.

  if(command === 'help') {
    return `<p style="white-space:pre-wrap">
pseudo-shell (psh), version 0.1.6

hi friend! if you'd like to read some of my poems you can &#96;ls&#96; to find my poems stored in this directory.
use &#96;cat [FILENAME]&#96; to read the poems, e.g. &#96;cat personal2.txt&#96;. 
below are a few other commands you can run to learn more about me!

commands:
${createPaddedString(`whoami`, `who i am and what i do`)}
${createPaddedString(`projects`, `what i've been up to`)}
${createPaddedString(`socials`, `my socials`)}
${createPaddedString(`ls`, `list directory contents`)}
${createPaddedString(`cat [FILENAME]`, `print file contents to output, e.g. &#96;cat horace1-14.txt&#96;`)}
${createPaddedString(`help`, `show this help message`)}
${createPaddedString(`clear`, `clear terminal`)}
${createPaddedString(`sudo reboot`, `makes the earth spin a bit faster`)}

</p>`
  } else if(command === 'whoami') {
    return `<br>
            &emsp;Hi! I'm James, a Computer Engineer, aspiring Latinist, and poet studying at Boston University.
            <br><br>
            &emsp;I am a pragmatic engineer who values honesty in communication and simplicity in solutions.
            <br> 
            &emsp;At the moment my primary interest lies in embedded systems programming. 
            <br>
            &emsp;Please feel free to contact me anytime at jameschang2005@icloud.com
            <br>&emsp;`
  } else if(command === 'projects') {
    return `<br>
            &emsp;<a href="https://github.com/SaveTubaTeam/saveTuba?tab=readme-ov-file#savetuba" target="_blank"><strong>Save Tuba</strong></a>
            <br>
            <span>&emsp;&emsp;a gamified educational platform for environmental sustainability education in Kazakhstan</span>
            <br><br>
            &emsp;<a><strong>Boston University Mars Rover</strong></a>
            <br>
            <span>&emsp;&emsp;building embedded software for robotic arm and 6-wheel drive train</span>
            <br><br>
            &emsp;<a><strong>Compiler</strong></a>
            <br>
            <span>&emsp;&emsp;building a compiler for the Jack programming language following Nand2Tetris</span>
            <br>&emsp;
            `
  } else if(command === 'socials') {
    return `
            &emsp;<a href="https://github.com/jimothych" target="_blank"><strong>GitHub</strong></a>
            <br>
            &emsp;<a href="https://www.linkedin.com/in/james-chang-881115202/" target="_blank"><strong>LinkedIn</strong></a>
            `
  } else if(command === 'ls') {
    return `horace1-14.txt&emsp;horace1-22.txt&emsp;catullus70.txt&emsp;personal1.txt&emsp;personal2.txt&emsp;personal3.txt`
  } else if (command.includes('cat')) {
    return outputPoem(command);
  } else if(command === 'clear') {
    return 'clear';
  } else if(command === 'sudo reboot') {
    return 'reboot';
  } else { //unknown command
    return `psh: command not found: ${command}`
  }
}

function createPaddedString(word1, word2) { //helper for the above func
  const paddedWord1 = `  ${word1.padEnd(20)}`
  return `${paddedWord1} ${word2}`
}

function outputPoem(command) {
  const parsedArgArray = command.trim().split(/\s+/); //trim then greedy whitespace split
  if(parsedArgArray.length > 2) { return `psh: too many args, try just one file` } 
  if(parsedArgArray[0] != "cat") { return `psh: command not found: ${command}` } //guarding against odd matched inputs
  if(parsedArgArray.length === 1) { return `usage: &#96;cat [FILENAME]&#96;`} //user entered `cat` w/ no args

  for(const poem of poems) {
    if(parsedArgArray[1].includes(poem.name)) { //matching command arg to poem name w/ leniency
      return poem.content;
    } //else we continue to iterate
  }

  //no poem found
  return `psh: no such file &#96;${parsedArgArray[1]}&#96;`;
}

export { sleep, determineCommandOutput }