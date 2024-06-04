const { getIO } = require('./socketInitializer');

function emitGameStart(roomId, room) {
    getIO().to(roomId).emit('startGame', room);
}

function emitGameClose(roomId) {
    getIO().to(roomId).emit('gameClosed');
}

function emitGameUpdate(roomId, room) {
    getIO().to(roomId).emit('gameUpdate', room);
}

function emitGameOver(roomId, winner) {
    getIO().to(roomId).emit('gameOver', winner);
}

module.exports = { emitGameStart, emitGameClose, emitGameUpdate, emitGameOver };