const socket = io();

socket.on('chatter', function(message) {
    $('#chat-messages').append($('<li>').text(message));
    $("#message").val("");
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
});

$('form').submit(function() {
    const name = $("#name").val();
    const message = $("#message").val();
    const dateString = getHoursAndMinutes();
    socket.emit('chatter', `[${dateString}] : ${name} : ${message}`);
    return false;
});