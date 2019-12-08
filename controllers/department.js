const database = require('./database');
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

const getDepartmentID = (departmentName) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id FROM department WHERE name = ?";
    db.query(query, [departmentName], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].id);
      }
    });
  });
}

const insertDepartment = (departmentName) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO department (name) VALUES (?)";
    db.query(query, [departmentName], err => {
      if (err) {
        reject(err);
      } else {
        console.log('Success');
        resolve();
      }
    });
  });
}

const deleteDepartment = (departmentName) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM department WHERE name = ?";
    db.query(query, [departmentName], err => {
      if (err) {
        reject(err);
      } else {
        resolve('Success');
      }
    });
  });
}

const getAllDepartments = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id AS 'ID', name AS 'Name' FROM department";
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getDepartmentID,
  insertDepartment,
  deleteDepartment,
  getAllDepartments
}