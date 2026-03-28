<script>
  import Sidebar from "./Sidebar.svelte";
  import DictionaryEntry from "./DictionaryEntry.svelte";
  import LoadingModal from "./LoadingModal.svelte";
  import { focusElement, sleep } from "../lib/utilities.svelte";
  import { getRandomLatinLemmaHTML, getLatinLemmaHTMLByTitle } from "./wiktionary";
  import { extractLatinSection, extractLatinSidebarContent, extractLatinDictionaryEntryContent } from "./htmlParser";

  let inputValue = $state("");
  let inputElement = $state(null);

  let latinSidebarContent = $state(null);
  let latinDictionaryEntryContent = $state(null);

  async function handleSubmit() {
    try {
      const html = await getLatinLemmaHTMLByTitle(inputValue);
      const latinSection = extractLatinSection(html);
      latinSidebarContent = extractLatinSidebarContent(latinSection);
      latinDictionaryEntryContent = extractLatinDictionaryEntryContent(latinSection);
    } catch(e) {
      latinSidebarContent = null;
      latinDictionaryEntryContent = `<p>${e.message}</p>`
    }
    inputValue = "";
  }

  async function generateRandomLatinLemmaOnMount() {
    try {
      const html = await getRandomLatinLemmaHTML();
      const latinSection = extractLatinSection(html);
      latinSidebarContent = extractLatinSidebarContent(latinSection);
      latinDictionaryEntryContent = extractLatinDictionaryEntryContent(latinSection);
    } catch(e) {
      latinSidebarContent = null;
      latinDictionaryEntryContent = `<p>${e.message}</p>`
    }
  }

  $effect(async() => {
    if (inputElement) { 
      await sleep(200); //wait for other stateful stuff to complete elsewhere
      focusElement(inputElement);
    }
  });

  $effect(() => { //no dependencies, runs once on mount
    (async () => { await generateRandomLatinLemmaOnMount(); })();
  });
</script>

<LoadingModal isVisible={latinDictionaryEntryContent ? false : true} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
  class="victionarium" 
  onmouseup={() => { 
    if(document.activeElement !== inputElement) { inputElement.focus(); } 
  }}
>
  <form 
    onsubmit={async(e) => { 
      e.preventDefault(); 
      await handleSubmit(); 
    }}
    autocomplete="off"
  >
    <input 
      spellcheck="false" 
      placeholder="īnscrībe" 
      bind:value={inputValue}
      bind:this={inputElement}
    >
  </form>

  <div class="row">
    <Sidebar />
    <DictionaryEntry />
  </div>
</div>

<style>
  .victionarium {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: var(--dark-grey);
    width: 100%;
    height: 100%;
    flex: 1; /* fill inside parent */
    min-height: 0; /* prevents flex overflow */
    overscroll-behavior-y: none;
    padding: 4px;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  form {
    width: 100%;
    height: 30px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .row {
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }

  input {
    font-family: "Ubuntu Sans";
    font-weight: 500;
    display: inline;
    width: 45%;
    height: 90%;
    background-color: var(--button-color);
    padding: 0;
    margin: 0;
    font-size: 14px;
    color: var(--white);
    border-radius: 4px;
    border: 1.5px solid var(--black);
    caret-color: var(--light-grey);
    padding-left: 6px;
  }
  input:focus{
    outline: none;
    border: none;
    box-shadow: none;
    border-radius: 5px;
    border: 1.5px solid var(--black);
  }
  ::placeholder {
    color: var(--light-grey);
    font-style: italic;
    opacity: 1;
  }
</style>