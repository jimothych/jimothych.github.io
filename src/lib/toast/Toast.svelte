<script>
  import { fly, fade } from "svelte/transition";
  import { toast } from "./toastController.svelte";
  import ExitSVG from "../../assets/ExitSVG.svelte";

  let isVisible = $state(false);
  let message = $state("");
  let duration = $state(2500);

  let timeoutID = $state(null);

  function open(msg, d) {
    message = msg;
    duration = d;
    isVisible = true;

    if(timeoutID) { clearTimeout(timeoutID); }
    if(duration > 0) { timeoutID = setTimeout(close, duration); }
  }

  function close() {
    isVisible = false;

    if(timeoutID) { clearTimeout(timeoutID); timeoutID = null; }
  }

  toast.register({ open, close });
</script>

{#if isVisible}
  <div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
    <div
      class="toast"
      in:fly={{ x: -200, duration: 300 }}
      out:fly={{ x: -200, duration: 500 }}
    >
      <p class="msg">
        {@html message}
      </p>

      <button 
        class="exit"
        onclick={() => close()}
      >
        <ExitSVG color={`var(--white)`}/>
      </button>

    </div>
  </div>
{/if}

<style>
  .toast {
    border-left: 5px solid var(--orange);
    position: fixed; top: 10px; left: 20px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    min-width: 200px;
    height: 60px;
    padding: 4px;
    background: var(--dark-grey);
    box-shadow: rgba(0, 0, 0, 0.18) 0px 1px 4px;
    z-index: 5;
    border-radius: 3px;
  }

  .msg {
    color: var(--white);
    font-family: "Ubuntu Sans";
    font-weight: 500;
    font-size: 14px;
    flex: 1;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 10px;
    padding-right: 4px;
    height: 100%;
    cursor: default;
  }

  .exit {
    padding: 0;
    margin-left: auto;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    opacity: 1;
    transition: 0.1s;
  }
  .exit:hover {
    background-color: var(--app-hover);
  }
</style>