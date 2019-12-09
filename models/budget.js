const database = require('../database');
const mysql = require('mysql');

// Conect to employee_db database
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'xExV2Rv3gjc7XC',
  database: 'employee_db',
  multipleStatements: true
});

/**
 * @description   Calculates the combined salaries of all employees
 * @returns       {Promise} Total utilized budget
 */
function getTotalBudget() {
  return new Promise((resolve, reject) => {
    const query = `SELECT SUM(salary) AS 'Total Budget' FROM role, employee WHERE employee.role_id=role.id`;
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]['Total Budget']);
      }
    });
  });
}

/**
 * @description   Calculates the combined salaries of all employees in that department
 * @param         {Number} The Department Id
 * @returns       {Promise} Total utilized budget of a department
 */
function getTotalBudgetByDepartment(departmentID) {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT SUM(salary) AS 'Total Department Budget'
      FROM employee
      LEFT JOIN role ON employee.role_id=role.id
      WHERE role.department_id = ?`;
    db.query(query, [departmentID], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]['Total Department Budget']);
      }
    });
  });
}

module.exports = {
  getTotalBudget,
  getTotalBudgetByDepartment
}