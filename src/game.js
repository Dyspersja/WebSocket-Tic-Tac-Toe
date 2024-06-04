const { checkBoardState } = require('./board');
const { getRoomResponse, getRoom } = require('./rooms');
const { emitGameUpdate } = require('./socketBroadcaster');
const { makeAIMove } = require('./ai');

function move(socket, cell) {
    let roomId = socket.roomId;
    if (!roomId) return;
    let room = getRoom(roomId);
    if (!room) return;

    let currentPlayerSocket = room.player1.side === room.currentPlayer 
        ? room.player1.socket
        : room.player2.socket;

    if (currentPlayerSocket !== socket) return;
    if (room.board[cell] !== '') return;

    makeMove(roomId, room, cell);
    if (room.mode === 'vsAI') {
        let aiCell = makeAIMove(room, room.player2.socket.difficulty);
        setTimeout(() => {
            makeMove(roomId, room, aiCell);
        }, 500);
    }
}

function makeMove(roomId, room, cell) {
    room.board[cell] = room.currentPlayer;
    room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';

    checkBoardState(roomId, room);
    emitGameUpdate(roomId, getRoomResponse(room));
}

module.exports = { move };