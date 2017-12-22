const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');

const app = express();

app.get('/', (req, res) => res.send("Hello World"));

const server = http.Server(app);
server.listen(3000);

const io = socketIo(server);
let clients;
console.log('server running ... ');

io.on('connection', (socket) => {

	clients = io.sockets.clients();

	let connectionCount = 0;
	for(let o in clients.connected){
		connectionCount++;
	}
	
	io.emit('connection count', connectionCount);

	socket.on('to server', function(data) {
		socket.broadcast.emit('from server', data);
	});

	socket.emit('db', data);

});

let connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Mnbvcxz111&&&999',
	database: 'mudserver'
});
let data;

connection.query('SELECT * from user', function(err, rows){
	if(err){
		console.log(err);
	}else{
		console.log('database connected');
		data = rows;
	}
});
connection.end();