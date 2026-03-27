import { sleep } from "../lib/utilities.svelte";

class Log {
  entries = $state<string[]>([]);

  add(message: string): void { 
    this.entries = [...this.entries, message];
  }

  clear(): void { this.entries = []; }
}

class InputElementStore {
  value = $state<string>('');
  visible = $state<boolean>(false);
  width = $derived<string>(`${(this.value ?? '').length}ch`);

  hasTrailingWhitespace(): boolean { 
    return /\s$/.test(this.value); 
  }

  async simulateTyping(text: string): Promise<void> {
    await sleep(100);
    for(const char of text) {
      this.value += char;
      await sleep(75 + (Math.random() * 75)); //75ms-150ms
    }
  }

  reset(): void {
    this.value = '';
    this.visible = false;
  }
}

class InputHistory {
  entries = $state<string[]>([]);
  position = $state<number>(-1);

  push(value: string): void {
    this.entries.unshift(value);
    this.position = -1;
  }

  previous(event: Event): string {
    event.preventDefault();
    if(this.position < (this.entries.length - 1)) { this.position += 1; }
    return this.entries[this.position];
  }

  next(event: Event): string {
    event.preventDefault();
    if(this.position > -1) { this.position -= 1; }
    return this.entries[this.position];
  }
}

//for tab completion — mirrors readline menu-complete (see pymotw.com/2/readline)
class TabCompletionStore {
  originalText = $state<string | null>(null); //full inputValue snapshot before cycling began
  originalWord = $state<string | null>(null); //the word being completed at cycle start
  matches = $state<string[] | null>(null); //locked match list
  index = $state<number>(-1); //current position in cycle
  options = $state<string>(""); //displayed matches
  isActive = false; //true while cycling
  isMutating = false; //prevents $effect from resetting state mid-tab

  getPrefix(): string {
    return this.originalWord === ''
      ? this.originalText! //no word to replace
      : this.originalText!.slice(0, this.originalText!.lastIndexOf(this.originalWord!)); //slice off the partial word, match will be appended by caller
  }

  getCompleted(): string {
    return this.originalText!.trimEnd().replace(/\S+$/, '') + this.matches![0]; //replace word in original
  }

  reset(): void {
    this.originalText = null;
    this.originalWord = null;
    this.matches = null;
    this.index = -1;
    this.options = "";
    this.isActive = false;
    this.isMutating = false;
  }
}

let log = new Log();
let inputElementStore = new InputElementStore();
let inputHistory = new InputHistory();
let tabCompletionStore = new TabCompletionStore();
export { log, inputElementStore, inputHistory, tabCompletionStore };