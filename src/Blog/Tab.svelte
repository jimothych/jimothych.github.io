<script lang="ts">
  import { tabManager } from './tabManager.svelte';
  import ExitSVG from '../assets/ExitSVG.svelte';
  import { windowManager } from '../lib/windowManager.svelte';
  import { urlManager } from '../lib/urlManager.svelte';
  import type { Snippet } from 'svelte';
  import type { WINDOW_ID } from '../lib/utilities.svelte';

  type Props = { windowID: WINDOW_ID; thisTabSlug: string; children: Snippet; }
  let { windowID, thisTabSlug, children }: Props = $props();

  let focusColor = $derived<string>(
    windowManager.activeWindow === windowID ? '--white' : '--app-inactive'
  );
  let bgColor = $derived<string>(
    tabManager.activeTabSlug === thisTabSlug ? '--dark-grey' : '--mid-black'
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="tab"
  class:active={tabManager.activeTabSlug === thisTabSlug}
  style={`
    --tab-bg: var(${bgColor});
    color: var(${focusColor});
  `}
  onclick={() => { 
    tabManager.activeTabSlug = thisTabSlug; 
    urlManager.navigate(`/blog/${thisTabSlug}`);
  }}
>
  <div class="tab-text">
    {@render children()}
  </div>

  <!-- expose a clickable close button for blog tabs -->
  {#if thisTabSlug != "home"}
  <button 
    class="icon-container"
    onclick={(e) => { 
      e.stopPropagation(); // prevent the parent click from happening
      tabManager.reset();
      urlManager.navigate(`/blog/home`);
    }}
  >
    <ExitSVG color={`var(${focusColor})`} />
  </button>
  {/if}
</div>

<style>
  .tab {
    box-sizing: border-box;
    width: min(125px, 35%);
    margin-left: 4px;
    height: 90%;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: visible;
    cursor: default;
    z-index: 1;
    background-color: var(--tab-bg);
  }
  .tab.active {
    z-index: 2;
  }
  .tab::before,
  .tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 12px;
    height: 12px;
  }
  .tab::before {
    left: -12px;
    border-bottom-right-radius: 12px;
    box-shadow: 4px 4px 0 0 var(--tab-bg);
  }
  .tab::after {
    right: -12px;
    border-bottom-left-radius: 12px;
    box-shadow: -4px 4px 0 0 var(--tab-bg);
  }

  .tab-text {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 60%;
    height: 100%;
    overflow-x: hidden;
    padding-left: 10px;
    padding-top: 2px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    mask-image: linear-gradient(to right, black 80%, transparent);
  }

  .icon-container{
    width: 16px;
    height: 16px;
    cursor: pointer;
    opacity: 1;
    transition: 0.1s;
    margin-right: 6px;
    background: none;
    border: none;
    padding: 0;
  }
  .icon-container:hover {
    background-color: var(--app-hover);
  }
</style>