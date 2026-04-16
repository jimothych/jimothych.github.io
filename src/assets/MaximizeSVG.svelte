<script lang="ts">
  type Props = { color: string }
  let { color }: Props = $props();
</script>

<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={`color: ${color}`}>
 <path d="M4 4v8h8V4zm1 1h6v6H5z" fill="currentColor" font-family="sans-serif" font-weight="400" overflow="visible" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none"/>
</svg>

<style>
  svg {
    cursor: pointer;
  }
</style>