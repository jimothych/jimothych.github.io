<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import DictionaryEntry from "./DictionaryEntry.svelte";
  import LoadingModal from "./LoadingModal.svelte";
  import { onMount } from "svelte";
  import { sleep } from "../lib/utilities.svelte";
  import { getRandomLatinLemmaHTML, getLatinLemmaHTMLByTitle, type LemmaResult } from "./wiktionary";
  import { 
    extractLatinSection, 
    extractLatinSidebarContent, type SidebarContent,
    extractLatinDictionaryEntryContent, type DictionaryEntryContent
  } from "./htmlParser";
  import { victionariumInputStore } from "./victionariumStore.svelte";
  import { urlManager } from "../lib/urlManager.svelte";
  import { VICTIONARIUM } from "../Terminal/commands/victionarium";

  let victionariumElement = $state<HTMLElement | null>(null);

  function handleHashLinkClick(e: MouseEvent) {
    // find the closest anchor element from the click target
    const target = (e.target as HTMLElement)?.closest('a');
    if(!target) return;
    const href = target.getAttribute('href');
    // only handle hash links (sidebar links)
    if(!href?.startsWith('#')) return;
    e.preventDefault();
    // strip leading # to get the element id
    const id = href.slice(1);
    // find the element with that id inside the scroll container
    const el = victionariumElement?.querySelector(`#${CSS.escape(id)}`) as HTMLElement;
    if(!el) return;
    const container = victionariumElement?.querySelector('.dictionary-entry');
    if (!container) return;
    container.scrollTo({ top: el.offsetTop, behavior: 'instant' });
  }

  let latinSidebarContent = $state<SidebarContent[] | null>(null);
  let latinDictionaryEntryContent = $state<DictionaryEntryContent | null>(null);
  let error = $state<string | null>(null);

  type FetchFn = () => Promise<LemmaResult>
  async function loadLatinLemma(fetchFn: FetchFn) {
    latinSidebarContent = null;
    latinDictionaryEntryContent = null;
    error = null;
    try {
      const { html, title } = await fetchFn();
      const latinSection = extractLatinSection(html);
      latinSidebarContent = extractLatinSidebarContent(latinSection, title);
      latinDictionaryEntryContent = extractLatinDictionaryEntryContent(latinSection, title);
      return title;
    } catch(e) {
      if(e instanceof Response && e.status === 404) {
        error = `no query results :(`;
      } else if(e instanceof Error) {
        error = e.message;
      } else {
        error = String(e);
      }
    }
  }

  async function loadLemmaAndNavigate(fetchFn: FetchFn) {
    const title = await loadLatinLemma(fetchFn);
    if(title) { urlManager.navigate(`/victionarium/${title}`); }
  }

  async function handleSubmit() {
    await loadLemmaAndNavigate(() => getLatinLemmaHTMLByTitle(victionariumInputStore.value));
    victionariumInputStore.value = "";
  }

  onMount(async () => {
    await sleep(200); //wait for other stateful stuff to complete elsewhere
    victionariumInputStore.element?.focus();
    const subpath = urlManager.getSubpath(VICTIONARIUM.name);
    if(subpath) {
      await loadLemmaAndNavigate(() => getLatinLemmaHTMLByTitle(subpath));
    } else {
      await loadLemmaAndNavigate(() => getRandomLatinLemmaHTML());
    }
  });

  //when the user navigates back/forward in browser history, restore the content
  //for that url without pushing a new history entry by calling navigate (which would corrupt the stack)
  $effect(() => {
    if(!urlManager.isRestoringHistory) { return; }
    urlManager.isRestoringHistory = false;
    const subpath = urlManager.getSubpath(VICTIONARIUM.name);
    if(subpath) {
      loadLatinLemma(() => getLatinLemmaHTMLByTitle(subpath));
    } else {
      loadLatinLemma(() => getRandomLatinLemmaHTML()); 
    }
  });
</script>

<LoadingModal isVisible={!latinDictionaryEntryContent && !error} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
  class="victionarium" 
  bind:this={victionariumElement}
  tabindex="-1"
  onkeydown={() => victionariumInputStore.element?.focus()}
  onclick={handleHashLinkClick}
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
      placeholder="quaere" 
      bind:value={victionariumInputStore.value}
      bind:this={victionariumInputStore.element}
    >
  </form>

  <div class="row">
    <Sidebar 
      content={latinSidebarContent} 
    />
    <DictionaryEntry 
      content={latinDictionaryEntryContent} 
      error={error}
      //big fancy closure :)
      onNavigate={(word: string) => loadLemmaAndNavigate(() => getLatinLemmaHTMLByTitle(word))}
    />
  </div>
</div>

<style>
  .victionarium {
    box-sizing: border-box;
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
    padding-left: 4px;
    padding-right: 4px;
    padding-bottom: 4px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin: 0;
    overflow: hidden;
  }

  form {
    width: 100%;
    flex-shrink: 0;
  }

  .row {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }

  input {
    font-family: "Ubuntu Sans";
    font-weight: 500;
    display: inline;
    width: 35%;
    height: 30px;
    background-color: var(--button-color);
    padding: 0;
    margin: 0;
    font-size: 14px;
    color: var(--white);
    border-radius: 4px;
    border: 1.5px solid var(--black);
    caret-color: var(--light-grey);
    padding-left: 6px;
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
  }
  input:focus{
    outline: none;
    border: none;
    box-shadow: none;
    border: 1.5px solid var(--black);
    background: var(--app-hover);
  }
  ::placeholder {
    color: var(--light-grey);
    font-style: italic;
    opacity: 1;
  }
  input:focus::placeholder {
    opacity: 0.3;
  }
</style>