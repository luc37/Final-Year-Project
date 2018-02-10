const database = require('../database/connect-database');

const create = function(socket){
    socket.on('create character', function(data){

        let query = 'INSERT into user (characterName, password, email) Values (\'' + data.characterName +'\' ,\''+ data.password +'\',\''+ data.email + '\')';

        database.connection.query( query, function(err, result){
            if(err){
                console.log(err);
            }else{
                socket.emit('create character', null);
            }
        });

    });
}

const createCharacter = {
    create: create
}

module.exports = createCharacter;