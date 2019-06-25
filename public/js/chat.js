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
	
	$(".online_box").html(getUsers(connectList));
});

socket.on('disconnect', (message, connectList) => {
    $('#chat-messages').append($('<li>').text(message));
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
	
	$(".online_box").html(getUsers(connectList));
});

$('form').submit(function() {
    const message = $("#message").val();
	$("#message").val("");
    const dateString = getHoursAndMinutes();
    socket.emit('chatter', `[${dateString}] ${user.nickname} : ${message}`);
    return false;
});

function getUsers(connectList) {
	let templateheader = `<h2 class="title">Online Users ${connectList.userCount}</h2>
		<hr>`;
	let templates = '';
	let connect;
	
	for(let i=0; i<connectList.onlineList.length; i++) {
		connect = JSON.parse(connectList.onlineList[i]);
		let template = '';
		template = `
		<div class="box" socID= "${connect.socID}">
			<article class="media mediabox">
				<div class="media-left">
					<i class="fas fa-circle online-box"></i>
				</div>
				<div class="media-content">
					<div class="content">
						<strong>${connect.nickname}</strong>
					</div>
				</div>
			</article>
		</div>`;
		templates+= template;
	}
				
	return templateheader + templates;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
}
