const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:4000';

async function importJobs() {
  const jobs = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/jobs.json'), 'utf8'));
  console.log(`\n📊 Importing ${jobs.length} jobs...`);
  
  for (const job of jobs) {
    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          location: job.location,
          competencies: job.competencies,
          hardFilters: job.hardFilters
        })
      });
      
      if (response.ok) {
        console.log(`✓ Created job: ${job.title}`);
      } else {
        console.log(`✗ Failed to create job: ${job.title}`);
      }
    } catch (error) {
      console.log(`✗ Error creating job ${job.title}:`, error.message);
    }
  }
}

async function importCandidates() {
  const content = fs.readFileSync(path.join(__dirname, 'generated/candidates.jsonl'), 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  console.log(`\n👥 Importing ${lines.length} candidates in batches of 100...`);
  
  const BATCH_SIZE = 50;
  let totalImported = 0;
  
  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    const batch = lines.slice(i, i + BATCH_SIZE);
    const batchContent = batch.join('\n');
    
    try {
      const response = await fetch(`${API_URL}/api/ingest/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: batchContent, format: 'jsonl' })
      });
      
      const result = await response.json();
      totalImported += result.count || 0;
      console.log(`  ✓ Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.count || 0} candidates`);
    } catch (error) {
      console.log(`  ✗ Batch ${Math.floor(i/BATCH_SIZE) + 1} error:`, error.message);
    }
  }
  
  console.log(`✓ Total imported: ${totalImported} candidates`);
}

async function importApplications() {
  const content = fs.readFileSync(path.join(__dirname, 'generated/applications.csv'), 'utf8');
  console.log(`\n📝 Importing applications...`);
  
  try {
    const response = await fetch(`${API_URL}/api/ingest/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    
    const result = await response.json();
    console.log(`✓ Imported ${result.count || 0} applications`);
  } catch (error) {
    console.log(`✗ Error importing applications:`, error.message);
  }
}

async function importAssessments() {
  const content = fs.readFileSync(path.join(__dirname, 'generated/assessments.csv'), 'utf8');
  console.log(`\n📊 Importing assessments...`);
  
  try {
    const response = await fetch(`${API_URL}/api/ingest/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, format: 'csv' })
    });
    
    const result = await response.json();
    console.log(`✓ Imported ${result.count || 0} assessments`);
  } catch (error) {
    console.log(`✗ Error importing assessments:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting data import...\n');
  
  await importJobs();
  await importCandidates();
  await importApplications();
  await importAssessments();
  
  console.log('\n✅ Data import complete!');
  console.log('\n📊 Next steps:');
  console.log('  1. Visit http://localhost:3000 to view the dashboard');
  console.log('  2. Click on a job to see candidates');
  console.log('  3. Run scoring for each job to see fit scores\n');
}

main().catch(console.error);

