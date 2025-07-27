
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    let username = '';

    socket.on('joinChat', (name) => {
        username = name || 'Guest';
        socket.broadcast.emit('userJoined', username);
    });

    socket.on('sendMessage', (msg) => {
        io.emit('message', { ...msg, user: username });
    });

    socket.on('disconnect', () => {
        if (username) io.emit('userLeft', username);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
