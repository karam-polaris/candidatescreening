const API_URL = 'http://localhost:4000';

async function scoreAllJobs() {
  console.log('🎯 Scoring all candidates for all jobs...\n');
  
  try {
    // Get all jobs
    const response = await fetch(`${API_URL}/api/jobs`);
    const jobs = await response.json();
    
    console.log(`Found ${jobs.length} jobs to score\n`);
    
    for (const job of jobs) {
      console.log(`⏳ Scoring: ${job.title}...`);
      
      try {
        const scoreResponse = await fetch(`${API_URL}/api/score/${job.job_id}/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        const result = await scoreResponse.json();
        console.log(`   ✓ Scored ${result.scored} candidates (${result.excluded} excluded)`);
      } catch (error) {
        console.log(`   ✗ Error:`, error.message);
      }
    }
    
    console.log('\n✅ All jobs scored! You can now view candidates on each job page.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

scoreAllJobs();

