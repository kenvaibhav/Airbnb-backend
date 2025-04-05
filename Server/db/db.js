const mysql = require('mysql2')
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'Vaibhav@root1',
    database : 'airbnb_db'
}) 
module.exports = pool