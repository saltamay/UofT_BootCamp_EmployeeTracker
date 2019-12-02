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

function resetDB() {
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
}

async function getEmployeeInfo() {
  const answer = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the employee\'s first name? '
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the employee\'s last name? '
      },
      // {
      //   type: 'list',
      //   name: 'department',
      //   message: 'What do you want to do?',
      //   choices: [
      //     'View All Employees',
      //     'View All Employees by Department',
      //     'View All Employees by Manager',
      //     'Add Employee',
      //     'Remove Employee Role',
      //     'Update Employee Manager'
      //   ]
      // }
    ]);

  console.log(answer);

  init();
}
async function init() {
  // Reset db
  resetDB();

  const answer = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
          'View All Employees',
          'View All Employees by Department',
          'View All Employees by Manager',
          'Add Employee',
          'Remove Employee Role',
          'Update Employee Manager'
        ]
      }
    ]);

  switch (answer.action.toLowerCase()) {
    case 'add employee':
      getEmployeeInfo();
      break;

    default:
      break;
  }
}

init();




