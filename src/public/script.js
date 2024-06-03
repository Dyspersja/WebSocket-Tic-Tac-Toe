$(document).ready(function() {
    let socket = io();
    let username;

    let closedGame = false;
    let isSpectating = false;

    $('#loginForm').submit(function(event) {
        event.preventDefault();
        
        username = $('#username').val().trim();
        if (username === "") {
            alert('Username cannot be empty!');
            return;
        }
        
        socket.emit('setUsername', username);
        $('#loginModal').hide();
        $('#menu').show();
    });

    $('#spectateButton').click(function() {
        socket.emit('spectate');
    });

    socket.on('availableRooms', function(data) {
        var roomList = $('#spectateRooms');
        roomList.empty();

        data.forEach(function(room) {
            var text = room.players.join(' vs ');
            var roomItem = $('<div></div>')
                .text(text)
                .addClass('roomItem')
                .attr('data-room-id', room.roomId);
            
            roomList.append(roomItem);
        });

        $('#spectateModal').show();
        
        $('.roomItem').click(function() {
            var roomId = $(this).data('room-id');
            socket.emit('spectateRoom', roomId);
        });
    });

    socket.on('startSpectating', function(data) {
        isSpectating = true;

        $('#menu').hide();
        $('.modal').hide();

        $('#gameArea').show();
        updateGameInfo(data);
        updateBoard(data.board);
    });

    $('#playVsAIButton').click(function() {
        $('#aiMenuModal').show();
    });

    $('#easyDifficulty').click(function() {
        socket.emit('playVsAI', 'easy');        
    });

    $('#mediumDifficulty').click(function() {
        socket.emit('playVsAI', 'medium');        
    });

    $('#hardDifficulty').click(function() {
        socket.emit('playVsAI', 'hard');        
    });

    $('#imposibleDifficulty').click(function() {
        socket.emit('playVsAI', 'imposible');        
    });

    $('#playVsPlayerButton').click(function() {
        $('#menu').hide();
        $('#playVsPlayerMenu').show();
    });

    $('#backButton').click(function() {
        $('#playVsPlayerMenu').hide();
        $('#menu').show();
    });

    $('#joinQueueButton').click(function() {
        $('#queueModal').show();
        socket.emit('joinQueue');
    });

    $('#queueLeaveButton').click(function() {
        $('#queueModal').hide();
        socket.emit('leaveQueue');
    });

    $('#createRoomButton').click(function() {
        $('#createRoomModal').show();
        socket.emit('createRoom');
    });

    $('#createRoomCancelButton').click(function() {
        $('#createRoomModal').hide();
        socket.emit('leaveRoom');
    });

    $('#joinRoomButton').click(function() {
        $('#joinRoomModal').show();
    });

    $('#connectToRoomButton').click(function() {
        roomId = $('#roomIdInput').val();
        if (roomId) {
            socket.emit('joinRoom', roomId);
        }
    });

    socket.on('roomCreated', function(roomId) {
        $('#createRoomRoomId').text(roomId);
    });

    socket.on('startGame', function(data) {
        $('#menu').hide();
        $('#playVsPlayerMenu').hide();
        $('.modal').hide();

        $('#gameArea').show();
        updateGameInfo(data);
        updateBoard(data.board);
    });

    socket.on('updateGame', function(data) {
        updateGameInfo(data);
        updateBoard(data.board);
    });

    socket.on('gameOver', function(winner) {
        let message = winner === 'draw' ? 'Game is a draw!' : `Player ${winner} wins!`;
        $('#gameWinner').text(message);
        $('#afterGameModal').show();
    });

    socket.on('gameClosed', function() {
        if (!closedGame) {
            alert('Opponent left the game');
        } else {
            closedGame = false;
        }

        $('.modal').hide();
        $('#gameArea').hide();
        $('#menu').show();
    });

    $('#continueGameButton').click(function() {
        $('#afterGameModal').hide();
    });

    $('#leaveGameButton').click(function() {
        closedGame = true;

        if (!isSpectating) {
            socket.emit('leaveRoom');
        } else {
            socket.emit('stopSpectating');
        }
    });

    $('.cell').click(function() {
        let cell = $(this).data('cell');
        socket.emit('move', cell);
    });

    $(window).click(function(event) {
        var modal = $('#aiMenuModal');
        if(event.target === modal[0]) {
            modal.hide();
        }
        var modal = $('#joinRoomModal');
        if(event.target === modal[0]) {
            modal.hide();
        }
        var modal = $('#spectateModal');
        if(event.target === modal[0]) {
            modal.hide();
        }
    });

    function updateGameInfo(data) {
        $('.middle-element').text(`${data.score.player1}:${data.score.draws}:${data.score.player2}`);
    
        const isPlayer1Turn = data.currentPlayer === data.player1.side;
    
        $('.left-element').html(isPlayer1Turn ? `<b>${data.player1.username}</b>` : data.player1.username);
        $('.middle-left-element').html(isPlayer1Turn ? `<b>${data.player1.side}</b>` : data.player1.side);
        $('.middle-right-element').html(isPlayer1Turn ? data.player2.side : `<b>${data.player2.side}</b>`);
        $('.right-element').html(isPlayer1Turn ? data.player2.username : `<b>${data.player2.username}</b>`);
    }

    function updateBoard(board) {
        $('.cell').each(function(index) {
            $(this).text(board[index]);
        });
    }
});