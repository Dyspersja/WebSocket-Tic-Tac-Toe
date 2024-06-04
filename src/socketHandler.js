function setupSocketHandlers(io) {
    io.on('connection', handleSocketConnection);
}

function handleSocketConnection(socket) {
    console.log('new user connected');    
}

module.exports = { setupSocketHandlers };