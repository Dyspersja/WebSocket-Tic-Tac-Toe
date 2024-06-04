function setupSocketHandlers(io) {
    io.on('connection', handleSocketConnection);
}

function handleSocketConnection(socket) {
    console.log('new user connected');    
    
    socket.on('setUsername', (username) => socket.username = username );
}

module.exports = { setupSocketHandlers };