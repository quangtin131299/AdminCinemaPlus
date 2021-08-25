const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "boofood.cl8j8wc2hw4p.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "123456789",
    database: "cinemaplus",  
    port: 3306
});
//Content Wrapper. Contains page content

module.exports = conn;