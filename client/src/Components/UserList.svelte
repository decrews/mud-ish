<script>
  export let users;
</script>

<main>
  <h4>connected users</h4>
  {#each users as user (user.id)}
    <div>
      <p>{user.username}</p>
    </div>
  {/each}
</main>

<style>
  main {
    width: 10em;
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
