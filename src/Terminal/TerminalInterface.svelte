<script>
  import { determineCommandOutput } from "./shell.js";
  import { sleep, focusOnMount } from "../lib/utilities.js";
  import { tick } from "svelte";

  let masterLog = $state([]);
  let inputValue = $state('');
  let inputElementVisible = $state(false);

  let mainInput = $state(); //used as a component-binded handle for native dom window focus

  function addLog(messageObject) {
    masterLog = [...masterLog, messageObject];
  }

  async function bootTerminal() {
    await tick();
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

  //force focus to input elem
  async function handleAfterSubmitProcess() {
    await tick(); //flush log entry to DOM
    inputElementVisible = true;
  }

  async function handleSubmit() {
    const submittedValue = inputValue;
    inputValue = ''; //resetting
    inputElementVisible = false; //force need to re-render input element to focus again after new logs are flushed to DOM

    const output = determineCommandOutput(submittedValue);

    //echoing user input
    addLog({ message: 
      `<span style="color: var(--yellow)">user</span>@weewaa-land-352 
      <span style="color: var(--light-grey)"> ~/jameschang ›</span> 
      <span style="color: var(--white); white-space: pre-wrap;">${submittedValue}</span>` 
    });

    //printing cmd output
    if(output) {
      if(output === 'reboot') { window.location.reload(); return; }
      if(output === 'clear') { await handleClear(); return; }
      addLog({ message: output });
    }

    await handleAfterSubmitProcess();
  }

  async function handleClear() {
    masterLog = [];
    await handleAfterSubmitProcess();
  }
</script>

<svelte:window onload={bootTerminal} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="terminal-interface"
  onclick={() => mainInput?.focus()}
>
  {#each masterLog as obj}
    <p>{@html obj.message}</p>
  {/each}

  {#if inputElementVisible}
  <form 
    onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} //disabling form submission page reload
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
      >
    </p>
  </form>
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
    height: 100%;
    padding: 8px;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    user-select: none; /* prevents user selection of text */
  }
</style>