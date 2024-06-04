const { initializeRoom, getRoom, joinRoom } = require('./rooms');
const { checkWinner, checkDraw } = require('./board');

function playVsAI(socket, difficulty) {
    const roomId = initializeRoom();
    const room = getRoom(roomId);

    room.mode = 'vsAI';
    joinRoom(socket, roomId);
    joinRoom({ 
        username: difficulty + ' AI', 
        difficulty: difficulty 
    }, roomId);
}

function makeAIMove(room, difficulty) {    
    let cell;

    switch(difficulty) {
        case 'easy':
            cell = getAIMove(room.board, 0.5);
            break;
        case 'medium':
            cell = getAIMove(room.board, 0.7);
            break;
        case 'hard':
            cell = getAIMove(room.board, 0.8);
            break;
        case 'impossible':
        default:
            cell = findBestMove(room.board);
            break;
    }

    return cell;
}

function getAIMove(board, percent) {
    if (Math.random() > percent) {
        return randomMove(board);
    } else {
        return findBestMove(board);
    }
}

function randomMove(board) {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableMoves.push(i);
        }
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function findBestMove(board, maxDepth) {
    let bestEvaluation = -Infinity;    
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let evaluation = minimax(board, 0, false, maxDepth);
            board[i] = '';
            if (evaluation > bestEvaluation) {
                bestEvaluation = evaluation;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing, maxDepth) {
    let winner = checkWinner(board);
    if (winner === 'O') return 1;
    if (winner === 'X') return -1;
    if (checkDraw(board) || depth === maxDepth) return 0;

    if (isMaximizing) {
        let maxEvaluation = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let evaluation = minimax(board, depth + 1, false, maxDepth);
                board[i] = '';
                maxEvaluation = Math.max(maxEvaluation, evaluation);
            }
        }
        return maxEvaluation;
    } else {
        let minEvaluation = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let evaluation = minimax(board, depth + 1, true, maxDepth);
                board[i] = '';
                minEvaluation = Math.min(minEvaluation, evaluation);
            }
        }
        return minEvaluation;
    }
}

module.exports = { makeAIMove, playVsAI };