const database = require('../database/connect-database');

const checkSignIn = function(socket){
    let isChar = false;
    let characterName;

    socket.on('checkSignIn', function(data) {
        database.connection.query('SELECT characterName, password from user', function(err, rows){
            if(err){
                console.log(err);
            }else{
                for(let i=0; i < rows.length; i++){
                    if(rows[i].characterName === data.characterName && rows[i].password === data.password){
                        isChar = true;
                        characterName = data.characterName;
                    }
                }
            }

            let returnValue = {
                isChar,
                characterName
            }
            
            socket.emit('checkSignIn', returnValue);
        });
    });
}

const manageSignIn = {
    check: checkSignIn
}

module.exports = manageSignIn;