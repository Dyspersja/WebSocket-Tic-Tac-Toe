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
let rooms = new Map();

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
        
        if (queue.length >= 2) {
            let roomId = createRoom();
            const room = rooms.get(roomId);

            let player1 = queue.shift();
            let player2 = queue.shift();

            player1.join(roomId);
            player2.join(roomId);

            player1.roomId = roomId;
            player2.roomId = roomId;

            room.player1.socket = player1;
            room.player2.socket = player2;

            // TODO: send start game
        }
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
    
    socket.on('createRoom', () => {
        let roomId = createRoom();
        const room = rooms.get(roomId);

        socket.join(roomId);
        socket.roomId = roomId;
        room.player1.socket = socket;

        socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId) => {
        let room = rooms.get(roomId);
        if (!room) {
            socket.emit('error', 'Room does not exist.');
            return;
        }

        if (room.player2.socket) {
            socket.emit('error', 'Room is already full.');
            return;
        }

        socket.join(roomId);
        socket.roomId = roomId;
        room.player2.socket = socket;

        // TODO: send start game
    });
    
    // socket.on('leaveRoom', () => {});
    
    // socket.on('disconnect', () => {});
});

function generateId() {
    return Math.random().toString(16).substring(2, 8);
}

function createRoom() {
    const roomId = generateId();

    const room = {
        player1: { socket: null, side: 'X' },
        player2: { socket: null, side: 'O' },
        board: Array(9).fill(''),
        currentPlayer: 'X',
        score: {
            player1: 0,
            player2: 0,
            draws: 0
        }
    };

    rooms.set(roomId, room);
    return roomId;
}

server.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});