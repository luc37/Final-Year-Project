const database = require('../database/connect-database');

const create = function(socket){
    socket.on('create character', function(data){

        let query = 'INSERT into user (characterName, password, email, health, bullets, gunPower, aim, lookDirection, maxHealth, smell, clumsiness)';
        let q2 = 'Values (\'' + data.characterName +'\' ,\''+ data.password +'\',\''+ data.email + '\', 10, 8, 2, 2, \'north\', 10, 0, 0)';

        database.connection.query( query + q2, function(err, result){
            if(err){
                console.log(err);
            }else{

                database.connection.query('select * from user where characterName = \'' + data.characterName + '\'', function(err,rows){
                    if(err){
                        console.log(err);
                    } else{

                        let query = 'insert into inventory (characterId) values(' + rows[0].characterId + ')';

                        database.connection.query( query, function(err, result){
                            if(err){
                                console.log(err);
                            } else{
                                database.connection.query('select * from inventory where characterId =' + rows[0].characterId, function(err, r){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        database.connection.query('update user set inventoryId = ' + r[0].id + ' where characterId = ' + rows[0].characterId, function(err){
                                            if(err){
                                                console.log(err);
                                            } else{
                                                database.connection.query('select * from user where characterid =' + rows[0].characterId, function(err, c){
                                                    if(err){
                                                        console.log(err);
                                                    } else{
                                                        socket.emit('create character', c[0]);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }); 
            }
        });
    });
}

const createCharacter = {
    create: create
}

module.exports = createCharacter;