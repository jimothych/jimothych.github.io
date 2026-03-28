<script>
  import { determineOutput, SHELL_AUTOCOMPLETE_OPTIONS } from "./shell";
  import beep from "../assets/beep";
  import { focusElement } from "../lib/utilities.svelte";
  import { tick } from "svelte"; //https://svelte.dev/docs/svelte/lifecycle-hooks#tick
  import { log, inputElementStore, inputHistory, tabCompletionStore } from "./terminalStore.svelte";
  import { windowManager } from "../lib/windowManager.svelte";
  import { bootTerminal, instantlyBootTerminalAndOpenApp } from "./terminalStartingActions.svelte";
  import { urlManager } from "../lib/urlManager.svelte";

  let mainInput = $state(null); //component-binded handle for native dom input box refocus
  let terminalElement = $state(null); //for focusBottomOfTerminal

  async function handleSubmit() {
    //handle if an app is open
    if(windowManager.hasActiveApp) { 
      beep();
      log.add(inputElementStore.value || `&nbsp`); //echo (without nbsp it will ignore empty string cuz empty <p> doesnt render)
      inputElementStore.value = ''; //clear without hiding
      await focusBottomOfTerminal();
      return;
    }

    tabCompletionStore.reset();

    //determine command output
    const output = determineOutput(inputElementStore.value);
    let echoValue = inputElementStore.value;
    inputElementStore.reset() //force need to re-render input element to focus again after new logs are flushed to DOM

    //adding non-empty cmd input to cmd history
    if(echoValue) { inputHistory.push(echoValue); }

    //echoing user input
    log.add( 
      `<span style="color: var(--yellow)">user</span>@weewaa-land-352 
      <span style="color: var(--light-grey)"> ~/jameschang ›</span> 
      <span style="color: var(--pink); white-space: pre-wrap;">${echoValue}</span>` 
    );

    //printing cmd output
    if(output) {
      if(typeof output === 'function') {
        output();
        await handleAfterSubmitProcess();
        return;
      }

      log.add(output);
    }

    await handleAfterSubmitProcess();
  }

  //force focus to input elem
  async function handleAfterSubmitProcess() {
    await tick(); //flush log entry to DOM
    inputElementStore.visible = true;
    await focusBottomOfTerminal();
    if(windowManager.hasActiveApp){ mainInput?.blur(); } //force un-focus
  }

  function buildTabCompletionState() {
    const args = inputElementStore.value.trim().split(/\s+/)
      .filter((string) => { return string.length > 0; }); //filter out empty strings
    if(args.length === 0) return null; //nothing typed

    const completingCommand = (args.length === 1) && (!inputElementStore.hasTrailingWhitespace());
    const trailingSpace = inputElementStore.hasTrailingWhitespace();
    const word = (!completingCommand && trailingSpace) ? '' : args[args.length - 1];
    const pool = completingCommand
      ? [...SHELL_AUTOCOMPLETE_OPTIONS.keys()] //complete against all known commands
      : SHELL_AUTOCOMPLETE_OPTIONS.get(args[0]); //complete against args for the given command

    if(!pool) return null; //unknown cmd

    const matches = pool.filter(v => v.startsWith(word));
    if(matches.length === 0) return null; //no matches

    return { word, matches };
  }

  async function handleTabComplete(event) {
    event.preventDefault();
    if(windowManager.hasActiveApp) { beep(); return; } //an app is running
    tabCompletionStore.isMutating = true;
    try {
      //first tab press: snapshot input state so subsequent tabs can cycle without re-parsing
      if(!tabCompletionStore.isActive) {
        const state = buildTabCompletionState();
        if(!state) { beep(); return; } //nothing typed, no pool, or no matches

        tabCompletionStore.originalText = inputElementStore.value; //lock snapshot
        tabCompletionStore.originalWord = state.word; //lock word being completed
        tabCompletionStore.matches = state.matches; //lock match list
        tabCompletionStore.index = -1; //no match applied yet — first tab only shows options
        tabCompletionStore.isActive = true; //must be set before inputElementStore mutation triggers $effect
        tabCompletionStore.options = state.matches.join('   '); //show all options on first tab
      } else {
        tabCompletionStore.index = ((tabCompletionStore.index + 1) % tabCompletionStore.matches.length); //advance cycle
      }

      if(tabCompletionStore.matches.length === 1) { //unambiguous match: skip cycling and complete immediately
        inputElementStore.value = tabCompletionStore.getCompleted() + ' '; //extra space is default unix behaviour
        tabCompletionStore.reset();
        return;
      }

      if(tabCompletionStore.index >= 0) { //replace word being completed with current match
        inputElementStore.value = (tabCompletionStore.getPrefix() + tabCompletionStore.matches[tabCompletionStore.index]);
        tabCompletionStore.options = tabCompletionStore.matches.join('   '); //show all options
      }

      await focusBottomOfTerminal();
    } finally {
      tabCompletionStore.isMutating = false; //release guard after all mutations done
    }
  }

  $effect(() => {
    inputElementStore.value; //subscribe
    //resetting tab state on any external input change
    if(!tabCompletionStore.isMutating) { tabCompletionStore.reset(); }
  });

  async function focusBottomOfTerminal() {
    await tick(); //finish microtask queue
    //https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    if(terminalElement) { terminalElement.scrollTop = terminalElement.scrollHeight; }
  }
