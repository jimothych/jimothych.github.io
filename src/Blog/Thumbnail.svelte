<script lang="ts">
  import { tabManager } from "./tabManager.svelte";
  import { urlManager } from "../lib/urlManager.svelte";
  import type { BlogData } from "./blogs/template/template";

  type Props = { data: BlogData }
  let { data }: Props = $props();

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
  class="thumbnail" 
  onclick={() => { 
    tabManager.blogData = data; 
    tabManager.activeTabSlug = data.slug;
    urlManager.navigate(`/blog/${data.slug}`)
  }}
>

  <div class="text-container">
    <div class="text">
      <h2 class="header" style="margin-bottom: 0.5rem;">{data.title}</h2>
      <p class="description">{data.thumbnail.description}</p>
    </div>

    <div class="date">{data.thumbnail.date}</div>
  </div>

  <!-- svelte-ignore a11y_missing_attribute -->
  <img class="thumbnail-photo" src={data.thumbnail.asset} loading="lazy">
</div>

<style>
  .thumbnail {
    margin-bottom: 24px;
    width: min(800px, 70%);
    height: 200px;
    flex-shrink: 0;
    /* background-color: var(--black); */
    border-bottom: 2px solid var(--black);

    box-sizing: border-box;
    padding-left: 24px;
    padding-right: 24px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    cursor: pointer;
  }

  .text-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 70%;
    height: 100%;
    padding-top: 12px;
    padding-bottom: 24px;
    padding-right: 24px;
    overflow-y:hidden;
  }

  .date {
    margin-top: 24px;
    font-size: 12px;
  }

  .thumbnail-photo {
    box-sizing: border-box;
    width: 30%;
    height: 100%;
    object-fit: contain;
  }
</style>