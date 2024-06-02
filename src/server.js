const http = require('http');
const express = require('express');
const Server = require('socket.io');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const port = 8000;
const server = http.createServer(app);
const io = Server(server);

io.on('connection', (socket) => {
    console.log('new user connected');
});

server.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});