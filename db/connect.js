const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "cinemaplus.mysql.database.azure.com",
    user: "adminboofood@cinemaplus",
    password: "yahWT@(o",
    database: "cinemaplus",  
    port: 3306,
});
//Content Wrapper. Contains page content

module.exports = conn;