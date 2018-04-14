const targetCommand = require('../Commands/TargetCommand');

const detonate = {}

Object.setPrototypeOf(detonate, targetCommand);
module.exports = detonate;