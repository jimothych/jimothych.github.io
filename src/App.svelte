<script>
  import Window from "./lib/Window.svelte"
  import MediaQueryModal from "./lib/MediaQueryModal.svelte";
  import { windowManager } from "./lib/windowManager.svelte";
  import { WINDOW_ID_ENUM, focusWindowViaBubble } from "./lib/utilities.svelte";
</script>

<MediaQueryModal />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
  {@attach focusWindowViaBubble(WINDOW_ID_ENUM.NONE)}
>
  {#each windowManager.activeWindows as activeWindow}
    <Window 
      id={activeWindow.ID}
      Header={activeWindow.HEADER} 
      Content={activeWindow.CONTENT}
      offsetX={activeWindow.OFFSET_X}
      offsetY={activeWindow.OFFSET_Y}
      initialWidth={activeWindow.INITIAL_WIDTH}
      initialHeight={activeWindow.INITIAL_HEIGHT}
      fontFamily={activeWindow.FONT_FAMILY}
      textColor={activeWindow.TEXT_COLOR}
      borderColor={activeWindow.BORDER_COLOR}
    />
  {/each}
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
</style>
