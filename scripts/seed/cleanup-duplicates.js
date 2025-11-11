const API_URL = 'http://localhost:4000';

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate jobs...\n');
  
  try {
    // Get all jobs
    const response = await fetch(`${API_URL}/api/jobs`);
    const jobs = await response.json();
    
    console.log(`Found ${jobs.length} jobs total`);
    
    // Group by title
    const jobsByTitle = new Map();
    for (const job of jobs) {
      if (!jobsByTitle.has(job.title)) {
        jobsByTitle.set(job.title, []);
      }
      jobsByTitle.get(job.title).push(job);
    }
    
    // Keep only the first of each title, delete duplicates
    let deleted = 0;
    for (const [title, jobList] of jobsByTitle.entries()) {
      if (jobList.length > 1) {
        console.log(`\n"${title}" has ${jobList.length} copies, keeping first, deleting ${jobList.length - 1}`);
        
        // Delete all except the first
        for (let i = 1; i < jobList.length; i++) {
          try {
            const delResponse = await fetch(`${API_URL}/api/jobs/${jobList[i].job_id}`, {
              method: 'DELETE'
            });
            
            if (delResponse.ok) {
              console.log(`  ✓ Deleted duplicate: ${jobList[i].job_id}`);
              deleted++;
            } else {
              console.log(`  ✗ Failed to delete: ${jobList[i].job_id}`);
            }
          } catch (error) {
            console.log(`  ✗ Error deleting ${jobList[i].job_id}:`, error.message);
          }
        }
      }
    }
    
    console.log(`\n✅ Cleanup complete! Deleted ${deleted} duplicate jobs.`);
    
    // Show final count
    const finalResponse = await fetch(`${API_URL}/api/jobs`);
    const finalJobs = await finalResponse.json();
    console.log(`\n📊 Final count: ${finalJobs.length} unique jobs`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanupDuplicates();

