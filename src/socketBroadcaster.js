const { getIO } = require('./socketInitializer');

function emitGameStart(roomId, room) {
    getIO().to(roomId).emit('startGame', room);
}

function emitGameClose(roomId) {
    getIO().to(roomId).emit('gameClosed');
}

module.exports = { emitGameStart, emitGameClose };