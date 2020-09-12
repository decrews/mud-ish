const Events = require('./Events');

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let users = [];

// SOCKETIO AND USERS
// run when a client connects
io.on(Events.Connection, newConnection);

function newConnection(socket) {
  sendServerMessage(socket, 'Welcome to DS+DS+POKEMON!');

  socket.on(Events.InitializeUser, (payload) => initializeUser(socket, payload));
  socket.on(Events.Disconnect, (payload) => userDisconnected(socket));
  socket.on(Events.UserMessage, (payload) => sendUserMessage(socket, payload));
}

function initializeUser(socket, payload) {
  socket.username = payload.name;
  users.push(socket);

  const userPayloads = users.map((user) => ({ username: user.username, id: user.id, time: Date.now() }));
  io.emit(Events.UserList, userPayloads);

  sendServerMessage(socket, `${payload.name} has joined the chat`, true);
}

function updateUsername(id) {
  // TODO
}

function userDisconnected(socket) {
  // remove user from the currently connected users
  users = users.filter((user) => user.id !== socket.id);
  sendUserList();
  sendServerMessage(null, `${socket.username} has disconnected!`);
}

function sendUserList() {
  const userPayloads = users.map((user) => ({ username: user.username, id: user.id, time: Date.now() }));
  io.emit(Events.UserList, userPayloads);
}

function removeUser(id) {
  // TODO
}

function sendUserMessage(socket, payload) {
  const { message } = payload;

  const msgPayload = { id: socket.id, text: message, time: Date.now() };
  io.emit(Events.UserMessage, msgPayload);
}

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
