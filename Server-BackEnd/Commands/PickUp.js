const targetCommand = require('../Commands/TargetCommand');

const pickUP = {}

Object.setPrototypeOf(pickUP, targetCommand);
module.exports = pickUP;