</script>

<svelte:window onload={async() => {
  const command = urlManager.getInitialRoute();
  if(!command) {
    await bootTerminal();
  } else {
    await instantlyBootTerminalAndOpenApp(command);
  }
  await handleSubmit();
}} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  id="terminal"
  class="terminal"
  onclick={async () => {
    mainInput?.focus();
    await focusBottomOfTerminal(); 
  }}
  bind:this={terminalElement}
>
  {#each log.entries as message}
    <p>{@html message}</p>
  {/each}

  {#if inputElementStore.visible}
  <form 
    onsubmit={(e) => { 
      e.preventDefault(); //disabling form submission page reload 
      handleSubmit(); 
    }}
    autocomplete="off" //disabling dropdown
  >
    <p>
      {#if !windowManager.hasActiveApp}
      <span style="color: var(--yellow)">user</span>@weewaa-land-352
      <span style="color: var(--light-grey)"> ~/jameschang ›</span>
      {/if}
      <input
        style="width:{inputElementStore.width}; max-width:100%; min-width:10ch;"
        spellcheck="false"
        type="text"
        bind:value={inputElementStore.value}
        bind:this={mainInput}
        {@attach focusElement}
        onkeydown={(event) => {
          if(event.key === 'Tab') { handleTabComplete(event); }
          if(event.key === 'ArrowUp') { 
            if(windowManager.hasActiveApp) { beep(); return; }
            inputElementStore.value = inputHistory.previous(event); 
          }
          if(event.key === 'ArrowDown') { 
            if(windowManager.hasActiveApp) { beep(); return; }
            inputElementStore.value = inputHistory.next(event); 
          }
          if(event.code === 'KeyC' && event.ctrlKey) { //SIGINT
            event.preventDefault(); 
            if(windowManager.hasActiveApp) {
              log.add(inputElementStore.value + "^C");
              inputElementStore.value = '';
              focusBottomOfTerminal();
              windowManager.closeApp(); 
            } else {
              handleSubmit();
            }
          }
        }}
      >
    </p>
  </form>
  {/if}

  {#if tabCompletionStore.options}
  <p style="white-space:pre-wrap">{tabCompletionStore.options}</p>
  {/if}
</div>

<style>
  .terminal {
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

  input {
    font-family: Ubuntu Mono;
    display: inline;
    border: none;
    width: 180px;
    background-color: unset;
    padding: 0;
    margin: 0;
    margin-top: -1px;
    font-size: 16px;
    color: var(--pink);
    overflow: hidden;
  }
  input:focus{
    border:none;
    outline: none;
    box-shadow: none;
    background-color: unset;
  }
</style>