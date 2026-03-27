import { ShellCommandTuple, invalidOption, usage } from "./common";

const COMMAND_NAME: string = "projects";
const ALLOWED_ARGS: string[] = [];
const ALLOWED_ARGS_DESCRIPTION: string[] = [];
const ALLOWED_OPTIONS: string[] = [];

function projects(args: string[], options: string[], isSuperUser: boolean): string {
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
  <a><strong>C Compiler for Bare-Metal Arduino</strong></a>
    <span>minimal C99 compiler for the avr-gcc toolchain</span>

  <a href="https://github.com/SaveTubaTeam/saveTuba?tab=readme-ov-file#savetuba" target="_blank"><strong>Save Tuba</strong></a>
    <span>a gamified educational platform for environmental sustainability education in Kazakhstan</span>

  <a href="https://github.com/jimothych/inStock_frontend?tab=readme-ov-file#instock---inventory-management-for-small-businesses" target="_blank"><strong>Inventory Forecasting App for Small Businesses</strong></a>
    <span>freelancer proof of concept for a customer</span>

  <a href="https://github.com/jimothych/LineFollowingCar?tab=readme-ov-file#demo" target="_blank"><strong>Line Following Car</strong></a>
    <span>project w/ friends</span>

  <a href="https://github.com/jimothych/bRot_Flashcards?tab=readme-ov-file#design-decisions" target="_blank"><strong>Flashcard App</strong></a>
    <span>EC327 group project</span>

</p>`); 
}

export const PROJECTS: ShellCommandTuple = {
  name: COMMAND_NAME, 
  shellCommand: projects, 
  autocompleteOptions: [...ALLOWED_ARGS, ...ALLOWED_OPTIONS]
};