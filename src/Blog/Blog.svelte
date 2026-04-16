<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Thumbnail from './Thumbnail.svelte';
  import { tabManager } from './tabManager.svelte';
  import { BLOGS } from './blogs/blogs';
  import { urlManager } from '../lib/urlManager.svelte';
  import { BLOG } from '../Terminal/commands/blog';

  onMount(async () => {
    await tick(); //flush
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

    urlManager.reload();
  });
</script>

{#if (tabManager.activeTabSlug != "home") && (tabManager.blogData)}
<div class="blog">
  <div class="content-scrollable-container">
  <div class="content-container">
    <h2>{tabManager.blogData.title}</h2>
    <p class="date">{tabManager.blogData.thumbnail.date}</p>
    {@html tabManager.blogData.content}
  </div>
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
  }

  /* ---------------------------------------------------- */
  /* blog-specific custom classes section                 */
  /* ---------------------------------------------------- */

  .content-scrollable-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    overscroll-behavior-y: contain;
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      var(--dark-purple) 6px,
      var(--dark-purple) calc(100% - 6px),
      transparent 100%
    );
  }
  .content-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 30px;
    padding-bottom: 64px;
    width: min(750px, 70%);
  }
  .content-container .date {
    font-size: 12px;
    font-weight: 500;
    color: var(--light-grey);
    width: 100%;
    height: 20px;
    margin-bottom: 24px;
    border-bottom: 2px solid var(--mid-black);
  }
  .content-container :global(p) {
    font-size: 18px;
    line-height: 1.35em;
    margin-bottom: 20px;
  }
  .content-container :global(.break) {
    width: 100%;
    border-bottom: 2px solid var(--mid-black);
  }
  .content-container :global(.img-container) {
    box-sizing: border-box;
    align-self: center;
    margin-top: 4px;
    margin-bottom: 24px;

    display: inline-block;
    width: min-content;
  }
  .content-container :global(.img) {
    object-fit: contain;
  }
  .content-container :global(.img-description) {
    margin-top: 4px;
    font-size: 14px;
    color: var(--light-grey);
    font-style: italic;
  }
  .content-container :global(.markdown) {
    font-size: 17px;
    background-color: var(--med-grey);
    border-radius: 5px;
    font-weight: 500;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 6px;
    padding-right: 6px;
    margin-left: 2px;
    margin-right: 2px;
  }
  .content-container :global(.comment) {
    color: var(--light-grey);
  }
  .content-container :global(.multi-line) {
    font-size: 18px;
    align-self: center;
    width: 85%;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 4px;
    margin-bottom: 28px;
    overflow-x: scroll;
    overscroll-behavior-x: none;
    white-space: pre;
  }
  .content-container :global(.block-quote) {
    align-self: center;
    width: 85%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-top: 4px;
    margin-bottom: 20px;
    font-style: italic;
    font-size: 18px;
    border-left: 2px solid var(--mid-black);
    white-space: pre-wrap;
  }
  .content-container :global(a) {
    color: var(--orange);
  }
  .content-container h2 {
    font-size: 28px;
    margin-top: 40px;
    margin-bottom: 8px;
  }
  .content-container :global(h3) {
    font-size: 19px;
    margin-top: 12px;
    margin-bottom: 4px;
  }
  .content-container :global(.footnote) { 
    padding-top: 10px;
    font-size: 14px;
    text-decoration: none;
    color: var(--light-grey);
    font-style: italic;
  }
  .content-container :global(sup) {
    font-size: 14px;
    text-decoration: none;
    vertical-align: baseline;
    position: relative;
    top: -0.4em;
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
    width: min(750px, 70%);
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