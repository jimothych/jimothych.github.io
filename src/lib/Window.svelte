<script>
  import { setContext } from 'svelte';
  import { 
    interactable, 
    WINDOW_ACTION,
    maximizeContainer,
    minimizeContainer,
    MIN_WINDOW_WIDTH,
    MIN_WINDOW_HEIGHT
  } from './utilities';

  let { header, content } = $props();

  //for interactable buttons in header
  const windowContext = $state({ action: null });
  setContext('window', windowContext);

  let container = $state(); //component-bound to the Window wrapper

  $effect(() => {
    if(windowContext.action === WINDOW_ACTION.MAXIMIZE) {
      maximizeContainer(container);
    } else if(windowContext.action === WINDOW_ACTION.MINIMIZE) {
      minimizeContainer(container);
    }
    windowContext.action = null;
  });
</script>

<div
  class="window-container"
  bind:this={container}
  style={`
    width: max(60vw, ${MIN_WINDOW_WIDTH}px); 
    height: max(70vh, ${MIN_WINDOW_HEIGHT}px);
  `}
  {@attach interactable}
>
  {@render header()}
  {@render content()}
</div>

<style>
  .window-container{
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 6px;
    border: 2px solid var(--dark-grey);
    cursor: default;
  }
</style>