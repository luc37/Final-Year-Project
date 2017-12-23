const mysql = require('mysql');

const database = {
    connection: connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Mnbvcxz111&&&999',
        database: 'mudserver'
    })
}

module.exports = database;
