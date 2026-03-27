<div class="victionarium">
  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
</div>

<style>
  .victionarium {
    box-sizing: border-box; /* forces css to calculate width as a total sum to include padding */
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--dark-grey);
    width: 100%;
    flex: 1; /* fill inside parent */
    min-height: 0; /* prevents flex overflow */
    overscroll-behavior-y: none;
    padding: 8px;
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    user-select: none; /* prevents user selection of text */
  }
</style>