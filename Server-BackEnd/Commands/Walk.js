const command = require('../Commands/Command');

const walk = {}

Object.setPrototypeOf(walk, command);
module.exports = walk;

