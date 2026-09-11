const newman = require('newman');
const path = require('path');

const collectionPath = path.resolve(__dirname, '../collections/JsonPlaceholder_Users.postman_collection.json');

console.log('Starting Postman API Automation via Newman...');

newman.run(
  {
    collection: collectionPath,
    reporters: ['cli', 'htmlextra'],
    reporter: {
      htmlextra: {
        export: './newman/api-report.html',
        title: 'JSONPlaceholder API Test Report',
      },
    },
  },
  function (err, summary) {
    if (err) {
      console.error('Newman execution error:', err);
      process.exit(1);
    }
    if (summary && summary.run && summary.run.failures && summary.run.failures.length > 0) {
      console.error(`Tests failed: ${summary.run.failures.length}`);
      process.exit(1);
    }
    console.log('All API test assertions passed successfully.');
    process.exit(0);
  }
);
