const targetCommand = require('../Commands/TargetCommand');

const eat = {}

Object.setPrototypeOf(eat, targetCommand);
module.exports = eat;