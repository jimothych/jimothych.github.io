<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import DOMPurify from 'dompurify';
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

  async function simulateHelp() { //cool typing "animation" using the input form's binded value
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
    console.log(`user inputted value: ${inputValue}`);
    submittedValue = inputValue;
    inputValue = '';
    inputElementVisible = false;

    const cleanedInput = DOMPurify.sanitize(submittedValue); //sanitizing input text
    console.log(`sanitized input: ${cleanedInput}`);
    const output = determineCommandOutput(cleanedInput);

    //step 1
    addLog({message: 
            `<span style="color: #F28B50">user</span>@weewaa-land-352
            <span style="color: #898989"> ~/jameschang <span>
            <span style="color: #d3b0c3; white-space: pre-wrap;">› ${cleanedInput}</span>`
          });

    //step 2
    if(output) { //checking for null
      if(output === 'reboot') { //sudo reboot command entered
        window.location.reload();
        return; 
      }
      if(output === 'clear') { //clearing master log
        handleClear();
        return;
      }

      addLog({message: output});
    }

    await handleAfterSubmitProcess();
  }

  async function handleAfterSubmitProcess() {
    await sleep(0); //conveniently pushes focus to bottom of div
    inputElementVisible = true;
    await sleep(0); //hack to bypass odd DOM rendering and get the input to focus again
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
    box-sizing: border-box; /* forces css to calculate width as a total sum */
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #260119;
    width: 100%;
    height: 100%;
    padding: 8px;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>