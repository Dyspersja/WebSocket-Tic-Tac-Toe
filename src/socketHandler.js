const { joinQueue, leaveQueue } = require('./queue');
const { createRoom, joinRoom, leaveRoom } = require('./rooms');

function setupSocketHandlers(io) {
    io.on('connection', handleSocketConnection);
}

function handleSocketConnection(socket) {
    console.log('new user connected');    
    
    socket.on('setUsername', (username) => socket.username = username );

    socket.on('joinQueue', () => joinQueue(socket));
    socket.on('leaveQueue', () => leaveQueue(socket));

    socket.on('createRoom', () => createRoom(socket));
    socket.on('joinRoom', (roomId) => joinRoom(socket, roomId));
    socket.on('leaveRoom', () => leaveRoom(socket));
}

module.exports = { setupSocketHandlers };