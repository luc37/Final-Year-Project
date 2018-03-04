const command = require('../Commands/Command');

const sneak = {}

Object.setPrototypeOf(sneak, command);
module.exports = sneak;