const inquirer = require('inquirer');
const db = require('./database');
const {
  addEmployee,
  removeEmployee,
  updateEmployeeManager,
  updateEmployeeRole,
  displayAllEmployees,
  displayAllEmployeesByDepartment,
  displayAllEmployeesByManager
} = require('./controllers/employee');
const {
  addDepartment,
  removeDepartment,
  displayAllDepartments
} = require('./controllers/department');
const { addRole, removeRole, displayAllRoles } = require('./controllers/role');
const {
  displayTotalBudget,
  displayTotalDepartmentBudget
} = require('./controllers/budget');
const { displayBanner } = require('./utils/banner');

async function init() {
  db.dropAndInit();
  await displayBanner();
  await app();
}

async function app() {
  console.log('\n');
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an option?',
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
      db.dropAndEnd();
    default:
      break;
  }
}

init();
