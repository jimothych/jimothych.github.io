<script>
  import Window from "./lib/Window.svelte"
  import TerminalHeader from "./Terminal/TerminalHeader.svelte";
  import TerminalInterface from "./Terminal/TerminalInterface.svelte";
</script>

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
