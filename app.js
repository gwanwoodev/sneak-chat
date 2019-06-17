const express = require('express');
const path = require('path');
const app = express();

const APP_PORT = 5733

const server = app.listen(APP_PORT, () => {
   console.log(`App running on port ${APP_PORT}`);
});

const io = require('socket.io').listen(server);

//This is config for render view in 'views' folder
//and use pug as template engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.render('index');
});

app.get('/chat', (req, res) => {
   res.render('chat');
});




io.on('connection', (socket) => {
    socket.broadcast.emit('a user connected');
    socket.on('chatter', (message) => {
        console.log(message);
        io.emit('chatter', message);
  });
});