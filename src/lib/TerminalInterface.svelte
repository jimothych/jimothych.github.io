<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import { sleep, determineCommandOutput } from "./utilities"

  let masterLog = []; //array of objects; each object is a message
  function addLog(messageObject) {
    masterLog = [...masterLog, messageObject];
  }

  let inputValue = ''; //the value of the input field, constantly tracked by svelte
  let submittedValue = null; //value passed into handleSubmit() once the input form is submitted

  let inputElementVisible = false; //to control visibility of input form
  async function bootTerminal() {
    await sleep(100);
    addLog({message: "<em>salvete amici!</em>"});
    await sleep(1000);
    addLog({message: "Booting environment..."});
    await sleep(1300);
    inputElementVisible = true;

    simulateHelp();
  }

  async function simulateHelp() {
    await sleep(0);
    document.getElementById("mainInput").focus();
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

  async function handleSubmit() { //called via form submission
    console.log(inputValue);
    submittedValue = inputValue;
    inputValue = '';
    inputElementVisible = false;

    const output = determineCommandOutput(submittedValue);

    //step 1
    addLog({message: 
            `<span style="color: #F28B50">user</span>@weewaa-land-352
            <span style="color: #898989"> ~/jameschang <span>
            <span style="color: #d3b0c3">› ${submittedValue}</span>`
          });

    //step 2
    if(output) { //checking for null
      if(output === 'reboot') { window.location.reload(); } //sudo reboot command entered
      if(output === 'clear') { //clearing master log
        handleClear();
        return;
      }

      addLog({message: output});
    }

    await handleAfterSubmitProcess();
  }

  async function handleAfterSubmitProcess() {
    await sleep(150); //simulating latency, also conveniently pushes to bottom of div
    inputElementVisible = true;
    await sleep(0); //hack to bypass odd Svelte DOM rendering and get the input to focus again
    document.getElementById("mainInput").focus();
  }

  async function handleClear() {
    masterLog = [];
    masterLog = masterLog; //mutation assignment
    await handleAfterSubmitProcess();
  }

  function focusInput(event) {
    try {
      event.currentTarget.querySelector('input').focus();
    } catch { } //do nothing w/ errors
  }

  bootTerminal(); //called on initial mount
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
  class="terminal-interface" 
  on:click={focusInput}
  on:mouseover={focusInput}
>

  {#each masterLog as obj}
    <p>{@html obj.message}</p>
  {/each}
  
  {#if inputElementVisible}
  <form on:submit|preventDefault={handleSubmit} autocomplete="off" name="mainForm">
    <p>
      <span style="color: #F28B50">user</span>@weewaa-land-352
      <span style="color: #898989"> ~/jameschang </span>›
      <input 
        spellcheck="false" type="text" style="display: inline;" 
        bind:value={inputValue} 
        id="mainInput"
      >
    </p>
  </form>
  {/if}
</div>

<style>
  .terminal-interface {
    display: flex;
    flex-direction: column;
    background-color: #260119;
    width: 100%;
    height: 100%;
    padding: 8px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>