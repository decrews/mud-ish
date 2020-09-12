<script>
  import { onMount } from 'svelte';
  export let messages;
  export let sendMessage;
  export let message;
  let input;
  let box;

  onMount(() => {
    input.focus();
  });

  function onMessage(e) {
    // gotta do this to prevent the form from reloading the page
    // DUMB
    e.preventDefault();

    // call the function from App.svelte to send the message
    sendMessage(message);

    // message is bound to the input box, reset it
    message = '';

    // scroll to the bottom of chat box
    box.scrollIntoView(false);
  }
</script>

<main>
  <div class="message-box" bind:this={box}>
    <div class="spacer" />
    {#each messages as message (message.id + message.time + message.text)}
      {#if message.user}
        <p><span class="name">{message.user.username}</span> - {message.text}</p>
      {/if}
      {#if message.id === 'server'}
        <p class="server-message">{message.text}</p>
      {/if}
    {/each}
    <div class="text-container">
      <span>{'> '}</span>
      <form on:submit={(e) => onMessage(e)}>
        <input class="text-box" type="text" bind:this={input} bind:value={message} />
      </form>
    </div>
  </div>
</main>

<style>
  main {
    text-align: left;
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
  }

  form {
    background-color: aqua;
    height: 32px;
  }

  .spacer {
    height: 0;
    margin-top: auto;
  }

  .message-box {
    display: flex;
    flex: 1;
    min-width: 500px;
    height: 320px;
    text-align: left;
    background-color: var(--default-terminal-bg);
    padding: 1em;
    overflow-y: scroll;
    flex-direction: column;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .name {
    font-weight: bold;
  }

  .text-box {
    background-color: var(--default-terminal-bg);
    color: var(--default-fg-normal);
    flex: 1;
    border-radius: 0px;
    border: 0px;
    outline: none;
  }

  .text-container {
    display: flex;
    align-items: center;
  }

  .message-box::-webkit-scrollbar {
    display: none;
  }

  .server-message {
    font-weight: bold;
    color: var(--default-fg-system);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
