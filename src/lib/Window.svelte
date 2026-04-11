<script lang="ts">
  import { windowManager } from './windowManager.svelte';
  import { setWindowContext, type WindowContext } from './context';
  import { 
    interactable, 
    centerContainer,
    WINDOW_ACTION_ENUM,
    maximizeContainer,
    minimizeContainer,
    MIN_WINDOW_WIDTH,
    MIN_WINDOW_HEIGHT,
    activateWindowViaDOMCapture,
    type WINDOW_ID,
  } from './utilities.svelte';
  import type { Component } from 'svelte';

  type Props = {
    id: WINDOW_ID;
    Header: Component<{ id: string }>;
    Content: Component<{ id: string }>;
    offsetX: number;
    offsetY: number;
    initialWidth: string;
    initialHeight: string;
    fontFamily: string;
    textColor: string;
    borderColor: string;
  }
  let { id, Header, Content, offsetX, offsetY, initialWidth, initialHeight, fontFamily, textColor, borderColor }: Props = $props();

  //for interactable buttons in header
  const windowContext = $state<WindowContext>({ action: null });
  setWindowContext(windowContext);

  let container = $state<HTMLElement>(); //component-bound to the Window wrapper

  function centerContainerClosure(): void { 
    centerContainer(container!, offsetX, offsetY); 
  }

  $effect(() => {
    if(windowContext.action === WINDOW_ACTION_ENUM.MAXIMIZE) {
      maximizeContainer(container!);
      centerContainer(container!);
    } else if(windowContext.action === WINDOW_ACTION_ENUM.MINIMIZE) {
      minimizeContainer(container!);
      centerContainer(container!, offsetX, offsetY);
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
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 6px;
    background: var(--black);
    box-shadow: rgba(0, 0, 0, 0.18) 0px 1px 4px;
  }
</style>