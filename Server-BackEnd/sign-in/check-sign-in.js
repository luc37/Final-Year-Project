const database = require('../database/connect-database');
const character = require('../Character/Character');

let theCharacter = Object.create(character);

const checkSignIn = function(socket, activePlayerList){
    let isChar = false;
    let characterName;
    let characterId;
    let socketId = socket.id;
    let alreadySignedIn = false;

    socket.on('checkSignIn', function(data) {
        database.connection.query('SELECT characterName, password, characterId from user', function(err, rows){
            if(err){
                console.log(err);
            }else{
                for(let i=0; i < rows.length; i++){
                    if(rows[i].characterName === data.characterName && rows[i].password === data.password){
                        isChar = true;
                        characterName = data.characterName;
                        characterId = rows[i].characterId;
                    }
                }
            }
            
            if(activePlayerList.length > 0){
                activePlayerList.forEach(element => {
                    if(element.id === characterId){
                        alreadySignedIn = true;
                    }
                });
            }

            theCharacter.build(characterName, characterId, isChar, null, socketId);
            
            if(alreadySignedIn){
                //emit a message - signed in somewhere else
                socket.disconnect();
            }

            socket.emit('checkSignIn', theCharacter);
        });
    });
}

const manageSignIn = {
    check: checkSignIn,
    character: theCharacter
}

module.exports = manageSignIn;