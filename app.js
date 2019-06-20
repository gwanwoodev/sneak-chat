const express = require('express');
const path = require('path');
const app = express();
const sqlite = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

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
app.use(expressSession({
    secret: 'a;lkjffdsa;afdsk',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24hours.
    }
}));

app.get('/', (req, res) => {
    if(req.session.user) res.render('chat');
    else res.render('index');
});

app.get('/chat', (req, res) => {
   if(req.session.user) res.render('chat');
   else res.redirect('/');
});

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


io.on('connection', (socket) => {
    socket.broadcast.emit('a user connected');
    socket.on('chatter', (message) => {
        console.log(message);
        io.emit('chatter', message);
  });
});