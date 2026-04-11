<script lang="ts">
  import { getWindowContext } from '../lib/context';
  import MinimizeSVG from '../assets/MinimizeSVG.svelte';
  import MaximizeSVG from '../assets/MaximizeSVG.svelte';
  import ExitSVG from '../assets/ExitSVG.svelte';
  import { WINDOW_ACTION_ENUM, type WINDOW_ID } from '../lib/utilities.svelte';
  import { windowManager } from '../lib/windowManager.svelte';

  const windowContext = getWindowContext();

  type Props = { id: WINDOW_ID }
  let { id }: Props = $props();

  let focusColor = $derived<string>(
    (windowManager.activeWindow === id) ? "--white" : "--app-inactive"
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
    <button 
      class="icon-container"
      onclick={() => windowContext.action = WINDOW_ACTION_ENUM.EXIT}
    >
      <ExitSVG color={`var(${focusColor})`} />
    </button>
  </div>

  <p style={`color: var(${focusColor});`}>
    victionarium
  </p>

</div>

<style>
  .header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 34px;
    background-color: var(--black);
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
    background-color: var(--app-hover);
  }

</style>