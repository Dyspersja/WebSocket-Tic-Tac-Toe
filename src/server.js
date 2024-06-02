const http = require('http');
const express = require('express');
const Server = require('socket.io');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const port = 8000;
const server = http.createServer(app);
const io = Server(server);

let queue = [];

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('setUsername', (username) => {
        socket.username = username;
    });
    
    socket.on('joinQueue', () => {
        if (queue.includes(socket)) {
            socket.emit('error', 'You are already in the queue.');
            return;
        }

        queue.push(socket);
        socket.emit('queueStatus', 'You have joined the queue.');
    });

    socket.on('leaveQueue', () => {
        let index = queue.indexOf(socket);
        if (index !== -1) {
            queue.splice(index, 1);
            socket.emit('queueStatus', 'You have left the queue.');
        } else {
            socket.emit('error', 'You are not in the queue.');
        }
    });
    
    // socket.on('createRoom', () => {});
    // socket.on('joinRoom', (roomId) => {});
    
    // socket.on('leaveRoom', () => {});
    
    // socket.on('disconnect', () => {});
});

server.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});