const { joinQueue, leaveQueue } = require('./queue');

function setupSocketHandlers(io) {
    io.on('connection', handleSocketConnection);
}

function handleSocketConnection(socket) {
    console.log('new user connected');    
    
    socket.on('setUsername', (username) => socket.username = username );

    socket.on('joinQueue', () => joinQueue(socket));
    socket.on('leaveQueue', () => leaveQueue(socket));
}

module.exports = { setupSocketHandlers };