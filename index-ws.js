const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});   

server.on('request', app);
server.listen(3000, () => console.log('Server started at 3000!'));

/** Begin websockets */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
    console.log('Client connected. Total clients: ', numClients);

    wss.broadcast(`Current clients: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send("Welcome to Gav's server");
    }

    ws.on('close', function close() {
        wss.broadcast(`Current clients: ${numClients}`);
        console.log('Client disconnected.');
    });

});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
}