<script>
  let { content } = $props();

  // [
  //   {"title":"Etymology","hash":"#Etymology","level":3,"children":[]},
  //   {"title":"Adjective","hash":"#Adjective","level":3,"children":[
  //      {"title":"Declension","hash":"#Declension","level":4,"children":[]},
  //      {"title":"Related terms","hash":"#Related_terms","level":4,"children":[]}
  //   ]},
  //   {"title":"References","hash":"#References","level":3,"children":[]}
  // ]
  function sidebarContentToHTML(entries, depth = 0) {
    return entries.map(entry => {
      const indent = depth * 10;
      const children = (entry.children.length > 0) 
        ? sidebarContentToHTML(entry.children, depth + 1) : '';
      return `<a 
        href="${entry.hash}" 
        style="
          padding-left:${indent}px; 
          align-self: flex-start;
          margin-bottom: 0.3em;
          font-weight: 500;
        "
      >
        ${entry.title}
      </a>${children}`;
    }).join('');
  }
</script>

<div class="sidebar">
  {#if content}
  {@html sidebarContentToHTML(content)}
  {/if}
</div>

<style>
  .sidebar {
    margin-top: 30px;
    box-sizing: border-box;
    width: 15%;
    display: flex;
    flex-direction: column;
    padding: 15px;
    overflow: hidden;
  }
  .sidebar::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: black;
  }
</style>