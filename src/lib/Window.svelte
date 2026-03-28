<script>
  import { setContext, untrack } from 'svelte';
  import { windowManager } from './windowManager.svelte';
  import { 
    interactable, 
    centerContainer,
    WINDOW_ACTION_ENUM,
    maximizeContainer,
    minimizeContainer,
    MIN_WINDOW_WIDTH,
    MIN_WINDOW_HEIGHT,
    activateWindowViaDOMCapture,
  } from './utilities.svelte';

  //choosing to spread props because I've decided not to use ts in .svelte files so no type hints
  let { id, Header, Content, offsetX, offsetY, initialWidth, initialHeight, 
    fontFamily, textColor, borderColor } = $props();

  //for interactable buttons in header
  const windowContext = $state({ action: null });
  setContext('windowContext', windowContext);

  let container = $state(); //component-bound to the Window wrapper

  function centerContainerClosure() { centerContainer(container, offsetX, offsetY); }

  $effect(() => {
    if(windowContext.action === WINDOW_ACTION_ENUM.MAXIMIZE) {
      maximizeContainer(container);
      centerContainer(container);
    } else if(windowContext.action === WINDOW_ACTION_ENUM.MINIMIZE) {
      minimizeContainer(container);
      centerContainer(container, offsetX, offsetY);
    } else if(windowContext.action === WINDOW_ACTION_ENUM.EXIT) { 
      windowManager.closeApp();
    }
    windowContext.action = null;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="window-container"
  bind:this={container}
  style={`
    font-family: ${fontFamily};
    color: var(${textColor});
    width: max(${initialWidth}, ${MIN_WINDOW_WIDTH}px); 
    height: max(${initialHeight}, ${MIN_WINDOW_HEIGHT}px);
    border: 2px solid var(${borderColor});
  `}
  style:z-index={windowManager.getZIndex(id)} //sets property reactively without messing up interact.js
  {@attach interactable}
  {@attach activateWindowViaDOMCapture(id)}
  {@attach centerContainerClosure}
>
  <Header id={id}></Header>
  <Content id={id}></Content>
</div>

<style>
  .window-container{
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 6px;
    cursor: default;
    box-shadow: rgba(0, 0, 0, 0.18) 0.5px 1.5px 4px;
  }
</style>