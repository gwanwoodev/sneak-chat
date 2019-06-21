window.onload = () => {
    if(window.Notification)
        Notification.requestPermission();
};

const socket = io();

socket.on('chatter', (message) => {
    $('#chat-messages').append($('<li>').text(message));
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
    
    let notification = new Notification('SneakChat', {
        icon: 'icons/push.png',
        body: message
    });
    
    setTimeout(()=> {
       notification.close(); 
    }, 2000);
});

socket.on('broadcast', (message, connectList) => {
    $('#chat-messages').append($('<li>').text(message));
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
	console.log(connectList);
});

socket.on('disconnect', (message, connectList) => {
    $('#chat-messages').append($('<li>').text(message));
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
	console.log(connectList);
});

$('form').submit(function() {
    const message = $("#message").val();
	$("#message").val("");
    const dateString = getHoursAndMinutes();
    socket.emit('chatter', `[${dateString}] : ${user.nickname} : ${message}`);
    return false;
});