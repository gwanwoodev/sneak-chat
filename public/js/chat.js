const socket = io();
const oldTitle = document.title;
const msg = "New Message!";
let timeoutID = false;
let dummyHTML = '';

const blink = () => {
    document.title = document.title === msg ? oldTitle : msg;
    
    if(document.hasFocus()) {
        document.title = oldTitle;
        clearInterval(timeoutID);
        timeoutID = false;
    }
};

// Loading Dummy HTML

$.ajax({
    url: '/dummy/dummy.txt',
    method: 'GET',
    success: function(data) {
        dummyHTML = data;
    }
});

$('body').keydown((evt) => {
   if(evt.keyCode === 36) {
       $('html').text("");
       $('html').html(dummyHTML);
   }
});

socket.on('chatter', (message) => {
    let decryptChat = decryptMessage(message);
    
    $('#chat-messages').append($('<li>').text(decryptChat));
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
    
    /* New Message Notification. */
    if(!timeoutID) timeoutID = setInterval(blink, 500);
    
    
});

//Get Messages History.
socket.on('message', (history) => {
	for(let i=0; i<history.length; i++) {
		let decryptChat = decryptMessage(history[i]);
		$('#chat-messages').append($('<li>').text(decryptChat));
	}
	
	$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
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

// Decrypt Messages.
function decryptMessage(message) {
	let bytes = CryptoJS.AES.decrypt(message, 'king');
    let decryptMessage = bytes.toString(CryptoJS.enc.Utf8);
	
	return decryptMessage;
}

//Get Users.
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
