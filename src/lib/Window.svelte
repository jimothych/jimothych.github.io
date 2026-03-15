<script>
  import { setContext } from 'svelte';
  import { centerContainer, interactable, MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from './utilities';

  let { header, content } = $props();

  //for min and max buttons in header
  const windowContext = $state({ action: null });
  setContext('window', windowContext);

  let container = $state(); //component-bound to the Window wrapper

  $effect(() => {
    if (windowContext.action === 'maximize') {
      container.style.width = (window.innerWidth - 4) + 'px';
      container.style.height = (window.innerHeight - 4) + 'px';
      container.style.transform = 'translate(0px, 0px)';
      container.setAttribute('data-x', 0);
      container.setAttribute('data-y', 0);
    } else if (windowContext.action === 'minimize') {
      container.style.width = MIN_WINDOW_WIDTH + 'px';
      container.style.height = MIN_WINDOW_HEIGHT + 'px';
    }
    centerContainer(container);
    windowContext.action = null;
  });
</script>

<div class="window-container" bind:this={container} {@attach interactable}>
  {@render header()}
  {@render content()}
</div>

<style>
  .window-container{
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 60vw;
    height: 70vh;
    overflow: hidden;
    border-radius: 6px;
    border: 2px solid var(--dark-grey);
    cursor: default;
  }
</style>