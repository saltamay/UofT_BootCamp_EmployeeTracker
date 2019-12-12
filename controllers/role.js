const { getAllDepartmentNames } = require('./department');
const { getDepartmentID } = require('../models/department');
const { getAllRoles } = require('../models/role');
const { displayHeadline, displayFooter } = require('../utils/log');

/**
 * @description   Adds a new role
 */
async function addRole() {
  try {
    const departmentNames = await getAllDepartmentNames();

    const role = await inquirer.prompt([
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
      }
    ]);

    role.departmentID = await getDepartmentID(role.department);
    await insertRole(role);
  } catch (err) {
    if (err) throw err;
  }
}

/**
 * @description   Retrieves all roles
 * @returns       Array object of role names
 */
async function getAllRoleNames() {
  try {
    const roles = await getAllRoles();

    let roleNames = [];
    for (const role of roles) {
      roleNames.push(role.Title);
    }

    return roleNames;
  } catch (err) {
    if (err) throw err;
  }
}

/**
 * @description   Removes a role
 */
async function removeRole() {
  try {
    const roleNames = await getAllRoleNames;

    const role = await inquirer.prompt([
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

/**
 * @description   Retrieves and displays all roles
 */
async function displayAllRoles() {
  try {
    const roles = await getAllRoles();
    const footer = displayHeadline('All Roles');
    console.table(roles);
    displayFooter(footer);
  } catch (err) {
    if (err) throw err;
  }
}

module.exports = {
  addRole,
  getAllRoleNames,
  removeRole,
  displayAllRoles
};
