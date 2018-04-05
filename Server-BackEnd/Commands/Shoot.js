const targetCommand = require('../Commands/TargetCommand');

const shoot = {}

Object.setPrototypeOf(shoot, targetCommand);
module.exports = shoot;