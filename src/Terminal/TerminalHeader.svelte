<script lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import { getWindowContext } from '../lib/context';
  import MinimizeSVG from '../assets/MinimizeSVG.svelte';
  import MaximizeSVG from '../assets/MaximizeSVG.svelte';
  import { WINDOW_ACTION_ENUM } from '../lib/utilities.svelte';
  import { windowManager } from '../lib/windowManager.svelte';
  import type { WINDOW_ID } from '../lib/utilities.svelte';

  const windowContext = getWindowContext();

  type Props = { id: WINDOW_ID }
  let { id }: Props = $props();

  let focusColor = $derived<string>(
    (windowManager.activeWindow === id) ? "--light-grey" : "--terminal-inactive"
  );
</script>

<div class="header drag-handle">

  <div class="icons-absolute">
    <button 
      class="icon-container" 
      onclick={() => windowContext.action = WINDOW_ACTION_ENUM.MINIMIZE}
    >
      <MinimizeSVG color={`var(${focusColor})`} />
    </button>
    <button 
      class="icon-container"
      onclick={() => windowContext.action = WINDOW_ACTION_ENUM.MAXIMIZE}
    >
      <MaximizeSVG color={`var(${focusColor})`} />
    </button>
  </div>

  <a 
    class="github-link"
    href="https://github.com/jimothych" 
    target="_blank" 
    style={`color: var(${focusColor})`}
  >
    <i class="fa-brands fa-github" style={`color: var(${focusColor})`}></i>
    <span style={`margin-left: 6px;`}>github.com/jimothych</span>
  </a>

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
    cursor: grab;
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

  .github-link {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-decoration: none;
  }
</style>