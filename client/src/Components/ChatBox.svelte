<script>
    export let messages;
    export let sendMessage;
    export let message;
    let input;
    let button;

    function onMessage(e) {
        e.preventDefault();
        sendMessage(message);
        message = '';
    }
</script>

<main>
    <div class="message-box">
        {#each messages as message (message.id + message.time + message.text)}
            {#if message.user}
                <p>{message.user.username} - {message.text}</p>
            {/if}
            {#if message.id === 'server'} 
                <p class='server-message'>{message.text}</p>
            {/if}
        {/each}
    </div>
    <form on:submit={(e) => onMessage(e)}>
        <input type="text" bind:this={input} bind:value={message}>
    </form>
</main>

<style>
	main {
        padding: 1em;
        text-align: left;
    }

    p {
        margin-top: 0;
        margin-bottom: 0;
        width: 100%;
        background-color: aqua;
    }
    
    .message-box {
        display: flex;
        min-width: 500px;
        height: 300px;
        text-align: left;
        background-color: var(--default-terminal-bg);
        padding: 1em;
        overflow: scroll;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        flex-direction: column;
        justify-content: flex-end;
    }

    .message-box::-webkit-scrollbar {
        display: none;
    }

    .server-message {
        font-weight: bold;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>