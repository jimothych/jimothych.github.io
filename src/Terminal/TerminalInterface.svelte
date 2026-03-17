<script>
  import { determineOutput, SHELL_AUTOCOMPLETE_OPTIONS } from "./shell";
  import { EMIT_COMMAND_ACTION } from "./commands/common"
  import { sleep, focusOnMount } from "../lib/utilities";
  import { tick } from "svelte";

  let masterLog = $state([]);
  let inputValue = $state('');
  let inputElementVisible = $state(false);

  //for arrow up & down behaviour
  let inputHistory = $state([]);
  let currentPositionInInputHistory = $state(-1);

  //for tab completion
  let tabCompletionOptions = $state("");

  let mainInput = $state(null); //component-binded handle for native dom input box refocus

  function addLog(message) {
    masterLog = [...masterLog, message];
  }

  async function bootTerminal() {
    await tick(); //https://svelte.dev/docs/svelte/lifecycle-hooks#tick
    addLog({ message: "<em>salvēte amīcī!</em>" });
    await sleep(700);
    addLog({ message: "booting environment..." });
    await sleep(1000);
    inputElementVisible = true;
    simulateHelp();
  }

  async function simulateHelp() {
    await tick();
    await sleep(150);
    inputValue = 'h'
    await sleep(121);
    inputValue = 'he'
    await sleep(154);
    inputValue = 'hel'
    await sleep(101);
    inputValue = 'help'
    await sleep(174);
    await handleSubmit();
  }

  async function handleSubmit() {
    tabCompletionOptions = ""; //reset
    const output = determineOutput(inputValue);
    let echoValue = inputValue;
    inputValue = ''; //reset
    inputElementVisible = false; //force need to re-render input element to focus again after new logs are flushed to DOM

    //adding input to cmd history
    inputHistory.unshift(echoValue);
    currentPositionInInputHistory = -1; //reset

    //echoing user input
    addLog({ message: 
      `<span style="color: var(--yellow)">user</span>@weewaa-land-352 
      <span style="color: var(--light-grey)"> ~/jameschang ›</span> 
      <span style="color: var(--white); white-space: pre-wrap;">${echoValue}</span>` 
    });

    //printing cmd output
    if(output) {
      if(output === EMIT_COMMAND_ACTION.REBOOT) { window.location.reload(); return; }
      if(output === EMIT_COMMAND_ACTION.CLEAR) { await handleClear(); return; }
      addLog({ message: output });
    }

    await handleAfterSubmitProcess();
  }

  async function handleClear() {
    masterLog = [];
    await handleAfterSubmitProcess();
  }

  //force focus to input elem
  async function handleAfterSubmitProcess() {
    await tick(); //flush log entry to DOM
    inputElementVisible = true;
    await focusBottomOfTerminal();
  }

  function useInputPrevious(event) {
    event.preventDefault();
    if(currentPositionInInputHistory < (inputHistory.length-1)) { currentPositionInInputHistory += 1; }
    inputValue = inputHistory[currentPositionInInputHistory];
  }

  function useInputNext(event) {
    event.preventDefault();
    if(currentPositionInInputHistory > -1) { currentPositionInInputHistory -= 1; }
    inputValue = inputHistory[currentPositionInInputHistory];
  }

  async function handleTabComplete(event) {
    event.preventDefault();
    const dirtyArgs = inputValue.split(/(\s+)/); //preserves groups of spaces as tokens
    console.log(`handleTabComplete --> ${dirtyArgs}`);
    const args = dirtyArgs.filter((token) => { return !/^\s+$/.test(token); });
    if(args.length === 1) {
      if(args[0] === "") { return; }
      let matches = [...SHELL_AUTOCOMPLETE_OPTIONS.keys()].filter(k => k.startsWith(args[0]));
      if(matches.length === 0) { return; } //no matches
      if(matches.length === 1) { //single match, autocomplete
        dirtyArgs[dirtyArgs.lastIndexOf(args[0])] = matches[0]; //reconstruct
        inputValue = dirtyArgs.join('') + " "; //extra space is unix behaviour
      } else { //show options
        tabCompletionOptions = matches.join('   ');
      }
    } else if(args.length > 1) {
      const options = SHELL_AUTOCOMPLETE_OPTIONS.get(args[0]);
      let matches = options.filter(v => v.startsWith(args[args.length-1]));
      if(matches.length === 0) { return; } //no matches
      if(matches.length === 1) { //single match, autocomplete
        dirtyArgs[dirtyArgs.lastIndexOf(args[args.length-1])] = matches[0]; //reconstruct
        inputValue = dirtyArgs.join('') + " "; //extra space is unix behaviour
      } else { //show options
        tabCompletionOptions = matches.join('   ');
      }
    }
    await focusBottomOfTerminal();
  }

  async function focusBottomOfTerminal() {
    await tick(); //finish microtask queue
    const terminal = document.getElementById('terminal-interface');
    if(terminal) { terminal.scrollTop = terminal.scrollHeight; }
  }
</script>

<svelte:window onload={bootTerminal} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  id="terminal-interface"
  class="terminal-interface"
  onclick={async () => {
    mainInput?.focus();
    await focusBottomOfTerminal(); 
  }}
>
  {#each masterLog as obj}
    <p>{@html obj.message}</p>
  {/each}

  {#if inputElementVisible}
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
        spellcheck="false"
        type="text"
        bind:value={inputValue}
        bind:this={mainInput}
        {@attach focusOnMount}
        onkeydown={(event) => {
          if(event.key === 'Tab') handleTabComplete(event);
          if(event.key === 'ArrowUp') useInputPrevious(event);
          if(event.key === 'ArrowDown') useInputNext(event);
        }}
      >
    </p>
  </form>
  {/if}

  {#if tabCompletionOptions}
  <p style="white-space:pre-wrap">{tabCompletionOptions}</p>
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
    padding: 8px;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    user-select: none; /* prevents user selection of text */
  }
</style>