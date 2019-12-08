const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');
const MySQL = require('./MySQL');
const sqlQuery = new MySQL();
const figlet = require('figlet');
const database = require('./controllers/database');
const { getEmployeeID, insertEmployee, deleteEmployee, setEmployeeRole, setEmployeeManager, getAllEmployees, getManagerByID, getAllManagers, getAllEmployeesDetails, getAllEmployeesByDepartment, getAllEmployeesByManager } = require('./controllers/employee');
const { getRoleID, insertRole, deleteRole, getAllRoles } = require('./controllers/role');
const { getDepartmentID, insertDepartment, deleteDepartment, getAllDepartments } = require('./controllers/department');

// Conect to employee_db database
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'xExV2Rv3gjc7XC',
  database: 'employee_db',
  multipleStatements: true
});

db.connect(function (err) {
  if (err) throw err;
});

function displayBanner() {
  return new Promise((resolve, reject) => {
    figlet('Employee Manager', {
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }, function (err, data) {
      if (err) {
        console.log('Something went wrong...');
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function app() {
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
          'View All Roles',
          'View All Departments',
          'Add Employee',
          'Remove Employee',
          'Update Employee Manager',
          'Update Employee Role',
          'Add Department',
          'Remove Department',
          'Add Role',
          'Remove Role',
          'View Total Budget',
          'View Total Department Budget',
          'Exit'
        ]
      }
    ]);

  switch (answer.action.toLowerCase()) {
    case 'view all employees':
      await displayAllEmployees();
      app();
      break;
    case 'view all employees by department':
      await displayAllEmployeesByDepartment();
      app();
      break;
    case 'view all employees by manager':
      await displayAllEmployeesByManager();
      app();
      break;
    case 'view all roles':
      await displayAllRoles();
      app();
      break;
    case 'view all departments':
      await displayAllDepartments();
      app();
      break;
    case 'add employee':
      await addEmployee();
      app();
      break;
    case 'remove employee':
      await removeEmployee();
      app();
      break;
    case 'update employee manager':
      await updateEmployeeManager();
      app();
      break;
    case 'update employee role':
      await updateEmployeeRole();
      app();
      break;
    case 'update employee department':
      await updateEmployeeDepartment();
      app();
      break;
    case 'add department':
      await addDepartment();
      app();
      break;
    case 'remove department':
      await removeDepartment();
      app();
      break;
    case 'add role':
      await addRole();
      app();
      break;
    case 'remove role':
      await removeRole();
      app();
      break;
    case 'view total budget':
      await displayTotalBudget();
      app();
      break;
    case 'view total department budget':
      await displayTotalDepartmentBudget();
      app();
      break;
    case 'exit':
      console.log('Have a nice day!');
      db.end();
    default:
      break;
  }
}

function setEmployeeDepartment(employeeName, department) {
  return new Promise((resolve, reject) => {
    const firstName = employeeName.split(' ')[0];
    const lastName = employeeName.split(' ')[1];
    const query = `UPDATE employee SET id=${department.id} WHERE first_name="${firstName}" AND last_name="${lastName}"`;
    db.query(query, err => {
      if (err) {
        reject(err);
      } else {
        resolve('Success');
      }
    });
  });
}

function getTotalBudget() {
  return new Promise((resolve, reject) => {
    const query = `SELECT SUM(salary) AS 'Total Budget' FROM role, employee WHERE employee.role_id=role.id`;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    })
  })
}

function getTotalBudgetByDepartment(departmentID) {
  return new Promise((resolve, reject) => {
    const query = `SELECT SUM(salary) AS 'Total Department Budget'
    FROM employee
    LEFT JOIN role ON employee.role_id=role.id
    WHERE role.department_id=${departmentID}`
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function addEmployee() {

  // Get the list of all titles
  const titles = [];

  db.query(sqlQuery.selectAllFromRole(), (err, results, fields) => {
    if (err) throw err;

    for (const role of results) {
      titles.push(role.Title);
    }
  });

  // Get the list of employees
  const employees = await getAllEmployees();
  employees.unshift('None');

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

    employee.roleID = await getRoleID(employee.title);
    employee.managerID = await getEmployeeID(employee.manager);

    await insertEmployee(employee);

  } catch (err) {
    if (err) throw err;
  }
}

async function removeEmployee() {

  // Get the list of employees
  const employees = await getAllEmployees();

  try {
    const employee = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Which employee would you like to remove ?',
          choices: employees
        }
      ]);

    const managers = await getAllManagers();

    if (managers.includes(employee.name)) {

      const managerID = await getEmployeeID(employee.name);
      const employeesManaged = await getAllEmployeesByManager(managerID);

      for (let employeeManaged of employeesManaged) {
        employeeManaged = employeeManaged['First Name'] + " " + employeeManaged['Last Name'];
        setEmployeeManager(employeeManaged);
      }

      deleteEmployee(employee.name);
    } else {
      deleteEmployee(employee.name);
    }
  } catch (err) {
    if (err) throw err;
  }
}

