const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.Server(app);

server.listen(3000);

const io = socketIo(server);
let clients;

const database = require('./database/connect-database');
const manageSignIn = require('./sign-in/check-sign-in');
const game = require('./Game/Game');
const createCharacter = require('./sign-in/create-character');

let theGame;

console.log('server running ... ');

database.connection.query('SELECT * from game where startRoomId = 1', function(err, rows){
	if(err){
		console.log(err);
	}else{
		console.log('database connected');
		theGame = Object.create(game);
		theGame.build(rows[0].startRoomId);

		setInterval(function() {
			theGame.run(io);
		}, 10000);
	}
});

io.on('connection', (socket) => {
	manageSignIn.check(socket, theGame.activePlayerList);
	createCharacter.create(socket);

	socket.on('resetPlayScreenPage', function(data){
		theGame.addPlayerToActivePlayerList(data);
		theGame.intoduceNewPlayer(socket);
		setUpPlayScreen(socket);
	});

	socket.on('switch tabs', function(data){
		theGame.activePlayerList.forEach(element => {

			if(element.id === data.characterId){
				element.socketId = socket.id;
				
				setUpPlayScreen(socket);
				io.sockets.connected[data.socketId].disconnect();
			}

			socket.emit('new socket', socket.id);
		});
	});
	
	socket.on('disconnect', function () {
		theGame.removePlayerFromActivePlayerList(socket.id);
		io.emit('connection count', getClientCount());
		io.emit('player list', theGame.activePlayerList);
	});
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
	io.emit('connection count', getClientCount());
	io.emit('player list', theGame.activePlayerList);


	socket.on('to server', function(data) {
		socket.broadcast.emit('from server', data);
	});
}