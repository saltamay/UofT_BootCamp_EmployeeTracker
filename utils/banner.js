const figlet = require('figlet');

function createBanner() {
  return new Promise((resolve, reject) => {
    figlet(
      'Employee Manager',
      {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      },
      function(err, data) {
        if (err) {
          console.log('Something went wrong...');
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

async function displayBanner() {
  const data = await createBanner();
  console.log('\n');
  console.log(data);
  console.log('\n');
}

module.exports = {
  createBanner,
  displayBanner
};
