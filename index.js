const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'function',
      message: 'What do you want to do?',
      choices: [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager'
      ]
    },
    // {
    //   type: 'list',
    //   name: 'size',
    //   message: 'What size do you need?',
    //   choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    //   filter: function (val) {
    //     return val.toLowerCase();
    //   }
    // }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });

// console.table([
//   {
//     name: 'View All Employees'
//   }, {
//     name: 'View All Employees by Department'
//   }
// ]);



