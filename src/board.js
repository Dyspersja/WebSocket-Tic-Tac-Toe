const { emitGameOver } = require('./socketBroadcaster');

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

function checkBoardState(roomId, room) {
    let winner = checkWinner(room.board);
    if (winner) {
        if (room.player1.side === winner) {
            room.score.player1++;
        } else {
            room.score.player2++;
        }
        room.board = Array(9).fill('');
        emitGameOver(roomId, winner);
    } else if (checkDraw(room.board)) {
        room.score.draws++;
        room.board = Array(9).fill('');
        emitGameOver(roomId, 'draw');
    }
}

module.exports = { checkWinner, checkDraw, checkBoardState };