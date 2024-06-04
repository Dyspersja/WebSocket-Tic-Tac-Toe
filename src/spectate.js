const { getRoom, getRoomResponse, getAllRooms } = require('./rooms');

function spectate(socket) {
    let spectateRooms = getAllRooms();
    socket.emit('availableRooms', spectateRooms);
}

function spectateRoom(socket, roomId) {
    roomId = roomId.toString();
    if (!roomId) return;
    let room = getRoom(roomId);
    if (!room) {
        socket.emit('error', 'Room does not exist.');
        return;
    }

    socket.join(roomId);
    socket.roomId = roomId;
    room.spectators.push(socket);
    socket.emit('startGame', getRoomResponse(room));
}

module.exports = { spectate, spectateRoom };