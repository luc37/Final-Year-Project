const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.Server(app);

server.listen(3000);

const io = socketIo(server);
let clients;

const manageSignIn = require('./sign-in/check-sign-in');

console.log('server running ... ');

io.on('connection', (socket) => {

	manageSignIn.check(socket);

	socket.on('resetPlayScreenPage', function(data){
		setUpPlayScreen(socket);
	});
});

const database = require('./database/connect-database');
let data;

database.connection.query('SELECT * from user', function(err, rows){
	if(err){
		console.log(err);
	}else{
		console.log('database connected');
		data = rows;
	}
});

function getClientCount(){
	clients = io.sockets.clients();

	let count = 0;
	for(let o in clients.connected){
		count++;
	}
	
	return count;
}

function setUpPlayScreen(socket){
	socket.emit('db', data);

	io.emit('connection count', getClientCount());

	socket.on('to server', function(data) {
		socket.broadcast.emit('from server', data);
		io.emit('connection count', getClientCount());
	});
}