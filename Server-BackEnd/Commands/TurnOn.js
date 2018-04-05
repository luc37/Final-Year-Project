const targetCommand = require('../Commands/TargetCommand');

const turnOn = {}

Object.setPrototypeOf(turnOn, targetCommand);
module.exports = turnOn;