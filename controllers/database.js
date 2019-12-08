const mysql = require('mysql');

const database = {
  createConnection: function (params) {
    return mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'xExV2Rv3gjc7XC',
      database: 'employee_db',
      multipleStatements: true
    });
  }
}

module.exports = database;

