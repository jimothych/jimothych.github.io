<script>
  import { renderDictionaryEntry } from "./htmlParser";

  let { content, error, onNavigate } = $props();

  const nodes = $derived(content ? renderDictionaryEntry(content) : []);

  function handleClick(e) {
    const target = (e.target).closest('a');
    if(!target) return;
    const href = target.getAttribute('href');
    if(href.startsWith('#')) return;
    e.preventDefault();
    if(href.startsWith('./')) { //detecting relative pathing
      const word = href.slice(2).split('?')[0];
      onNavigate(word);
      return;
    }
    window.open(href, '_blank'); //open other website link
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="dictionary-entry" onclick={handleClick}>
  <div class="scrollable-container">
  {#if error}
    <p>{error}</p>
  {:else}
  {#each nodes as node}
    {#if node.type === 'heading'}
      <svelte:element this={`h${node.level}`} id={node.id}>{node.text}</svelte:element>
    {:else if node.type === 'html'}
      {@html node.html}
    {:else if node.type === 'table'}
      <table>
        <tbody>
          {#each node.rows as row}
            <tr>
              {#each row.cells as cell}
                {#if cell.isHeader}
                  <th colspan={cell.colspan} rowspan={cell.rowspan}>{@html cell.html}</th>
                {:else}
                  <td colspan={cell.colspan} rowspan={cell.rowspan}>{@html cell.html}</td>
                {/if}
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/each}
  {/if}
  </div>
</div>

<style>
  .dictionary-entry {
    padding-top: 30px;
    width: 70%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: scroll;
    overscroll-behavior-y: contain;
    overscroll-behavior-x: contain;
  }

  .scrollable-container {
    padding: 15px;
    padding-bottom: 50px;
  }

  :global(.dictionary-entry a) {
    color: var(--orange);
  }

  :global(a[href*="redlink"]) {
    color: var(--red);
    pointer-events: none;
  }

  :global(.dictionary-entry sup) {
    color: var(--red) !important;
  }
</style>