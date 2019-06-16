const socket = io();
$('form').submit(function() {
    const name = $("#name").val();
    const message = $("#message").val();
    const dateString = getHoursAndMinutes();
    socket.emit('chatter', `[${dateString}] : ${name} : ${message}`);
    return false;
});

socket.on('chatter', function(message) {
    $('#chat-messages').append($('<li>').text(message));
    $("#message").val("");
    $("#chat-messages").scrollTop($("#chat-messages").height());
});