<script>
  import Header from "./lib/Header.svelte";
  import TerminalInterface from "./lib/TerminalInterface.svelte";
</script>

<main>
  <div class="main-container">
    <Header />
    <TerminalInterface />
  </div>
</main>

<style>
  .main-container{
    display: flex;
    flex-direction: column;
    width: 60vw;
    min-width: 400px;
    height: 500px;
    overflow: hidden;
    border-radius: 6px;
    border: 2px solid #222222;
    margin: 20px;
    cursor: text;
  }
</style>
