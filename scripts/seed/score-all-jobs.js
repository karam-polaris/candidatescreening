// Use native fetch (Node 18+) or fallback
const fetch = globalThis.fetch || require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:4000';

async function scoreAllJobs() {
  console.log('🎯 Starting to score all jobs...\n');

  try {
    // Get all jobs
    const jobsResponse = await fetch(`${API_URL}/api/jobs`);
    if (!jobsResponse.ok) {
      throw new Error('Failed to fetch jobs. Make sure the API is running on port 4000');
    }
    
    const jobs = await jobsResponse.json();
    console.log(`📊 Found ${jobs.length} jobs\n`);

    if (jobs.length === 0) {
      console.log('❌ No jobs found! Please run the data import first:');
      console.log('   node scripts/seed/import-data.js\n');
      return;
    }

    // Score each job
    for (const job of jobs) {
      console.log(`⏳ Scoring job: ${job.title}...`);
      
      const response = await fetch(`${API_URL}/api/score/${job.job_id}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Scored ${result.scored} candidates (${result.excluded} excluded)\n`);
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${error}\n`);
      }
    }

    console.log('✅ All jobs scored successfully!');
    console.log('\n🎉 Next steps:');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Click on any job');
    console.log('   3. See candidates with realistic fit scores!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. The API server is running (npm run dev or pnpm dev)');
    console.log('   2. Data has been imported (node scripts/seed/import-data.js)');
    console.log('   3. The API is accessible at http://localhost:4000\n');
  }
}

scoreAllJobs().catch(console.error);
