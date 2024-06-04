const Server = require('socket.io');

let io;

function initializeSocket(server) { 
    return io = Server(server);   
}

function getIO() {
    return io;
}

module.exports = { initializeSocket, getIO };