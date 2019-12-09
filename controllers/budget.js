const inquirer = require('inquirer');
const { getTotalBudget, getTotalBudgetByDepartment } = require('../models/budget');
const { getDepartmentID } = require('../models/department');
const { getAllDepartmentNames } = require('./department');

/**
 * @description   Displays the total utilized budget
 */
async function displayTotalBudget() {
  try {
    let totalBudget = await getTotalBudget();
    totalBudget = new Intl.NumberFormat('en-CAD', { style: 'currency', currency: 'CAD' }).format(totalBudget);
    console.log('');
    console.table(totalBudget);
  } catch (err) {
    if (err) throw err;
  }
}

/**
 * @description   Displays the total utilized budget that department
 */
async function displayTotalDepartmentBudget() {
  try {
    const departmentNames = await getAllDepartmentNames();

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

    let totalDepartmentBudget = await getTotalBudgetByDepartment(departmentID);

    if (totalDepartmentBudget) {
      totalDepartmentBudget = new Intl.NumberFormat('en-CAD', { style: 'currency', currency: 'CAD' }).format(totalDepartmentBudget);
    } else {
      totalDepartmentBudget = `\nTotal ${department.name} budget: CA$0.00\n`;
    }
    console.table(totalDepartmentBudget);
  } catch (err) {
    if (err) throw err;
  }
}

module.exports = {
  displayTotalBudget,
  displayTotalDepartmentBudget
}