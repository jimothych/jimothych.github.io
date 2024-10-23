<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
</script>

<div class="header">

  <div class="buttons-absolute">
    <div class="button red"></div>
    <div class="button yellow"></div>
    <div class="button green"></div>
  </div>

  <div class="github-link" style="color: #898989;">
    <a href="https://github.com/jimothych" target="_blank" style="text-decoration: none;">
      <i class="fa-brands fa-github" style="color: #898989;"></i> github.com/jimothych
    </a>
  </div>

</div>

<style>
  .header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 24px;
    background-color: #2C2C2C;
    cursor: default;
  }

  .buttons-absolute{
    position: absolute;
    left: 8px;
    display: flex;
    flex-direction: row;
  }

  .header .button{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
    cursor: pointer;
  }
  .red{background-color:#F5544D;}
  .yellow{background-color:#FABD2F;}
  .green{background-color:#47D043;}

</style>