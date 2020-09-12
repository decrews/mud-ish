const Events = require('./Events'); // the available socketio events.  should match server Events

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// holds the currently connected users (socket connections)
let users = [];

// SOCKETIO AND USERS
io.on(Events.Connection, newConnection);

/**
 *  runs when a new client connects
 */
function newConnection(socket) {
  sendServerMessage(socket, 'Welcome to DS+DS+POKEMON!');

  socket.on(Events.InitializeUser, (payload) => initializeUser(socket, payload));
  socket.on(Events.Disconnect, (payload) => userDisconnected(socket));
  socket.on(Events.UserMessage, (payload) => sendUserMessage(socket, payload));
}

/**
 *  handles what happens when a new user connects
 */
function initializeUser(socket, payload) {
  socket.username = payload.name;
  users.push(socket);

  const userPayloads = users.map((user) => ({ username: user.username, id: user.id, time: Date.now() }));
  io.emit(Events.UserList, userPayloads);

  sendServerMessage(socket, `${payload.name} has joined the chat`, true);
}

/**
 *  handles updating the username for a connected user
 */
function updateUsername(id) {
  // TODO
}

/**
 *  removes the user from the connected users list and updates all
 *  connected clients
 */
function userDisconnected(socket) {
  // remove user from the currently connected users
  users = users.filter((user) => user.id !== socket.id);
  // update all the clients
  sendUserList();
  sendServerMessage(null, `${socket.username} has disconnected!`);
}

/**
 *  sends an update user list to every client
 */
function sendUserList() {
  const userPayloads = users.map((user) => ({ username: user.username, id: user.id, time: Date.now() }));
  io.emit(Events.UserList, userPayloads);
}

/**
 *  handles an incoming message from a user
 */
function sendUserMessage(socket, payload) {
  // rather than sending the message it comes in an object payload.
  // this way other data can be sent along with it.  we only need the message
  // itself here, so we destructure it
  const { message } = payload;

  // create the payload we want to send to every user
  const msgPayload = { id: socket.id, text: message, time: Date.now() };

  // send it to every user including the client who sent it
  // (so they can see their own) messages.
  io.emit(Events.UserMessage, msgPayload);
}

/**
 * sends a "server" message which has an id of `server`.
 * @param {socket} socket - the socket to send the message to
 * @param {string} message - the message you want to send
 * @param {bool} broadcast - if you want to broadcast from the socket
 */
function sendServerMessage(socket, message, broadcast = false) {
  if (!socket) {
    io.emit(Events.ServerMessage, { id: 'server', text: message, time: Date.now() });
  } else if (broadcast) {
    socket.broadcast.emit(Events.ServerMessage, { id: 'server', text: message, time: Date.now() });
  } else {
    socket.emit(Events.ServerMessage, { id: 'server', text: message, time: Date.now() });
  }
}

// SERVER SETUP
// set static folder
app.use(express.static(path.join(__dirname, '../client/public')));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
