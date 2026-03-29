<script>
  import { DotLottie } from "@lottiefiles/dotlottie-web";

  let { isVisible } = $props();
  let canvasElement = $state(null);

  $effect(() => {
    if (!canvasElement) { return; }
    const dotLottie = new DotLottie({
      canvas: canvasElement,
      src: "/animations/loading.lottie",
      loop: true,
      autoplay: true,
    });
    return () => dotLottie.destroy();
  });
</script>

{#if isVisible}
<div class="loading-modal">
  <canvas bind:this={canvasElement} width="85" height="85"></canvas>
</div>
{/if}

<style>
  .loading-modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(var(--dark-purple-rgb), 0.2);
    inset: 0;
    z-index: 9999;
  }
</style>