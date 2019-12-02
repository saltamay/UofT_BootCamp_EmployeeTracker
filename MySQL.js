class MySQL {

  dropEmployeeTable() {
    return `DROP TABLE IF EXISTS employee`;
  }

  dropDepartmentTable() {
    return `DROP TABLE IF EXISTS department`;
  }

  dropRoleTable() {
    return `DROP TABLE IF EXISTS role`;
  }

  createDepartmentTable() {
    return `CREATE TABLE IF NOT EXISTS department(
      id INT AUTO_INCREMENT,
      name VARCHAR(30) NOT NULL,
      PRIMARY KEY(id)
    );`
  }

  createRoleTable() {
    return `CREATE TABLE IF NOT EXISTS role(
      id INT AUTO_INCREMENT,
      title VARCHAR(30) NOT NULL,
      salary DECIMAL NOT NULL,
      department_id INT NOT NULL,
      PRIMARY KEY(id),
      FOREIGN KEY(department_id) REFERENCES department(id)
    );`
  }

  createEmployeeTable() {
    return `CREATE TABLE IF NOT EXISTS employee(
      id INT AUTO_INCREMENT,
      first_name VARCHAR(30) NOT NULL,
      last_name VARCHAR(30) NOT NULL,
      role_id INT NOT NULL,
      manager_id INT,
      PRIMARY KEY(id),
      FOREIGN KEY(role_id) REFERENCES role(id),
      FOREIGN KEY(manager_id) REFERENCES employee(id)
    );`;
  }

  selectAllFromRole() {
    return `SELECT * FROM role`;
  }

  selectAllFromEmployee() {
    return `SELECT * FROM employee`;
  }

  selectRoleId(employee) {
    return `SELECT id FROM role WHERE title="${employee.title}"`;
  }

  selectEmployeeId(employee) {
    const firstName = employee.manager.split(' ')[0];
    const lastName = employee.manager.split(' ')[1];
    return `SELECT id FROM employee WHERE first_name="${firstName}" AND last_name="${lastName}"`;
  }

  insertIntoEmployee(employee) {
    if (employee.managerID) {
      return `INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES("${employee.firstName}", "${employee.lastName}", ${employee.roleID}, ${employee.managerID});`;
    } else {
      return `INSERT INTO employee (first_name, last_name, role_id)
      VALUES("${employee.firstName}", "${employee.lastName}", ${employee.roleID});`;
    }
  }
}

module.exports = MySQL;