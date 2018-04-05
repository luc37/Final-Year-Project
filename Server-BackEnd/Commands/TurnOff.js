const targetCommand = require('../Commands/TargetCommand');

const turnOff = {}

Object.setPrototypeOf(turnOff, targetCommand);
module.exports = turnOff;