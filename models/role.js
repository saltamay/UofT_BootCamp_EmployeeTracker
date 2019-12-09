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

const getRoleID = (roleTitle) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id FROM role WHERE title = ?"
    db.query(query, [roleTitle], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].id);
      }
    });
  });
};

const insertRole = (role) => {
  return new Promise((resolve, reject) => {
    const query =
      `INSERT INTO role (title, salary, department_id)
     VALUES (?, ?, ?)`;
    db.query(query, [role.title, role.salary, role.departmentID], err => {
      if (err) {
        reject(err);
      } else {
        resolve('Success');
      }
    });
  });
};

const deleteRole = (roleTitle) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM role WHERE title = ?";
    db.query(query, [roleTitle], err => {
      if (err) {
        reject(err);
      } else {
        resolve('Success');
      }
    });
  });
};

const getAllRoles = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id AS 'ID', title AS 'Title', salary AS 'Salary' FROM role";
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllTitles = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id AS 'ID', title AS 'Title', salary AS 'Salary' FROM role";
    // Get the list of all titles
    const titles = [];
    db.query(query, (err, results, fields) => {
      if (err) reject(err);

      for (const role of results) {
        titles.push(role.Title);
      }

      resolve(titles);
    });
  });
};



module.exports = {
  getRoleID,
  insertRole,
  deleteRole,
  getAllRoles,
  getAllTitles
}