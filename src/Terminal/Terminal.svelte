<script lang="ts">
  import { determineOutput, SHELL_AUTOCOMPLETE_OPTIONS } from "./shell";
  import beep from "../assets/beep";
  import { focusElement } from "../lib/utilities.svelte";
  import { onMount, tick } from "svelte"; //https://svelte.dev/docs/svelte/lifecycle-hooks#tick
  import { log, terminalInputStore, inputHistory, tabCompletionStore } from "./terminalStore.svelte";
  import { windowManager } from "../lib/windowManager.svelte";
  import { bootTerminal, instantlyBootTerminalAndOpenApp } from "./terminalStartingActions.svelte";
  import { urlManager } from "../lib/urlManager.svelte";

  let mainInput = $state<HTMLElement | null>(null); //component-binded handle for native dom input box refocus

  onMount(async () => {
    const command = urlManager.getInitialRoute();
    if(!command) {
      await bootTerminal();
    } else {
      await instantlyBootTerminalAndOpenApp(command);
    }
    await handleSubmit();
  });

  async function handleSubmit(): Promise<void> {
    //handle if an app is open
    if(windowManager.hasActiveApp) { 
      beep();
      log.add(terminalInputStore.value || `&nbsp`); //echo (without nbsp it will ignore empty string cuz empty <p> doesnt render)
      terminalInputStore.value = ''; //clear without hiding
      await focusBottomOfTerminal();
      return;
    }

    tabCompletionStore.reset();

    //determine command output
    const output = determineOutput(terminalInputStore.value);
    const echoValue = terminalInputStore.value;
    terminalInputStore.reset() //force need to re-render input element to focus again after new logs are flushed to DOM

    //adding non-empty cmd input to cmd history
    if(echoValue) { inputHistory.push(echoValue); }

    //echoing user input
    log.add( 
      `<span style="color: var(--orange)">user</span>@weewaa-land-352 
      <span style="color: var(--light-grey)"> ~/jameschang ›</span> 
      <span style="color: var(--pink); white-space: pre-wrap;">${echoValue}</span>` 
    );

    //printing cmd output
    if(output) {
      if(typeof output === 'function') {
        output(); // is type () => void as EMIT_COMMAND_ACTION
        await handleAfterSubmitProcess();
        return;
      }

      log.add(output);
    }

    await handleAfterSubmitProcess();
  }

  //force focus to input elem
  async function handleAfterSubmitProcess(): Promise<void> {
    await tick(); //flush log entry to DOM
    terminalInputStore.isVisible = true;
    await focusBottomOfTerminal();
    if(windowManager.hasActiveApp){ mainInput?.blur(); } //force un-focus
  }

  type TabCompletionState = { word: string, matches: string[] }
  function buildTabCompletionState(): TabCompletionState | null {
    const args = terminalInputStore.value.trim().split(/\s+/)
      .filter((string) => { return string.length > 0; }); //filter out empty strings
    if(args.length === 0) return null; //nothing typed

    const completingCommand = (args.length === 1) && (!terminalInputStore.hasTrailingWhitespace());
    const trailingSpace = terminalInputStore.hasTrailingWhitespace();
    const word = (!completingCommand && trailingSpace) ? '' : args[args.length - 1];
    const pool = completingCommand
      ? [...SHELL_AUTOCOMPLETE_OPTIONS.keys()] //complete against all known commands
      : SHELL_AUTOCOMPLETE_OPTIONS.get(args[0]); //complete against args for the given command

    if(!pool) return null; //unknown cmd

    const matches = pool.filter(v => v.startsWith(word));
    if(matches.length === 0) return null; //no matches

    return { word, matches };
  }

  async function handleTabComplete(event: Event) {
    event.preventDefault();
    if(windowManager.hasActiveApp) { beep(); return; } //an app is running
    tabCompletionStore.isMutating = true;
    try {
      //first tab press: snapshot input state so subsequent tabs can cycle without re-parsing
      if(!tabCompletionStore.isActive) {
        const state = buildTabCompletionState();
        if(!state) { beep(); return; } //nothing typed, no pool, or no matches

        tabCompletionStore.originalText = terminalInputStore.value; //lock snapshot
        tabCompletionStore.originalWord = state.word; //lock word being completed
        tabCompletionStore.matches = state.matches; //lock match list
        tabCompletionStore.index = -1; //no match applied yet — first tab only shows options
        tabCompletionStore.isActive = true; //must be set before terminalInputStore mutation triggers $effect
        tabCompletionStore.options = state.matches.join('   '); //show all options on first tab
      } else {
        if(!tabCompletionStore.matches) { beep(); return; }
        tabCompletionStore.index = ((tabCompletionStore.index + 1) % tabCompletionStore.matches.length); //advance cycle
      }

      if(tabCompletionStore.matches.length === 1) { //unambiguous match: skip cycling and complete immediately
        terminalInputStore.value = tabCompletionStore.getCompleted() + ' '; //extra space is default unix behaviour
        tabCompletionStore.reset();
        return;
      }

      if(tabCompletionStore.index >= 0) { //replace word being completed with current match
        terminalInputStore.value = (tabCompletionStore.getPrefix() + tabCompletionStore.matches[tabCompletionStore.index]);
        tabCompletionStore.options = tabCompletionStore.matches.join('   '); //show all options
      }

      await focusBottomOfTerminal();
    } finally {
      tabCompletionStore.isMutating = false; //release guard after all mutations done
    }
  }

  $effect(() => {
    terminalInputStore.value; //subscribe
    //resetting tab state on any external input change
    if(!tabCompletionStore.isMutating) { tabCompletionStore.resetAllButOptions(); }
  });

  async function focusBottomOfTerminal(): Promise<void> {
    await tick(); //finish microtask queue
    //https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
    if(terminalInputStore.element) { terminalInputStore.element.scrollTop = terminalInputStore.element.scrollHeight; }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  id="terminal"
  class="terminal"
  onclick={async () => {
    mainInput?.focus();
    await focusBottomOfTerminal(); 
  }}
  bind:this={terminalInputStore.element}
>
  {#each log.entries as message}
    <p>{@html message}</p>
  {/each}

  {#if terminalInputStore.isVisible}
  <form 
    onsubmit={(e) => { 
      e.preventDefault(); //disabling form submission page reload 
      handleSubmit(); 
    }}
    autocomplete="off" //disabling dropdown
  >
    <p>
      {#if !windowManager.hasActiveApp}
      <span style="color: var(--orange)">user</span>@weewaa-land-352
      <span style="color: var(--light-grey)"> ~/jameschang ›</span>
      {/if}
      <input
        style="width:{terminalInputStore.width}; max-width:100%; min-width:10ch;"
        spellcheck="false"
        type="text"
        bind:value={terminalInputStore.value}
        bind:this={mainInput}
        {@attach focusElement}
        onkeydown={(event) => {
          if(event.key === 'Tab') { handleTabComplete(event); }
          if(event.key === 'ArrowUp') { 
            if(windowManager.hasActiveApp) { beep(); return; }
            terminalInputStore.value = inputHistory.previous(event); 
          }
          if(event.key === 'ArrowDown') { 
            if(windowManager.hasActiveApp) { beep(); return; }
            terminalInputStore.value = inputHistory.next(event); 
          }
          if(event.code === 'KeyC' && event.ctrlKey) { //SIGINT
            event.preventDefault(); 
            if(windowManager.hasActiveApp) {
              log.add(terminalInputStore.value + "^C");
              terminalInputStore.value = '';
              focusBottomOfTerminal();
              windowManager.closeApp(); 
            } else {
              terminalInputStore.reset();
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