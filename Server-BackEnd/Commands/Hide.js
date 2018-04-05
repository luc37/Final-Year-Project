const targetAndStatusCommand = require('../Commands/TargetAndStatusCommand');

const hide = {}

Object.setPrototypeOf(hide, targetAndStatusCommand);
module.exports = hide;