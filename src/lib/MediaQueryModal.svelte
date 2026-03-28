<div class="screen-too-small">
  {"mobile incompatible :("}
  <br><br>
  {"pls use a larger screen thx"}
</div>

<style>
  .screen-too-small {
    display: none;
    position: fixed;
    inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; */
    z-index: 9999;
    align-items: center;
    justify-content: center;
    background-color: var(--white);
    color: var(--dark-purple);
    text-align: center;
    font-size: 24px;
  }

  @media (max-width: 500px) {
    .screen-too-small {
      display: flex;
    }
  }
</style>