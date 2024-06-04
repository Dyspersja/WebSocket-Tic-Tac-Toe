const { initializeRoom, joinRoom } = require('./rooms');

let queue = [];

function joinQueue(socket) {
    if (!queue.includes(socket)) {
        queue.push(socket);

        socket.emit('joinedQueue');
        isQueueReady();
    }
}

function leaveQueue(socket) {
    let index = queue.indexOf(socket);
    if (index !== -1) {
        queue.splice(index, 1);
    }
    socket.emit('leftQueue');
}

function isQueueReady() {
    if (queue.length >= 2) {
        let player1 = queue.shift();
        let player2 = queue.shift();

        const roomId = initializeRoom();
        joinRoom(player1, roomId);
        joinRoom(player2, roomId);
    }
}

module.exports = { joinQueue, leaveQueue };