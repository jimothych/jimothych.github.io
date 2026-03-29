<script>
  import Window from "./lib/Window.svelte"
  import MediaQueryModal from "./lib/MediaQueryModal.svelte";
  import { windowManager } from "./lib/windowManager.svelte";
  import { WINDOW_ID_ENUM, activateWindowViaDOMBubbleUp } from "./lib/utilities.svelte";
  import Toast from "./lib/toast/Toast.svelte";
</script>

<MediaQueryModal />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
  {@attach activateWindowViaDOMBubbleUp(WINDOW_ID_ENUM.NONE)}
>
  <Toast />
  <Window
    id={windowManager.activeWindows.terminal.ID}
    Header={windowManager.activeWindows.terminal.HEADER} 
    Content={windowManager.activeWindows.terminal.CONTENT}
    offsetX={windowManager.activeWindows.terminal.OFFSET_X}
    offsetY={windowManager.activeWindows.terminal.OFFSET_Y}
    initialWidth={windowManager.activeWindows.terminal.INITIAL_WIDTH}
    initialHeight={windowManager.activeWindows.terminal.INITIAL_HEIGHT}
    fontFamily={windowManager.activeWindows.terminal.FONT_FAMILY}
    textColor={windowManager.activeWindows.terminal.TEXT_COLOR}
    borderColor={windowManager.activeWindows.terminal.BORDER_COLOR}>
  </Window>

  {#if windowManager.activeWindows.app}
    <Window 
      id={windowManager.activeWindows.app.ID}
      Header={windowManager.activeWindows.app.HEADER} 
      Content={windowManager.activeWindows.app.CONTENT}
      offsetX={windowManager.activeWindows.app.OFFSET_X}
      offsetY={windowManager.activeWindows.app.OFFSET_Y}
      initialWidth={windowManager.activeWindows.app.INITIAL_WIDTH}
      initialHeight={windowManager.activeWindows.app.INITIAL_HEIGHT}
      fontFamily={windowManager.activeWindows.app.FONT_FAMILY}
      textColor={windowManager.activeWindows.app.TEXT_COLOR}
      borderColor={windowManager.activeWindows.app.BORDER_COLOR}
    />
  {/if}
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
</style>
