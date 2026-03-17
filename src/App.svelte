<script>
  import Window from "./lib/Window.svelte"
  import TerminalHeader from "./Terminal/TerminalHeader.svelte";
  import TerminalInterface from "./Terminal/TerminalInterface.svelte";
  import MediaQueryModal from "./lib/MediaQueryModal.svelte";
  import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from "./lib/utilities"
</script>

<MediaQueryModal />
<main>
  <Window 
    header={TerminalHeader} 
    content={TerminalInterface}
  />
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
</style>
