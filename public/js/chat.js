window.onload = () => {
    if(window.Notification)
        Notification.requestPermission();
};

const socket = io();

socket.on('chatter', function(message) {
    $('#chat-messages').append($('<li>').text(message));
    $("#message").val("");
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
    
    let notification = new Notification('SneakChat', {
        icon: 'https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-1-512.png',
        body: message
    });
    
    setTimeout(()=> {
       notification.close(); 
    }, 2000);
});

$('form').submit(function() {
    const name = $("#name").val();
    const message = $("#message").val();
    const dateString = getHoursAndMinutes();
    socket.emit('chatter', `[${dateString}] : ${name} : ${message}`);
    return false;
});


