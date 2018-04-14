const item = require('./Item');

const bomb = {
    buildBomb: function(timer, status){
        this.timer = timer;
        this.status = status;
    },
    timer: 10,
    status: ''
}

Object.setPrototypeOf(bomb, item);
module.exports = bomb;