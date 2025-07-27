
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChat', (username) => {
        socket.username = username;
        socket.broadcast.emit('userJoined', username);
    });

    socket.on('sendMessage', (msg) => {
        io.emit('message', {
            user: socket.username || 'Anonymous',
            text: msg.text,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('userLeft', socket.username);
        }
    });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
