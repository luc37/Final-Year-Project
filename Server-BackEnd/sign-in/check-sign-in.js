const database = require('../database/connect-database');
const character = require('../Character/Character');
const item = require('../Game/Objects/Item');

let theCharacter = Object.create(character);

const checkSignIn = function(socket, activePlayerList){
    let isChar = false;
    let characterId;
    let socketId = socket.id;
    let alreadySignedIn = false;

    socket.on('checkSignIn', function(data) {
        database.connection.query('SELECT * from user where characterName= \'' + data.characterName + '\' and password = \'' + data.password + '\'', function(err, rows){
            if(err){
                console.log(err);
            }else{
                console.log(data);
                if(rows.length !== 0){
                    database.connection.query('select * from inventory where characterId = ' + rows[0].characterId, function(err, r){
                        if(err){
                            console.log(err);
                        } else {
                            database.connection.query('select * from items', function(err, theItems){
                                if(err){
                                    console.log(err);
                                } else{
                                    database.connection.query('select * from allitems', function(err, allItems){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            for(let i=0; i < rows.length; i++){
                                                if(rows[i].characterName === data.characterName && rows[i].password === data.password){
                                                    isChar = true;
                                                    characterId = rows[i].characterId;
                                                    theCharacter.build(rows[i], isChar, socketId);
                    
                                                    let x = [];
                                                    if(r[0].itemId1 !== null){
                                                        x.push(r[0].itemId1);
                                                    }
                                                    if(r[0].itemId2 !== null){
                                                        x.push(r[0].itemId2);
                                                    }
                                                    if(r[0].itemId3 !== null){
                                                        x.push(r[0].itemId3);
                                                    }
            
                                                    let x2 = [];
            
                                                    theItems.forEach(function(anItem){
                                                        allItems.forEach(function(allItem){
                                                            x.forEach(function(id){
                                                                if(id === anItem.id){
                                                                    if(anItem.allitemsId === allItem.id){
                                                                        let i = Object.create(item);
                                                                        i.build(anItem, allItem);
                                                                        x2.push(i);
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    });
                    
                                                    theCharacter.buildInventory(x2);
                                                }
                                            }
                    
                                            if(activePlayerList.length > 0){
                                                activePlayerList.forEach(element => {
                                                    if(element.id === characterId){
                                                        alreadySignedIn = true;
                                                    }
                                                });
                                            }
                                            
                                            if(alreadySignedIn){
                                                //emit a message - signed in somewhere else
                                                socket.disconnect();
                                            }
                                
                                            socket.emit('checkSignIn', theCharacter);
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            }
        });
    });
}

const manageSignIn = {
    check: checkSignIn,
    character: theCharacter
}

module.exports = manageSignIn;