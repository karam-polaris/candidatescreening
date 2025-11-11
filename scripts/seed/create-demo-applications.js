const API_URL = process.env.API_URL || 'https://dollarcity-api.onrender.com';

async function createDemoApplications() {
  console.log('\n🚀 Creating demo applications...\n');
  
  // Step 1: Fetch all jobs
  console.log('📋 Fetching jobs...');
  const jobsResponse = await fetch(`${API_URL}/api/jobs`);
  const jobs = await jobsResponse.json();
  console.log(`✓ Found ${jobs.length} jobs`);
  
  // Step 2: Fetch all candidates
  console.log('👥 Fetching candidates...');
  const candidatesResponse = await fetch(`${API_URL}/api/candidates`);
  const candidates = await candidatesResponse.json();
  console.log(`✓ Found ${candidates.length} candidates`);
  
  if (jobs.length === 0 || candidates.length === 0) {
    console.log('❌ No jobs or candidates found. Please import data first.');
    return;
  }
  
  // Step 3: Create applications
  // Assign 20-50 candidates to each job randomly
  const applications = [];
  const sources = ['LinkedIn', 'Company Website', 'Indeed', 'Referral', 'Job Board'];
  const stages = ['applied', 'screening', 'interview', 'offer', 'rejected'];
  
  for (const job of jobs) {
    // Random number of candidates per job (20-50)
    const numCandidates = Math.floor(Math.random() * 31) + 20;
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selectedCandidates = shuffled.slice(0, Math.min(numCandidates, candidates.length));
    
    for (const candidate of selectedCandidates) {
      const submittedAt = new Date();
      submittedAt.setDate(submittedAt.getDate() - Math.floor(Math.random() * 90)); // Random date in last 90 days
      
      applications.push({
        job_id: job.job_id,
        candidate_id: candidate.candidate_id,
        source: sources[Math.floor(Math.random() * sources.length)],
        submitted_at: submittedAt.toISOString(),
        stage: stages[Math.floor(Math.random() * stages.length)],
        recruiter_notes: ''
      });
    }
    
    console.log(`  ✓ Created ${selectedCandidates.length} applications for: ${job.title}`);
  }
  
  // Step 4: Import applications in batches
  console.log(`\n📝 Importing ${applications.length} applications in batches...`);
  const BATCH_SIZE = 100;
  let totalImported = 0;
  
  for (let i = 0; i < applications.length; i += BATCH_SIZE) {
    const batch = applications.slice(i, i + BATCH_SIZE);
    
    // Convert to CSV format
    const { v4: uuidv4 } = require('uuid');
    const csvHeader = 'application_id,job_id,candidate_id,source,submitted_at,stage,recruiter_notes\n';
    const csvRows = batch.map(app => {
      const id = uuidv4();
      // Ensure all fields are strings, handle null/undefined
      // Quote date strings to prevent Papa.parse from converting them to Date objects
      const source = app.source || '';
      const submittedAt = app.submitted_at || new Date().toISOString();
      const stage = app.stage || 'applied';
      const notes = app.recruiter_notes || '';
      // Quote the date and any fields that might contain commas
      return `${id},${app.job_id},${app.candidate_id},"${source}","${submittedAt}","${stage}","${notes}"`;
    });
    const csvContent = csvHeader + csvRows.join('\n');
    
    try {
      const response = await fetch(`${API_URL}/api/ingest/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: csvContent })
      });
      
      const result = await response.json();
      const count = result.count || 0;
      totalImported += count;
      console.log(`  ✓ Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${count} applications`);
    } catch (error) {
      console.log(`  ✗ Batch ${Math.floor(i/BATCH_SIZE) + 1} error:`, error.message);
    }
  }
  
  console.log(`\n✅ Total imported: ${totalImported} applications`);
  console.log('\n🎉 Demo is ready!');
  console.log('\n👉 Now go to your Vercel app and:');
  console.log('   1. Click on any job');
  console.log('   2. You should see candidates with applications!');
}

createDemoApplications().catch(console.error);

