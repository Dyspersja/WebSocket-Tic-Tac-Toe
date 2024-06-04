const http = require('http');
const express = require('express');
const { initializeSocket } = require('./socketInitializer');
const { setupSocketHandlers } = require('./socketHandler');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const port = 8000;
const server = http.createServer(app);
const io = initializeSocket(server);

setupSocketHandlers(io);

server.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});