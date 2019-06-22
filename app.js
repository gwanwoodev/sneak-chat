const express = require('express');
const path = require('path');
const app = express();
const sqlite = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const sharedSession = require('express-socket.io-session');

const APP_PORT = 5733;
const db = new sqlite.Database('db/database.db');

const server = app.listen(APP_PORT, () => {
   console.log(`App running on port ${APP_PORT}`);
});

const io = require('socket.io').listen(server);

//This is config for render view in 'views' folder
//and use pug as template engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('public'));

//setting middleware cookie & session
app.use(cookieParser());

//settings session environment
const session = expressSession({
    secret: 'a;lkjffdsa;afdsk',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24hours.
    }
});

app.use(session);

/* socket shared express-session settings */
io.use(sharedSession(session, {
	autoSave: true
}));

app.get('/', (req, res) => {
    if(req.session.user) res.render('chat', {sessionData: req.session.user});
    else res.render('index');
});

app.get('/chat', (req, res) => {
   if(req.session.user) res.render('chat', {sessionData: req.session.user});
   else res.redirect('/');
});

app.get('/register', (req, res) => {
   res.render('register');
});


/* login */
app.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;    
    let resultJson;
    const HTTP_STATUS_OK = 200;
    const HTTP_STATUS_NO_CONTENT = 204;
    
    /* login check */
    if(req.session.user) {
        res.redirect('/chat');
    }else {
        
        db.get(`SELECT idx, id, nickname FROM user WHERE id="${username}" AND pw="${password}"`, (err, row) => {
            if(row) {
                resultJson = JSON.stringify({status: HTTP_STATUS_OK, msg: 'success', data: row});
                                
                req.session.user = {
                    idx: row.idx,
                    id: row.id,
                    nickname: row.nickname
                };
                
            }else {
                resultJson = JSON.stringify({status: HTTP_STATUS_NO_CONTENT, msg: 'nocontent', data: ''});
            }
	        res.json(resultJson);
        });
    }
});

/* join */
app.post('/join', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let usernick = req.body.usernick;
    
    let resultJson;
    const HTTP_STATUS_OK = 200;
    const HTTP_STATUS_NO_CONTENT = 204;
    const HTTP_STATUS_BAD_REQUEST = 400;
    
    /* Check User */
    
    db.get(`SELECT id FROM user WHERE id="${username}"`, (err, row) => {
        if(row) {
           resultJson = JSON.stringify({status: HTTP_STATUS_BAD_REQUEST, msg: 'failed', data: ''});
           res.json(resultJson);
       }else {
           db.run(`INSERT INTO USER(id, pw, nickname) VALUES(?, ?, ?)`, [`${username}`, `${password}`, `${usernick}`]);
           resultJson = JSON.stringify({status: HTTP_STATUS_OK, msg: 'success', data: ''});
           
           res.json(resultJson);
       }
    });
});


let connectList = {"userCount": 0, "onlineList": []}; // connectUserInformationList
io.on('connection', (socket) => {	
	const connectUser = socket.handshake.session.user;
	
	if(connectUser !== undefined) {
		connectList.onlineList.push(getConnectUserList(socket));
		connectList.userCount = getConnectUserCount();
		
		socket.broadcast.emit('broadcast', `[Admin] a "${connectUser.nickname}" connected.`, connectList);
		socket.emit('broadcast', `[Admin] a "${connectUser.nickname}" connected.`, connectList);
		
	}
	
    
    socket.on('chatter', (message) => {
        console.log(message);
        io.emit('chatter', message);
    });
    
    socket.on('disconnect', () => {
		if(!connectUser) return;
		connectList.onlineList.splice(connectList.onlineList.indexOf(connectUser), 1);
		connectList.userCount = getConnectUserCount();
        io.emit('disconnect', `[Admin] a "${connectUser.nickname} disconnected.`, connectList);
		
		
    });
	
	
});

/* io Functions */

//Get Online Users Count.
function getConnectUserCount() {
	return io.engine.clientsCount;
}

//Get Connect Users List JSON.
function getConnectUserList(socket) {
	let csSessionData = socket.handshake.session.user;
	let userIDX = csSessionData.idx;
	let userNick = csSessionData.nickname;
	let socID = socket.id;
	let connectTotalUsers = getConnectUserCount();
	let json = `{"idx": ${userIDX}, "nickname": "${userNick}", "socID": "${socID}"}`;
	
	return json;
}