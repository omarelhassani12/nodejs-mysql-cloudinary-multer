const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_mysql_cloudinary(multer)',
});


connection.connect((err)=>{
    if(err) throw err;

    console.log('connected to database');
});

module.exports = connection;