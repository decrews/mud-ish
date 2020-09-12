<script>
  let name = '';
  export let connect;

  function onSubmit(e) {
    console.warn('SUBMITTINGSDFSDF');
    e.preventDefault();
    connect(name);
  }
</script>

<main>
  <h1>Name?</h1>
  <form on:submit={onSubmit}><input type="text" bind:value={name} /></form>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
