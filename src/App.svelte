<script>
  import Window from "./lib/Window.svelte"
  import MediaQueryModal from "./lib/MediaQueryModal.svelte";
  import { windowManager } from "./lib/windowManager.svelte";
  import { WINDOW_ID_ENUM } from "./lib/utilities";
</script>

<MediaQueryModal />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main onclick={() => windowManager.setCurrentlyFocusedWindow(WINDOW_ID_ENUM.NONE)}>
  {#each windowManager.activeWindows as window}
    <Window 
      id={window.ID}
      Header={window.HEADER} 
      Content={window.CONTENT}
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
