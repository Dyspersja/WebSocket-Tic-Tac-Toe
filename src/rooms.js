const { emitGameStart, emitGameClose } = require('./socketBroadcaster');

let rooms = new Map();

function generateRoomId() {
    return Math.random().toString(16).substring(2, 8);
}

function initializeRoom() {
    const roomId = generateRoomId();

    const room = {
        mode: 'vsPlayer',
        player1: { socket: null, side: 'X' },
        player2: { socket: null, side: 'O' },
        board: Array(9).fill(''),
        currentPlayer: 'X',
        score: {
            player1: 0,
            player2: 0,
            draws: 0
        },
        spectators: []
    };

    rooms.set(roomId, room);
    return roomId;
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

function createRoom(socket) {
    const roomId = initializeRoom();
    joinRoom(socket, roomId);

    socket.emit('roomCreated', roomId);
}

function joinRoom(socket, roomId) {
    const room = rooms.get(roomId);
    if (!room) {
        socket.emit('error', 'Room does not exist.');
        return;
    }

    if (!room.player1.socket) {
        socket.join(roomId);
        socket.roomId = roomId;
        room.player1.socket = socket;
    } else if (!room.player2.socket) {
        if(room.mode !== 'vsAI') {
            socket.join(roomId);
            socket.roomId = roomId;
        }
        room.player2.socket = socket;

        emitGameStart(roomId, getRoomResponse(room));
    } else socket.emit('error', 'Room is already full.');
}

function leaveRoom(socket) {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    // If socket belongs to a spectator or one of the players
    if (socket !== room.player1.socket && 
        socket !== room.player2.socket) {
        
        socket.leave(roomId);
        socket.roomId = null;

        const spectatorIndex = room.spectators.findIndex(socket);
        if (spectatorIndex !== -1) {
            room.spectators.splice(spectatorIndex, 1);
        }
        socket.emit('gameClosed');
    } else {
        // Tear down the whole room if one of the players left
        emitGameClose(roomId);
        rooms.delete(roomId);

        room.player1.socket.roomId = null;
        room.player1.socket.leave(roomId);

        room.spectators.forEach(socket => socket.roomId = null);
        room.spectators.forEach(socket => socket.leave(roomId));

        if (room.player2.socket && room.mode !== 'vsAI') {
            room.player2.socket.leave(roomId);
            room.player2.socket.roomId = null;    
        }
    }
}

function getRoom(roomId) {
    return rooms.get(roomId);
}

module.exports = { initializeRoom, createRoom, joinRoom, leaveRoom, getRoomResponse, getRoom };