const http = require('http');
const express = require('express');
const Server = require('socket.io');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const port = 8000;
const server = http.createServer(app);
const io = Server(server);

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('setUsername', (username) => {
        socket.username = username;
    });
    
    // socket.on('joinQueue', () => {});
    // socket.on('leaveQueue', () => {});

    // socket.on('createRoom', () => {});
    // socket.on('joinRoom', (roomId) => {});
    
    // socket.on('leaveRoom', () => {});
    
    // socket.on('disconnect', () => {});
});

server.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});