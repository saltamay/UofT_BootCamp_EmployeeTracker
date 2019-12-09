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

getEmployeeID = (employeeName) => {
  if (employeeName === 'None') {
    return null;
  }
  return new Promise((resolve, reject) => {
    const firstName = employeeName.split(' ')[0];
    const lastName = employeeName.split(' ')[1];
    query = "SELECT id FROM employee WHERE first_name= ? AND last_name= ?";
    db.query(query, [firstName, lastName], (err, results, fields) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results[0].id);
      }
    });
  });
}

insertEmployee = (employee) => {
  return new Promise((resolve, reject) => {
    if (employee.managerID) {
      const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;
      db.query(query, [employee.firstName, employee.lastName, employee.roleID, employee.managerID],
        err => {
          if (err) {
            reject(err);
          } else {
            console.log('Success');
            resolve();
          }
        }
      );
    } else {
      const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES(?, ?, ?)`;
      db.query(query, [employee.firstName, employee.lastName, employee.roleID],
        err => {
          if (err) {
            reject(err);
          } else {
            console.log('Success');
            resolve();
          }
        }
      );
    }
  });
}

deleteEmployee = (employeeName) => {
  return new Promise((resolve, reject) => {
    const firstName = employeeName.split(' ')[0];
    const lastName = employeeName.split(' ')[1];
    query = "DELETE FROM employee WHERE first_name = ? AND last_name = ?"
    db.query(query, [firstName, lastName], err => {
      if (err) {
        reject(err);
      } else {
        console.log('Success');
        resolve();
      }
    });
  });
}

setEmployeeRole = (employeeName, role) => {
  return new Promise((resolve, reject) => {
    const firstName = employeeName.split(' ')[0];
    const lastName = employeeName.split(' ')[1];
    const query = "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?"
    db.query(query, [firstName, lastName, role.id], err => {
      if (err) {
        reject(err);
      } else {
        resolve('Success');
      }
    });
  });
}

setEmployeeManager = (employee, manager = null) => {
  return new Promise((resolve, reject) => {
    const firstName = employee.split(' ')[0];
    const lastName = employee.split(' ')[1];
    let query = '';
    if (manager) {
      query = "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?";
    } else {
      query = "UPDATE employee SET manager_id = null WHERE first_name = ? AND last_name = ?";
    }
    db.query(query, [firstName, lastName], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve('Success');
      }
    });
  });
}

getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM employee";
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        const employees = [];
        for (const employee of results) {
          const firstName = employee['first_name'];
          const lastName = employee['last_name'];
          employees.push(`${firstName} ${lastName}`);
        }
        resolve(employees);
      }
    });
  });
}

const getManagerByID = (managerID) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM employee WHERE id = ?";
    db.query(query, [managerID], (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        const manager = `${results[0]['first_name']} ${results[0]['last_name']}`;
        resolve(manager);
      }
    });
  })
}

getAllManagers = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM employee, employee manager WHERE employee.manager_id = manager.id";
    db.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        const managers = [];
        for (const manager of results) {
          const firstName = manager['first_name'];
          const lastName = manager['last_name'];
          managers.push(`${firstName} ${lastName}`);
        }
        resolve(managers);
      }
    });
  });
}

getAllEmployeesDetails = () => {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT employee.id AS 'ID', 
        first_name AS 'First Name', 
        last_name AS 'Last Name', 
        role.title AS 'Title', 
        department.name AS 'Department', 
        role.salary AS 'Salary', 
        manager_id
      FROM employee, role, department
      WHERE employee.role_id = role.id
        AND role.department_id = department.id
      ORDER BY employee.id ASC`;

    db.query(query, (err, results, fields) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

getAllEmployeesByDepartment = (departmentID) => {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT employee.id AS 'ID', 
        first_name AS 'First Name', 
        last_name AS 'Last Name'
      FROM employee
      WHERE employee.role_id = ANY (SELECT role.id FROM role WHERE role.department_id = ?)
      ORDER BY employee.id ASC`;
    db.query(query, [departmentID], (err, results, fields) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

getAllEmployeesByManager = (managerID) => {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT id AS 'ID', 
        first_name AS 'First Name', 
        last_name AS 'Last Name'
      FROM employee WHERE employee.manager_id = ? 
      ORDER BY employee.first_name ASC`;
    db.query(query, [managerID], (err, results, fields) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getEmployeeID,
  insertEmployee,
  deleteEmployee,
  setEmployeeRole,
  setEmployeeManager,
  getAllEmployees,
  getManagerByID,
  getAllManagers,
  getAllEmployeesDetails,
  getAllEmployeesByDepartment,
  getAllEmployeesByManager
}