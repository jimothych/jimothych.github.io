<script>
  import { tabManager, TAB_ENUM } from './tabManager.svelte';
  import ExitSVG from '../assets/ExitSVG.svelte';
  import { windowManager } from '../lib/windowManager.svelte';

  let { windowID, thisTabID, children } = $props();

  let focusColor = $derived(
    windowManager.activeWindow === windowID ? '--white' : '--app-inactive'
  );
  let bgColor = $derived(
    tabManager.activeTabID === thisTabID ? '--dark-grey' : '--mid-black'
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="tab"
  class:active={tabManager.activeTabID === thisTabID}
  style={`
    --tab-bg: var(${bgColor});
    color: var(${focusColor});
  `}
  onclick={() => {
    tabManager.activeTabID = thisTabID;
  }}
>
  <div class="tab-text">
    {@render children()}
  </div>

  {#if thisTabID == TAB_ENUM.BLOG}
  <button 
    class="icon-container"
    onclick={(e) =>  { 
      e.stopPropagation(); // prevent the parent click from happening
      tabManager.blogData = null;
      tabManager.activeTabID = TAB_ENUM.HOME;
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
    margin-left: 6px;
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