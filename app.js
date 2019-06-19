const express = require('express');
const path = require('path');
const app = express();
const sqlite = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const APP_PORT = 80;
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

app.get('/', (req, res) => {
   res.render('index');
});

app.get('/chat', (req, res) => {
   res.render('chat');
});

app.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	
	db.each(`SELECT *FROM user WHERE id="${username}" AND pw="${password}"`, function(err, row) {
      console.log(row);
  	});
	
	const resultJson = JSON.stringify({ok: 200, text: 'success fetch test'});
	res.json(resultJson);
});


io.on('connection', (socket) => {
    socket.broadcast.emit('a user connected');
    socket.on('chatter', (message) => {
        console.log(message);
        io.emit('chatter', message);
  });
});