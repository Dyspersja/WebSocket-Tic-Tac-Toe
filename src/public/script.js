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

    $(window).click(function(event) {
        var modal = $('#aiMenuModal');
        if(event.target === modal[0]) {
            modal.hide();
        }
    });
});