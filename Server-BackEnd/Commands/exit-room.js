const room = require('../Locations/Room');
const command = require('../Commands/Command');

const exitRoomCommand = {}

Object.setPrototypeOf(exitRoomCommand, command);
module.exports = exitRoomCommand;

