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
const map = require('./Game/Map');

let theGame;

const mapHeight = 10;
const mapWidth = 10;

console.log('server running ... ');

database.connection.query('SELECT * from game where startRoomId = 1', function(err, rows){
	if(err){
		console.log(err);
	}else{
		console.log('database connected');
		theGame = Object.create(game);
		theGame.build(rows[0].startRoomId, io);

		let theMap = Object.create(map);
        theMap.build(theGame, mapWidth, mapHeight, true);

		theGame.setUpOutlaws(5);
		theGame.setUpOverlord();

		setInterval(function() {
			theGame.run(io);
		}, 1000);
	}
});

io.on('connection', (socket) => {
	manageSignIn.check(socket, theGame.activePlayerList);
	createCharacter.create(socket);

	theGame.setUp(theGame, socket, io);
});