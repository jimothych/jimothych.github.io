<script>
  import { setContext } from 'svelte';
  import { windowManager } from './windowManager.svelte';
  import { 
    interactable, 
    WINDOW_ACTION_ENUM,
    maximizeContainer,
    minimizeContainer,
    MIN_WINDOW_WIDTH,
    MIN_WINDOW_HEIGHT
  } from './utilities';

  let { id, Header, Content } = $props();

  //for interactable buttons in header
  const windowContext = $state({ action: null });
  setContext('window', windowContext);

  let container = $state(); //component-bound to the Window wrapper

  $effect(() => {
    if(windowContext.action === WINDOW_ACTION_ENUM.MAXIMIZE) {
      maximizeContainer(container);
    } else if(windowContext.action === WINDOW_ACTION_ENUM.MINIMIZE) {
      minimizeContainer(container);
    }
    windowContext.action = null;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class={[ //https://svelte.dev/docs/svelte/class
    'window-container', 
    { focused: windowManager.currentlyFocusedWindow === id } //z-index hack
  ]}
  bind:this={container}
  onclick={(event) => { 
    event.stopPropagation(); //stop click bubbling to main
    windowManager.setCurrentlyFocusedWindow(id);
  }}
  style={`
    width: max(60vw, ${MIN_WINDOW_WIDTH}px); 
    height: max(70vh, ${MIN_WINDOW_HEIGHT}px);
  `}
  {@attach interactable}
>
  <Header {id}></Header>
  <Content {id}></Content>
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

  .window-container.focused {
    z-index: 1;
  }
</style>