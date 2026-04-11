<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Thumbnail from './Thumbnail.svelte';
  import { tabManager, BLOGS } from './tabManager.svelte';
  import { urlManager } from '../lib/urlManager.svelte';
  import { BLOG } from '../Terminal/commands/blog';

  onMount(async () => {
    await tick(); //wait for other stateful stuff to complete elsewhere
    const subpath = urlManager.getSubpath(BLOG.name);
    if(!subpath) {
      urlManager.navigate(`/blog/home`);
    } else if (BLOGS.has(subpath)) {
      tabManager.activeTabSlug = subpath
      tabManager.blogData = BLOGS.get(subpath)!;
      urlManager.navigate(`/blog/${subpath}`);
    }
  });

  //when the user navigates back/forward in browser history
  //we simply reload the page as preserving state is of no importance for blog app
  $effect(() => {
    if(!urlManager.isRestoringHistory) { return; }
    window.location.reload();
  });
</script>

{#if (tabManager.activeTabSlug != "home") && (tabManager.blogData)}
<div class="blog">
  <div class="content-container">
    {@html tabManager.blogData.content}
  </div>
</div>
{:else}
<div class="blog">
  <div class="column">

    <div class="menu">
      <p class="home-text">Home</p>
    </div>
    {#each Array.from(BLOGS.values()) as blog (blog.slug)}
      <Thumbnail data={blog} />
    {/each}
  </div>
</div>
{/if}

<style>
  .blog {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--dark-grey);
    width: 100%;
    height: 100%;
    flex: 1; /* fill inside parent */
    min-height: 0; /* prevents flex overflow */
    border-top-right-radius: 6px;
    margin: 0;
    overflow: hidden;
  }

  /* ---------------------------------------------------- */
  /* blog-specific custom classes section                 */
  /* ---------------------------------------------------- */

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 30px;
    padding-bottom: 30px;
    width: min(800px, 70%);
    height: 100%;
    overflow-y: scroll;
    overscroll-behavior-y: contain;
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      var(--dark-purple) 8px,
      var(--dark-purple) calc(100% - 8px),
      transparent 100%
    );
  }

  .content-container :global(p) {
    font-size: 18px;
  }

  /* ---------------------------------------------------- */
  /* home section                                         */
  /* ---------------------------------------------------- */

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 30px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overscroll-behavior-y: contain;
  }

  .menu {
    width: min(800px, 70%);
    flex-direction: row;
    justify-content: flex-start;
    cursor: default;
    user-select: none; /* prevents user selection of text */
  }

  .home-text {
    margin-left: 24px; 
    margin-bottom: 12px;
    padding-bottom: 12px; 
    border-bottom: 2px solid var(--orange);
    width: 45px;
    font-weight: 500;
  }
</style>