async function displayAllEmployees() {
  try {
    const employees = await getAllEmployeesDetails();

    for (const employee of employees) {
      if (employee['manager_id'] !== null) {
        employee.Manager = await getManagerByID(employee['manager_id']);
        delete employee['manager_id'];
      } else {
        employee.Manager = 'None';
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

async function displayAllEmployeesByDepartment() {
  try {
    const results = await getAllDepartments();
    const departments = [];
    for (const department of results) {
      departments.push(department.Name);
    }
    const department = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select a department ?',
          choices: departments
        }
      ]);

    const departmentID = await getDepartmentID(department.name);

    const employees = await getAllEmployeesByDepartment(departmentID);

    console.table(employees);
  } catch (err) {
    if (err) throw err;
  }
}

async function displayAllEmployeesByManager() {
  try {
    const managers = await getAllManagers();
    const manager = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select a department ?',
          choices: managers
        }
      ]);

    const managerID = await getEmployeeID(manager.name);

    const employeesManaged = await getAllEmployeesByManager(managerID);

    console.table(employeesManaged);

  } catch (error) {

  }
}

async function updateEmployeeManager() {
  try {
    // Get the list of employees
    let employees = await getAllEmployees();

    let employee = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select an employee: ',
          choices: employees
        }
      ]);

    employee = employee.name;
    employees = employees.filter(el => el !== employee)

    const manager = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select an employee to assign as an manager: ',
          choices: employees
        }
      ]);

    manager.id = await getEmployeeID(manager.name);

    await setEmployeeManager(employee, manager);
  } catch (err) {
    if (err) throw err;
  }
}

async function updateEmployeeRole() {
  try {
    // Get the list of employees
    let employees = await getAllEmployees();

    let employee = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select an employee: ',
          choices: employees
        }
      ]);

    const roles = await getAllRoles();
    let roleTitles = [];
    for (const role of roles) {
      roleTitles.push(role.Title);
    }
    const role = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'title',
          message: 'Please select an employee to assign as an manager: ',
          choices: roleTitles
        }
      ]);

    role.id = await getRoleID(role.title);

    await setEmployeeRole(employee.name, role);
  } catch (err) {
    if (err) throw err;
  }
}

async function displayAllRoles() {
  try {
    const roles = await getAllRoles();

    console.table(roles);
  } catch (err) {
    if (err) throw err;
  }
}

async function displayAllDepartments() {
  try {
    const departments = await getAllDepartments();

    console.table(departments);
  } catch (err) {
    if (err) throw err;
  }
}

async function addDepartment() {
  try {
    const department = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What department would you like to add? '
        }
      ]);

    await insertDepartment(department.name);

  } catch (err) {
    if (err) throw err;
  }
}

async function removeDepartment() {
  try {
    const departments = await getAllDepartments();

    let departmentNames = [];
    for (const department of departments) {
      departmentNames.push(department.Name);
    }

    const department = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Which department would you like to remove? ',
          choices: departmentNames
        }
      ]);

    await deleteDepartment(department.name);

  } catch (err) {
    if (err) throw err;
  }
}

async function addRole() {
  try {

    const departments = await getAllDepartments();

    let departmentNames = [];
    for (const department of departments) {
      departmentNames.push(department.Name);
    }

    const role = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Please enter the role that you would like to add: '
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Please enter the salary assigned for this role: '
        },
        {
          type: 'list',
          name: 'department',
          message: 'To which department would you like to add this role? ',
          choices: departmentNames
        },
      ]);

    role.departmentID = await getDepartmentID(role.department);
    await insertRole(role);

  } catch (err) {
    if (err) throw err;
  }
}

async function removeRole() {
  try {
    const roles = await getAllRoles();

    let roleNames = [];
    for (const role of roles) {
      roleNames.push(role.Title);
    }

    const role = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'title',
          message: 'Which role would you like to remove? ',
          choices: roleNames
        }
      ]);

    await deleteRole(role.title);

  } catch (err) {
    if (err) throw err;
  }
}

async function displayTotalBudget() {
  try {
    const totalBudget = await getTotalBudget();
    totalBudget[0]['Total Budget'] = new Intl.NumberFormat('en-CAD', { style: 'currency', currency: 'CAD' }).format(totalBudget[0]['Total Budget']);
    console.log('');
    console.table(totalBudget);
  } catch (err) {
    if (err) throw err;
  }
}

async function displayTotalDepartmentBudget() {
  try {
    const departments = await getAllDepartments();

    let departmentNames = [];
    for (const department of departments) {
      departmentNames.push(department.Name);
    }

    const department = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Which department\'s budget would you like to see? ',
          choices: departmentNames
        }
      ]);

    const departmentID = await getDepartmentID(department.name);

    const totalDepartmentBudget = await getTotalBudgetByDepartment(departmentID);

    if (totalDepartmentBudget[0]['Total Department Budget']) {
      totalDepartmentBudget[0]['Total Department Budget'] = new Intl.NumberFormat('en-CAD', { style: 'currency', currency: 'CAD' }).format(totalDepartmentBudget[0]['Total Department Budget']);
    } else {
      totalDepartmentBudget[0]['Total Department Budget'] = `CA$0.00`;
    }
    console.log('');
    console.table(totalDepartmentBudget);
  } catch (error) {

  }
}

async function init() {
  database.reset();
  database.init();
  const data = await displayBanner();
  console.log(data);
  console.log('\n')
  await app();
}

init();





