<script>
  import { DotLottie } from "@lottiefiles/dotlottie-web";

  let { isVisible } = $props();
  let canvasElement = $state(null);

  $effect(() => {
    if (!canvasElement) { return; }
    const dotLottie = new DotLottie({
      canvas: canvasElement,
      src: "/animations/isometric_loader.lottie",
      loop: true,
      autoplay: true,
    });
    return () => dotLottie.destroy();
  });
</script>

{#if isVisible}
  <div class="loading-modal">
    <canvas bind:this={canvasElement} width="90" height="90"></canvas>
  </div>
{/if}

<style>
  .loading-modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    inset: 0;
    z-index: 9999;
  }
</style>