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
        $('#menu').show();
    });

    // Starting vs AI games
    $('#playVsAIButton').click(function() {
        $('#aiMenuModal').show();
    });

    // Starting vs Player game
    $('#playVsPlayerButton').click(function() {
        $('#menu').hide();
        $('#playVsPlayerMenu').show();
    });

    $('#backButton').click(function() {
        $('#playVsPlayerMenu').hide();
        $('#menu').show();
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
});