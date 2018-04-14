const outlaw = require('../Character/Outlaw');

const overlord = {}

Object.setPrototypeOf(overlord, outlaw);
module.exports = overlord;