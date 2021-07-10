const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "by3lwtpeyft77fig1kwg-mysql.services.clever-cloud.com",
    user: "ui0jmcww1c0x23v9",
    password: "LCRJf2IGphiwLksj4FNQ",
    database: "by3lwtpeyft77fig1kwg",  
    port: 3306,
});
//Content Wrapper. Contains page content

module.exports = conn;