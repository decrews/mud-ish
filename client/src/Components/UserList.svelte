<script>
    export let users;
</script>

<main>
    {#each users as user (user.id)}
        <div>
            <p>{user.username}</p>
        </div>
    {/each}
</main>

<style>
</style>