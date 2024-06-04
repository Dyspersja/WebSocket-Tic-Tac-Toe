$(document).ready(function() {
    let socket = io();

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