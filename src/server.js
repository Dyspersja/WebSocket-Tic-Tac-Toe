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

            io.to(roomId).emit('startGame', getRoomResponse(room));
        }
    });

    socket.on('leaveQueue', () => {
        if (leaveQueue(socket)) {
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

        io.to(roomId).emit('startGame', getRoomResponse(room));
    });

    socket.on('leaveRoom', () => {
        if (leaveRoom(socket)) {
            socket.emit('roomLeft', 'You left the room.');
        } else {
            socket.emit('error', 'You are not in any room.');
        }
    });

    socket.on('move', (data) => {
        let roomId = socket.roomId;
        if (!roomId) {
            socket.emit('error', 'You are not in any room.');
            return;
        }

        let room = rooms.get(roomId);
        if (!room) {
            socket.emit('error', 'This room does not exist.');
            return;
        }

        if (room.player1.socket !== socket && room.player2.socket !== socket) {
            socket.emit('error', 'You are not a player in this room.');
            return;
        }

        if (room.currentPlayer !== data.side) {
            socket.emit('error', 'It is not your turn.');
            return;
        }

        if (room.board[data.cell] !== '') {
            socket.emit('error', 'Cell is already occupied.');
            return;
        }

        room.board[data.cell] = data.side;
        io.to(roomId).emit('updateGame', getRoomResponse(room));

        let winner = checkWinner(room.board);
        if (winner) {
            if (room.player1.side === winner) {
                room.score.player1++;
            } else {
                room.score.player2++;
            }
            io.to(roomId).emit('gameOver', winner);
        } else if (checkDraw(room.board)) {
            room.score.draws++;
            io.to(roomId).emit('gameOver', 'draw');
        } else {
            room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
        }
    });
    
    socket.on('disconnect', () => {
        leaveQueue(socket);
        leaveRoom(socket);
    });
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

function leaveQueue(socket) {
    let index = queue.indexOf(socket);
    if (index !== -1) {
        queue.splice(index, 1);
        return true;
    }
    return false;
}

function leaveRoom(socket) {
    let roomId = socket.roomId;
    if (!roomId) {
        return false;
    }

    let room = rooms.get(roomId);
    if (!room) {
        return false;
    }

    let opponent = room.player1.socket === socket 
        ? room.player2.socket 
        : room.player1.socket;

    if (opponent) {
        opponent.leave(roomId);
        opponent.emit('opponentLeft', 'Your opponent has left the game.');
        opponent.roomId = null;
    }
    rooms.delete(roomId);
    socket.roomId = null;

    return true;
}

function getRoomResponse(room) {
    return {
        player1: {
            username: room.player1.socket.username,
            side: room.player1.side
        },
        player2: {
            username: room.player2.socket.username,
            side: room.player2.side
        },
        board: room.board,
        currentPlayer: room.currentPlayer,
        score: room.score
    };
}

function checkWinner(board) {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }

    return null;
}

function checkDraw(board) {
    return board.every(cell => cell !== '');
}

server.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});