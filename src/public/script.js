$(document).ready(function() {
    let socket = io();
    let username;

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

    $('#playVsAIButton').click(function() {
        $('#aiMenuModal').show();
    });

    $('#playVsPlayerButton').click(function() {
        $('#menu').hide();
        $('#playVsPlayerMenu').show();
    });

    $('#backButton').click(function() {
        $('#playVsPlayerMenu').hide();
        $('#menu').show();
    });

    $('#createRoomButton').click(function() {
        $('#createRoomModal').show();
        socket.emit('createRoom');
    });

    $('#createRoomCancelButton').click(function() {
        $('#createRoomModal').hide();
        socket.emit('leaveRoom');
    });

    socket.on('roomCreated', function(roomId) {
        $('#createRoomRoomId').text(roomId);
    });

    $(window).click(function(event) {
        var modal = $('#aiMenuModal');
        if(event.target === modal[0]) {
            modal.hide();
        }
    });
});