const targetCommand = require('../Commands/TargetCommand');

const drop = {}

Object.setPrototypeOf(drop, targetCommand);
module.exports = drop;