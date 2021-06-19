const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "bgcs6lfujsw9xwszjqhj-mysql.services.clever-cloud.com",
    user: "ueogosnzkiuwtl5z",
    password: "bgcs6lfujsw9xwszjqhj",
    database: "ylaJ3jVOQ9oey9k25vF8",  
    port: 3306,
});
//Content Wrapper. Contains page content

module.exports = conn;