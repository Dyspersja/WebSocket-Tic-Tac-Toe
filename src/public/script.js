$(document).ready(function() {
    let socket = io();

    // Error alert
    socket.on('error', function(data) {
        alert(data);
    });

    // Selecting username
    $('#loginForm').submit(function(event) {
        event.preventDefault();
        
        let username = $('#username').val().trim();
        if (username === "") {
            alert('Username cannot be empty!');
            return;
        }
        
        socket.emit('setUsername', username);
        $('#loginModal').hide();
        $('#mainMenu').show();
    });

    // Starting vs AI games
    $('#playVsAIButton').click(function() {
        $('#aiMenuModal').show();
    });

    // Starting vs Player game
    $('#playVsPlayerButton').click(function() {
        $('#mainMenu').hide();
        $('#playVsPlayerMenu').show();
    });

    $('#backButton').click(function() {
        $('#playVsPlayerMenu').hide();
        $('#mainMenu').show();
    });

    // Queue
    $('#joinQueueButton').click(function() {
        socket.emit('joinQueue');
    });

    $('#queueLeaveButton').click(function() {
        socket.emit('leaveQueue');
    });

    socket.on('joinedQueue', function() {
        $('#queueModal').show();
    });
    
    socket.on('leftQueue', function() {
        $('#queueModal').hide();
    });

    // Create / Join room
    $('#createRoomButton').click(function() {
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
        $('#createRoomModal').show();
    });    

    // Game room state 
    socket.on('startGame', function(data) {
        $('.menu').hide();
        $('.modal').hide();

        $('#gameArea').show();
        updateGameInfo(data);
        updateBoard(data.board);
    });

    // Closing modal windows
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

    // Game board
    $('.cell').click(function() {
        let cell = $(this).data('cell');
        socket.emit('move', cell);
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