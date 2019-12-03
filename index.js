const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const MySQL = require('./MySQL');
const sqlQuery = new MySQL();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xExV2Rv3gjc7XC',
  database: 'employee_db',
  multipleStatements: true
});

db.connect(function (err) {
  if (err) throw err;
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

function initDB() {

  // Seed database
  db.query("INSERT INTO department (name) VALUES (?);INSERT INTO department (name) VALUES (?);INSERT INTO department (name) VALUES (?);INSERT INTO department (name) VALUES (?)", ['Sales', 'Legal', 'Finance', 'Engineering'],
    err => {
      if (err) throw err;
    }
  );

  // Seed role table
  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 100000, 1)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 80000, 1)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Lawyer', 190000, 2)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Legal Team Lead', 250000, 2)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 125000, 3)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 120000, 4)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO role (title, salary, department_id) VALUES ('Lead Software Engineer', 180000, 4)", err => {
    if (err) throw err;
  });

  // Seed employees to test the functionality
  db.query("INSERT INTO employee (first_name, last_name, role_id) VALUES ('Leanne', 'Graham', 4)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ervin', 'Howell', 3, 1)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO employee (first_name, last_name, role_id) VALUES ('Clementine', 'Bauch', 1)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Patricia', 'Lebsack', 2, 3)", err => {
    if (err) throw err;
  });

  db.query("INSERT INTO employee (first_name, last_name, role_id) VALUES ('Chelsey', 'Dietrich', 5)", err => {
    if (err) throw err;
  });
}

async function init() {
  // Reset and initialize the database

  const answer = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
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
      await addEmployee();
      init();
      break;
    case 'view all employees':
      await displayAllEmployees();
      init();
      break;
    default:
      break;
  }
}

function getRoleID(employee) {
  return new Promise((resolve, reject) => {
    db.query(sqlQuery.selectRoleId(employee), (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].id);
      }
    });
  });
}

function getManagerID(employee) {
  if (employee.manager === 'Not Assigned') {
    return null;
  }

  return new Promise((resolve, reject) => {
    db.query(sqlQuery.selectEmployeeId(employee), (err, results, fields) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results[0].id);
      }
    });
  });
}

function insertEmployee(employee) {
  return new Promise((resolve, reject) => {
    db.query(sqlQuery.insertIntoEmployee(employee), err => {
      if (err) {
        reject(err);
      } else {
        console.log('Success');
        resolve();
      }
    });
  })
}

function getManagerByID(managerID) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM employee WHERE id=${managerID}`, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        const manager = results[0]['first_name'] + " " + results[0]['last_name'];
        resolve(manager);
      }
    });
  })
}

function getAllEmployeeDetails() {
  return new Promise((resolve, reject) => {
    const query = `SELECT employee.id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', manager_id
    FROM employee, role, department
    WHERE employee.role_id=role.id
      AND role.department_id=department.id
    ORDER BY employee.id ASC`;
    // const query = `SELECT first_name FROM employee`
    db.query(query, (err, results, fields) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    })
  })
}

async function addEmployee() {

  // Get the list of all titles
  const titles = [];

  db.query(sqlQuery.selectAllFromRole(), (err, results, fields) => {
    if (err) throw err;

    for (const role of results) {
      titles.push(role.title);
    }
  });

  // Get the list of employees

  const employees = ['Not Assigned'];

  db.query(sqlQuery.selectAllFromEmployee(), (err, results, fields) => {
    if (err) throw err;
    for (const employee of results) {
      const firstName = employee['first_name'];
      const lastName = employee['last_name'];
      employees.push(`${firstName} ${lastName}`);
    }
  });

  try {
    const employee = await inquirer
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
        {
          type: 'list',
          name: 'title',
          message: 'What is employee\'s role? ',
          choices: titles
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is employee\'s manager ?',
          choices: employees
        }
      ]);

    employee.roleID = await getRoleID(employee);
    employee.managerID = await getManagerID(employee);

    await insertEmployee(employee);

  } catch (err) {
    if (err) throw err;
  }
}

async function displayAllEmployees() {

  try {
    const employees = await getAllEmployeeDetails();

    for (const employee of employees) {
      if (employee['manager_id'] !== null) {
        employee.Manager = await getManagerByID(employee['manager_id']);
        delete employee['manager_id'];
      } else {
        employee.Manager = 'Not Assigned';
        delete employee['manager_id'];
      }
    }

    console.table(employees);
  } catch (err) {
    if (err) {
      throw err;
    }
  }

}


resetDB();
initDB();
init();




