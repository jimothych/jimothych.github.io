<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import { getContext } from 'svelte';
  import MinimizeSVG from '../assets/MinimizeSVG.svelte';
  import MaximizeSVG from '../assets/MaximizeSVG.svelte';
  import { WINDOW_ACTION_ENUM } from '../lib/utilities';
  import { windowManager } from '../lib/windowManager.svelte';

  const windowContext = getContext('window');
  let { id } = $props();

  let focusColor = $derived(
    (windowManager.currentlyFocusedWindow === id) ? "--light-grey" : "--terminal-inactive"
  );
</script>

<div class="header drag-handle">

  <div class="icons-absolute">
    <button 
      class="icon-container" 
      onclick={() => windowContext.action = WINDOW_ACTION_ENUM.MINIMIZE}
    >
      <MinimizeSVG color="var(--light-grey)" />
    </button>
    <button 
      class="icon-container"
      onclick={() => windowContext.action = WINDOW_ACTION_ENUM.MAXIMIZE}
    >
      <MaximizeSVG color="var(--light-grey)" />
    </button>
  </div>

  <div class="github-link" style={`color: var(${focusColor})`}>
    <a 
      href="https://github.com/jimothych" 
      target="_blank" 
      style={`text-decoration: none; color: var(${focusColor})`}
    >
      <i class="fa-brands fa-github" style={`color: var(${focusColor})`}></i> github.com/jimothych
    </a>
  </div>

</div>

<style>
  .header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 24px;
    background-color: var(--med-grey);
    cursor: default;
    user-select: none; /* prevents user selection of text */
  }

  .icons-absolute{
    position: absolute;
    right: 4px;
    display: flex;
    flex-direction: row;
  }

  .header .icon-container{
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: 0.1s;
    margin-left: 4px;
    background: none;
    border: none;
    padding: 0;
  }
  .icon-container:hover {
    background-color: var(--terminal-hover);
  }

</style>