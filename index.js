const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const MySQL = require('./MySQL');
const sqlQuery = new MySQL();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xExV2Rv3gjc7XC',
  database: 'employee_db'
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connected to the database');
});

db.query(sqlQuery.dropEmployeeTable(), err => {
  if (err) throw err
});

db.query(sqlQuery.dropRoleTable(), err => {
  if (err) throw err
});

db.query(sqlQuery.dropDepartmentTable(), err => {
  if (err) throw err
});

db.query(sqlQuery.createDepartmentTable(), err => {
  if (err) throw err
});

db.query(sqlQuery.createRoleTable(), err => {
  if (err) throw err
});

db.query(sqlQuery.createEmployeeTable(), err => {
  if (err) throw err
});

inquirer
  .prompt([
    {
      type: 'list',
      name: 'function',
      message: 'What do you want to do?',
      choices: [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager'
      ]
    },
    // {
    //   type: 'list',
    //   name: 'size',
    //   message: 'What size do you need?',
    //   choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    //   filter: function (val) {
    //     return val.toLowerCase();
    //   }
    // }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });

// console.table([
//   {
//     name: 'View All Employees'
//   }, {
//     name: 'View All Employees by Department'
//   }
// ]);



