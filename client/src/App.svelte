<script>
  import io from 'socket.io-client';
  import Events from './Events';
  import UserList from './Components/UserList.svelte';
  import ChatBox from './Components/ChatBox.svelte';
  import Login from './Components/Login.svelte';

  let socket;
  let messages = [];
  let userList = [];

  // $: connectionStatus = !!socket ? 'Connected!' : 'Not Connected!';
  // $: connectionStyle = `color: ${!!socket ? 'green' : 'red'}`;

  function connect(name) {
    console.warn('IN CONNECT WITH NAME' + name);
    socket = io();
    socket.emit(Events.InitializeUser, { name });

    socket.on(Events.ServerMessage, onServerMessage);
    socket.on(Events.UserMessage, onUserMessage);
    socket.on(Events.UserList, onUserList);
  }

  function onUserMessage(message) {
    console.warn('-- new user message --');
    console.log(message);
    if (message.id) {
      // get the name associated with the id of the user
      const user = userList.find((user) => user.id === message.id);
      // get fresh messages array
      const newMessages = Array.from(messages);
      // add the user to the message object
      message.user = user;
      // add new message to array;
      newMessages.push(message);
      // update messages object to refresh svelte component
      messages = newMessages;
    }
  }

  function onServerMessage(message) {
    console.warn('-- new server message --');
    console.log(message);

    // get fresh messages array
    const newMessages = Array.from(messages);
    // add new message to array;
    newMessages.push(message);
    // update messages object to refresh svelte component
    messages = newMessages;
  }

  function onUserList(newList) {
    console.warn('-- new userList --');
    console.log(newList);
    userList = newList;
  }

  function sendMessage(message) {
    const payload = { message };
    console.log('sending payload');
    console.log(payload);
    socket.emit(Events.UserMessage, payload);
  }
</script>

<main>
  {#if !socket}
    <Login {connect} />
  {:else}
    <div class="content">
      <UserList users={userList} />
      <ChatBox {messages} {sendMessage} />
    </div>
  {/if}
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

  .content {
    display: flex;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
