<script>
  import { determineOutput, SHELL_AUTOCOMPLETE_OPTIONS, beep } from "./shell";
  import { EMIT_COMMAND_ACTION_ENUM } from "./commands/common"
  import { sleep, focusOnMount } from "../lib/utilities";
  import { tick } from "svelte";
  import { TerminalLog, TerminalInput, InputHistory, TabCompletion } from "./terminal.svelte";

  let log = new TerminalLog();
  let inputElementValue = new TerminalInput();
  let inputHistory = new InputHistory();
  let tabCompletion = new TabCompletion();

  let mainInput = $state(null); //component-binded handle for native dom input box refocus

  async function bootTerminal() {
    await tick(); //https://svelte.dev/docs/svelte/lifecycle-hooks#tick
    const terminalInterface = document.getElementById("terminal-interface");
    terminalInterface.click(); //click to focus Window (bubbles up)
    log.add({ message: "<em>salvēte amīcī!</em>" });
    await sleep(700);
    log.add({ message: "booting environment..." });
    await sleep(1000);
    inputElementValue.visible = true;
    simulateHelp();
  }

  async function simulateHelp() {
    await tick();
    await sleep(150);
    inputElementValue.value = 'h'
    await sleep(121);
    inputElementValue.value = 'he'
    await sleep(154);
    inputElementValue.value = 'hel'
    await sleep(101);
    inputElementValue.value = 'help'
    await sleep(174);
    await handleSubmit();
  }

  async function handleSubmit() {
    tabCompletion.reset();

    //determine command output
    const output = determineOutput(inputElementValue.value);
    let echoValue = inputElementValue.value;
    inputElementValue.reset() //force need to re-render input element to focus again after new logs are flushed to DOM

    //adding input to cmd history
    inputHistory.push(echoValue);

    //echoing user input
    log.add({ message: 
      `<span style="color: var(--yellow)">user</span>@weewaa-land-352 
      <span style="color: var(--light-grey)"> ~/jameschang ›</span> 
      <span style="color: var(--white); white-space: pre-wrap;">${echoValue}</span>` 
    });

    //printing cmd output
    if(output) {
      log.add({ message: output });
      if(output === EMIT_COMMAND_ACTION_ENUM.REBOOT) { window.location.reload(); }
      if(output === EMIT_COMMAND_ACTION_ENUM.CLEAR) { log.clear(); }
    }

    await handleAfterSubmitProcess();
  }

  //force focus to input elem
  async function handleAfterSubmitProcess() {
    await tick(); //flush log entry to DOM
    inputElementValue.visible = true;
    await focusBottomOfTerminal();
  }

  async function handleTabComplete(event) {
    event.preventDefault();
    tabCompletion.isMutating = true;
    try {
      if(!tabCompletion.isActive) { //build match list from current input
        const args = inputElementValue.value.trim().split(/\s+/)
          .filter((string) => { return string.length > 0; }); //filter out empty strings
        if(args.length === 0) { beep(); return; } //nothing typed

        const completingCommand = (args.length === 1) && (!inputElementValue.hasTrailingWhitespace()); //still on first token
        const trailingSpace = inputElementValue.hasTrailingWhitespace();
        const word = (!completingCommand && trailingSpace) ? '' : args[args.length - 1]; //word under cursor
        const pool = completingCommand
          ? [...SHELL_AUTOCOMPLETE_OPTIONS.keys()] //complete against all known commands
          : SHELL_AUTOCOMPLETE_OPTIONS.get(args[0]); //complete against args for the given command

        if(!pool) { return; } //unknown cmd
        const matches = pool.filter(v => v.startsWith(word));
        if(matches.length === 0) { beep(); return; } //no matches

        tabCompletion.originalText = inputElementValue.value; //lock snapshot
        tabCompletion.originalWord = word; //lock word being completed
        tabCompletion.matches = matches; //lock match list
        tabCompletion.index = -1; //no match applied yet — first tab only shows options
        tabCompletion.isActive = true; //must be set before inputValue mutation triggers $effect
        tabCompletion.options = matches.join('   '); //show all options on first tab
      } else {
        tabCompletion.index = (tabCompletion.index + 1) % tabCompletion.matches.length; //advance cycle
      }

      if(tabCompletion.matches.length === 1) { //single match: complete and add trailing space
        const completed = tabCompletion.getCompleted();
        inputElementValue.value = completed + ' '; //extra space is default unix behaviour
        tabCompletion.reset();
        return;
      }

      //replace the word being completed in the original text with current match
      if(tabCompletion.index >= 0) {
        const prefix = tabCompletion.getPrefix();
        inputElementValue.value = prefix + tabCompletion.matches[tabCompletion.index];
        tabCompletion.options = tabCompletion.matches.join('   '); //show all options
      }

      await focusBottomOfTerminal();
    } finally {
      tabCompletion.isMutating = false; //release guard only after all mutations done
    }
  }

  $effect(() => {
    inputElementValue.value; //subscribe
    //resetting tab state on any external input change
    if(!tabCompletion.isMutating) { tabCompletion.reset(); }
  });

  async function focusBottomOfTerminal() {
    await tick(); //finish microtask queue
    const terminal = document.getElementById('terminal-interface');
    //https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    if(terminal) { terminal.scrollTop = terminal.scrollHeight; }
  }
</script>

<svelte:window onload={bootTerminal} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  id="terminal-interface"
  class="terminal-interface"
  onclick={async () => {
    mainInput?.focus();
    await focusBottomOfTerminal(); 
  }}
>
  {#each log.entries as obj}
    <p>{@html obj.message}</p>
  {/each}

  {#if inputElementValue.visible}
  <form 
    onsubmit={(e) => { 
      e.preventDefault(); //disabling form submission page reload 
      handleSubmit(); 
    }}
    autocomplete="off" //disabling dropdown
  >
    <p>
      <span style="color: var(--yellow)">user</span>@weewaa-land-352
      <span style="color: var(--light-grey)"> ~/jameschang ›</span>
      <input
        style="width:{inputElementValue.width}; max-width:100%; min-width:10ch;"
        spellcheck="false"
        type="text"
        bind:value={inputElementValue.value}
        bind:this={mainInput}
        {@attach focusOnMount}
        onkeydown={(event) => {
          if(event.key === 'Tab') { handleTabComplete(event); }
          if(event.key === 'ArrowUp') { inputElementValue.value = inputHistory.previous(event); }
          if(event.key === 'ArrowDown') { inputElementValue.value = inputHistory.next(event); }
        }}
      >
    </p>
  </form>
  {/if}

  {#if tabCompletion.options}
  <p style="white-space:pre-wrap">{tabCompletion.options}</p>
  {/if}
</div>

<style>
  .terminal-interface {
    box-sizing: border-box; /* forces css to calculate width as a total sum to include padding */
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--dark-purple);
    width: 100%;
    flex: 1; /* fill inside parent */
    min-height: 0; /* prevents flex overflow */
    overscroll-behavior-y: none;
    padding: 8px;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    user-select: none; /* prevents user selection of text */
  }
</style>