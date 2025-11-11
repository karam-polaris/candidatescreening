const fetch = require('node-fetch');
const API_URL = 'https://dollarcity-api.onrender.com';
// Load the jobs from dollarcity-jobs.js
const { jobs } = require('./dollarcity-jobs.js');
(async () => {
  console.log('Importing', jobs.length, 'jobs to production...');
  for (const job of jobs) {
    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      if (response.ok) {
        console.log('✓ Imported:', job.title);
      } else {
        console.log('✗ Failed:', job.title);
      }
    } catch (error) {
      console.log('✗ Error:', job.title, error.message);
    }
  }
  console.log('Done!');
})();
